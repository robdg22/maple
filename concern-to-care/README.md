# From Concern to Care

Mobile web prototype for the Care Handoff Model. PR 1 establishes the React app shell, design tokens, shared UI components, scenario state, and seed headache scenario data.

## Run locally

```bash
npm install
npm run dev
```

## Check

```bash
npm run build
npm run lint
```

## PR 1 structure

- `src/styles/tokens.css` defines the palette, typography base, and global page surface.
- `src/components/` contains the shared `PhoneFrame`, `Screen`, `Card`, and `Button` primitives.
- `src/hooks/useScenarioState.ts` owns the demo screen flow and clarifying-answer state.
- `src/data/scenario.ts` contains the hardcoded headache scenario content.
- `src/app/App.tsx` composes the shell, flow stubs, and component preview panel.
