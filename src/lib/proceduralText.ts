// Procedural Burroughs-pastiche text engine. Original phrasing, never copies source text.

const PRONOUNS_2P = ["you", "your hands", "your typewriter parasite", "your tongue", "your spine"];
const NOUNS_BODY = [
  "centipede secretary", "mugwump", "talking asshole", "fleshy keyboard", "typewriter beetle",
  "Dr. Benway", "agent of the Nova Police", "Sender", "Liquefactionist", "Divisionist clone",
  "blue-lipped clerk", "soft machine", "interzone customs officer", "carbonized membrane",
];
const VERBS_GROTESQUE = [
  "secretes a greasy translucent fluid",
  "molts into a half-finished memo",
  "files your retinal vectors with the Nova Police",
  "clicks its mandibles in approval",
  "transcribes the inside of your skull verbatim",
  "negotiates a contract for your reflexes",
  "audits your unspoken intentions",
  "weeps a slow amber resin",
  "rearranges its vertebrae into a filing cabinet",
  "broadcasts on the frequency of your fillings",
];
const SETTINGS = [
  "the Tangier consulate sub-basement",
  "a hotel room that smells of formaldehyde and orange peel",
  "the laundromat of the Interzone Bureau",
  "a corridor lined with breathing wallpaper",
  "the back office of the Reconditioning Center",
  "an elevator that opens onto your childhood",
  "a market stall selling tongues by the kilo",
];
const ATMOSPHERE = [
  "The radiator hisses a complaint in Mandarin.",
  "Somewhere a typewriter taps without operator.",
  "The light comes from no source you can name.",
  "Your shadow disagrees with your posture.",
  "A wet warmth gathers behind the wallpaper.",
  "Time arrives in unmarked envelopes.",
  "The walls flex once, politely.",
];
const PARANOIA = [
  "They have already filed the report.",
  "Your hesitation has been noted in triplicate.",
  "The cameras blink in your rhythm now.",
  "Something is reading you in return.",
  "Your name appears on a list you have not seen.",
  "The transcript will reach you before the conversation ends.",
];

export interface HallucinationSeed {
  substance?: "bug_powder" | "black_meat" | "slow_speed" | "flesh_juice";
  descent: number;
  paranoia: number;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SUBSTANCE_FLAVOR: Record<string, string[]> = {
  bug_powder: [
    "A fine green powder catches in the back of your throat.",
    "The dust speaks in the voice of a small auditor.",
    "Your fingers count themselves before you do.",
  ],
  black_meat: [
    "Something black and translucent moves under your tongue.",
    "You taste copper, then formaldehyde, then nothing at all.",
    "The chewing continues after you stop.",
  ],
  slow_speed: [
    "Time loosens like a wet bandage.",
    "Each second arrives twice, slightly out of order.",
    "Your reflexes are being audited for compliance.",
  ],
  flesh_juice: [
    "A warmth opens behind your sternum, dishonestly.",
    "Your skin reports back enthusiastically.",
    "The pleasure has paperwork attached.",
  ],
};

export function generateHallucination(seed: HallucinationSeed): string {
  const noun = pick(NOUNS_BODY);
  const verb = pick(VERBS_GROTESQUE);
  const setting = pick(SETTINGS);
  const atmo = pick(ATMOSPHERE);

  const lines: string[] = [];
  if (seed.substance && SUBSTANCE_FLAVOR[seed.substance]) {
    lines.push(pick(SUBSTANCE_FLAVOR[seed.substance]));
  }
  lines.push(`In ${setting}, a ${noun} ${verb}.`);
  lines.push(atmo);
  if (seed.descent >= 4) lines.push(pick(PARANOIA));
  if (seed.descent >= 7) {
    lines.push(`${pick(PRONOUNS_2P).replace(/^./, c => c.toUpperCase())} has been replaced with a clerical instrument and no one has noticed.`);
  }
  return lines.join(" ");
}

export function generateSurveillanceLine(ctx: { idleMs?: number; descent: number; paranoia: number }): string {
  const base = [
    "Subject's mouse velocity indicates elevated cortisol.",
    "The Mugwumps have noted your hesitation.",
    "Sub-dermal transmitters: stable carrier frequency.",
    "Your dwell-time on this pixel exceeds the recommended threshold.",
    "Dr. Benway has updated your file in green ink.",
    "Operator note: target appears to be reading the surveillance log.",
    "The centipede secretaries are transcribing your micro-expressions.",
    "Interzone Bureau acknowledges receipt of your involuntary tremor.",
  ];
  if (ctx.idleMs && ctx.idleMs > 8000) {
    return `Target has been motionless for ${Math.round(ctx.idleMs / 1000)} seconds. Awaiting instruction.`;
  }
  if (ctx.descent >= 6 && Math.random() > 0.5) {
    return `Cross-reference confirms: the reader and the read are no longer separable.`;
  }
  return pick(base);
}

export function generateRoomVignette(slug: string, descent: number): string {
  const noun = pick(NOUNS_BODY);
  const atmo = pick(ATMOSPHERE);
  return `[${slug.toUpperCase()}] You enter. A ${noun} regards you without surprise. ${atmo} ${descent >= 5 ? pick(PARANOIA) : ""}`.trim();
}
