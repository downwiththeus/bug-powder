import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useInterzone, type SubstanceKey } from "@/lib/store";
import { generateHallucination } from "@/lib/proceduralText";
import { clack } from "@/lib/audio";
import { Syringe } from "lucide-react";

export const Route = createFileRoute("/_app/fix")({
  component: FixPage,
  head: () => ({ meta: [{ title: "Administer Fix — Interzone Feed" }] }),
});

const SUB_META: Record<SubstanceKey, { label: string; tagline: string; color: string }> = {
  bug_powder: { label: "Bug Powder", tagline: "Fine green dust. For the auditor's voice.", color: "var(--iz-bug)" },
  black_meat: { label: "Black Meat", tagline: "Translucent. Best chewed slowly.", color: "var(--iz-blood)" },
  slow_speed: { label: "Slow-Speed", tagline: "Time becomes a wet bandage.", color: "var(--iz-bruise)" },
  flesh_juice: { label: "Flesh Juice", tagline: "A warmth with paperwork attached.", color: "var(--iz-pus)" },
};

function FixPage() {
  const dependence = useInterzone(s => s.dependence);
  const descent = useInterzone(s => s.descent);
  const paranoia = useInterzone(s => s.paranoia);
  const takeFix = useInterzone(s => s.takeFix);
  const [administering, setAdministering] = useState<SubstanceKey | null>(null);
  const [lastVignette, setLastVignette] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAdminister = async (sub: SubstanceKey) => {
    setAdministering(sub);
    clack();
    await new Promise(r => setTimeout(r, 1400));
    const text = generateHallucination({ substance: sub, descent, paranoia });
    takeFix(sub, `[FIX · ${sub.replace("_", " ").toUpperCase()}] ${text}`);
    setLastVignette(text);
    await new Promise(r => setTimeout(r, 2400));
    setAdministering(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl sm:text-4xl text-iz-bone iz-glitch-text">The Fix Panel</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-2">Choose your descent · Each administration is recorded</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {(Object.keys(SUB_META) as SubstanceKey[]).map(sub => {
          const meta = SUB_META[sub];
          const level = dependence[sub];
          return (
            <motion.button
              key={sub}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAdminister(sub)}
              disabled={administering !== null}
              className="text-left bg-iz-void/70 border border-iz-vein hover:border-iz-blood p-5 transition-all relative overflow-hidden disabled:opacity-40 disabled:cursor-wait group"
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: `radial-gradient(circle at 80% 20%, ${meta.color}, transparent 60%)` }} />
              <div className="flex items-start justify-between mb-3 relative">
                <h3 className="font-display text-xl text-iz-bone">{meta.label}</h3>
                <Syringe className="w-4 h-4 text-iz-blood group-hover:rotate-12 transition-transform" />
              </div>
              <p className="text-xs text-muted-foreground italic mb-4">{meta.tagline}</p>
              <div className="h-1.5 bg-iz-ink border border-iz-vein overflow-hidden relative">
                <motion.div
                  className="h-full iz-vein-pulse"
                  style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
                  animate={{ width: `${level}%` }}
                />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">{Math.round(level)}% dependence</p>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={() => navigate({ to: "/feed" })}
        className="mt-8 mx-auto block text-xs uppercase tracking-widest text-muted-foreground hover:text-iz-pus transition-colors"
      >
        ← Return to the Feed
      </button>

      {/* Administer ritual overlay */}
      <AnimatePresence>
        {administering && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-iz-ink/95 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <div className="max-w-2xl text-center">
              <motion.div
                animate={{ scale: [1, 1.4, 1], rotate: [0, 6, -6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mb-6"
              >
                <Syringe className="w-16 h-16 text-iz-blood mx-auto iz-flicker" />
              </motion.div>
              <p className="font-display text-iz-pus text-sm uppercase tracking-[0.4em] mb-4">Administering · {SUB_META[administering].label}</p>
              {lastVignette ? (
                <motion.p
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  className="text-iz-bone font-mono text-lg leading-relaxed iz-glitch-text iz-typewriter-cursor"
                >
                  {lastVignette}
                </motion.p>
              ) : (
                <p className="text-muted-foreground font-mono text-sm animate-pulse">Initializing biological link...</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
