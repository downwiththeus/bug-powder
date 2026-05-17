import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInterzone } from "@/lib/store";
import { generateSurveillanceLine } from "@/lib/proceduralText";

export function SurveillancePanel() {
  const logs = useInterzone(s => s.surveillanceLogs);
  const pushSurveillance = useInterzone(s => s.pushSurveillance);
  const descent = useInterzone(s => s.descent);
  const paranoia = useInterzone(s => s.paranoia);
  const idleRef = useRef<number>(Date.now());

  useEffect(() => {
    const onMove = () => { idleRef.current = Date.now(); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onMove);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.45) {
        const idleMs = Date.now() - idleRef.current;
        const line = generateSurveillanceLine({ idleMs, descent, paranoia });
        const severity = paranoia > 60 ? "HIGH" : paranoia > 30 ? "MEDIUM" : "LOW";
        pushSurveillance(line, severity);
      }
    }, 8000 - Math.min(5000, descent * 500));
    return () => clearInterval(id);
  }, [descent, paranoia, pushSurveillance]);

  const sevColor = (s: string) =>
    s === "CRITICAL" ? "text-iz-blood iz-flicker" :
    s === "HIGH" ? "text-iz-pus" :
    s === "MEDIUM" ? "text-iz-bone" : "text-muted-foreground";

  return (
    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
      <AnimatePresence initial={false}>
        {logs.map(l => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="text-[11px] font-mono leading-relaxed"
          >
            <span className="text-iz-vein">[{l.severity}]</span>{" "}
            <span className={sevColor(l.severity)}>» {l.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
