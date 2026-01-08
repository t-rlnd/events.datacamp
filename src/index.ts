import './index.css';

/** Forms */
import { initFormSubmitListener } from './scripts/forms/formSubmit';
import { addMarketoFormID } from './scripts/forms/marketo';
import { initAccessButtons } from './scripts/ui/accessButtons';
import { initAccessRadios } from './scripts/ui/accessRadios';
import { updateConditionalDisplay } from './scripts/ui/conditionalDisplay';
import { initModals } from './scripts/ui/modals/modals';
import { addStagingPrefix } from './scripts/ui/pageName';
import { inCardExpertsSlider } from './scripts/ui/sliders/cardExpertsSlider';
import { sqlR2RSlider01 } from './scripts/ui/sliders/globalSqlr2rSlider01';
import { toolkitSlider01 } from './scripts/ui/sliders/globalToolkitSlider01';
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
  sqlR2RSlider01();
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

  // Forms management
  addMarketoFormID();
  initFormSubmitListener(PAGE_PATH);
});
