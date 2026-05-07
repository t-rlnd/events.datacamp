import './index.css';

import { indexForms } from './scripts/forms/--index-forms';
import { indexValidation } from './scripts/forms/validation/--index-validation';
import { indexSession, type JobTitleTierKeywordConfig } from './scripts/session/--index-session';
import { indexUI } from './scripts/ui/--index-ui';
import { indexSliders } from './scripts/ui/sliders/--index-sliders';

const formsIndex = indexForms();
const uiIndex = indexUI();
const slidersIndex = indexSliders();
const sessionIndex = indexSession();
const validationIndex = indexValidation();

declare global {
  interface Window {
    dcTierLogic?: {
      getKeywords: () => JobTitleTierKeywordConfig;
      updateKeywords: (overrides: Partial<JobTitleTierKeywordConfig>) => JobTitleTierKeywordConfig;
      refresh: () => void;
    };
    isStaging?: boolean;
    isProd?: boolean;
    onStaging?: (callback: () => void) => void;
    onProd?: (callback: () => void) => void;
  }
}

function initAccessControls() {
  sessionIndex.initAccessFromURL();
  uiIndex.initAccessRadios();
  uiIndex.initAccessButtons();
}

function initFormFeatures(pagePath: string) {
  formsIndex.addMarketoFormID();
  formsIndex.initFormSubmitListener(pagePath);
  sessionIndex.initFormDataStorage({
    storageKey: sessionIndex.USER_DATA_STORAGE_KEY,
    fieldsToSave: sessionIndex.SAVED_USER_FIELDS,
  });
  sessionIndex.initSessionDataStorage({
    storageKey: sessionIndex.SESSION_DATA_STORAGE_KEY,
  });
  sessionIndex.initFormsState({
    storageKey: sessionIndex.FORMS_STATE_STORAGE_KEY,
    persistOnReload: sessionIndex.PERSIST_FORM_STATE_ON_RELOAD,
  });
  validationIndex.initAllValidation();
}

function initPageUi() {
  uiIndex.addStagingPrefix(document.title);
  uiIndex.initModals();
  uiIndex.initDropdowns();
}

function initConditionalDisplays() {
  uiIndex.updateConditionalDisplay();
  uiIndex.updateTierConditionalDisplay();
}

function exposeTierApiOnWindow() {
  window.dcTierLogic = {
    getKeywords: sessionIndex.getJobTitleTierKeywordConfig,
    updateKeywords: (overrides) => sessionIndex.updateJobTitleTierKeywordConfig(overrides),
    refresh: () => uiIndex.updateTierConditionalDisplay(),
  };
}

function exposeEnvironmentApiOnWindow() {
  window.isStaging = sessionIndex.isStaging;
  window.isProd = sessionIndex.isProd;
  window.onStaging = sessionIndex.onStaging;
  window.onProd = sessionIndex.onProd;
}

/**
 * Small helper used by page triggers.
 * It returns true when the current pathname starts with one of the prefixes.
 *
 * Example:
 * - pathname "/thank-you/data-ai"
 * - prefixes ["/thank-you"]
 * => returns true
 */
function pathStartsWithOneOf(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

/**
 * A "page trigger" says:
 * - when to run (match function),
 * - and what to run (execute function).
 *
 * This keeps init() readable and makes page-specific behavior easy to add.
 */
interface PageTrigger {
  name: string;
  match: (pathname: string) => boolean;
  execute: (pathname: string) => void;
}

/**
 * Trigger list:
 * - First match wins.
 * - Keep most specific triggers first.
 * - Keep the "default" trigger last.
 *
 * For now, behavior stays the same as before:
 * every page runs access + forms + conditional displays.
 */
const PAGE_TRIGGERS: PageTrigger[] = [
  {
    name: 'thank-you-pages',
    match: (pathname) => pathStartsWithOneOf(pathname, ['/thank-you']),
    execute: (pathname) => {
      initAccessControls();
      initFormFeatures(pathname);
      initConditionalDisplays();
    },
  },
  {
    name: 'default',
    match: () => true,
    execute: (pathname) => {
      initAccessControls();
      initFormFeatures(pathname);
      initConditionalDisplays();
    },
  },
];

/**
 * Finds the first matching trigger and runs it.
 * If no trigger matches (should not happen because of "default"),
 * we still run safe defaults.
 */
function runPageTriggers(pathname: string) {
  const trigger = PAGE_TRIGGERS.find((entry) => entry.match(pathname));
  if (!trigger) {
    initAccessControls();
    initFormFeatures(pathname);
    initConditionalDisplays();
    return;
  }

  trigger.execute(pathname);
}

function init() {
  const pagePath = window.location.pathname;

  slidersIndex.initAllSliders();
  initPageUi();
  runPageTriggers(pagePath);
  exposeTierApiOnWindow();
  exposeEnvironmentApiOnWindow();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth !== lastWidth) {
    lastWidth = window.innerWidth;
    slidersIndex.initAllSliders();
  }
});
