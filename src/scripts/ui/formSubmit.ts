import { getAccessID } from '../state/accessState';
import { saveFormFieldsOnSubmit } from '../users/formDataStorage';
import { updateFormsJSONAfterSubmit } from '../users/formsState';
import { updateConditionalDisplay } from './conditionalDisplay';

// Initialize listener to handle all form submissions on the page
export function initFormSubmitListener(pagePath: string) {
  const forms = document.querySelectorAll<HTMLFormElement>('form'); // Select all form elements
  if (!forms.length) return; // Exit if no forms found

  forms.forEach((form) => {
    // Add a submit event listener to each form
    form.addEventListener('submit', () => {
      // Save form fields to localStorage (if SAVE_MODE is 'submit')
      saveFormFieldsOnSubmit(form);
      const accessID = getAccessID(); // Get current accessID
      updateFormsJSONAfterSubmit(pagePath, accessID); // Update submission state for this form and accessID
      updateConditionalDisplay(); // Refresh UI elements relying on submission state
    });
  });
}
