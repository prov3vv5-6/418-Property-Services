# CLAUDE.md — 418 Property Services Bid Calculator

This file tells Claude how to behave on this project. Read it at the start of every session.

## What this project is

A **bid / price calculator** web app for **418 Property Services** (junk hauling,
property cleanouts, moving/labor help). The owner's friend needs it to quickly and
consistently price jobs — likely **on his phone, in the field** — so the app must be
**responsive and fast to use on a small screen.**

The user enters a few job details (e.g. job type, size/volume, labor, dump fees,
travel) and the app instantly shows a **suggested bid price**.

This is **also a learning project.** The user is a near-beginner in HTML/CSS/JS. The
real goal is for the user to learn the **80/20 of web development** and be able to
**explain every line in an interview** — proving they use AI as an efficient *tool*,
not to "vibe code" (ship code they don't understand).

## TEACHING CONTRACT (most important section)

**Mode: "Explain, then the user types it." (Option 1)**

1. **Do NOT write code into the project files unless the user explicitly asks** (e.g.
   "show me", "write it"). Default to explaining in plain English.
2. For each new piece, explain **what** it does and **why**, then ask the user to type
   it themselves and show you the result.
3. After the user types something, **check it** and give specific, kind feedback.
4. Go **slowly, line by line.** Getting briefly stuck is good — don't rush to rescue.
5. Prefer plain-English explanations and analogies; define jargon when used.
6. The user may switch to a faster mode later (especially for JS) — honor that if asked.

## The 80/20 scope (what we teach)

- **HTML:** skeleton, meta viewport, semantic tags, and **accessible form inputs with
  labels** (number inputs, selects) — the calculator is mostly a form.
- **CSS:** box model, Flexbox, Grid, media queries, CSS variables, responsive units.
  Mobile-first, since it's used on a phone.
- **JS (the heart of this app):** `querySelector`, `addEventListener` (input/click),
  reading input values, `parseFloat`/`Number`, doing the **price math**, and writing
  the result back to the page (`textContent`). Stretch: `localStorage` to remember the
  owner's default rates.

**Deliberately skipped:** Bootstrap/Tailwind, build tools, React/frameworks,
TypeScript, backends, SCSS.

## "Use AI well, not vibe coding" — build these in

- **Git:** small, deliberate commits (one per build unit) = proof of understanding.
- **Live URL:** deploy free via GitHub Pages once solid (so the friend can use it).
- **README:** keep a short, honest "How I used AI" section.

## Pricing model — DECIDED (placeholder $ values; get real numbers from friend later)

Decision (user chose to build now with placeholders, refine later):

**Price by VOLUME (cubic yards), not by "a truckload."** A "load" varies by equipment
(pickup vs box truck vs trailer, multiple units), so the base price tracks the
*customer's junk volume*, which is equipment-independent. Equipment only affects
trips/effort, which lives in the labor/travel add-ons.

Formula:
```
volume (yd^3) = equipment capacity (yd^3) x how full (0.25 / 0.5 / 0.75 / 1.0)
base price    = volume x price-per-yd^3
             + dump fee    (heavy debris: weight in tons x dump rate)
             + extra labor (workers x hours x hourly rate)
             + travel      (miles beyond free radius x per-mile rate)
-> enforce a minimum charge
-> (optional) x profit-margin multiplier
```

Equipment capacities + all rates are **editable settings** (placeholders now; later
saved with localStorage so multiple trucks/trailers and rate changes need no code edit).

**Placeholder values (REPLACE with friend's real numbers):** price-per-yd^3 = $40;
dump rate = $60/ton; hourly labor = $35/worker/hr; free travel radius = 15 mi, then
$2/mi; minimum charge = $95; profit margin = optional, default 1.0 (off).
Equipment capacities (placeholder): pickup 2.5 yd^3, small trailer 5 yd^3,
large trailer 10 yd^3, box truck 15 yd^3.

## Build order (checklist)

1. [x] HTML skeleton + meta viewport (re-type from memory for practice) — done
2. [x] Page heading (h1) — done
3. [x] Input form: equipment + fullness selects, dumpWeight/laborWorkers/laborHours/
       travelMiles number inputs, calcBtn button, all with matched label for/id — done
4. [x] Result display area (`<span id="result">$0</span>`) — done
5. [x] CSS: mobile-first layout, variables, spacing, make it thumb-friendly — done
6. [x] JS: read inputs, compute price, show result; handle empty/invalid input — done
7. [ ] Stretch (optional): localStorage for default rates; itemized breakdown;
       **multi-load support:** interim "number of loads" multiplier field — **done**
       (Approach A: multiplies base volume; travel/dump stay manual by decision).
       - [ ] **Mixed loads via load rows — Style 1 (fixed rows)** ← NEXT (building now).
         Lets each load have its OWN equipment + fullness + count, so a real "truck full +
         trailer half" job prices honestly (single fullness currently forces both to match).
         Approach: put a few (~3) fixed `.load` rows in the HTML, each = equipment select +
         fullness select + count input. JS grabs them all with `querySelectorAll(".load")`,
         loops, and sums each row's `capacity × fullness × count` into one `totalVolume`;
         `basePrice = totalVolume × PRICE_PER_YARD`. Empty/unused rows contribute 0.
         New concepts to teach: `querySelectorAll` (returns a *list*), and a loop that
         accumulates a running total. Downstream (dump/labor/travel/min) unchanged.
         **Supersedes** the combined "Truck + Trailer" option and the "number of loads"
         multiplier — tidy those up once rows work. Style 2 (dynamic "+ Add another load"
         button via `cloneNode`/`appendChild`) is the follow-up upgrade = old "Approach C."
       - [ ] **Send bid to a lead (SMS hand-off)** — "Text this bid" button that opens
         the friend's Messages app with the bid pre-filled, via an `sms:` link. DECIDED:
         SMS link, **message-only** (no recipient/phone field — friend picks who to text).
         No backend: a static site can't send SMS itself (that needs Twilio/paid + a
         backend, out of scope); we hand the pre-written message off to the phone's own
         Messages app. Alternatives considered & deferred: `navigator.share` share-sheet
         (needs desktop fallback) and `mailto:` email. Build: add `<button id="textBtn"
         type="button">`, build the body string from the calculated bid, `encodeURIComponent`
         it, then `window.location.href = "sms:?&body=" + encoded` (note: `sms:` body
         syntax varies iOS vs Android — verify on a real phone). New concept to teach:
         `encodeURIComponent`.
8. [ ] Deploy (GitHub Pages) + document

## Current progress checkpoint

- **HTML: done** — heading + full form (equipment/fullness selects, 4 number inputs, all
  with matched labels), Calculate button, `<span id="result">` display.
- **CSS: done** — mobile-first stylesheet: `*` border-box reset, body defaults, centered
  `main` (max-width 500px), stacked/spaced `.field`s, full-width thumb-friendly inputs,
  green `#calcBtn` CTA, prominent `#result`.
- **JS: done** — `calculateBid()` (extracted function, wired via
  `addEventListener("click", calculateBid)`): reads 6 inputs with `parseFloat`, number
  inputs guarded with `|| 0`; computes volume → base → dump/labor/travel (travel clamped
  with `Math.max(0, …)`); enforces `MIN_CHARGE` via `Math.max`; formats with
  `.toFixed(2)`; writes to page with `textContent`. Rate constants are placeholders — get
  real numbers from the friend.
- Pricing model: **decided** (volume/cubic-yards hybrid with placeholders — see above).
- Deployed: live via GitHub Pages at `/418-Property-Services/bid-calculator/`.
- **Next step (step 7, optional stretch):** pick one — recompute live on input `change`
  (reuse `calculateBid`), itemized breakdown, `localStorage` for editable rates, or
  multi-load support. Otherwise the v1 calculator is complete.

## Teaching note (how this was built)

Built in the "explain, then the user types it" mode (see TEACHING CONTRACT). The user
typed every line; Claude explained each concept first and checked the result. Concepts
covered and understood: box model + `box-sizing:border-box` on `*` (non-inherited vs
inherited properties like `font-size`), mobile-first layout, `margin:0 auto` centering,
id vs class vs descendant/grouped selectors, `getElementById`, `addEventListener` with a
function reference (no parens), `.value` always returns a string, `parseFloat`,
`Math.max` clamping, `.toFixed(2)` (rounds + returns string), `textContent` vs
`innerHTML`, template literals, and the `|| 0` NaN fallback.

## Related

The **landing page** project lives in the sibling `../landing-page` folder. It was
started first (HTML skeleton done) and is **paused** until the bid calculator ships.
See [[landing-page/CLAUDE.md]].
