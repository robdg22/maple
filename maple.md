# From Concern to Care — Prototype Specification

## Overview

A mobile web prototype that demonstrates the full Care Handoff Model — from a worried customer typing their concern through to a booked appointment with their clinician fully briefed.

This prototype walks through one specific scenario (recurring headaches with vision changes) so that every moment is concrete and the design choices can be evaluated against a real situation. The AI is hardcoded — no real model integration. The point is to demonstrate the *behaviour* of the design, not the intelligence of the system.

**Tech stack:** React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion

**Target viewport:** Mobile (390px wide, iPhone-sized). Wrap in a phone frame component for desktop demo.

**Deployment:** Vercel (free, instant deploy from a GitHub repo)

---

## Project setup

```bash
npm create vite@latest concern-to-care -- --template react-ts
cd concern-to-care
npm install
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure Tailwind with your design tokens (see Design System section). Add Plus Jakarta Sans (or your chosen font) via Google Fonts in index.html.

---

## Design system

### Colours

Match the deck's palette — calm, warm, restrained, credible. Not branded, not theatrical.

```css
:root {
  --bg: #F7F4EE;          /* Warm cream — page background */
  --surface: #FFFFFF;      /* White — card surfaces */
  --surface-soft: #EFEAE1; /* Soft cream — secondary surfaces */
  --ink: #1A1A1A;          /* Near-black — primary text */
  --ink-soft: #5A5A5A;     /* Mid grey — secondary text */
  --ink-muted: #8A8A8A;    /* Light grey — tertiary text */
  --line: #E5E0D6;         /* Border / divider */
  --sage: #7A9E94;         /* Brand sage — accents, headers */
  --sage-soft: #DDE8E2;    /* Light sage — confidence chips, soft fills */
  --sage-deep: #4F7065;    /* Deep sage — emphasis */
  --amber: #C8896A;        /* Warm amber — primary CTAs */
  --amber-soft: #F0DCC9;   /* Light amber — highlights */
  --alert: #B85C5C;        /* Muted red — escalation only */
  --alert-soft: #F4DDDD;   /* Light red — escalation backgrounds */
}
```

### Typography

- **Display:** Plus Jakarta Sans, 700 weight (matches deck headings)
- **Body:** Plus Jakarta Sans, 400-500 weight
- **Sizes:**
  - Headline: 28px / line-height 1.2
  - Subhead: 20px / line-height 1.3
  - Body: 16px / line-height 1.5
  - Caption: 14px / line-height 1.4
  - Small: 12px / line-height 1.3

### Shape and spacing

- Border radius: 20px (cards), 12px (buttons), 999px (pills)
- Card padding: 20-24px
- Section spacing: 24-32px
- Generous whitespace throughout

### Motion principles

- **All animation is spring-based.** No linear or ease curves for anything user-facing.
- **Default spring** (most things): `{ stiffness: 280, damping: 26, mass: 0.9 }`
- **Snappy spring** (small UI, buttons): `{ stiffness: 400, damping: 30, mass: 0.5 }`
- **Settling spring** (cards, layouts): `{ stiffness: 220, damping: 24, mass: 1.1 }`
- **Stagger interval:** 60-80ms between sibling elements
- **Respect `prefers-reduced-motion`** — use Framer Motion's `useReducedMotion` hook

### Tone of motion

This is important and easy to get wrong. The motion should feel **calm and purposeful**, not bouncy or playful. Think "settling into place" not "popping into view." Avoid:
- Anything overshooting dramatically
- Wobble or spring oscillation
- Anything that feels celebratory (this is healthcare, not Duolingo)
- Loading spinners — use considered processing states instead

---

## The scenario

The user, an adult, types this concern:

> "I've had headaches on and off for a couple of weeks. They're getting more frequent and sometimes my vision feels off. I'm not sure if this is a GP thing, an optician thing, or something I should stop ignoring."

The system extracts a structured summary, asks one focused clarifying question, recommends a same-day or next-day GP appointment with reasoning, lets the user inspect and edit what will be shared, then books the appointment.

---

## The screens

### Phone frame wrapper

Wrap the entire app in a phone frame for desktop presentation:
- Rounded rectangle (40px radius)
- Subtle bezel (8-10px)
- Drop shadow to give it presence on screen
- Status bar at top (time, signal, battery) — purely decorative

On mobile, hide the frame and use the full viewport.

---

### Screen 1 — Concern

**Purpose:** Capture the customer's concern in their own words.

**Layout:**
- Top: small header "From concern to care" (your project title, calm, small)
- Centred: a single soft prompt — "What's been happening?"
- Below: a generous text input area (multi-line, no border initially, just a soft underline that becomes more prominent on focus)
- Bottom: a "Continue" button (amber, full-width, disabled until there's content)
- Subtle helper text below the input: "Use your own words. You can always change anything later."

**Animations on entry:**
- Fade up the title (y: 8 → 0, opacity 0 → 1)
- Fade up the prompt (60ms after)
- Fade up the input (120ms after)
- Fade in the helper text (200ms after)
- Button stays hidden/transparent until there's text

**Interaction:**
- Pre-fill the input with the headache scenario when the user starts typing (or have a "use example" link that fills it instantly for demo purposes — your call, but for a live demo I'd auto-type the scenario character by character at ~30ms per char so it feels real)
- As text appears, the Continue button fades in and gently lifts into place
- Tap Continue → transition to Screen 2

**Demo tip:** Have a button somewhere subtle that triggers the auto-type. That way during the live demo you can tap it and the scenario appears as if you're typing — letting you talk over it without actually typing.

---

### Screen 2 — Structuring (transition state)

**Purpose:** Show the AI processing the input. This is brief but important — it sets up the next screen.

**This is not a loading screen.** It's a moment of visible understanding.

**Layout:**
- Top: the customer's typed concern stays visible at the top, slightly compressed
- Centre: a calm visual — could be the sage colour pulsing very softly, or three dots that gently rise and fall in sequence (NOT a "typing indicator" style — slower, more meditative)
- Caption beneath: "Understanding what you've shared..."

**Duration:** 1.5-2 seconds total. Don't rush it (feels untrustworthy) and don't drag it out (feels broken).

**Animations:**
- The user's text shrinks/lifts to become a card at the top
- The processing visual fades in centred
- After ~1.8s, transition to Screen 3

---

### Screen 3 — Structure (THE FIRST HERO MOMENT)

**Purpose:** Show what the AI extracted. This is where transparency becomes tangible.

**This is the first craft moment.** The motion should make the AI's understanding *visible* — not pop everything in at once, but build the structured summary as if the system is finding the relevant parts of what was said.

**Layout:**

Top of screen: the original concern stays visible as a compressed card with a quote mark and the user's text. Slightly faded — it's context, not the focus now.

Below: header "Here's what we understood"

Below that, the structured summary card containing four rows:

- **Symptom:** Headaches
- **Pattern:** On and off, becoming more frequent
- **Duration:** Around two weeks
- **Other:** Vision feels off at times

Each row has a small edit affordance (a pencil icon at the right, or the row itself is tappable to edit).

Below the summary card, a soft sage-tinted strip: "This is what we understood from what you shared. Tap any row to correct it."

Below that, after a pause, a clarifying question card appears:

> "Do the headaches come with anything else — like nausea, sensitivity to light, or numbness?"

With three pill options: "Yes" / "Some of these" / "No"

Helper text beneath the question: "We're asking because it changes what kind of help you might need."

**The animation choreography (this is the craft moment):**

1. The user's text card lifts to the top (layout animation)
2. The header "Here's what we understood" fades in
3. The summary card *container* fades in as an empty card (200ms)
4. Then each row populates inside it, top to bottom, staggered at 80ms
5. Each row's content has a subtle reveal — imagine the label appearing first, then the value sliding in from a small offset (x: -4 → 0, opacity 0 → 1)
6. After the last row settles, the helper strip fades in (200ms delay)
7. **PAUSE** — wait 600ms before introducing the clarifying question. This pause is critical. It says "take your time, verify what we got."
8. The clarifying question card slides up from below (y: 16 → 0, opacity 0 → 1, settling spring)
9. Its three options stagger in (60ms apart)

**Why this matters:** Most AI products show their output instantly. That feels arbitrary — like the system already had the answer. By staging the reveal, you're showing the system thinking through what was said. That's the "use motion to show understanding forming" principle from the feedback.

**Interaction:**
- Tap a row → opens an edit modal (don't build this fully — a sheet that slides up from the bottom with the field editable, "Save" and "Cancel" — keep it simple)
- Tap an answer pill → it fills with sage colour, the others fade slightly, then transition to Screen 4

---

### Screen 4 — Recommend (THE SECOND HERO MOMENT)

**Purpose:** Show the recommendation with calibrated confidence and visible reasoning. This is where trust is designed.

**Layout:**

Top: the structured summary stays visible but compressed (one-line summary card showing "Headaches, two weeks, vision changes")

Below: a confidence indicator

> A small sage chip: "Based on what you've shared"

Then the headline recommendation:

> **"It's worth seeing a GP soon — ideally same or next day."**

Below, a "Why" section that's expanded by default (don't make people tap to see the reasoning — that's where trust dies):

> Headaches that are becoming more frequent, alongside changes in vision, are something a GP should look at properly. They can rule out anything that needs treatment and refer you on if needed (for example, to an optician or a specialist).

Below, an "Other options you could consider" section, slightly less prominent:

> **See an optician** — if you'd like to start with an eye check, that's reasonable. They can refer you if they spot something that needs medical follow-up.
>
> **Speak to a pharmacist** — for advice on managing the headaches in the meantime.

Below that, a "When to act faster" panel (subtle alert styling — soft amber/coral, not screaming):

> Get urgent help (call 111 or go to A&E) if:
> - The headache becomes the worst you've ever had
> - You have weakness, confusion, or trouble speaking
> - The vision changes become sudden or severe

At the bottom, a primary action: **"Find a GP appointment"** (amber, full-width)

And a secondary action below it: **"See and edit what will be shared"** (text link, sage)

**Animations:**

1. Compressed summary slides up to top
2. Sage chip fades in
3. Headline recommendation fades up (y: 12 → 0, opacity 0 → 1)
4. "Why" section fades in beneath (200ms after)
5. Other options section fades in (300ms after)
6. "When to act faster" panel fades in last (450ms after) — this should arrive subtly, never dominantly
7. Primary CTA fades in with a slight scale (0.96 → 1.0)

**The confidence calibration is in the language**, not in a percentage:
- "It's worth seeing a GP soon — ideally same or next day" — confident but proportionate
- "If you'd like to start with..." — gives the user agency
- "Get urgent help if..." — clear escalation criteria

This is what "calibrate confidence visibly" means in practice — not a confidence score UI, but language that matches certainty to what the system actually knows.

**Interaction:**
- Primary CTA → Screen 6 (booking)
- "See and edit what will be shared" → Screen 5 (the inspectable handoff)

---

### Screen 5 — Inspectable handoff (THE THIRD HERO MOMENT)

**Purpose:** Show what will be sent to the clinician, give the user real control. This is the slide ChatGPT was right to push us toward — this is principal-level judgment made tangible.

**Layout:**

Top header: "What we'll share with your GP"

Subhead: "Your GP will see this before your appointment so you don't have to explain it again."

Below, a "care brief" card styled to look like something a clinician would receive — slightly more formal than the rest of the UI. Sage header bar, white card, structured content:

> **Care brief**
> Prepared by [System] · Date
> 
> **Reason for appointment**
> Worsening headaches with intermittent vision changes
> 
> **Symptom summary**
> - Headaches: on and off, becoming more frequent
> - Duration: approximately 2 weeks
> - Vision: occasionally feels "off"
> - Associated symptoms: [based on clarifying question]
> 
> **What the customer is concerned about**
> Unsure whether this needs a GP, optician, or urgent attention
> 
> **What we recommended**
> Same- or next-day GP appointment
>
> **What we did not assess**
> No clinical examination or diagnosis. Recommendation based on stated symptoms only.

Below the card, control affordances:
- **"Edit any section"** (text link)
- **"Add something we missed"** (text link)
- **"Remove the brief and start fresh"** (text link, more muted)

A small reassurance line at the bottom:
"You're in control. Nothing is shared until you book the appointment."

A primary CTA: **"Continue to booking"**

**Animations:**
- Care brief card scales in slightly (0.96 → 1.0) with a settling spring
- Each section within the card staggers in subtly
- Control links fade in beneath
- CTA fades in last

**Why this screen matters:** This is the "inspectable handoff" principle made real. Most AI products handwave the data sharing question. Showing exactly what gets sent — in a format that looks like what a clinician would actually see — demonstrates that you've thought about the system end-to-end, not just the customer-facing chat.

**Interaction:**
- Edit links → could just be tappable for the demo (they don't need to do anything functional)
- CTA → Screen 6

---

### Screen 6 — Booking

**Purpose:** Get the user to a confirmed appointment quickly. This is connective tissue, so keep it clean and quick — not the place for craft pyrotechnics.

**Layout:**

Header: "GP appointments"
Subhead: "Same- or next-day, near you"

Three slot cards, stacked:

1. **Today, 4:20pm** · Dr. Sarah Chen · Parkside Medical Centre · 0.8 mi
2. **Today, 5:45pm** · Dr. James Okafor · Parkside Medical Centre · 0.8 mi
3. **Tomorrow, 9:15am** · Dr. Priya Sharma · Greenfield Surgery · 1.2 mi

Below the cards: "Show more times" (text link)

A small note: "Your care brief will be sent to your GP automatically when you book."

**Animations:**
- Cards stagger in (70ms apart) from below
- Each card on press: scale to 0.98 with a snappy spring, then release

**Interaction:**
- Tap a card → it scales briefly, then transitions to Screen 7

---

### Screen 7 — Confirmation

**Purpose:** A satisfying close. Resolution after uncertainty.

**Layout:**

Centred composition:

- A soft sage circle, large but not huge
- Inside it: a simple, hand-drawn-feeling check or tick (NOT a corporate green tick — something more muted, more considered)
- Below: "You're booked"
- Appointment details centred:
  > **Today, 4:20pm**
  > Dr. Sarah Chen
  > Parkside Medical Centre
- Below that, a key payoff line in sage:
  > "Dr. Chen will have your care brief before the appointment."
- Two secondary actions, side by side:
  - "Add to calendar" (outline button)
  - "How to prepare" (outline button)
- At the bottom, a small note:
  > "We'll check in with you afterwards to see how it went."

**Animations (this is the moment of resolution — invest some craft here):**

1. The sage circle scales in (0.4 → 1.0) with a settling spring
2. The check draws inside it (animate stroke-dashoffset on an SVG path) — slow enough to be felt, ~500ms
3. A subtle sage glow pulses outward once and fades (uses scale and opacity on a duplicated circle behind)
4. "You're booked" fades up (200ms after the check completes)
5. Appointment details stagger in (60ms apart)
6. The "Dr. Chen will have your care brief..." line fades in last — this is the payoff, give it space
7. Secondary actions fade in together
8. Bottom note fades in subtly

**Why this matters:** Most prototypes either skip the confirmation or do a cheesy "🎉 Success!" treatment. A calm, considered confirmation that emphasises *what's now true* (your GP knows about you) rather than *what just happened* (you submitted a form) reinforces the entire thesis of the deck.

---

## Code structure

```
src/
├── App.tsx                    // Main app, screen routing
├── components/
│   ├── PhoneFrame.tsx         // Wrapper for desktop demo
│   ├── Screen.tsx             // Base screen with transitions
│   ├── Card.tsx               // Reusable card
│   ├── Button.tsx             // Primary, secondary, pill variants
│   └── ProcessingState.tsx    // The "understanding" visual
├── screens/
│   ├── ConcernScreen.tsx
│   ├── StructuringScreen.tsx
│   ├── StructureScreen.tsx
│   ├── RecommendScreen.tsx
│   ├── HandoffScreen.tsx
│   ├── BookingScreen.tsx
│   └── ConfirmationScreen.tsx
├── data/
│   └── scenario.ts            // The headache scenario data
├── hooks/
│   └── useScenarioState.ts    // Simple state machine for screen flow
├── styles/
│   └── tokens.css             // Colour and spacing tokens
└── main.tsx
```

Use a simple state machine for screen flow — don't over-engineer with React Router. A `currentScreen` state in App.tsx with `setScreen('recommend')` is plenty for a 7-screen prototype.

---

## Build order

1. **Setup + design system + phone frame** (1-2 hours)
2. **Screen 1 (Concern) + auto-type interaction** (1 hour)
3. **Screen 3 (Structure) — the first hero moment** (3-4 hours — invest the time)
4. **Screen 4 (Recommend) — the second hero moment** (2-3 hours)
5. **Screen 5 (Handoff) — the third hero moment** (2-3 hours)
6. **Screens 6-7 (Booking + Confirmation)** (2-3 hours)
7. **Screen 2 (Structuring transition)** (1 hour) — easy to slot in
8. **Polish pass: spacing, typography, motion timing** (2-3 hours)
9. **Deploy to Vercel + test on actual phone** (30 mins)

Total: roughly 14-20 hours. If you've got a week, that's very achievable.

---

## What to test before the interview

1. **Run through it on the laptop you'll present on.** Battery saver and reduced motion settings can break animations.
2. **Run through it on your actual phone.** Some spring values feel different on real hardware.
3. **Practice the demo script with the prototype open.** Time yourself — aim for 3-4 minutes max on the demo.
4. **Have a backup screen recording.** If anything fails live, you switch to video. No drama.
5. **Test it offline.** If the venue WiFi is bad and you're loading from Vercel, you've got a problem. Make a local version available.

---

## What this prototype is NOT

- It is not a fully functional app
- It is not a chatbot
- It is not an AI demo (the AI is hardcoded)
- It is not a Figma click-through — it should feel like a real interactive product
- It is not branded — it's "From concern to care," not a startup

---

## What this prototype IS

A demonstration of how AI behaviour can be made visible, inspectable, and trustworthy through interaction design — across the full Care Handoff Model the deck sets up. Every screen earns its place either by carrying strategic weight or by being clean enough that it doesn't get in the way.