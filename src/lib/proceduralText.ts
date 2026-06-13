// Procedural Burroughs-pastiche text engine. Original phrasing, never copies source text.

const PRONOUNS_2P = ["you", "your hands", "your typewriter parasite", "your tongue", "your spine"];
const NOUNS_BODY = [
  "centipede secretary", "mugwump", "talking asshole", "fleshy keyboard", "typewriter beetle",
  "Dr. Benway", "agent of the Nova Police", "Sender", "Liquefactionist", "Divisionist clone",
  "blue-lipped clerk", "soft machine", "interzone customs officer", "carbonized membrane",
  "taxidermied switchboard operator", "larval stenographer", "municipal tapeworm",
  "glass-jawed informant", "intestinal telegraph", "sleepwalking pharmacist", "licensed dream butcher",
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
  "stamps tomorrow's date onto your soft palate",
  "dictates an apology through a borrowed larynx",
  "exchanges your pulse for counterfeit currency",
  "folds the afternoon into a contaminated envelope",
  "removes three unauthorized memories with office scissors",
];
const SETTINGS = [
  "the Tangier consulate sub-basement",
  "a hotel room that smells of formaldehyde and orange peel",
  "the laundromat of the Interzone Bureau",
  "a corridor lined with breathing wallpaper",
  "the back office of the Reconditioning Center",
  "an elevator that opens onto your childhood",
  "a market stall selling tongues by the kilo",
  "the municipal fever archive",
  "a café where every patron has your handwriting",
  "the night-shift vivisection tram",
  "a waiting room beneath the wrong embassy",
];
const ATMOSPHERE = [
  "The radiator hisses a complaint in Mandarin.",
  "Somewhere a typewriter taps without operator.",
  "The light comes from no source you can name.",
  "Your shadow disagrees with your posture.",
  "A wet warmth gathers behind the wallpaper.",
  "Time arrives in unmarked envelopes.",
  "The walls flex once, politely.",
  "A telephone rings inside the sink.",
  "The carpet remembers a different pair of feet.",
  "Every clock coughs at the same second.",
  "A fly circles the room in perfect square corners.",
];
const PARANOIA = [
  "They have already filed the report.",
  "Your hesitation has been noted in triplicate.",
  "The cameras blink in your rhythm now.",
  "Something is reading you in return.",
  "Your name appears on a list you have not seen.",
  "The transcript will reach you before the conversation ends.",
  "Your alibi has begun answering questions without you.",
  "A clerk is practicing your signature in the next room.",
  "They left the microphone visible because concealment is no longer necessary.",
];

const OPENINGS = [
  "The transmission begins halfway through a sentence.",
  "A procedural error opens briefly behind your left eye.",
  "Your file clears its throat.",
  "At an hour not printed on any clock, the channel opens.",
  "The screen develops a pulse and issues the following correction.",
];

const DIRECTIVES = [
  "Do not sign anything that recognizes you.",
  "Keep the receipt under your tongue until questioned.",
  "If the elevator asks your destination, lie.",
  "Count the exits again; one of them has learned to move.",
  "Destroy this instruction after remembering it incorrectly.",
];

const DEEP_DESCENT = [
  "For nine wet seconds, every object in the room shares one nervous system.",
  "Your browser history appears as bruises along the clerk's neck.",
  "The sentence turns around and watches you finish reading it.",
  "A second version of you signs the discharge papers from inside the wall.",
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
  if (Math.random() > 0.62) lines.push(pick(OPENINGS));
  if (seed.substance && SUBSTANCE_FLAVOR[seed.substance]) {
    lines.push(pick(SUBSTANCE_FLAVOR[seed.substance]));
  }
  const scene = Math.random();
  if (scene < 0.34) lines.push(`In ${setting}, a ${noun} ${verb}.`);
  else if (scene < 0.67) lines.push(`A ${noun} follows you through ${setting} and ${verb}.`);
  else lines.push(`Official correction: the ${noun} in ${setting} did not ${verb}. You did.`);
  lines.push(atmo);
  if (seed.paranoia >= 35 || seed.descent >= 4) lines.push(pick(PARANOIA));
  if (seed.descent >= 5 && Math.random() > 0.45) lines.push(pick(DIRECTIVES));
  if (seed.descent >= 7) {
    lines.push(Math.random() > 0.5
      ? `${pick(PRONOUNS_2P).replace(/^./, c => c.toUpperCase())} has been replaced with a clerical instrument and no one has noticed.`
      : pick(DEEP_DESCENT));
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
    "Predictive model confirms subject will reread this line.",
    "A second cursor has been detected beneath the visible cursor.",
    "Dental microphone reports low-confidence whispering.",
    "Subject's shadow arrived 0.8 seconds before subject.",
    "Routine deviation categorized as decorative resistance.",
  ];
  if (ctx.idleMs && ctx.idleMs > 8000) {
    return `Target has been motionless for ${Math.round(ctx.idleMs / 1000)} seconds. Awaiting instruction.`;
  }
  if (ctx.descent >= 6 && Math.random() > 0.5) {
    return `Cross-reference confirms: the reader and the read are no longer separable.`;
  }
  return pick(base);
}

const PROBE_ACTIONS = [
  "touches the nearest wall", "asks who owns the room", "checks beneath the furniture",
  "holds their breath", "reads the smallest available print", "knocks three times on the floor",
  "attempts to remember arriving", "looks directly at the surveillance lens",
];

export function generateInteractionResponse(roomTitle: string, descent: number, paranoia: number): string {
  const action = pick(PROBE_ACTIONS);
  const noun = pick(NOUNS_BODY);
  const reaction = pick(VERBS_GROTESQUE);
  const lines = [`You ${action}. The room labeled “${roomTitle}” answers first.`];
  if (Math.random() > 0.5) lines.push(`A ${noun} ${reaction}.`);
  else lines.push(pick(ATMOSPHERE));
  if (paranoia >= 45) lines.push(pick(PARANOIA));
  if (descent >= 7) lines.push(pick(DEEP_DESCENT));
  return lines.join(" ");
}

export function generateRoomVignette(slug: string, descent: number): string {
  const noun = pick(NOUNS_BODY);
  const atmo = pick(ATMOSPHERE);
  return `[${slug.toUpperCase()}] You enter. A ${noun} regards you without surprise. ${atmo} ${descent >= 5 ? pick(PARANOIA) : ""}`.trim();
}
