/**
 * Vérifie si le slider doit être initialisé selon l'attribut et la taille d'écran
 */
export function verifySliderInit(element: HTMLElement, currentBreakpoint: string): boolean {
  const initFromValue = element.getAttribute('dc-slider-init-from');

  // Si aucun attribut n'est présent ou vide, initialiser par défaut
  if (!initFromValue) {
    return true;
  }

  const normalizedValue = initFromValue.toLowerCase().trim();

  // Vérifier selon la valeur de l'attribut et le breakpoint actuel
  switch (normalizedValue) {
    case 'desktop':
      return currentBreakpoint === 'desktop';
    case 'tablet':
      return currentBreakpoint === 'tablet';
    case 'mobile':
      return true; // Mobile s'applique à toutes les tailles
    default:
      // Valeur non reconnue, initialiser par défaut
      return true;
  }
}
