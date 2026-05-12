import './index.css';

import { indexAnimations } from './scripts/animations/--index-animations';
import { indexForms } from './scripts/forms/--index-forms';
import { indexValidation } from './scripts/forms/validation/--index-validation';
import { indexSession, type JobTitleTierKeywordConfig } from './scripts/session/--index-session';
import { indexUI } from './scripts/ui/--index-ui';
import { indexSliders } from './scripts/ui/sliders/--index-sliders';

// Build one facade per domain so this file stays orchestration-only.
const formsIndex = indexForms();
const uiIndex = indexUI();
const slidersIndex = indexSliders();
const sessionIndex = indexSession();
const validationIndex = indexValidation();
const animationsIndex = indexAnimations();

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
  // Read URL access params, then sync related UI controls.
  sessionIndex.initAccessFromURL();
  uiIndex.initAccessRadios();
  uiIndex.initAccessButtons();
}

function initFormFeatures(pagePath: string) {
  // Attach form metadata and submit handlers for this page.
  formsIndex.addMarketoFormID();
  formsIndex.initFormSubmitListener(pagePath);
  // Persist user fields and session data used across forms.
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
  // Page-level UI setup that is not tied to a specific route.
  uiIndex.addStagingPrefix(document.title);
  uiIndex.initModals();
  uiIndex.initDropdowns();
}

/**
 * Base initialization
 * -------------------
 * This is the shared startup sequence that runs on every page.
 */
function runBaseInitialization(pathname: string) {
  initAccessControls();
  initFormFeatures(pathname);
  uiIndex.updateConditionalDisplay();
  uiIndex.updateTierConditionalDisplay();
  animationsIndex.initAutoReveal();
}

function exposeTierApiOnWindow() {
  // Expose debug helpers in the browser console: window.dcTierLogic.*
  window.dcTierLogic = {
    getKeywords: sessionIndex.getJobTitleTierKeywordConfig,
    updateKeywords: (overrides) => sessionIndex.updateJobTitleTierKeywordConfig(overrides),
    refresh: () => uiIndex.updateTierConditionalDisplay(),
  };
}

function exposeEnvironmentApiOnWindow() {
  // Expose environment helpers for quick checks from console/scripts.
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
  execute?: (pathname: string) => void;
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
    execute: () => {
      animationsIndex.initThankYouAnimations();
    },
  },
  {
    name: 'default',
    match: () => true,
  },
];

/**
 * Page-specific triggers
 * ----------------------
 * Finds the first matching trigger and runs it.
 */
function runPageSpecificTriggers(pathname: string) {
  // Run extra behavior only for matching pages.
  const trigger = PAGE_TRIGGERS.find((entry) => entry.match(pathname));
  trigger?.execute?.(pathname);
}

function init() {
  // Read once so downstream functions do not touch window.location directly.
  const pagePath = window.location.pathname;

  // Global startup order: sliders -> shared UI -> route triggers -> global APIs.
  slidersIndex.initAllSliders();
  initPageUi();
  runBaseInitialization(pagePath);
  runPageSpecificTriggers(pagePath);
  exposeTierApiOnWindow();
  exposeEnvironmentApiOnWindow();
}

/**
 * Loading triggers
 * ----------------
 * These functions define when initialization should be executed.
 */
function wireDomReadyTrigger() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function wireResizeTrigger() {
  let lastWidth = window.innerWidth;
  // Rebuild sliders only when width changed (not on height-only resize).
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      slidersIndex.initAllSliders();
    }
  });
}

wireDomReadyTrigger();
wireResizeTrigger();
