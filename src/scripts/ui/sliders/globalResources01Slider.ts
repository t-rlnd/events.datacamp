import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

function globalResources01SliderConfig(element: HTMLElement): Swiper | null {
  const paginationEl = element.querySelector<HTMLElement>(
    '.swiper-pagination[dc-slider-config="resources01"]'
  );

  return new Swiper(element, {
    modules: [Pagination, Autoplay],
    speed: 450,
    slidesPerView: 'auto',
    loop: false,
    spaceBetween: 24,

    // --- Drag + Snap ---
    freeMode: false,
    grabCursor: true,
    touchRatio: 1,
    threshold: 5,
    resistance: true,
    resistanceRatio: 0.6,

    pagination: {
      enabled: true,
      el: paginationEl,
      clickable: true,
      dynamicBullets: false,
      dynamicMainBullets: 1,
    },

    breakpoints: {
      0: {},
      992: {},
    },
  });
}

function inCardExpertsInResources01SliderConfig(element: HTMLElement): Swiper | null {
  const paginationEl = element.querySelector<HTMLElement>(
    '.swiper-pagination[data-dc-slider-config="resources01-experts01"]'
  );

  return new Swiper(element, {
    modules: [Pagination, Autoplay],
    speed: 1000,
    loop: true,
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: {
      enabled: true,
      el: paginationEl,
      dynamicBullets: false,
      dynamicMainBullets: 1,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
  });
}

/**
 * Initialise les sliders globaux (.v-toolkit-01) sur mobile/tablette.
 * À appeler une fois le DOM chargé.
 */
export function globalResources01Slider() {
  // Sliders principaux
  const resources01Sliders = document.querySelectorAll<HTMLElement>(
    '.swiper[data-dc-slider-config="resources01"]'
  );
  // Sliders experts dans les cards
  const expertsInResources01CardSliders = document.querySelectorAll<HTMLElement>(
    '.swiper[data-dc-slider-config="resources01-experts01"]'
  );

  // Sliders principaux
  resources01Sliders.forEach((sliderEl) => {
    if (window.innerWidth < 992) {
      globalResources01SliderConfig(sliderEl);
    }
  });

  // Sliders experts dans les cards
  expertsInResources01CardSliders.forEach((sliderEl) => {
    if (window.innerWidth < 992) {
      const slides = sliderEl.querySelectorAll('.swiper-slide');
      if (slides.length > 1) {
        inCardExpertsInResources01SliderConfig(sliderEl);
      }
    }
  });
}
