// Handles UI radio buttons controlling access, and syncs their checked state.

import { setAccessID } from '../state/accessState';

// Attach change listener on all radios to update global accessID.
// Uses 'change' event to ensure form state is updated before syncing.
export function initAccessRadios() {
  const radios = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"][name="webinarOptionsSelector"]'
  );
  radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.checked) {
        setAccessID(target.value);
      }
    });
  });
}

// Synchronize all UI radios to match the current accessID.
// Also updates .w-radio-input for Webflow visual state.
export function updateRadiosFromAccess(accessID: string) {
  document.querySelectorAll<HTMLElement>('.w-radio').forEach((wrapper) => {
    const input = wrapper.querySelector<HTMLInputElement>('input[type="radio"]');
    const visual = wrapper.querySelector<HTMLElement>('.w-radio-input');
    if (!input || !visual) return;
    const checked = input.value === accessID;
    input.checked = checked;
    visual.classList.toggle('w--redirected-checked', checked);
    visual.classList.toggle('w--redirected-focused', checked);
  });
}
