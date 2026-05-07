# CLAUDE.md

This file defines the high-level assistant conventions for this repository.

## Source of Truth

- Use `ARCHITECTURE.md` as the detailed internal architecture reference.
- If a rule here conflicts with implementation details, align with `ARCHITECTURE.md`.

## Core Rules

1. Keep `src/index.ts` lightweight and orchestration-only.
2. Import through `--index-*` facades instead of deep module paths in `src/index.ts`.
3. Keep runtime/session logic under `src/scripts/session/`.
4. Keep UI behavior under `src/scripts/ui/`.
5. Keep configurable business data in `src/scripts/config/` (example: tier keyword lists).

## Architecture Include

For complete project conventions, read:
- `ARCHITECTURE.md`
