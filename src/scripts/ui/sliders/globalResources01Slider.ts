import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

function resources01SliderConfig(element: HTMLElement): Swiper | null {
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

function resources01ExpertsInCardSliderConfig(element: HTMLElement): Swiper | null {
  // Rechercher la pagination associée à ce slider enfant .v-slider-card-experts
  // La pagination peut être dans le slider ou dans son parent immédiat
  // Mais il faut éviter de prendre la pagination du slider parent (v-toolkit-01)
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
export function resources01Slider() {
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
      resources01SliderConfig(sliderEl);
    }
  });
  // Sliders experts dans les cards
  expertsInResources01CardSliders.forEach((sliderEl) => {
    $;
    if (window.innerWidth < 992) {
      resources01ExpertsInCardSliderConfig(sliderEl);
    }
  });
}
