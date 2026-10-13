import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

import { getCurrentBreakpoint } from './utils/breakpoints';
import { syncSlider } from './utils/sliderRegistry';

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

    // Breakpoints : paramètres selon la taille d'écran
    breakpoints: {
      0: {
        // Mobile et tablet (< 992px)
      },
      992: {
        // Desktop (>= 992px)
      },
    },
  });
}

/**
 * Initialise les sliders globaux (.v-toolkit-01) sur mobile/tablette.
 * À appeler une fois le DOM chargé.
 */
export function toolkitSlider01() {
  const sliders = document.querySelectorAll<HTMLElement>('.swiper.v-toolkit-01');

  // Actif seulement sur mobile ou tablet (< 992px), détruit au retour en desktop
  const shouldInit = getCurrentBreakpoint() !== 'desktop';

  sliders.forEach((sliderEl) => {
    syncSlider(sliderEl, shouldInit, toolkitSlider01Config);
  });
}
