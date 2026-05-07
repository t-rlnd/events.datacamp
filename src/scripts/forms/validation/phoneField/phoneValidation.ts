import { USE_ERROR_AUTO_TRANSLATION } from '../behavior';
import { getLocalizedPhoneErrorMessage } from './phoneTranslations';

// Typing for the intl-tel-input instance
interface IntlTelInputInstance {
  getSelectedCountryData: () => { iso2?: string; dialCode?: string; name?: string } | null;
  isValidNumber: () => boolean;
}

// Returns the error message in user's browser language or English if not auto-translation
function getErrorMessage(): string {
  if (USE_ERROR_AUTO_TRANSLATION) {
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    return getLocalizedPhoneErrorMessage(browserLang);
  }
  return getLocalizedPhoneErrorMessage('us');
}

// Updates the phone error message (in place in the DOM)
function updateErrorMessage(phoneErrorEl: HTMLElement): void {
  phoneErrorEl.textContent = getErrorMessage();
}

// Initialize phone field validation for all forms on the page
export function initPhoneValidation(): void {
  const forms = document.querySelectorAll('form');

  forms.forEach((form) => {
    // Get the phone input and submit button within the form
    const phoneInput = form.querySelector<HTMLInputElement>('input[type="tel"]');
    const submitButton = form.querySelector<HTMLElement>(
      'button[type="submit"], input[type="submit"]'
    );

    if (!phoneInput || !submitButton) return;

    // Get international phone instance saved earlier
    const iti = (phoneInput as HTMLInputElement & { _iti?: IntlTelInputInstance })._iti;
    if (!iti) return;

    // Find or create the error element after the phone input
    let phoneErrorEl = form.querySelector<HTMLElement>('[data-error-phone]');
    if (!phoneErrorEl) {
      phoneErrorEl = document.createElement('div');
      phoneErrorEl.setAttribute('data-error-phone', '');
      phoneErrorEl.textContent = getErrorMessage();
      phoneErrorEl.style.color = 'red';
      phoneErrorEl.style.fontSize = '0.85rem';
      phoneErrorEl.style.marginTop = '4px';
      phoneErrorEl.style.display = 'none';
      phoneInput.insertAdjacentElement('afterend', phoneErrorEl);
    }

    let hasTypedPhone = false;

    // Validate phone: enable/disable submit, show/hide error
    const validatePhone = () => {
      const value = phoneInput.value.trim();
      const isValid = value.length > 0 && iti.isValidNumber();

      if (!hasTypedPhone && value.length > 0) hasTypedPhone = true;

      if (isValid) {
        submitButton.style.opacity = '1';
        submitButton.style.pointerEvents = 'auto';
        phoneErrorEl!.style.display = 'none';
      } else {
        submitButton.style.opacity = '0.5';
        submitButton.style.pointerEvents = 'none';
        phoneErrorEl!.style.display = hasTypedPhone ? 'block' : 'none';
      }
    };

    // On country change: update error message (based on browser language, not dropdown)
    const handleCountryChange = () => {
      updateErrorMessage(phoneErrorEl!);
      validatePhone();
    };

    phoneInput.addEventListener('input', validatePhone);
    phoneInput.addEventListener('blur', validatePhone);
    phoneInput.addEventListener('countrychange', handleCountryChange as EventListener);
  });
}
