/**
 * Error messages for email validation.
 * Localized by ISO 639-1 language code.
 */
export const EMAIL_ERROR_MESSAGES: Record<string, string> = {
  // French
  fr: 'Veuillez entrer une adresse email valide.',
  // English
  en: 'Please enter a valid email address.',
  // Spanish
  es: 'Introduce una dirección de correo válida.',
  // German
  de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
  // Italian
  it: 'Inserisci un indirizzo email valido.',
  // Portuguese
  pt: 'Insira um endereço de email válido.',
  // Dutch
  nl: 'Voer een geldig e-mailadres in.',
  // Default (English)
  default: 'Please enter a valid email address.',
};

/**
 * Returns the localized email error message according to browser language.
 * @param langCode - Language code (e.g. 'fr', 'en', 'es'). If not given, uses browser language.
 * @returns Error message in appropriate language.
 */
export function getLocalizedEmailErrorMessage(langCode?: string): string {
  // If no langCode is provided, use browser language
  const code = langCode || navigator.language.split('-')[0].toLowerCase();
  return EMAIL_ERROR_MESSAGES[code] || EMAIL_ERROR_MESSAGES.default;
}
