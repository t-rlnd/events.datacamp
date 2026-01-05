import './index.css';

import { initAccessButtons } from './scripts/ui/accessButtons';
import { initAccessRadios } from './scripts/ui/accessRadios';
import { updateConditionalDisplay } from './scripts/ui/conditionalDisplay';
import { initFormSubmitListener } from './scripts/ui/formSubmit';
import { initModals } from './scripts/ui/modals/modals';
import { addStagingPrefix } from './scripts/ui/pageName';
/** Sliders */
import { toolkitSlider01 } from './scripts/ui/sliders/global-ToolkitSlider01';
import { inCardExpertsSlider } from './scripts/ui/sliders/inCard-ExpertsSlider';
/** End Sliders */
import { initAccessFromURL } from './scripts/users/access';
import { initFormDataStorage } from './scripts/users/formDataStorage';
import { initFormsState } from './scripts/users/formsState';
import { initEmailValidation } from './scripts/validation/emailField/emailValidation';
import { initPhoneFields } from './scripts/validation/phoneField/phoneField';
import { initPhoneValidation } from './scripts/validation/phoneField/phoneValidation';

const PAGE_PATH = window.location.pathname;

document.addEventListener('DOMContentLoaded', () => {
  // Add "STAGING" prefix to page name if on staging
  addStagingPrefix(document.title);
  // Initialize modals

  // Initialize Sliders

  toolkitSlider01();
  inCardExpertsSlider();

  initModals();

  // Access control (URL, radio, button)
  initAccessFromURL();
  initAccessRadios();
  initAccessButtons();

  // Update UI based on conditions (conditional display)
  updateConditionalDisplay();

  // Initialize form fields and validation
  initPhoneFields(); // Phone field input UI
  initPhoneValidation(); // Phone input validation
  initEmailValidation(); // Email input validation

  // Save form data to localStorage on form submission
  // Les données sont stockées dans un JSON unique : { user: { firstName: xxx, lastName: xxx, ... } }
  initFormDataStorage({
    storageKey: 'dc_user_data',
    fieldsToSave: ['firstName', 'lastName', 'jobTitle', 'company', 'companyEmail'],
  });

  // Initialize forms state (tracking of form submissions)
  initFormsState({
    storageKey: 'dc_forms_data',
  });

  // Listen to form submissions
  initFormSubmitListener(PAGE_PATH);
});
