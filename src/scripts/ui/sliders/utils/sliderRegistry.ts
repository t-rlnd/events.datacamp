import type Swiper from 'swiper';

// Instances actives, partagées entre tous les appels (initAllSliders est relancé à chaque resize).
const swiperInstances = new WeakMap<HTMLElement, Swiper>();

/**
 * Crée le slider s'il doit être actif et n'existe pas encore,
 * le détruit (en nettoyant les styles inline posés par Swiper, ex. margin-right) s'il ne doit plus l'être.
 */
export function syncSlider(
  element: HTMLElement,
  shouldInit: boolean,
  createSwiper: (element: HTMLElement) => Swiper | null
): void {
  const existingInstance = swiperInstances.get(element);

  if (shouldInit && !existingInstance) {
    const swiper = createSwiper(element);
    if (swiper) swiperInstances.set(element, swiper);
  } else if (!shouldInit && existingInstance) {
    existingInstance.destroy(true, true);
    swiperInstances.delete(element);
  }
}
