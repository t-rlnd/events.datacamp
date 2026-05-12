# Architecture Conventions

This document defines the naming and folder conventions for this project.
Keep it short, predictable, and consistent.

## 1) Domain Folders

- Use `src/scripts/session/` for client-side session/context logic (access, storage, tiering, environment).
- Use `src/scripts/ui/` for UI behavior (conditional display, modals, dropdowns, access widgets, sliders).
- Use `src/scripts/config/` for shared constants/keys.
- Use `src/scripts/forms/` for form submission and Marketo integration.
- Use `src/scripts/validation/` for field and input validation logic.
- Use `src/scripts/animations/` for GSAP-based reveal animations (scroll-triggered transitions).

## 2) Aggregator Files

- Use explicit aggregator files named `--index-*.ts`.
- Each aggregator exports one facade function:
  - `indexSession()`
  - `indexUi()`
  - `indexForms()`
  - `indexValidation()`
  - `indexSliders()`
  - `indexAnimations()`
- `src/index.ts` should import facades only (not deep module files).

## 3) File Naming

- Prefer feature-first folders, then file by concern:
  - `session/access/access.ts`
  - `session/state/formsState.ts`
  - `session/tier/jobTitleTier.ts`
  - `ui/conditional/scopeConditionalDisplay.ts`
- Avoid ambiguous domain names (`users`) when logic is session/context based.

### Animations sub-layout

The `animations/` domain follows a strict internal layout:

- `animations/config/animationKeys.ts` — shared defaults (duration, ease, stagger, scroll start, `data-dc-animate` attribute name, breakpoint prefixes).
- `animations/core/` — one-time setup: `gsapSetup.ts` (plugin registration, defaults) and `reducedMotion.ts` (`prefers-reduced-motion` helper).
- `animations/reveals/` — **one file per reveal type**, each exporting a function with the same `(target, opts?: RevealOptions)` signature. Reveals are pure and DOM-agnostic.
- `animations/auto/autoReveal.ts` — scans `[data-dc-animate]` and applies the matching reveal. Breakpoint prefixes (e.g. `d-`) are routed through `gsap.matchMedia()`.
- `animations/pages/` — **one file per page** for bespoke reveals that can't be expressed declaratively (composed timelines, custom triggers). Each exports `initXxxAnimations()`.

Declarative markup convention (Webflow side):

- `data-dc-animate="slide-up"` — all breakpoints.
- `data-dc-animate="children-slide-up"` — stagger direct children, all breakpoints.
- `data-dc-animate="d-..."` — desktop only (≥ 992px). Same convention scales to future `t-`/`m-` prefixes.

Anti-FOUC CSS for `[data-dc-animate]` lives in `src/style/animations/animations.css` and is `@import`-ed from `src/index.css`.

## 4) Constants and Keys

- Store shared keys in `src/scripts/config/keys.ts`.
- Use descriptive names:
  - `FORM_DATA_STORAGE_KEY`
  - `FORMS_STATE_STORAGE_KEY`
  - `PERSIST_FORM_STATE_ON_RELOAD`
- Do not duplicate constants in `src/index.ts`.

## 5) Imports

- Prefer shallow imports from local facades in `src/index.ts`.
- Keep relative imports inside domains concise and consistent.
- Update imports immediately after moves/renames to avoid stale paths.

## 6) Practical Rule

Before adding a new file:
1. Pick the right domain folder.
2. Add it under a meaningful subfolder.
3. Expose it via the relevant `--index-*` facade if needed by `src/index.ts`.
