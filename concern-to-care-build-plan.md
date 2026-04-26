# From Concern to Care — Build Plan

A phased plan for building the prototype. Each phase produces something you can run, see, and decide on before moving forward. If you run out of time, stop at the end of any completed phase — you'll still have something demonstrable.

---

## Phase 0 — Setup (1 hour)

**Goal:** A running React app with the design system in place, deployed to Vercel.

### Tasks

**0.1 Initialise the project**
- `npm create vite@latest concern-to-care -- --template react-ts`
- Install dependencies: `framer-motion`, `tailwindcss`, `postcss`, `autoprefixer`, `clsx`
- Configure Tailwind: `npx tailwindcss init -p`
- Add Plus Jakarta Sans via Google Fonts in `index.html`

**0.2 Set up the design tokens**
- Create `src/styles/tokens.css` with all colour variables
- Extend `tailwind.config.js` to use these tokens as theme colours
- Set the body font to Plus Jakarta Sans, body bg to `--bg`, body text to `--ink`

**0.3 Create the GitHub repo and push**
- `git init`, push to GitHub
- Connect to Vercel — it will auto-deploy on every push
- Confirm the deployed URL works

**0.4 Build the PhoneFrame component**
- A wrapper component that shows a phone frame on desktop (≥768px) and full viewport on mobile
- Rounded corners (40px), 8px bezel, subtle shadow
- Decorative status bar at top (time, signal, battery icons)
- Inside should be a 390x844px (iPhone 14 size) container

**Deliverable:** A running app showing an empty phone frame on the deployed URL.

---

## Phase 1 — Architecture and shared components (1-2 hours)

**Goal:** All the foundational pieces that every screen will use, so screens can be built quickly afterwards.

### Tasks

**1.1 Build the screen state machine**
- Create `src/hooks/useScenarioState.ts`
- Manage `currentScreen` state with values: `'concern' | 'structuring' | 'structure' | 'recommend' | 'handoff' | 'booking' | 'confirmation'`
- Expose `goTo(screen)` and `goBack()` functions
- Track the user's clarifying answer ("Yes" / "Some of these" / "No") — even though it doesn't affect the output, this lets the recommendation reflect their answer in language

**1.2 Build the Screen wrapper component**
- Wraps each screen in AnimatePresence
- Handles enter/exit transitions between screens
- Default transition: fade + slight x-offset (or y-offset for upward feeling)
- Should accept children and a screenKey prop

**1.3 Build the Card component**
- White surface (`--surface`), 20px border radius, 20-24px padding
- Optional variant: `soft` (uses `--surface-soft`)
- Optional `elevated` variant with subtle shadow

**1.4 Build the Button component**
- Three variants: `primary` (amber, full-width default), `secondary` (outline), `pill` (rounded, sage when selected)
- Press state: scale to 0.97 with snappy spring
- Optional `disabled` state with reduced opacity

**1.5 Build the scenario data file**
- `src/data/scenario.ts` exports the headache scenario:
  - The user's typed concern (full text)
  - The structured fields (symptom, pattern, duration, other)
  - The clarifying question and three possible answers
  - The recommendation text, reasoning, alternatives, escalation criteria
  - The care brief content
  - The available booking slots

**Deliverable:** All shared components rendered on a test page, with the state machine functional.

---

## Phase 2 — Concern screen + auto-type (1-2 hours)

**Goal:** The first screen feels alive and the auto-type demo trick works smoothly.

### Tasks

**2.1 Build the static layout**
- Small header at top: "From concern to care"
- Centred prompt: "What's been happening?"
- Multi-line text input (auto-resizing textarea)
- Helper text below: "Use your own words. You can always change anything later."
- Continue button (initially hidden/transparent)

**2.2 Implement auto-type**
- Add a small "Use example" link below the input (or a hidden button — your call)
- When triggered, animate the text appearing in the textarea character by character at ~30ms per char
- The Continue button should fade in once there's text

**2.3 Add entry animations**
- Title fades up first (y: 8 → 0, opacity 0 → 1)
- Prompt fades up 60ms after
- Input fades up 120ms after
- Helper fades in 200ms after
- Use Framer Motion's `staggerChildren` on a parent variant

**2.4 Wire up the Continue button**
- On tap: trigger the snappy press spring
- Then call `goTo('structuring')`

**Deliverable:** Screen 1 is fully working. You can tap "Use example," watch the text type in, then tap Continue to move to the next screen.

**Demo tip:** When you're presenting live, you might want the auto-type to start automatically when the screen loads, after a short pause. That way you don't need to hide a button to tap.

---

## Phase 3 — Structuring transition (1 hour)

**Goal:** A short, calm processing moment between screens 1 and 3.

### Tasks

**3.1 Build the layout**
- The user's typed concern compressed into a small card at the top
- Centred: a calm visual (three dots that gently rise and fall in sequence — slow, meditative timing)
- Caption beneath: "Understanding what you've shared..."

**3.2 Build the dot animation**
- Three small circles, sage colour
- Each animates y from 0 → -4 → 0 with a smooth spring
- Stagger delay of 200ms between each
- Repeats indefinitely while on screen
- The motion should feel like breathing, not blinking

**3.3 Implement the auto-advance**
- After 1.8 seconds, automatically transition to Screen 3
- Use a `useEffect` with a `setTimeout`

**Deliverable:** Tapping Continue on Screen 1 now leads through a calm processing state into the next screen.

---

## Phase 4 — Structure screen (THE FIRST HERO MOMENT) (3-4 hours)

**Goal:** The core craft moment — the AI's understanding becoming visible. This is where you invest real time.

### Tasks

**4.1 Build the static layout**
- Top: compressed user concern card (a quote mark icon, then their text, slightly muted)
- Header: "Here's what we understood"
- Summary card with four rows (Symptom, Pattern, Duration, Other)
- Each row: label (small, muted), value (larger, primary), edit pencil icon at right
- Sage helper strip below: "This is what we understood..."
- Clarifying question card with three pill answers and helper text below

**4.2 Build the row reveal animation**
- Each row starts at opacity 0
- Label fades in first
- Value slides in from x: -4 with a slight delay (40ms after the label)
- Use Framer Motion variants on each row

**4.3 Choreograph the full sequence**
- Compressed user card slides up first
- Header fades in
- Summary card container appears (fades in as an empty card)
- Each row staggers in at 80ms intervals using parent `staggerChildren`
- Helper strip fades in 200ms after the last row
- **600ms pause**
- Clarifying question card slides up (y: 16 → 0)
- Three pill options stagger in at 60ms

**4.4 Build the edit row interaction**
- Tapping a row opens a bottom sheet
- Sheet contains the field name, an editable text input pre-filled with the current value, and Save/Cancel buttons
- This doesn't need to actually save anything for the demo — Save just closes the sheet
- Use `dragElastic` so it can be dismissed by dragging down

**4.5 Wire up the answer pills**
- Tapping a pill fills it with sage colour, others fade slightly
- Use a snappy spring for the fill animation
- After 400ms, advance to Screen 4
- Store the answer in state (for later use in language)

**Deliverable:** The first hero moment is complete. You can demo from Concern → Structure with all the choreography working. Test the timing — it should feel calm and considered, not slow.

**Polish notes for this screen:**
- Test the sequence at least 5 times. Watch other people watching it. The pacing matters more than the individual animations.
- If the 600ms pause feels too long, try 500ms. Don't go below 400ms — the pause is doing real work.
- Make sure the row stagger feels like understanding emerging, not items popping in. Subtle.

---

## Phase 5 — Recommend screen (THE SECOND HERO MOMENT) (2-3 hours)

**Goal:** Show calibrated confidence and visible reasoning.

### Tasks

**5.1 Build the static layout**
- Compressed summary card at top (one-line: "Headaches, two weeks, vision changes")
- Sage chip: "Based on what you've shared"
- Headline recommendation in large display text
- "Why" section in a card (expanded by default)
- "Other options" section, two sub-cards, less prominent
- "When to act faster" panel — soft amber background, with bullet criteria
- Primary CTA: "Find a GP appointment"
- Secondary action: "See and edit what will be shared"

**5.2 Implement entry animations**
- Compressed summary slides up
- Sage chip fades in
- Headline fades up (y: 12 → 0)
- "Why" section fades in 200ms after
- "Other options" fades in 300ms after
- "When to act faster" fades in last, 450ms after — subtle, not dominant
- CTA fades in with slight scale (0.96 → 1.0)

**5.3 Style the urgency panel carefully**
- Soft amber/coral background, never bright red
- The icon (if any) should feel informative, not alarming
- Bullet items aligned cleanly
- This is the trickiest visual balance in the whole prototype — present but not screaming

**5.4 Wire up navigation**
- Primary CTA → Screen 6 (booking)
- Secondary action → Screen 5 (handoff inspect)
- Both with the snappy press spring on tap

**Deliverable:** Tapping the answer pill on Screen 3 now leads to the full recommendation screen with all reasoning visible and both navigation paths working.

**Polish notes:**
- Read the language on this screen out loud. If anything sounds clinical or hedgy, rewrite it.
- The hierarchy should make it impossible to miss the headline recommendation, but never feel like the urgency panel is hidden.

---

## Phase 6 — Handoff screen (THE THIRD HERO MOMENT) (2-3 hours)

**Goal:** Make the inspectable handoff tangible. This is the principal-level differentiator.

### Tasks

**6.1 Build the static layout**
- Top header: "What we'll share with your GP"
- Subhead: "Your GP will see this before your appointment so you don't have to explain it again."
- Care brief card — styled to look slightly more formal than the rest of the UI:
  - Sage header bar with "Care brief" and date
  - White card body
  - Sections: Reason for appointment, Symptom summary, What the customer is concerned about, What we recommended, What we did not assess
- Below: "Edit any section" / "Add something we missed" / "Remove the brief and start fresh"
- Reassurance line: "You're in control. Nothing is shared until you book the appointment."
- Primary CTA: "Continue to booking"

**6.2 Style the care brief to feel formal**
- Slightly different visual treatment from the rest of the UI
- Maybe a thin line under each section header
- Monospace-style date/time
- Tighter spacing than the conversational screens
- The point is it should look like something a clinician would receive, not like a chat bubble

**6.3 Implement entry animations**
- Header fades in
- Care brief card scales up slightly (0.96 → 1.0) with a settling spring
- Each section within the card staggers in at 60ms
- Control links fade in beneath
- CTA fades in last

**6.4 Make the edit affordances tappable (cosmetically)**
- Tapping any of them just shows a brief sheet that says "Editing not enabled in this prototype" — or just animates as if something happened
- Don't waste time building real editing here; the point is showing it's possible

**6.5 Wire up the CTA**
- Continue to booking → Screen 6

**Deliverable:** From the recommendation screen, you can tap "See and edit what will be shared" and see the full handoff. The care brief looks credible and the controls are visible.

---

## Phase 7 — Booking + Confirmation (2-3 hours)

**Goal:** Clean, quick screens that close the loop. Not the place for craft pyrotechnics.

### Tasks

**7.1 Build the booking screen**
- Header: "GP appointments"
- Subhead: "Same- or next-day, near you"
- Three slot cards stacked
- "Show more times" link
- Note at bottom: "Your care brief will be sent to your GP automatically when you book."

**7.2 Animate the booking screen entry**
- Cards stagger in (70ms apart) from below
- Each card has a press state (scale to 0.98 with snappy spring)

**7.3 Build the confirmation screen layout**
- Centred composition
- Sage circle with check mark
- "You're booked" heading
- Appointment details (Today 4:20pm, Dr. Sarah Chen, Parkside Medical Centre)
- Payoff line: "Dr. Chen will have your care brief before the appointment."
- Two outline buttons: "Add to calendar" / "How to prepare"
- Bottom note: "We'll check in with you afterwards to see how it went."

**7.4 Build the confirmation animation (this one deserves real craft)**
- Sage circle scales in (0.4 → 1.0) with a settling spring
- The check mark draws inside it (animate stroke-dashoffset on an SVG path) over ~500ms
- A subtle sage glow pulses outward once and fades (duplicated circle behind, scaling and opacity)
- "You're booked" fades up 200ms after the check completes
- Appointment details stagger in
- Payoff line fades in last with a slight delay — give it space
- Buttons and note fade in to close

**7.5 Wire up booking → confirmation**
- Tap a slot card → it scales briefly, then transitions
- The selected slot's data populates the confirmation screen

**Deliverable:** The full flow from Concern → Confirmation works end to end. You can demo the entire prototype.

---

## Phase 8 — Polish (2-3 hours)

**Goal:** Tighten everything. This phase is what separates a good prototype from a great one.

### Tasks

**8.1 Motion timing pass**
- Run through every screen and watch every transition
- If anything feels too slow, speed it up (rarely)
- If anything feels too fast, slow it down (more common)
- Pay particular attention to the three hero moments — they need room to breathe

**8.2 Spacing and typography pass**
- Print or display each screen alongside the deck slides
- Make sure the visual language matches — same fonts, weights, colours
- Check spacing consistency across screens
- Tweak any text that feels too dense or too sparse

**8.3 Add reduced motion support**
- Use Framer Motion's `useReducedMotion` hook
- For users who prefer reduced motion, use opacity-only transitions, no spring physics
- Test by enabling reduced motion in your OS settings

**8.4 Test on actual mobile**
- Open the deployed URL on your phone
- Run through the full flow
- Note anything that feels off — tap targets, animation speeds, text sizing
- Fix issues

**8.5 Add subtle finishing touches**
- A subtle background texture or gradient if it adds warmth (test before committing — could also subtract)
- Status bar styling on the phone frame
- Tab title and favicon
- Maybe a subtle keyboard shortcut or button to reset the demo (so you can easily restart between practice runs)

**8.6 Record a backup video**
- Run through the full demo once and screen-record it
- Save somewhere you can quickly access during the interview
- This is your fallback if the live demo fails

**Deliverable:** The prototype feels like a real product, runs smoothly on your demo device, and you have a backup video.

---

## Phase 9 — Practice and prepare for the demo (1-2 hours)

**Goal:** Be ready to demo confidently in the interview.

### Tasks

**9.1 Write the demo script**
- For each screen, what are you saying? Aim for one or two sentences max per screen
- Practice talking over the prototype, not at it
- Total demo time: 3-4 minutes max

**9.2 Practice the full demo at least 5 times**
- First two: figuring out what to say
- Next two: refining the language
- Last one: clean run

**9.3 Test the setup on your demo device**
- The exact laptop you'll use
- The exact browser
- WiFi vs hotspot — have a backup plan

**9.4 Prepare for likely questions**
- "Why did you choose this scenario?"
- "What would you change about this if you had more time?"
- "What's the riskiest part of this design?"
- "How would clinicians react to the care brief?"
- "How would you test this with real users?"

**Deliverable:** You're ready.

---

## Time budget summary

| Phase | Time | Cumulative |
|---|---|---|
| 0. Setup | 1h | 1h |
| 1. Architecture | 1-2h | 3h |
| 2. Concern screen | 1-2h | 5h |
| 3. Structuring | 1h | 6h |
| 4. Structure (HERO) | 3-4h | 10h |
| 5. Recommend (HERO) | 2-3h | 13h |
| 6. Handoff (HERO) | 2-3h | 16h |
| 7. Booking + Confirmation | 2-3h | 19h |
| 8. Polish | 2-3h | 22h |
| 9. Practice | 1-2h | 24h |

Roughly 20-24 hours total. Spread over a week, that's 3-4 hours a day. Achievable but not trivial.

---

## If time gets tight

Cut in this order:

1. **Skip Phase 9.1-9.2 detailed practice** — improvise. (Risky but possible.)
2. **Skip Phase 8.5 finishing touches** — texture, favicon, etc.
3. **Simplify Phase 7 confirmation animation** — just a static check mark, no SVG draw.
4. **Skip the edit interactions in Phase 4.4 and 6.4** — make them visually present but not functional.
5. **Skip the Structuring transition (Phase 3)** entirely — go straight from Concern to Structure with a simple fade.

Do NOT cut:
- Phase 4 (the first hero moment)
- Phase 5 (the recommendation)
- Phase 6 (the handoff)
- Phase 8.4 (testing on actual mobile)
- Phase 8.6 (backup video)
