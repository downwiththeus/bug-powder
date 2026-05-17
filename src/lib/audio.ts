// Simple drone using WebAudio API — no extra deps.
let ctx: AudioContext | null = null;
let nodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; lfo: OscillatorNode; lfoGain: GainNode } | null = null;

export function startDrone() {
  if (typeof window === "undefined") return;
  if (nodes) return;
  ctx = ctx || new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  osc1.type = "sawtooth";
  osc1.frequency.value = 55; // low A
  osc2.type = "sine";
  osc2.frequency.value = 82.4; // E
  lfo.frequency.value = 0.18;
  lfoGain.gain.value = 0.012;
  gain.gain.value = 0.0;

  lfo.connect(lfoGain).connect(gain.gain);
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(); osc2.start(); lfo.start();
  gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2.5);
  nodes = { osc1, osc2, gain, lfo, lfoGain };
}

export function stopDrone() {
  if (!nodes || !ctx) return;
  const { osc1, osc2, gain, lfo } = nodes;
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
  setTimeout(() => {
    try { osc1.stop(); osc2.stop(); lfo.stop(); } catch {}
    nodes = null;
  }, 900);
}

export function clack() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  g.gain.value = 0.12;
  src.buffer = buffer;
  src.connect(g).connect(ctx.destination);
  src.start();
}
