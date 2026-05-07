/**
 * EMAIL VALIDATION — Progressive UX & Webflow-safe
 *
 * Initializes email validation for all forms on the page.
 * Disables the submit button if the email is invalid,
 * and displays a localized error message if needed.
 */

import { USE_ERROR_AUTO_TRANSLATION } from '../behavior';
import { getLocalizedEmailErrorMessage } from './emailTranslations';

/**
 * Check if the email has a valid format.
 * @param email The email address to validate.
 * @returns true if valid, false otherwise.
 */
function validateEmailFormat(email: string): boolean {
  // Simple and effective email regex
  return /\S+@\S+\.\S+/.test(email);
}

/**
 * Set up email validation for all forms on the page.
 * Disables submit button and shows error if needed.
 */
export function initEmailValidation(): void {
  const forms = document.querySelectorAll('form');

  forms.forEach((form) => {
    // Find email input and submit button within the form
    const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]');
    const submitButton = form.querySelector<HTMLElement>(
      'button[type="submit"], input[type="submit"]'
    );

    if (!emailInput || !submitButton) return;

    // Create or get the error element after the email field
    let emailErrorEl = form.querySelector<HTMLElement>('[data-error-email]');
    if (!emailErrorEl) {
      emailErrorEl = document.createElement('div');
      emailErrorEl.setAttribute('data-error-email', '');

      // Error message - auto translate if enabled
      let errorMessage: string;
      if (USE_ERROR_AUTO_TRANSLATION) {
        errorMessage = getLocalizedEmailErrorMessage();
      } else {
        errorMessage = getLocalizedEmailErrorMessage('en');
      }
      emailErrorEl.textContent = errorMessage;
      emailErrorEl.style.color = 'red';
      emailErrorEl.style.fontSize = '0.85rem';
      emailErrorEl.style.marginTop = '4px';
      emailErrorEl.style.display = 'none';
      emailInput.insertAdjacentElement('afterend', emailErrorEl);
    }

    let hasTypedEmail = false;

    // Validate email and toggle submit/error UI
    const validateEmail = () => {
      const value = emailInput.value.trim();
      const isValid = validateEmailFormat(value);

      if (!hasTypedEmail && value.length > 0) hasTypedEmail = true;

      if (isValid) {
        submitButton.style.opacity = '1';
        submitButton.style.pointerEvents = 'auto';
        emailErrorEl!.style.display = 'none';
      } else {
        submitButton.style.opacity = '0.5';
        submitButton.style.pointerEvents = 'none';
        emailErrorEl!.style.display = hasTypedEmail ? 'block' : 'none';
      }
    };

    // Listen for user input and blur events on email field
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
  });
}
