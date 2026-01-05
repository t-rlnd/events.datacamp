// Prevents background scroll when modal is open
function lockBodyScroll() {
  document.body.style.overflow = 'hidden';
}

// Restores page scroll state
function unlockBodyScroll() {
  document.body.style.overflow = '';
}

// Opens the modal matching the given id
function openModal(id: string) {
  const targetModal = document.querySelector<HTMLElement>(
    `[dc-modal-element="wrapper"][dc-modal-id="${id}"]`
  );
  if (targetModal) {
    targetModal.style.display = 'flex';
    targetModal.setAttribute('data-modal-open', 'true');
    lockBodyScroll();
    // Optionally: sync radios or other UI here when modal opens
  }
}

// Closes the provided modal; unlocks scroll if no more modals are open
function closeModal(modal: HTMLElement) {
  // Cacher la modale après la réinitialisation
  modal.style.display = 'none';
  modal.setAttribute('data-modal-open', 'false');

  // Check if any modal is still open
  const stillOpen = document.querySelector('[data-modal-open="true"]');
  if (!stillOpen) {
    unlockBodyScroll();
  }
}

// Initializes modal open/close behaviors
export function initModals() {
  // Selectors for modal open buttons and overlay close areas
  const modalButtons = document.querySelectorAll('[dc-button-action="modal"]');
  const overlays = document.querySelectorAll('[dc-modal-element="overlay"]');

  // Open modal on button click
  modalButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = button.getAttribute('dc-modal-id');
      if (modalId) openModal(modalId);
    });
  });

  // Close modal when clicking the overlay
  overlays.forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = overlay.closest<HTMLElement>('[dc-modal-element="wrapper"][dc-modal-id]');
      if (modal) closeModal(modal as HTMLElement);
    });
  });
}
