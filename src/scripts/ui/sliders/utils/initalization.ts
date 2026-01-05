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
  // Logique hiérarchique : tablet couvre mobile et tablet, desktop couvre tout
  switch (normalizedValue) {
    case 'desktop':
      // Desktop couvre tablet, mobile et desktop
      return true;
    case 'tablet':
      // Tablet couvre mobile et tablet
      return currentBreakpoint === 'mobile' || currentBreakpoint === 'tablet';
    case 'mobile':
      // Mobile couvre seulement mobile
      return currentBreakpoint === 'mobile';
    default:
      // Valeur non reconnue, initialiser par défaut
      return true;
  }
}
