import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInterzone } from "@/lib/store";

export function FeedStream() {
  const hallucinations = useInterzone(s => s.hallucinations);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [hallucinations.length]);

  return (
    <div ref={scrollRef} className="overflow-y-auto max-h-[60vh] space-y-3 pr-2">
      <AnimatePresence initial={false}>
        {hallucinations.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-muted-foreground text-sm italic iz-typewriter-cursor"
          >
            The Feed is empty. Administer a fix to begin transmission.
          </motion.p>
        )}
        {hallucinations.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
            transition={{ duration: 0.55 }}
            className="border-l-2 border-iz-blood pl-3 py-1"
          >
            <p className="text-sm leading-relaxed text-iz-bone font-mono iz-glitch-text">
              {h.text}
            </p>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-widest">
              {new Date(h.at).toLocaleTimeString()} {h.substance ? `· ${h.substance.replace("_", " ")}` : ""}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
