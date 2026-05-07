import { setAccessID } from '../../state/accessState';

const STORAGE_KEY = 'dc_state'; // LocalStorage main key
const QUERY_KEY = 'access'; // Query param for access level

// User state shape: { pages: { [pagePath]: { forms: { [formKey]: { submitted: boolean } } } } }
interface State {
  pages: Record<
    string,
    {
      forms: Record<string, { submitted: boolean }>;
    }
  >;
}

// Get user state from localStorage, or init empty if absent
export function getState(): State {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"pages":{}}');
}

// Save user state to localStorage
export function saveState(state: State) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Return the current page path
export function getPage() {
  return window.location.pathname;
}

// Mark a form as submitted for the current page.
// If formKey is 'global', marks all forms as submitted for the page.
export function saveForm(formKey: string) {
  const state = getState();
  const page = getPage();

  // Initialize page entry if missing
  if (!state.pages[page]) {
    state.pages[page] = { forms: {} };
  }

  const { forms } = state.pages[page];

  // If 'global', override with global submission
  if (formKey === 'global') {
    state.pages[page].forms = {
      global: { submitted: true },
    };
    saveState(state);
    return;
  }

  // If already globally submitted, do nothing
  if (forms.global) return;

  // Mark this form as submitted
  forms[formKey] = { submitted: true };
  saveState(state);
}

// Check if a form is submitted.
// If 'global' is submitted, only global access is allowed.
export function isSubmitted(formKey: string) {
  const state = getState();
  const page = getPage();
  const forms = state.pages[page]?.forms;

  if (!forms) return false;

  // If global was submitted, only 'global' key passes
  if (forms.global) {
    return formKey === 'global';
  }

  return Boolean(forms[formKey]);
}

// On load: Set accessID from URL, default to 'none' if no param
export function initAccessFromURL() {
  const params = new URLSearchParams(window.location.search);
  const access = params.get(QUERY_KEY) || 'none';
  console.log('accessID from URL :', access);
  setAccessID(access);
}

// Update the URL query param to match the current accessID
export function updateURLFromAccess(accessID: string) {
  const url = new URL(window.location.href);

  if (accessID === 'none') {
    url.searchParams.delete(QUERY_KEY);
  } else {
    url.searchParams.set(QUERY_KEY, accessID);
  }

  window.history.replaceState({}, '', url.toString());
}
