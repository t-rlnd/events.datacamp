import './index.css';

/** Forms */
import { initFormSubmitListener } from './scripts/forms/formSubmit';
import { addMarketoFormID } from './scripts/forms/marketo';
import { initAccessButtons } from './scripts/ui/accessButtons';
import { initAccessRadios } from './scripts/ui/accessRadios';
import { updateConditionalDisplay } from './scripts/ui/conditionalDisplay';
import { initDropdowns } from './scripts/ui/dropdowns/dropdowns';
import { initModals } from './scripts/ui/modals/modals';
import { addStagingPrefix } from './scripts/ui/pageName';
import { globalExperts01Slider } from './scripts/ui/sliders/globalExperts01Slider';
import { globalResources01Slider } from './scripts/ui/sliders/globalResources01Slider';
import { sqlR2RSlider01 } from './scripts/ui/sliders/globalSqlr2rSlider01';
import { toolkitSlider01 } from './scripts/ui/sliders/globalToolkitSlider01';
import { inCardExpertsSlider } from './scripts/ui/sliders/incardExpertsSlider';
import { initAccessFromURL } from './scripts/users/access';
import { initFormDataStorage } from './scripts/users/formDataStorage';
import { initFormsState } from './scripts/users/formsState';
import { initEmailValidation } from './scripts/validation/emailField/emailValidation';
import { initPhoneFields } from './scripts/validation/phoneField/phoneField';
import { initPhoneValidation } from './scripts/validation/phoneField/phoneValidation';

function initSliders() {
  sqlR2RSlider01();
  toolkitSlider01();
  inCardExpertsSlider();
  globalResources01Slider(); // Resources 01 slider
  globalExperts01Slider();
}

function initAccess() {
  initAccessFromURL();
  initAccessRadios();
  initAccessButtons();
}

function initForms(pagePath: string) {
  addMarketoFormID();
  initFormSubmitListener(pagePath);
  initFormDataStorage({
    storageKey: 'dc_user_data',
    fieldsToSave: ['firstName', 'lastName', 'jobTitle', 'company', 'companyEmail'],
  });
  initFormsState({
    storageKey: 'dc_forms_data',
  });
  initPhoneFields();
  initPhoneValidation();
  initEmailValidation();
}

function init() {
  const pagePath = window.location.pathname;

  // Initialize Sliders
  initSliders();

  // Add "STAGING" prefix to page name if on staging
  addStagingPrefix(document.title);

  initModals();
  initDropdowns();

  // Access control (URL, radio, button)
  initAccess();
  updateConditionalDisplay();
  initForms(pagePath);
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
    initSliders();
  }
});
