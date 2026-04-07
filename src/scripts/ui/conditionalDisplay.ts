import { getAccessID } from '../state/accessState';
import { isFormSubmitted } from '../users/formsState';

/**
 * DC CONDITIONAL DISPLAY
 * ---------------------
 * Affiche ou cache des éléments selon des règles data-driven.
 * data-dc-* = JavaScript | classes = CSS
 *
 * STRUCTURE
 * - data-dc-conditional                  → racine du comportement
 * - data-dc-conditional-rule             → type de règle (ex: form-submitted, access)
 * - data-dc-conditional-action="show|hide"
 * - data-dc-conditional-keys="a, b, c"   → clés métier (dataset)
 *
 * LOGIQUE
 * - action="show" → visible si condition vraie
 * - action="hide" → caché si condition vraie
 * - comportement inverse si condition fausse
 *
 * RÈGLES DISPONIBLES
 * - form-submitted → vérifie si un des formulaires listés a été soumis
 * - access         → vérifie si l'accessID courant (?access=) correspond à une des clés
 *
 * Exemples
 * <div
 *   data-dc-conditional
 *   data-dc-conditional-rule="form-submitted"
 *   data-dc-conditional-action="hide"
 *   data-dc-conditional-keys="global, learners"
 * ></div>
 *
 * <div
 *   data-dc-conditional
 *   data-dc-conditional-rule="access"
 *   data-dc-conditional-action="show"
 *   data-dc-conditional-keys="global, unlocked"
 * ></div>
 */

function getKeys(value?: string): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function isAnyFormSubmitted(pagePath: string, keys: string[]): boolean {
  return keys.some((key) => isFormSubmitted(pagePath, key));
}

export function updateConditionalDisplay() {
  const pagePath = window.location.pathname;

  document.querySelectorAll<HTMLElement>('[data-dc-conditional]').forEach((el) => {
    const rule = el.dataset.dcConditionalRule;
    const action = el.dataset.dcConditionalAction;
    const keys = getKeys(el.dataset.dcConditionalKeys);

    if (!rule || !action || keys.length === 0) return;

    let conditionMet = false;

    if (rule === 'form-submitted') {
      conditionMet = isAnyFormSubmitted(pagePath, keys) || keys.includes(getAccessID());
    } else if (rule === 'access') {
      conditionMet = keys.includes(getAccessID());
    }

    const shouldShow = (conditionMet && action === 'show') || (!conditionMet && action === 'hide');

    el.style.display = shouldShow ? 'flex' : 'none';
  });
}
