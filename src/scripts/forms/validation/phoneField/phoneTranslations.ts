/**
 * Localized error messages for phone number validation.
 * Keys are ISO 3166-1 alpha-2 country codes.
 */
export const PHONE_ERROR_MESSAGES: Record<string, string> = {
  // French (France)
  fr: 'Veuillez entrer un numéro de téléphone valide.',
  // French (Belgium)
  be: 'Veuillez entrer un numéro de téléphone valide.',
  // French (Switzerland)
  ch: 'Veuillez entrer un numéro de téléphone valide.',
  // French (Luxembourg)
  lu: 'Veuillez entrer un numéro de téléphone valide.',
  // French (Monaco)
  mc: 'Veuillez entrer un numéro de téléphone valide.',

  // English (United States)
  us: 'Enter a valid phone number.',
  // English (United Kingdom)
  gb: 'Enter a valid phone number.',
  // English (Canada)
  ca: 'Enter a valid phone number.',
  // English (Australia)
  au: 'Enter a valid phone number.',
  // English (New Zealand)
  nz: 'Enter a valid phone number.',
  // English (Ireland)
  ie: 'Enter a valid phone number.',

  // Spanish (Spain)
  es: 'Introduce un número de teléfono válido.',
  // Spanish (Mexico)
  mx: 'Introduce un número de teléfono válido.',
  // Spanish (Argentina)
  ar: 'Introduce un número de teléfono válido.',
  // Spanish (Colombia)
  co: 'Introduce un número de teléfono válido.',
  // Spanish (Chile)
  cl: 'Introduce un número de teléfono válido.',

  // German (Germany)
  de: 'Bitte geben Sie eine gültige Telefonnummer ein.',
  // German (Austria)
  at: 'Bitte geben Sie eine gültige Telefonnummer ein.',

  // Italian (Italy)
  it: 'Inserisci un numero di telefono valido.',

  // Portuguese (Portugal)
  pt: 'Insira um número de telefone válido.',
  // Portuguese (Brazil)
  br: 'Insira um número de telefone válido.',

  // Dutch (Netherlands)
  nl: 'Voer een geldig telefoonnummer in.',

  // Default (English)
  default: 'Enter a valid phone number.',
};

/**
 * Get the localized error message for a given country code.
 * @param countryCode - ISO country code (e.g., 'fr', 'us', 'gb')
 * @returns Localized error message
 */
export function getLocalizedPhoneErrorMessage(countryCode: string | undefined): string {
  if (!countryCode) return PHONE_ERROR_MESSAGES.default;
  const code = countryCode.toLowerCase();
  return PHONE_ERROR_MESSAGES[code] || PHONE_ERROR_MESSAGES.default;
}
