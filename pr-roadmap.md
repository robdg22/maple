# Concern to Care — PR Roadmap

This roadmap converts `concern-to-care-build-plan.md` into a sequence of small, reviewable pull requests.

## PR sequence

### PR 1 — Bootstrap app shell + design system foundations
- Initialize Vite React + TypeScript app (`concern-to-care/`).
- Add Tailwind + Framer Motion + `clsx`.
- Add base tokens (`src/styles/tokens.css`) and wire Tailwind theme extensions.
- Add app shell components:
  - `PhoneFrame`
  - `Screen`
  - `Card`
  - `Button`
- Add scenario state hook (`useScenarioState`) with:
  - screen flow state
  - `goTo`, `goBack`
  - clarifying answer state
- Add seed scenario data file (`src/data/scenario.ts`).
- Add a lightweight verification page rendering core components.

### PR 2 — Concern + Structuring screens
- Build `ConcernScreen` static layout and interactions.
- Add example auto-type flow (~30ms/character).
- Add concern entry choreography.
- Wire Continue to `structuring`.
- Build `StructuringScreen`:
  - compressed concern preview
  - 3-dot calm animation
  - caption
  - timed auto-advance (~1.8s) to `structure`

### PR 3 — Structure hero moment
- Build full structure summary screen with staged reveal choreography.
- Implement row-level reveal timing and helper strip.
- Add clarifying question card and pill options.
- Add answer selection animation and delayed navigate (400ms) to `recommend`.
- Add bottom sheet edit affordance (visual-first behavior acceptable for demo).

### PR 4 — Recommendation + navigation branches
- Build recommendation screen hierarchy and timing.
- Add urgency panel styling and copy balancing.
- Wire CTAs:
  - booking path
  - inspect/edit handoff path

### PR 5 — Handoff, booking, confirmation
- Build handoff brief inspection screen and mock edit affordances.
- Build booking slot selection screen.
- Build confirmation screen + success animation sequence.
- Add reset/restart affordance for demo reruns.

### PR 6 — Accessibility + motion + QA hardening
- Apply `prefers-reduced-motion` handling across screens.
- Mobile viewport and tap-target QA pass.
- Timing/pacing tuning across hero moments.
- Add demo backup notes/checklist and readiness script.

## Branching and merge strategy
- Use one branch per PR from `main`.
- Keep each PR shippable and demo-able.
- Avoid cross-PR file churn where possible:
  - PR 1 owns foundational components and tokens.
  - PRs 2–5 primarily add screen-specific files.
  - PR 6 only adjusts behavior, timing, and QA docs.

## Review checklist per PR
- Build passes locally.
- Flow is runnable at least to the current milestone.
- Motion is calm (no overshoot/wobble), spring-based.
- Component and screen files stay aligned to planned structure.
- Notes include what was intentionally deferred to the next PR.
