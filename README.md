# Interzone Feed

> A paranoia-fueled hallucination simulator. A surreal, escalating habit tracker that descends into Burroughs-coded body horror.
> Dark, addictive, strangely beautiful.

## Stack

- React 19 + TypeScript
- Vite + TanStack Start (Vite under the hood — deploys cleanly to Vercel)
- Tailwind CSS v4 (semantic tokens in `src/styles.css`)
- Framer Motion for fluid transitions
- Zustand (with `persist` middleware) for local state
- Supabase (optional) for cross-device persistence
- `html-to-image` for shareable Routine exports

## Quick start

```bash
bun install      # or npm/pnpm
bun run dev
```

The app runs entirely on **localStorage** by default. No setup required to play.

## Optional: Supabase persistence

1. Create a Supabase project at https://supabase.com
2. Open the SQL editor, paste in `supabase/schema.sql`, run it
3. Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your anon key>
```

4. Restart `bun run dev`

> **Note:** The current build uses local-only state; Supabase sync is wired in `src/lib/supabase.ts` and ready to extend in a future pass (see `// TODO: sync to supabase` comments).

## Deploy to Vercel

```bash
# Push to a GitHub repo, then:
# 1. Import the repo at https://vercel.com/new
# 2. Framework preset: Vite
# 3. Build command: bun run build  (or npm run build)
# 4. Output directory: dist
# 5. Add env vars (optional):
#       VITE_SUPABASE_URL
#       VITE_SUPABASE_ANON_KEY
```

The included `vercel.json` rewrites all routes to `/` so client-side routing works.

### One-shot CLI deploy

```bash
npm i -g vercel
vercel
```

## Project structure

```
src/
├── components/         InterzoneLayout, VeinMeter, FeedStream, SurveillancePanel
├── lib/
│   ├── store.ts        Zustand store: dependence, descent, mutations, endings
│   ├── proceduralText.ts   Burroughs-pastiche generator (original phrasing)
│   ├── rooms.ts        Interzone Explorer vignettes (branching)
│   ├── audio.ts        WebAudio drone + typewriter clack
│   └── supabase.ts     Optional Supabase client
├── routes/
│   ├── index.tsx       Landing page
│   ├── _app.tsx        Shared layout (header, scanlines, descent CSS)
│   ├── _app.feed.tsx   The Feed — dashboard with substances + surveillance
│   ├── _app.fix.tsx    Ritual fix administration screen
│   ├── _app.interzone.tsx   Branching room explorer
│   ├── _app.mutations.tsx   Mutations gallery + routine PNG export
│   └── _app.withdrawal.tsx  Forced redirect on missed fix
└── styles.css          Design tokens, animations, mutation classes
```

## Core mechanics

| System | Behavior |
|---|---|
| **Dependence** | 4 substances, each 0–100. Each fix bumps that substance ~15. |
| **Descent** | Global 1–10, derived from total dependence. Drives UI glitch intensity via `--descent` CSS variable. |
| **Streak** | Daily fix increments streak. >26h gap triggers Withdrawal Mode. |
| **Paranoia** | Bumps on every action. Drives surveillance frequency + ending unlock. |
| **Mutations** | Threshold-gated. Each toggles a `mut-*` body class altering the UI permanently (centipede cursor, mugwump eyes, melted nav, etc). |
| **Endings** | 4 paths unlock at descent 10 based on which dependence dominated. |
| **Routines** | Export your last 5 hallucinations as a shareable PNG via `html-to-image`. |

## Content credit

All text is original procedural pastiche — no source material is reproduced. The work pays homage to William S. Burroughs' *Naked Lunch* (1959) as cultural reference; no copyrighted text is included.

## License

MIT. Build something stranger.
