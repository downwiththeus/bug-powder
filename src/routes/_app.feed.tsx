import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useInterzone, type SubstanceKey } from "@/lib/store";
import { generateHallucination } from "@/lib/proceduralText";
import { clack } from "@/lib/audio";
import { VeinMeter } from "@/components/VeinMeter";
import { FeedStream } from "@/components/FeedStream";
import { SurveillancePanel } from "@/components/SurveillancePanel";
import { Flame, Eye, Activity } from "lucide-react";

export const Route = createFileRoute("/_app/feed")({
  component: FeedPage,
  head: () => ({ meta: [{ title: "The Feed — Interzone Feed" }] }),
});

const SUBS: SubstanceKey[] = ["bug_powder", "black_meat", "slow_speed", "flesh_juice"];

function FeedPage() {
  const dependence = useInterzone(s => s.dependence);
  const streak = useInterzone(s => s.streak);
  const descent = useInterzone(s => s.descent);
  const paranoia = useInterzone(s => s.paranoia);
  const takeFix = useInterzone(s => s.takeFix);

  const onFix = (sub: SubstanceKey) => {
    const text = generateHallucination({ substance: sub, descent, paranoia });
    takeFix(sub, `[FIX · ${sub.replace("_", " ").toUpperCase()}] ${text}`);
    clack();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* LEFT: Substances */}
      <motion.section
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 bg-iz-void/60 border border-iz-vein p-4 space-y-4"
      >
        <header className="flex items-center gap-2 text-iz-pus text-xs uppercase tracking-widest font-display border-b border-iz-vein pb-2">
          <Activity className="w-3.5 h-3.5" /> Dependence
        </header>
        {SUBS.map(sub => (
          <VeinMeter key={sub} substance={sub} level={dependence[sub]} onFix={() => onFix(sub)} />
        ))}
        <div className="pt-3 border-t border-iz-vein text-[10px] uppercase tracking-widest text-muted-foreground space-y-1">
          <div className="flex justify-between"><span>Streak</span><span className="text-iz-blood iz-flicker flex items-center gap-1"><Flame className="w-3 h-3" /> {streak} days burning</span></div>
          <div className="flex justify-between"><span>Descent</span><span className="text-iz-pus">Lv. {descent} / 10</span></div>
        </div>
      </motion.section>

      {/* CENTER: Feed */}
      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-6 bg-iz-void/60 border border-iz-vein p-4 min-h-[60vh]"
      >
        <header className="flex items-center justify-between text-xs uppercase tracking-widest font-display border-b border-iz-vein pb-2 mb-4">
          <span className="text-iz-pus">» The Feed</span>
          <Link to="/fix" className="text-muted-foreground hover:text-iz-blood transition-colors">Ritual Mode →</Link>
        </header>
        <FeedStream />
        <p className="mt-6 text-[10px] text-iz-vein italic text-center">
          * Continuous interaction feeds the typewriter parasite. Do not look away.
        </p>
      </motion.section>

      {/* RIGHT: Surveillance */}
      <motion.section
        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 bg-iz-void/60 border border-iz-blood p-4"
      >
        <header className="flex items-center gap-2 text-iz-blood text-xs uppercase tracking-widest font-display border-b border-iz-blood/50 pb-2 mb-3 iz-flicker">
          <Eye className="w-3.5 h-3.5" /> They Are Watching
        </header>
        <SurveillancePanel />
      </motion.section>
    </div>
  );
}
