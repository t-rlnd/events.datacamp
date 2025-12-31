import { isFormSubmitted } from '../users/formsState';

// Parse a comma-separated string and return non-empty trimmed keys as an array.
function getKeys(value?: string): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

// Returns true if any of the provided keys were submitted for this pagePath.
function isAnyFormSubmitted(pagePath: string, keys: string[]): boolean {
  return keys.some((key) => isFormSubmitted(pagePath, key));
}

// Update the visibility of elements based on form submission state and conditional attributes.
export function updateConditionalDisplay() {
  const pagePath = window.location.pathname;

  // Handle all elements with [data-show-if-form]:
  // Show the element if any associated forms for those keys are submitted; hide otherwise.
  document.querySelectorAll<HTMLElement>('[data-show-if-form]').forEach((el) => {
    const keys = getKeys(el.dataset.showIfForm);
    const shouldShow = isAnyFormSubmitted(pagePath, keys);
    el.style.display = shouldShow ? 'flex' : 'none';
  });

  // Handle all elements with [data-hide-if-form]:
  // Hide the element if any associated forms for those keys are submitted; show otherwise.
  document.querySelectorAll<HTMLElement>('[data-hide-if-form]').forEach((el) => {
    const keys = getKeys(el.dataset.hideIfForm);
    const shouldHide = isAnyFormSubmitted(pagePath, keys);
    el.style.display = shouldHide ? 'none' : 'flex';
  });
}
