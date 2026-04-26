# PR 1 Checklist — Bootstrap app shell + foundations

## Setup
- [ ] Create Vite React TS app in `concern-to-care/`
- [ ] Install runtime deps: `framer-motion`, `clsx`
- [ ] Install/configure Tailwind + PostCSS + Autoprefixer
- [ ] Add Plus Jakarta Sans font import

## Design tokens
- [ ] Create `src/styles/tokens.css`
- [ ] Add CSS variables from spec (`--bg`, `--surface`, `--sage`, `--amber`, etc.)
- [ ] Apply base body styles from tokens
- [ ] Map Tailwind colors to token variables

## Shared components
- [ ] `PhoneFrame` (desktop frame, mobile full viewport)
- [ ] `Screen` (AnimatePresence wrapper + default transition)
- [ ] `Card` (base + `soft` + `elevated`)
- [ ] `Button` (`primary`, `secondary`, `pill` + press spring)

## State + data
- [ ] `useScenarioState`:
  - [ ] screen union type
  - [ ] `goTo` + `goBack`
  - [ ] selected clarifying answer state
- [ ] `src/data/scenario.ts` with headache scenario content

## Integration
- [ ] Compose app shell in `src/app/App.tsx`
- [ ] Add simple screen host stub for flow stepping
- [ ] Add component-preview/dev test route or panel

## Validation
- [ ] `npm run build`
- [ ] `npm run lint` (if configured)
- [ ] Manual mobile-width smoke pass
