# Tier Keys Overview

This file gives a quick visual overview of the tiering logic used by `jobTitleTier`.

## Categories, Keywords, and Tier

| Category          | Detected Keywords                                                                                  | Tier                 |
| ----------------- | -------------------------------------------------------------------------------------------------- | -------------------- |
| `red-flag`        | education-body                                                                                     | `red-flag`           |
| `education-body`  | academician, student, etudiant, estudiante, phd, teacher, educator, docent, instructor, lecturer, professor, fellow, researcher, postdoc, alumni, intern, aspiring | called by `red-flag` |
| `c-suite`         | chief, ceo, cto, coo, cfo, cio, cmo, cdo, controller, partner, president                           | `tier1`              |
| `heads-vps`       | vp, head, director, senior manager, md                                                             | `tier1`              |
| `upper-faculty`   | rector, dean, doyen, decaan, chancellor, chair, principal, provost, warden, faculty                | `tier1`              |
| `leads-managers`  | lead, manager, jefe, principal, staff, mgr, associate, executive, supervisor                       | `tier2`              |
| `senior-ics`      | senior, snr, sr                                                                                    | `tier2`              |
| `lower-faculty`   | fellow, professor, lecturer                                                                        | `tier2`              |
| `juniors`         | graduate, junior, assistan, entry, intern                                                          | `tier3`              |
| `founders-owners` | owner, founder                                                                                     | `tier3`              |
| `other`           | no explicit keyword list (fallback)                                                                | `tier3`              |

## Source of Truth

- Keywords live in: `src/scripts/config/tierKeys.ts`
- Classification logic lives in: `src/scripts/session/tier/jobTitleTier.ts`
