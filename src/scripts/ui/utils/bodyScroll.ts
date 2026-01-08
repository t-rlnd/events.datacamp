// Prevents background scroll when modal is open
export function lockBodyScroll() {
  document.body.style.overflow = 'hidden';
}

// Restores page scroll state
export function unlockBodyScroll() {
  document.body.style.overflow = '';
}
