import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

import { getCurrentBreakpoint } from './utils/breakpoints';
import { verifySliderInit } from './utils/initalization';

function toolkitSlider01Config(element: HTMLElement): Swiper | null {
  const paginationEl = element.querySelector<HTMLElement>('.swiper-pagination.v-toolkit-01');

  return new Swiper(element, {
    modules: [Pagination, Autoplay],
    speed: 450,
    slidesPerView: 'auto',
    loop: false,

    // --- Drag + Snap ---
    freeMode: false, // IMPORTANT → snap activé
    grabCursor: true,
    touchRatio: 1,
    threshold: 5, // évite les micro-drags
    resistance: true,
    resistanceRatio: 0.6,

    pagination: {
      enabled: true,
      el: paginationEl,
      dynamicBullets: false,
      dynamicMainBullets: 1,
    },
  });
}

/**
 * Initialise les sliders globaux (.v-toolkit-01) sur mobile/tablette.
 * À appeler une fois le DOM chargé.
 */
export function toolkitSlider01() {
  const sliders = document.querySelectorAll<HTMLElement>('.swiper.v-toolkit-01');
  if (!sliders.length) {
    return;
  }
  const swiperInstances = new Map<HTMLElement, Swiper>();

  function initSliders() {
    const currentBreakpoint = getCurrentBreakpoint();

    sliders.forEach((sliderEl) => {
      const shouldInit = verifySliderInit(sliderEl, currentBreakpoint);
      const existingInstance = swiperInstances.get(sliderEl);

      if (shouldInit && !existingInstance) {
        // Initialiser le slider
        const swiper = toolkitSlider01Config(sliderEl);
        if (swiper) {
          swiperInstances.set(sliderEl, swiper);
        }
      } else if (!shouldInit && existingInstance) {
        // Détruire le slider si la condition n'est plus remplie
        existingInstance.destroy(true, true);
        swiperInstances.delete(sliderEl);
      }
    });
  }

  // Initialisation au chargement
  initSliders();
}
