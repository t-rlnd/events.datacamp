import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

function sqlR2RSlider01Config(element: HTMLElement): Swiper | null {
  const paginationEl = element.querySelector<HTMLElement>(
    '.swiper-pagination[dc-slider-config="sqlr2r-slider-01"]'
  );

  return new Swiper(element, {
    modules: [Pagination, Autoplay],
    speed: 450,
    slidesPerView: 'auto',
    loop: false,
    spaceBetween: 24,

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
      clickable: true,
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
export function sqlR2RSlider01() {
  const sliders = document.querySelectorAll<HTMLElement>(
    '.swiper[dc-slider-config="sqlr2r-slider-01"]'
  );

  sliders.forEach((sliderEl) => {
    // Initialiser seulement si on est sur mobile ou tablet (< 992px)
    if (window.innerWidth < 992) {
      sqlR2RSlider01Config(sliderEl);
    }
  });
}
