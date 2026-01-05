/**
 * Obtient la taille d'écran actuelle en fonction des breakpoints
 */
export function getCurrentBreakpoint() {
  const width = window.innerWidth;
  if (width >= 992) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}
