export interface Room {
  slug: string;
  title: string;
  body: string;
  requiresDescent?: number;
  choices: Array<{ label: string; to: string; paranoia?: number; mutation?: string }>;
}

export const ROOMS: Record<string, Room> = {
  entry: {
    slug: "entry",
    title: "The Customs Office",
    body: "A blue-lipped clerk fingers your passport with damp gloves. The stamp is already wet. Behind him, a wall of filing cabinets breathes in slow shifts. He asks, without looking up, what you have come to declare.",
    choices: [
      { label: "Declare nothing.", to: "corridor", paranoia: 4 },
      { label: "Declare your intentions.", to: "benway", paranoia: -2 },
      { label: "Declare a small parasite.", to: "market", paranoia: 8 },
    ],
  },
  corridor: {
    slug: "corridor",
    title: "Corridor of Breathing Wallpaper",
    body: "The wallpaper expands and contracts in unison with your own chest. Somewhere a typewriter taps without operator. Two doors. One marked OPERATIONS. One marked simply with a wet handprint.",
    choices: [
      { label: "OPERATIONS.", to: "operations", paranoia: 6 },
      { label: "The handprint.", to: "handprint", paranoia: 10 },
      { label: "Back to customs.", to: "entry" },
    ],
  },
  benway: {
    slug: "benway",
    title: "Dr. Benway's Theatre",
    body: "Dr. Benway is mid-operation on a patient who appears to be himself. He waves you in with a forceps. 'Excellent timing,' he says. 'I require a second opinion on this nostalgia.' He gestures at a quivering pink organ in a steel tray.",
    choices: [
      { label: "Offer an opinion.", to: "operations", paranoia: 5 },
      { label: "Decline politely.", to: "corridor", paranoia: 2 },
      { label: "Take the organ.", to: "market", paranoia: 15, mutation: "mugwump-eyes" },
    ],
  },
  market: {
    slug: "market",
    title: "Tangier Market, 03:00",
    body: "Stalls sell tongues by the kilo, paperwork by the meter. A vendor weighs your hesitation on a brass scale and frowns. A boy in a porter's cap whispers that he can introduce you to a Mugwump. For a price.",
    choices: [
      { label: "Follow the boy.", to: "mugwump", paranoia: 12 },
      { label: "Buy a tongue.", to: "tongue-room", paranoia: 6 },
      { label: "Leave.", to: "corridor" },
    ],
  },
  operations: {
    slug: "operations",
    title: "Operations Room 7-G",
    body: "Three centipede secretaries type your file in real time. Each keystroke arrives slightly before you decide to make it. The supervisor — a soft machine with a clipboard for a face — asks whether you would prefer compliance or surprise.",
    choices: [
      { label: "Compliance.", to: "reconditioning", paranoia: -5 },
      { label: "Surprise.", to: "handprint", paranoia: 12 },
      { label: "Demand a transfer.", to: "benway", paranoia: 8 },
    ],
  },
  handprint: {
    slug: "handprint",
    title: "Behind the Wet Handprint",
    body: "The room is warm and pink and slightly damp. The walls flex around you like a slow lung. In the center, a single typewriter rests on a pedestal of bone. A sheet of paper, half-typed: '...and then they realized'.",
    requiresDescent: 3,
    choices: [
      { label: "Finish the sentence.", to: "typewriter-room", paranoia: 15, mutation: "typewriter-keys" },
      { label: "Tear out the page.", to: "corridor", paranoia: 5 },
      { label: "Sit and listen.", to: "mugwump", paranoia: 20 },
    ],
  },
  mugwump: {
    slug: "mugwump",
    title: "Audience with a Mugwump",
    body: "The Mugwump is taller than you remembered and entirely the wrong color. It does not speak. It exudes a clear, sweet liquid which the boy collects in a small cup and offers to you with an expression of polite urgency.",
    choices: [
      { label: "Drink.", to: "ending-mugwumps", paranoia: 25, mutation: "mugwump-eyes" },
      { label: "Decline.", to: "market", paranoia: 8 },
      { label: "Ask a question.", to: "tongue-room", paranoia: 12 },
    ],
  },
  "tongue-room": {
    slug: "tongue-room",
    title: "Cold Storage",
    body: "Hooks of tongues — beef, sheep, several you cannot identify — sway gently. One of them is talking, but only when no one watches it directly. You catch the words 'don't sign the' before it goes still.",
    choices: [
      { label: "Watch the tongue directly.", to: "handprint", paranoia: 10 },
      { label: "Pretend not to listen.", to: "operations", paranoia: 6 },
      { label: "Flee.", to: "corridor", paranoia: 4 },
    ],
  },
  reconditioning: {
    slug: "reconditioning",
    title: "Reconditioning Suite",
    body: "Beige. Beige everywhere. A nurse with a clipboard and a too-kind smile guides you to a chair that fits you slightly too well. 'It won't take long,' she says. 'Most of it has already happened.'",
    choices: [
      { label: "Sit.", to: "ending-reconditioned" },
      { label: "Refuse.", to: "handprint", paranoia: 18 },
    ],
  },
  "typewriter-room": {
    slug: "typewriter-room",
    title: "The Sentence",
    body: "Your fingers find the keys before you decide to. The sentence types itself: '...and then they realized they had been writing themselves the whole time.' The paper feeds another blank sheet. You are expected to continue.",
    requiresDescent: 5,
    choices: [
      { label: "Continue typing.", to: "ending-typewriter", mutation: "typewriter-keys" },
      { label: "Stop.", to: "operations", paranoia: 20 },
    ],
  },
  // Terminal "ending" rooms loop back gently:
  "ending-mugwumps": {
    slug: "ending-mugwumps",
    title: "The Long Drink",
    body: "The liquid is warm and slightly sweet and not, in any meaningful sense, optional. You begin to file your own thoughts before thinking them. The Mugwump nods, approvingly, with all of its faces at once.",
    choices: [{ label: "Return to the Feed.", to: "entry" }],
  },
  "ending-reconditioned": {
    slug: "ending-reconditioned",
    title: "Compliance Achieved",
    body: "Thank you for your cooperation. Your file has been amended. You may return to your duties. This sentence has not occurred.",
    choices: [{ label: "Return to the Feed.", to: "entry" }],
  },
  "ending-typewriter": {
    slug: "ending-typewriter",
    title: "Continuous Operation",
    body: "You continue typing. The page does not end. You are the page. Welcome.",
    choices: [{ label: "Return to the Feed.", to: "entry" }],
  },
};
