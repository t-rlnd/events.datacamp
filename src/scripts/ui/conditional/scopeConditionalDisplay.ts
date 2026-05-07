import { getAccessID } from '../../state/accessState';
import { isFormSubmitted } from '../../session/state/formsState';

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
  const accessID = getAccessID();

  const applyConditionalDisplay = (
    selector: string,
    ruleKey: string | null,
    actionKey: string,
    keysKey: string,
    forcedRule?: 'form-submitted' | 'access'
  ) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      const rule = forcedRule ?? (ruleKey ? (el.dataset[ruleKey] as string | undefined) : undefined);
      const action = el.dataset[actionKey];
      const keys = getKeys(el.dataset[keysKey]);

      if (!rule || !action || keys.length === 0) return;

      let conditionMet = false;

      if (rule === 'form-submitted') {
        conditionMet = isAnyFormSubmitted(pagePath, keys) || keys.includes(accessID);
      } else if (rule === 'access') {
        conditionMet = keys.includes(accessID);
      }

      const shouldShow = (conditionMet && action === 'show') || (!conditionMet && action === 'hide');
      el.style.display = shouldShow ? 'flex' : 'none';
    });
  };

  // Existing generic conditional API (kept as-is).
  applyConditionalDisplay(
    '[data-dc-conditional]',
    'dcConditionalRule',
    'dcConditionalAction',
    'dcConditionalKeys'
  );

  // New alias API for form scope only.
  applyConditionalDisplay(
    '[data-dc-form-scope-conditional]',
    null,
    'dcFormScopeAction',
    'dcFormScopeKeys',
    'form-submitted'
  );
}
