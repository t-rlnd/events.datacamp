import type Swiper from 'swiper';

// Instances actives, partagées entre tous les appels (initAllSliders est relancé à chaque resize).
const swiperInstances = new WeakMap<HTMLElement, Swiper>();

// Propriétés inline posées par Swiper, à retirer quand le slider est détruit.
const SWIPER_SLIDE_STYLES = [
  'width',
  'height',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
];
const SWIPER_WRAPPER_STYLES = ['transform', 'transition-duration', 'transition-delay', 'cursor'];

/**
 * Détruit le slider en ne retirant que les styles inline de Swiper.
 * `destroy(true, true)` supprime tout l'attribut `style`, donc aussi les styles posés par GSAP
 * (visibility/opacity des reveals) : les éléments redeviendraient invisibles (CSS anti-FOUC).
 */
function destroySlider(swiper: Swiper): void {
  const { wrapperEl } = swiper;
  const slides = Array.from(swiper.slides);

  // Sauvegarde des styles inline avant que Swiper ne les efface
  const savedStyles = new Map<HTMLElement, string>();
  [swiper.el, wrapperEl, ...slides].forEach((el) => savedStyles.set(el, el.style.cssText));

  swiper.destroy(true, true);

  savedStyles.forEach((cssText, el) => {
    el.style.cssText = cssText;
  });
  slides.forEach((slide) =>
    SWIPER_SLIDE_STYLES.forEach((prop) => slide.style.removeProperty(prop))
  );
  SWIPER_WRAPPER_STYLES.forEach((prop) => wrapperEl.style.removeProperty(prop));
}

/**
 * Crée le slider s'il doit être actif et n'existe pas encore,
 * le détruit (en retirant les styles inline posés par Swiper, ex. margin-right) s'il ne doit plus l'être.
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
    destroySlider(existingInstance);
    swiperInstances.delete(element);
  }
}
