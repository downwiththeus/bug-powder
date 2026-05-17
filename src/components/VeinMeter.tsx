import { motion } from "framer-motion";
import type { SubstanceKey } from "@/lib/store";

const COLORS: Record<SubstanceKey, string> = {
  bug_powder: "var(--iz-bug)",
  black_meat: "var(--iz-blood)",
  slow_speed: "var(--iz-bruise)",
  flesh_juice: "var(--iz-pus)",
};

const LABELS: Record<SubstanceKey, string> = {
  bug_powder: "Bug Powder",
  black_meat: "Black Meat",
  slow_speed: "Slow-Speed",
  flesh_juice: "Flesh Juice",
};

export function VeinMeter({ substance, level, onFix }: { substance: SubstanceKey; level: number; onFix?: () => void }) {
  const color = COLORS[substance];
  const critical = level > 75;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline text-[11px] font-mono uppercase tracking-wider">
        <span className={`${critical ? "text-iz-blood iz-flicker font-bold" : "text-iz-bone"}`}>{LABELS[substance]}</span>
        <span className={critical ? "text-iz-blood" : "text-muted-foreground"}>{Math.round(level)}%</span>
      </div>
      <div className="relative h-3 bg-iz-ink border border-iz-vein overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 iz-vein-pulse"
          style={{
            background: `linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 70%, var(--iz-blood)))`,
            boxShadow: `inset 0 0 8px ${color}`,
          }}
          animate={{ width: `${level}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
        />
        {/* organic ridges */}
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 8px, rgba(0,0,0,0.25) 8px, rgba(0,0,0,0.25) 9px)" }} />
      </div>
      {onFix && (
        <button
          onClick={onFix}
          className="w-full text-[10px] uppercase tracking-widest py-1.5 border border-iz-vein hover:border-iz-blood bg-iz-ink/60 hover:bg-iz-blood/20 text-muted-foreground hover:text-iz-bone transition-all"
        >
          Administer Fix
        </button>
      )}
    </div>
  );
}
