import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SubstanceKey = "bug_powder" | "black_meat" | "slow_speed" | "flesh_juice";

export interface InterzoneState {
  // Profile
  dependence: Record<SubstanceKey, number>;
  descent: number;
  paranoia: number;
  streak: number;
  lastFixAt: number | null;
  withdrawal: boolean;
  audioEnabled: boolean;
  eroticGrotesque: boolean;
  mutations: string[];
  ending: string | null;
  // Logs
  surveillanceLogs: Array<{ id: string; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; message: string; at: number }>;
  hallucinations: Array<{ id: string; text: string; at: number; substance?: SubstanceKey }>;
  // Actions
  takeFix: (sub: SubstanceKey, hallucinationText: string) => void;
  pushSurveillance: (msg: string, severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL") => void;
  pushHallucination: (text: string, substance?: SubstanceKey) => void;
  unlockMutation: (slug: string) => boolean;
  setAudio: (on: boolean) => void;
  setEroticGrotesque: (on: boolean) => void;
  checkWithdrawal: () => void;
  exitWithdrawal: () => void;
  resetAll: () => void;
}

const initialDeps: Record<SubstanceKey, number> = {
  bug_powder: 0, black_meat: 0, slow_speed: 0, flesh_juice: 0,
};

const MUTATION_RULES: Array<{ slug: string; check: (s: InterzoneState) => boolean; label: string }> = [
  { slug: "centipede-cursor", label: "Centipede Secretary", check: s => s.dependence.bug_powder >= 60 },
  { slug: "mugwump-eyes", label: "Mugwump Eyes", check: s => s.dependence.black_meat >= 60 },
  { slug: "melted-nav", label: "Melted Bureaucracy", check: s => s.dependence.slow_speed >= 60 },
  { slug: "flesh-bg", label: "Fleshly Wallpaper", check: s => s.dependence.flesh_juice >= 60 },
  { slug: "typewriter-keys", label: "Typewriter Parasite", check: s => s.descent >= 5 },
  { slug: "interzone-citizen", label: "Citizen of Interzone", check: s => s.descent >= 8 },
  { slug: "nova-police-target", label: "Nova Police Target", check: s => s.paranoia >= 80 },
];

const ENDINGS: Array<{ slug: string; check: (s: InterzoneState) => boolean }> = [
  { slug: "reconditioned", check: s => s.descent >= 10 && s.paranoia < 40 },
  { slug: "consumed-by-mugwumps", check: s => s.descent >= 10 && s.dependence.black_meat >= 90 },
  { slug: "became-typewriter", check: s => s.descent >= 10 && s.dependence.bug_powder >= 90 },
  { slug: "vanished-into-interzone", check: s => s.descent >= 10 && s.paranoia >= 80 },
];

export const useInterzone = create<InterzoneState>()(
  persist(
    (set, get) => ({
      dependence: { ...initialDeps },
      descent: 1,
      paranoia: 10,
      streak: 0,
      lastFixAt: null,
      withdrawal: false,
      audioEnabled: false,
      eroticGrotesque: false,
      mutations: [],
      ending: null,
      surveillanceLogs: [
        { id: "sys-init", severity: "LOW", message: "SYS_INIT: Interzone typewriter link established.", at: 0 },
      ],
      hallucinations: [],

      takeFix: (sub, text) => {
        const now = Date.now();
        const s = get();
        const newDep = { ...s.dependence, [sub]: Math.min(100, s.dependence[sub] + 12 + Math.random() * 8) };
        const totalDep = Object.values(newDep).reduce((a, b) => a + b, 0);
        const newDescent = Math.min(10, 1 + Math.floor(totalDep / 40));
        const newParanoia = Math.min(100, s.paranoia + 3 + Math.floor(Math.random() * 5));
        const sameDay = s.lastFixAt && now - s.lastFixAt < 26 * 3600 * 1000;
        const streak = sameDay ? s.streak : s.streak + 1;

        set({
          dependence: newDep,
          descent: newDescent,
          paranoia: newParanoia,
          streak,
          lastFixAt: now,
          withdrawal: false,
          hallucinations: [
            { id: crypto.randomUUID(), text, at: now, substance: sub },
            ...s.hallucinations,
          ].slice(0, 50),
        });

        // Check mutations
        const state = get();
        for (const rule of MUTATION_RULES) {
          if (rule.check(state) && !state.mutations.includes(rule.slug)) {
            get().unlockMutation(rule.slug);
          }
        }
        // Check endings
        for (const ending of ENDINGS) {
          if (ending.check(state) && !state.ending) {
            set({ ending: ending.slug });
            break;
          }
        }
      },

      pushSurveillance: (msg, severity = "LOW") => {
        set(s => ({
          surveillanceLogs: [
            { id: crypto.randomUUID(), severity, message: msg, at: Date.now() },
            ...s.surveillanceLogs,
          ].slice(0, 30),
        }));
      },

      pushHallucination: (text, substance) => {
        set(s => ({
          hallucinations: [
            { id: crypto.randomUUID(), text, at: Date.now(), substance },
            ...s.hallucinations,
          ].slice(0, 50),
        }));
      },

      unlockMutation: (slug) => {
        const s = get();
        if (s.mutations.includes(slug)) return false;
        set({ mutations: [...s.mutations, slug] });
        const rule = MUTATION_RULES.find(r => r.slug === slug);
        get().pushSurveillance(`MUTATION UNLOCKED: ${rule?.label ?? slug}`, "HIGH");
        return true;
      },

      setAudio: (on) => set({ audioEnabled: on }),
      setEroticGrotesque: (on) => set({ eroticGrotesque: on }),

      checkWithdrawal: () => {
        const s = get();
        if (!s.lastFixAt) return;
        const hoursSince = (Date.now() - s.lastFixAt) / 3600000;
        if (hoursSince > 26 && !s.withdrawal && s.streak > 0) {
          set({ withdrawal: true, streak: 0, paranoia: Math.min(100, s.paranoia + 15) });
          get().pushSurveillance("WITHDRAWAL DETECTED. Subject's vitals destabilizing.", "CRITICAL");
        }
      },

      exitWithdrawal: () => set({ withdrawal: false }),

      resetAll: () => set({
        dependence: { ...initialDeps },
        descent: 1, paranoia: 10, streak: 0, lastFixAt: null, withdrawal: false,
        mutations: [], ending: null, hallucinations: [],
        surveillanceLogs: [{ id: crypto.randomUUID(), severity: "LOW", message: "SYS_RESET: Cycle terminated. Subject reinitialized.", at: Date.now() }],
      }),
    }),
    { name: "interzone-feed-v1", skipHydration: true }
  )
);

export const MUTATION_LABELS: Record<string, string> = Object.fromEntries(
  MUTATION_RULES.map(r => [r.slug, r.label])
);

export const ENDING_TEXT: Record<string, { title: string; body: string }> = {
  reconditioned: {
    title: "Reconditioned",
    body: "You wake in a beige room. A clerk hands you a form. You sign without reading. The Interzone has been edited out of your file. You will not remember writing this sentence.",
  },
  "consumed-by-mugwumps": {
    title: "Consumed by the Mugwumps",
    body: "The black meat finishes its negotiation. Your tongue files for asylum. The Mugwumps absorb your routines into theirs. You continue, technically.",
  },
  "became-typewriter": {
    title: "Became the Typewriter",
    body: "The bug powder reaches a quorum in your spinal column. Your fingers grow keys. Someone is already typing. The text reads: 'Please continue.'",
  },
  "vanished-into-interzone": {
    title: "Vanished into the Interzone",
    body: "The Nova Police arrive. You are not where they expect. You are in the wallpaper of a hotel room that has not been built yet. Welcome, citizen.",
  },
};
