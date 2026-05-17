import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useInterzone } from "@/lib/store";
import { generateHallucination } from "@/lib/proceduralText";
import { clack } from "@/lib/audio";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/withdrawal")({
  component: WithdrawalPage,
  head: () => ({ meta: [{ title: "WITHDRAWAL — Interzone Feed" }] }),
});

function WithdrawalPage() {
  const exitWithdrawal = useInterzone(s => s.exitWithdrawal);
  const takeFix = useInterzone(s => s.takeFix);
  const descent = useInterzone(s => s.descent);
  const paranoia = useInterzone(s => s.paranoia);
  const navigate = useNavigate();

  const emergency = () => {
    clack();
    const text = generateHallucination({ substance: "flesh_juice", descent, paranoia });
    takeFix("flesh_juice", `[EMERGENCY FIX] ${text}`);
    exitWithdrawal();
    navigate({ to: "/feed" });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center iz-withdrawal">
      <div className="max-w-xl text-center px-4">
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <AlertTriangle className="w-20 h-20 text-iz-blood mx-auto mb-6" />
        </motion.div>
        <h1 className="font-display text-4xl text-iz-blood iz-glitch-text mb-4">WITHDRAWAL</h1>
        <p className="text-iz-bone font-mono text-base leading-relaxed mb-2">
          Your typewriter parasite is dying.
        </p>
        <p className="text-iz-pus font-mono text-sm leading-relaxed mb-8 italic">
          The walls have stopped breathing. The Mugwumps are filing a complaint. Your streak has been burned to ash.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={emergency}
          className="px-8 py-4 bg-iz-blood/30 border-2 border-iz-blood text-iz-bone font-display text-lg uppercase tracking-widest hover:bg-iz-blood/50 transition-all iz-flicker"
        >
          Emergency Fix
        </motion.button>
        <p className="text-[10px] text-iz-vein mt-6 uppercase tracking-widest">
          One administration will restore the link · Your file will be amended
        </p>
      </div>
    </div>
  );
}
