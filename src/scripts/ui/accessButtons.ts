// Handles UI buttons that change global accessID state.
// Finds all elements with [dc-access-id], adds click handlers to update access.
import { setAccessID } from '../state/accessState';

export function initAccessButtons() {
  const buttons = document.querySelectorAll<HTMLElement>('[data-dc-options-selector]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const accessID = button.getAttribute('data-dc-options-selector');
      if (accessID) setAccessID(accessID);
    });
  });
}
