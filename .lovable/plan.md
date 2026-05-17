# Interzone Feed — Build Plan

A paranoia-fueled hallucination simulator. Dark, surreal, addictive. Burroughs-coded.

## Heads-up on the stack choice

You picked "plain Vite + Vercel". This project is currently scaffolded as **TanStack Start** (which is Vite + React under the hood, but with a server runtime and file-based routing). To honor the request I will:

1. Strip TanStack Start scaffolding (`src/routes/`, `src/router.tsx`, `src/start.ts`, `src/server.ts`, `wrangler.jsonc`, the TanStack Vite plugin) and replace it with a clean Vite + React + `react-router-dom` setup.
2. Use **your own** Supabase project (you'll supply `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as env vars). I will not enable Lovable Cloud.
3. Ship a `vercel.json`, `.env.example`, a `schema.sql` to run in your Supabase dashboard, and a README with deploy instructions.

**Tradeoff to be aware of:** Lovable AI Gateway needs a server. On plain Vite + Vercel that means **Vercel Serverless Functions** (`api/*.ts`). The Lovable sandbox preview here does not run Vercel functions, so AI-generated text will fall back to the local procedural engine in preview, and only "light up" once you deploy to Vercel and set `LOVABLE_API_KEY` there. (Alternative: I do it through Supabase Edge Functions instead — let me know if you'd prefer that.)

---

## Visual & Audio Direction

- **Palette:** ink black `#080608`, void purple `#120d13`, vein `#3a0f1d`, blood `#821425`, sickly pus-green `#a1b06c`, bug green `#2d4a3e`, bruise `#4a2a5e`. Defined as CSS custom properties in `src/styles.css` (oklch).
- **Typography:** A glitchy serif display (Special Elite / IBM Plex Mono for typewriter feel) + a degraded mono body. Letters subtly jitter at higher descent levels via CSS custom property `--descent` driving `text-shadow` and `transform: skew`.
- **Motion:** Framer Motion for panel transitions, CSS keyframes for CRT scanlines, chromatic-aberration glitch, vein pulse, melting streak flame. A full-screen SVG noise overlay with `mix-blend-mode: overlay`.
- **Audio:** Tone.js (or raw `AudioContext`) generating a low drone + occasional typewriter clack. Off by default, toggle in header.

UI degradation scales off a single `descent` value (1–10): scanline intensity, color shift, font tracking, button jitter, cursor lag.

---

## Information Architecture

```
/                     -> Landing / "Step into the Interzone" (anonymous entry)
/feed                 -> Main Dashboard (substances, feed, surveillance)
/fix                  -> Substances / Fix Panel (focused ritual screen)
/interzone            -> Interzone Explorer (branching vignettes)
/mutations            -> Profile / Mutations gallery
/withdrawal           -> Forced redirect when in withdrawal_mode
```

`react-router-dom` with a shared `<InterzoneLayout>` (header + audio toggle + global glitch overlay).

---

## Anonymous-first auth flow

- On first visit, immediately call `supabase.auth.signInAnonymously()`. User is dropped straight into `/feed` with no signup wall.
- A discreet "Bind to identity" link in the header lets them upgrade the anon account to email/password later (`updateUser({ email, password })`), preserving all streaks, dependence, and mutations.
- All Supabase reads/writes are RLS-scoped to `auth.uid()`, so anon and bound users use the same code path.

---

## Database Schema (run in your Supabase SQL editor)

Same shape as your blueprint, with small additions:

- `profiles` — id, descent_level, paranoia_score, current_streak, last_fix_at, withdrawal_mode, 4× dependence columns (0–100), `audio_enabled`, `erotic_grotesque` toggle, `ending_slug` (for multi-ending finale)
- `mutations` — user_id, slug, unlocked_at (unique pair)
- `surveillance_logs` — user_id, severity, message, created_at
- `hallucination_history` — user_id, seed, content (jsonb: { text, glitch_config, room_id }), created_at
- `interzone_rooms` — id, slug, title, body, requires_descent, requires_mutation_slug, choices (jsonb) — *seeded with ~25 hand-written rooms; AI fills in dynamic flavor*
- `routines` — user_id, title, body, snapshot_url (for shareable "Routines" exports)

A `handle_new_user()` trigger creates a `profiles` row on signup (incl. anonymous). RLS policies as in your blueprint, plus public `select` on `interzone_rooms`.

---

## Core mechanics

1. **Daily Fix Ritual** — Once per 24h, "Administer Fix" gives +1 streak, generates a personalized hallucination, and logs to history. Skipping >26h sets `withdrawal_mode=true` (checked client-side on load; a Supabase scheduled function would be nicer but is post-MVP).
2. **Dependence** — Each fix bumps that substance +10–20. Levels gate content: cross 60 = new feed style, cross 80 = unlock mutations, cross 95 = unique vignette + risk of Withdrawal cascade.
3. **Descent Level** — Global 1–10, driven by total fixes + paranoia. Controls UI degradation intensity via a CSS variable.
4. **Surveillance Engine** — Listens to mouse idle, page-visibility, time-on-screen, tab switches. Generates paranoid lines mixing your real telemetry ("you stopped moving 14 seconds ago") with Interzone flavor. Mix of procedural templates + occasional Lovable AI calls for personalization at high paranoia.
5. **Mutations** — Triggered by thresholds, persist forever. Each mutation toggles a CSS class on `<body>` (centipede cursor, mugwump eye blinks in corners, melted nav, swapped fonts).
6. **Routines export** — `html-to-image` on the current feed → downloadable PNG + optional save to `routines` table.
7. **Paranoia Score → Endings** — At descent 10 + paranoia thresholds, unlock one of 4 ending slugs shown in `/mutations`.

---

## Generative Hallucination Engine (Lovable AI Gateway)

- **Server:** `api/hallucinate.ts` (Vercel function). Reads `LOVABLE_API_KEY` from env, calls `https://ai.gateway.lovable.dev/v1` with `google/gemini-3-flash-preview`. Headers: `Lovable-API-Key`, `X-Lovable-AIG-SDK: vercel-ai-sdk`.
- **Input:** current substance, descent level, paranoia score, last 3 hallucinations (for continuity), optional erotic-grotesque flag.
- **System prompt:** strict Burroughs-pastiche voice, 2–4 sentences, second person, no copying of source text, must include one corporeal/mechanical hybrid image.
- **Fallback:** if API fails or in preview, use a local procedural splicer (noun/verb/modifier arrays) so the app never feels broken.
- **Surveillance lines:** same endpoint, different prompt, called sparingly (every ~30s when descent > 4).

---

## Project Restructure & New Files

Created:
- `index.html` (Vite default), `src/main.tsx`, `src/App.tsx` with `<BrowserRouter>`
- `src/lib/supabase.ts`, `src/lib/ai.ts`, `src/lib/glitch.ts`, `src/lib/proceduralText.ts`
- `src/hooks/useProfile.ts`, `useSurveillance.ts`, `useDescent.ts`, `useAudio.ts`
- `src/components/layout/InterzoneLayout.tsx`, `GlitchOverlay.tsx`, `Scanlines.tsx`, `VeinMeter.tsx`, `FeedStream.tsx`, `SurveillancePanel.tsx`, `FixButton.tsx`, `MutationBadge.tsx`, `RoomCard.tsx`, `AudioToggle.tsx`, `BindIdentityDialog.tsx`
- `src/pages/Landing.tsx`, `Feed.tsx`, `Fix.tsx`, `Interzone.tsx`, `Mutations.tsx`, `Withdrawal.tsx`
- `api/hallucinate.ts` (Vercel serverless function)
- `supabase/schema.sql`, `supabase/seed_rooms.sql`
- `vercel.json`, `.env.example`, `README.md`

Removed:
- `src/routes/`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/start.ts`, `src/server.ts`, `wrangler.jsonc`
- TanStack plugins from `vite.config.ts`; replaced with plain `@vitejs/plugin-react`

Dependencies added: `react-router-dom`, `@supabase/supabase-js`, `framer-motion`, `tone`, `html-to-image`, `zustand` (lightweight global state for descent/audio).

---

## Secrets needed

- **Locally / Vercel:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (public, in client bundle)
- **Vercel only:** `LOVABLE_API_KEY` (server-side, for the hallucination function)

I'll wire `.env.example` and the README so you can paste them in.

---

## Build order

1. Restructure: strip TanStack, set up Vite + react-router + Tailwind tokens + styles.css palette/animations
2. Supabase: client, schema.sql, anonymous-auth bootstrap, `useProfile` hook
3. Layout shell: header, audio toggle, scanlines, glitch overlay, descent CSS variable
4. Feed dashboard: vein meters, fix buttons, feed stream, surveillance panel (procedural-only first pass)
5. Fix page: ritualistic full-screen "administer" flow with framer-motion sequence
6. Interzone Explorer: room renderer + branching choices, seeded rooms
7. Mutations gallery + mutation CSS classes wired to `<body>`
8. Withdrawal mode: forced redirect, screen-shake, panic CTA
9. Vercel function + AI integration + procedural fallback
10. Routines export (html-to-image) + paranoia endings
11. `vercel.json`, README, `.env.example`, deploy doc

---

## Out of scope (call out for v2)

- Server-side cron for withdrawal (using client-side time check instead)
- Real moderation on AI output (Gemini is well-behaved with the system prompt)
- Multiplayer / shared Interzone
- Mobile app shell

---

Ready to build on approval. If you'd rather route AI through a Supabase Edge Function instead of a Vercel function (single deployment surface, no Vercel-function cold starts), say the word before I start.
