/**
 * Returns true when the user has opted into reduced motion via OS settings.
 * Reveals should fall back to a short opacity-only fade in that case so
 * content still appears but without distracting movement.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
