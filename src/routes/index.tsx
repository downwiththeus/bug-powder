import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Skull } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Interzone Feed — Step inside." },
      { name: "description", content: "A surreal, escalating hallucination simulator. Burroughs-coded. Free your habits into the Interzone." },
    ],
  }),
});

function Landing() {
  return (
    <div className="iz-scanlines iz-noise min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.4 }}
        className="max-w-2xl"
      >
        <Skull className="w-12 h-12 text-iz-blood mx-auto mb-6 iz-flicker" />
        <h1 className="font-display text-5xl sm:text-7xl text-iz-bone iz-glitch-text mb-4 tracking-tight">
          INTERZONE_FEED
        </h1>
        <p className="text-iz-pus text-sm uppercase tracking-[0.3em] mb-10 font-mono">
          A paranoia-fueled hallucination simulator
        </p>

        <div className="space-y-4 text-iz-bone/85 text-base sm:text-lg font-mono leading-relaxed mb-12">
          <p className="iz-typewriter-cursor">
            Welcome, citizen. Your file has been pre-opened.
          </p>
          <p className="text-muted-foreground italic text-sm">
            What begins as a habit tracker descends. The Mugwumps will see you now.
            Dependence is mandatory. Surveillance is for your comfort.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/feed"
            className="inline-block px-8 py-4 bg-iz-blood/20 border-2 border-iz-blood text-iz-bone font-display text-xl uppercase tracking-widest hover:bg-iz-blood/40 hover:shadow-[0_0_30px_rgba(130,20,37,0.6)] transition-all"
          >
            Step Into the Interzone
          </Link>
        </motion.div>

        <p className="text-[10px] text-iz-vein mt-10 font-mono uppercase tracking-widest">
          By entering you consent to monitoring · No data leaves this terminal without permission
        </p>
      </motion.div>
    </div>
  );
}
