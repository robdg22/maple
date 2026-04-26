# PR 1 Checklist — Bootstrap app shell + foundations

## Setup
- [x] Create Vite React TS app in `concern-to-care/`
- [x] Install runtime deps: `framer-motion`, `clsx`
- [x] Install/configure Tailwind + PostCSS + Autoprefixer
- [x] Add Plus Jakarta Sans font import

## Design tokens
- [x] Create `src/styles/tokens.css`
- [x] Add CSS variables from spec (`--bg`, `--surface`, `--sage`, `--amber`, etc.)
- [x] Apply base body styles from tokens
- [x] Map Tailwind colors to token variables

## Shared components
- [x] `PhoneFrame` (desktop frame, mobile full viewport)
- [x] `Screen` (AnimatePresence wrapper + default transition)
- [x] `Card` (base + `soft` + `elevated`)
- [x] `Button` (`primary`, `secondary`, `pill` + press spring)

## State + data
- [x] `useScenarioState`:
  - [x] screen union type
  - [x] `goTo` + `goBack`
  - [x] selected clarifying answer state
- [x] `src/data/scenario.ts` with headache scenario content

## Integration
- [x] Compose app shell in `src/app/App.tsx`
- [x] Add simple screen host stub for flow stepping
- [x] Add component-preview/dev test route or panel

## Validation
- [x] `npm run build`
- [x] `npm run lint` (if configured)
- [x] Manual mobile-width smoke pass
