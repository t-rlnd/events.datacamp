# Architecture Conventions

This document defines the naming and folder conventions for this project.
Keep it short, predictable, and consistent.

## 1) Domain Folders

- Use `src/scripts/session/` for client-side session/context logic (access, storage, tiering, environment).
- Use `src/scripts/ui/` for UI behavior (conditional display, modals, dropdowns, access widgets, sliders).
- Use `src/scripts/config/` for shared constants/keys.
- Use `src/scripts/forms/` for form submission and Marketo integration.
- Use `src/scripts/validation/` for field and input validation logic.

## 2) Aggregator Files

- Use explicit aggregator files named `--index-*.ts`.
- Each aggregator exports one facade function:
  - `indexSession()`
  - `indexUi()`
  - `indexForms()`
  - `indexValidation()`
  - `indexSliders()`
- `src/index.ts` should import facades only (not deep module files).

## 3) File Naming

- Prefer feature-first folders, then file by concern:
  - `session/access/access.ts`
  - `session/state/formsState.ts`
  - `session/tier/jobTitleTier.ts`
  - `ui/conditional/scopeConditionalDisplay.ts`
- Avoid ambiguous domain names (`users`) when logic is session/context based.

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
