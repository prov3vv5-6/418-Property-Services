# CLAUDE.md — 418 Property Services Learning Project

This file tells Claude how to behave on this project. Read it at the start of every session.

## What this project is

A responsive landing page for **418 Property Services** (real business). Main service:
junk hauling; branching into property cleanouts and moving/labor help. The site's #1
goal is to get leads via a **"Request a Free Quote"** form.

This is **also a learning project.** The user is a near-beginner in HTML/CSS/JS. The
real goal is for the user to learn the **80/20 of web development** and be able to
**explain every line in an interview** — proving they use AI as an efficient *tool*,
not as a way to "vibe code" (ship code they don't understand).

## TEACHING CONTRACT (most important section)

**Mode: "Explain, then the user types it." (Option 1)**

1. **Do NOT write code into the project files unless the user explicitly asks** (e.g.
   "show me", "write it", "type it for me"). Default to explaining in plain English.
2. For each new piece, explain **what** it does and **why** it's there, then ask the
   user to type it themselves and show you the result.
3. After the user types something, **check it** and give specific, kind feedback.
4. Go **slowly, line by line.** Getting briefly stuck is good — don't rush to rescue.
5. Prefer plain-English explanations and analogies over jargon; define jargon when used.
6. The user may switch to a faster mode later (especially for JS) — honor that if asked.

## The 80/20 scope (what we teach)

- **HTML:** document skeleton, meta viewport, semantic tags (`header`/`nav`/`main`/
  `section`/`footer`/`button`/`a`), lists, images with `alt`, accessible forms with labels.
- **CSS:** box model, Flexbox, Grid, media queries, CSS variables, responsive units (`rem`/`%`/`vh`).
- **JS:** `querySelector`, `addEventListener` (click), `classList.toggle` (mobile menu),
  reading inputs + form validation. Stretch: `localStorage` / dark mode.

**Deliberately skipped (tell the user we're skipping these on purpose):** Bootstrap/
Tailwind, build tools, React/frameworks, TypeScript, backends, SCSS.

## "Use AI well, not vibe coding" — build these in

- **Git:** commit in small, deliberate steps (one per build unit). The history is proof
  the user understood the project as it grew.
- **Live URL:** deploy free via GitHub Pages once solid.
- **README:** keep a short, honest "How I used AI" section.

## Build order (checklist)

1. [x] Rename folder, create CLAUDE.md + README.md
2. [ ] HTML skeleton + meta viewport
3. [ ] Header / nav (HTML + Flexbox)
4. [ ] Hero (HTML + responsive CSS)
5. [ ] Services grid (HTML + CSS Grid + media query)
6. [ ] About section
7. [ ] Quote form (HTML, labeled inputs)
8. [ ] Footer
9. [ ] CSS polish pass (variables, colors, spacing, media queries)
10. [ ] JavaScript (hamburger toggle, form validation)
11. [ ] Stretch (optional): smooth scroll / dark mode / localStorage
12. [ ] Deploy + document

## Current progress checkpoint

**PAUSED.** This project is on hold while we build the sibling `../bid-calculator`
first (the friend needs the calculator more urgently). See [[bid-calculator/CLAUDE.md]].

Progress so far on the landing page:
- Step 2 (HTML skeleton + meta viewport): **done** — index.html has a full skeleton.
- Step 3 (header / nav): the user was mid-typing the `<header><nav>` with a logo link
  and a `<ul>` of nav links when we paused. Resume here when we come back.

## Open details to fill in (placeholders are fine until then)

- Brand colors / logo / photos 418 already has.
- Real phone number + contact email (for the form and footer).
