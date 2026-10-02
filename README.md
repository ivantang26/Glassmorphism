# Lumen

Landing site for a fictional budgeting app with an interactive dashboard preview. It is a study in glassmorphism that meets WCAG AA text contrast on every glass panel.

SvelteKit 2 + Svelte 5, prerendered to static HTML (`adapter-static`). Charts are hand-rolled SVG.

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # runs the contrast check, then builds to ./build
npm run check:contrast -- --verbose
```

## Where things live

| Path | What |
| --- | --- |
| `src/app.css` | All design tokens, section themes (`.theme-light` / `.theme-dark` / `.theme-calm`), glass, fallbacks |
| `scripts/check-contrast.mjs` | FR-7 build gate. Reads the tokens from `app.css` and fails below 4.5:1 |
| `src/lib/components/Band.svelte`, `Blobs.svelte` | A themed run of sections sharing one colour field |
| `src/lib/dashboard/` | Dashboard preview: persona switch, budgets, donut, 30-day line, goals, transactions |
| `src/lib/data/*.json` | One sample-data file per persona |
| `src/lib/store-links.js` | Store URLs (placeholders) and platform detection |

## Requirements

- **FR-1** Persona switch: data is bundled, so updates take under 100 ms. Counters animate over 600 ms.
- **FR-2** Budget sliders are native range inputs, so arrows, Page Up/Down and Home/End all work. "Left to spend" updates live and is announced politely after you stop.
- **FR-3** `GetAppButton`: iOS → App Store, Android → Play Store, desktop → QR dialog. Without JS it links to `/download`.
- **FR-4** Nav fill goes from 0.55 to 0.75 past 80px of scroll, with a 200 ms transition.
- **FR-5** `@supports not (backdrop-filter…)` switches to 0.92 solid fills. Add **`?noblur`** to any URL to force the same fallback for QA.
- **FR-6** Monthly / annual toggle: £3.99 a month or £39.90 a year (2 months free).
- **FR-7** `check-contrast.mjs` samples every background a panel can sit on and fails the build below 4.5:1. That covers the base colour, each blob along its fall-off, and every pair of overlapping blobs. Checked surfaces: bare background, glass, nested glass, no-blur fallback, nav at both opacities, the primary button, and `prefers-contrast: more`.
- **FR-8** Each band declares its theme and tokens switch with it.

Also covered:
- Charts have a hidden data table and a text summary.
- Donut segments switch to patterns under `prefers-contrast: more`.
- Reduced motion stops the blobs, bobbing cards and count-ups.
- Mobile shows 2 blobs, tablet 3, desktop 4 drifting, with blur stepping 12 → 16 → 20/24px.
- Nested panels never add a second blur.

## Where the build departs from the spec, and why

The contrast checker caught these. Each is the smallest change that passes.

- **Dark-section blobs peak at 0.24 opacity, not full strength.** Under the spec's `rgba(255,255,255,0.10)` dark glass, overlapping teal and blue blobs at 0.45 pull white text down to about 3.5:1. The light sections keep 0.55.
- **Dark-section secondary text is near-white.** That covers muted, positive, negative and link text. Tinted text can't clear 4.5:1 over the brightest blob mix on 0.10 glass. Meaning never relies on colour alone: amounts carry +/− signs and warnings carry icons and words.
- **Primary button gradient uses deepened brand colours** (`#5B3DF5` → `#0E7C74`). White on the original teal `#2EC4B6` is about 2.2:1.

## Open questions (from the spec)

- **Bank-connection partner and regulatory wording.** The site says "FCA-registered partner" and "authorised account information service provider" without naming anyone. Legal needs to supply both.
- **Custom numbers in the dashboard.** It currently stays limited to the three personas. Budget sliders are the only input, and edits are kept per persona.

Store URLs in `src/lib/store-links.js` are placeholders. Analytics events (`store_cta_click`, `store_badge_click`) go to `window.dataLayer` and a `lumen:track` DOM event, so any provider can be wired in later.
