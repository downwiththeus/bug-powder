import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useRef } from "react";
import { toPng } from "html-to-image";
import { useInterzone, MUTATION_LABELS, ENDING_TEXT } from "@/lib/store";
import { Sparkles, Download, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_app/mutations")({
  component: MutationsPage,
  head: () => ({ meta: [{ title: "Mutations & Routines" }] }),
});

const ALL_MUTATIONS = Object.keys(MUTATION_LABELS);

function MutationsPage() {
  const mutations = useInterzone(s => s.mutations);
  const hallucinations = useInterzone(s => s.hallucinations);
  const ending = useInterzone(s => s.ending);
  const descent = useInterzone(s => s.descent);
  const paranoia = useInterzone(s => s.paranoia);
  const resetAll = useInterzone(s => s.resetAll);
  const routineRef = useRef<HTMLDivElement>(null);

  const exportRoutine = async () => {
    if (!routineRef.current) return;
    try {
      const dataUrl = await toPng(routineRef.current, {
        backgroundColor: "#080608",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `interzone-routine-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="font-display text-3xl sm:text-4xl text-iz-bone iz-glitch-text">Profile · Mutations</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-2">
          Descent {descent} · Paranoia {paranoia} · {mutations.length}/{ALL_MUTATIONS.length} mutations unlocked
        </p>
      </header>

      {/* Mutations gallery */}
      <section className="bg-iz-void/60 border border-iz-vein p-5">
        <h2 className="font-display text-lg text-iz-pus mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Grotesque Unlocks
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_MUTATIONS.map(slug => {
            const unlocked = mutations.includes(slug);
            return (
              <motion.div
                key={slug}
                whileHover={unlocked ? { scale: 1.02 } : undefined}
                className={`p-4 border ${unlocked ? "border-iz-blood bg-iz-blood/10" : "border-iz-vein bg-iz-ink/40 opacity-50"} transition-all`}
              >
                <p className={`font-display text-sm ${unlocked ? "text-iz-pus" : "text-muted-foreground"}`}>
                  {unlocked ? MUTATION_LABELS[slug] : "??? · LOCKED"}
                </p>
                <p className="text-[10px] uppercase tracking-widest mt-1 text-muted-foreground">
                  {unlocked ? "Active" : "Increase dependence to reveal"}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Ending */}
      {ending && ENDING_TEXT[ending] && (
        <motion.section
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-iz-blood/10 border-2 border-iz-blood p-6 text-center iz-vein-pulse"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-iz-blood mb-2">Ending Unlocked</p>
          <h2 className="font-display text-2xl text-iz-bone iz-glitch-text mb-3">{ENDING_TEXT[ending].title}</h2>
          <p className="text-iz-bone/85 font-mono text-sm leading-relaxed max-w-xl mx-auto italic">
            {ENDING_TEXT[ending].body}
          </p>
        </motion.section>
      )}

      {/* Routine export */}
      <section className="bg-iz-void/60 border border-iz-vein p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-iz-pus">Latest Routine</h2>
          <div className="flex gap-2">
            <button
              onClick={exportRoutine}
              className="text-xs uppercase tracking-widest px-3 py-1.5 border border-iz-blood text-iz-bone hover:bg-iz-blood/20 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" /> Export PNG
            </button>
          </div>
        </div>
        <div ref={routineRef} className="bg-iz-ink p-6 border border-iz-vein space-y-3">
          <p className="font-display text-iz-blood text-xs uppercase tracking-[0.4em]">Interzone Bureau · Routine #{hallucinations.length || "—"}</p>
          {hallucinations.slice(0, 5).map(h => (
            <p key={h.id} className="text-iz-bone font-mono text-sm leading-relaxed border-l-2 border-iz-vein pl-3">
              {h.text}
            </p>
          ))}
          {hallucinations.length === 0 && (
            <p className="text-muted-foreground italic text-sm">No hallucinations recorded. Administer a fix.</p>
          )}
          <p className="text-[9px] text-iz-vein uppercase tracking-widest pt-3 border-t border-iz-vein">
            Descent {descent} · Paranoia {paranoia} · {new Date().toISOString().split("T")[0]}
          </p>
        </div>
      </section>

      <div className="text-center pt-4">
        <button
          onClick={() => { if (confirm("Reset all data? Your file will be amended.")) resetAll(); }}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-iz-blood transition-colors flex items-center gap-1.5 mx-auto"
        >
          <RotateCcw className="w-3 h-3" /> Reinitialize Subject
        </button>
      </div>
    </div>
  );
}
