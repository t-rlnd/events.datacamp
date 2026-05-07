/**
 * Clé utilisée pour stocker les données dans localStorage
 * Peut être modifiée via initFormsState()
 */
let storageKey = 'dc_forms_state';
let persistOnReload = true;

/**
 * Structure example:
 * {
 *   pages: {
 *     "/page1": {
 *       forms: {
 *         global: { submitted: true }
 *       }
 *     }
 *   }
 * }
 */

// Holds all form submission state, loaded from localStorage on startup
export const formsState: {
  pages: {
    [pagePath: string]: {
      scope?: string;
      forms: {
        [formKey: string]: {
          submitted: boolean;
        };
      };
    };
  };
} = loadFormsState();

/**
 * Initialise le module avec une configuration personnalisée
 * Doit être appelée avant toute utilisation du module
 * @param options - Options de configuration
 * @param options.storageKey - Clé utilisée pour stocker les données dans localStorage
 *
 * @example
 * initFormsState({ storageKey: 'custom_storage_key' });
 */
export function initFormsState(options?: { storageKey?: string; persistOnReload?: boolean }) {
  if (typeof options?.persistOnReload === 'boolean') {
    persistOnReload = options.persistOnReload;
  }

  if (options?.storageKey && options.storageKey !== storageKey) {
    storageKey = options.storageKey;
  }

  const newState = loadFormsState();
  Object.keys(formsState.pages).forEach((key) => delete formsState.pages[key]);
  Object.assign(formsState.pages, newState.pages);
}

/* -------------------------------------
 * Load/Save functions
 * ----------------------------------- */

/**
 * Charge les données depuis localStorage
 * @returns Les données chargées ou un objet vide si aucune donnée n'existe
 */
function loadFormsState() {
  if (!persistOnReload) {
    return { pages: {} };
  }

  try {
    const jsonString = localStorage.getItem(storageKey);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
  } catch (err) {
    console.error('Error loading forms state:', err);
    // Si le JSON est invalide ou qu'une erreur se produit, avertir et réinitialiser
    console.error('[formsState] Invalid localStorage data');
  }
  // Retourner une structure vide si aucune donnée n'existe ou en cas d'erreur
  return { pages: {} };
}

/**
 * Sauvegarde l'état actuel dans localStorage
 */
function saveFormsState() {
  if (!persistOnReload) return;
  localStorage.setItem(storageKey, JSON.stringify(formsState));
}

/* -------------------------------------
 * State update (global form submission overwrites all)
 * ----------------------------------- */

/**
 * Mark a form as submitted for the given page.
 * If formKey is 'global', marks all as submitted for the page and overwrites previous status.
 */
export function updateFormsJSONAfterSubmit(pagePath: string, formKey: string) {
  // Ensure there is an entry for this page
  if (!formsState.pages[pagePath]) {
    formsState.pages[pagePath] = { forms: {} };
  }
  const { forms } = formsState.pages[pagePath];
  formsState.pages[pagePath].scope = formKey;

  // If global is submitted, overwrite and mark ONLY global as submitted for this page
  if (formKey === 'global') {
    formsState.pages[pagePath].forms = {
      global: { submitted: true },
    };
    saveFormsState();
    return;
  }

  // If global is already submitted for this page, no further form submissions count
  if (forms.global?.submitted) {
    return;
  }

  // Regular case: mark this specific form as submitted
  forms[formKey] = { submitted: true };
  saveFormsState();
}

/* -------------------------------------
 * State read (visibility)
 * ----------------------------------- */

/**
 * Returns true if the given form is submitted for the page,
 * or if global submission is present for that page.
 */
export function isFormSubmitted(pagePath: string, formKey: string): boolean {
  const page = formsState.pages[pagePath];
  if (!page) return false;
  // If global form is submitted, treat all as submitted
  if (page.forms.global?.submitted) {
    return true;
  }
  // Otherwise check if specific form submitted
  return !!page.forms[formKey]?.submitted;
}
