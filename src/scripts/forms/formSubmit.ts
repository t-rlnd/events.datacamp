import { getAccessID } from '../state/accessState';
import { updateConditionalDisplay } from '../ui/conditionalDisplay';
import { saveFormFieldsOnSubmit } from '../users/formDataStorage';
import { updateFormsJSONAfterSubmit } from '../users/formsState';

// Initialize listener to handle all form submissions on the page
export function initFormSubmitListener(pagePath: string) {
  const forms = document.querySelectorAll<HTMLFormElement>('form'); // Select all form elements
  if (!forms.length) return; // Exit if no forms found

  forms.forEach((form) => {
    // Add a submit event listener to each form
    form.addEventListener('submit', () => {
      // Save form fields to localStorage (if SAVE_MODE is 'submit')
      saveFormFieldsOnSubmit(form);
      const accessID = getAccessID();
      const formKey = accessID === 'none' ? 'global' : accessID; // Default to 'global' if no URL param
      updateFormsJSONAfterSubmit(pagePath, formKey);
      updateConditionalDisplay(); // Refresh UI elements relying on submission state
    });
  });
}
