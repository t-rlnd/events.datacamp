/**
 * Initialize intl-tel-input on all phone fields.
 * The library is loaded via CDN (window.intlTelInput).
 * The country dropdown always matches the width of the clicked input.
 */
export function initPhoneFields(): void {
  if (typeof window === 'undefined') return;

  // Use unknown typing to avoid "any"
  const intlTelInputFn = (
    window as unknown as {
      intlTelInput?: (input: HTMLInputElement, options: Record<string, unknown>) => unknown;
    }
  ).intlTelInput;
  if (!intlTelInputFn) {
    console.warn('intlTelInput is not loaded (CDN missing)');
    return;
  }

  const phoneInputs = document.querySelectorAll<HTMLInputElement>('input[type="tel"]');
  if (!phoneInputs.length) return;

  phoneInputs.forEach((input) => {
    // Prevent double init (can happen with CMS/interactions)
    if (input.dataset.itiInitialized) return;
    input.dataset.itiInitialized = 'true';

    // Initialize intl-tel-input
    // autoPlaceholder: "polite" selects placeholder based on selected country
    const iti = intlTelInputFn(input, {
      initialCountry: 'us',
      separateDialCode: true,
      nationalMode: false,
      autoPlaceholder: 'polite',
      formatOnDisplay: true,
      dropdownContainer: document.body,
    });

    // Bridge for other scripts (validation, submit, etc.)
    (input as HTMLInputElement & { _iti?: unknown })._iti = iti;

    // (Optional) Get the hidden field to store the phone dial code
    const form = input.closest('form');
    const dialCodeInput = form?.querySelector<HTMLInputElement>('input[data-phone-dial-code]');

    // Updates the hidden dial code field based on current country
    const updateDialCode = () => {
      if (!dialCodeInput) return;
      const itiApi = iti as { getSelectedCountryData: () => { dialCode: string } | null };
      const data = itiApi.getSelectedCountryData();
      dialCodeInput.value = data ? `+${data.dialCode}` : '';
    };

    input.addEventListener('countrychange', updateDialCode);
    input.addEventListener('input', updateDialCode);
  });

  // Sync country dropdown width to input width on flag button click
  document.addEventListener('click', (e) => {
    const flagButton = (e.target as HTMLElement)?.closest('.iti__flag-container');
    if (!flagButton) return;

    const itiWrapper = flagButton.closest('.iti');
    if (!itiWrapper) return;

    const input = itiWrapper.querySelector<HTMLInputElement>('input[type="tel"]');
    const dropdown = document.querySelector<HTMLElement>('.iti__country-list');
    if (!input || !dropdown) return;

    const rect = input.getBoundingClientRect();
    dropdown.style.width = `${rect.width}px`;
  });

  // Also adjust dropdown width responsively on window resize
  window.addEventListener('resize', () => {
    const dropdown = document.querySelector<HTMLElement>('.iti__country-list');
    if (!dropdown || dropdown.style.display === 'none') return;

    const activeInput = document.querySelector<HTMLInputElement>(".iti input[type='tel']:focus");
    if (!activeInput) return;

    const rect = activeInput.getBoundingClientRect();
    dropdown.style.width = `${rect.width}px`;
  });
}
