import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

import { getCurrentBreakpoint } from './utils/breakpoints';
import { verifySliderInit } from './utils/initalization';
import { syncSlider } from './utils/sliderRegistry';

function inCardExpertsSliderConfig(element: HTMLElement): Swiper | null {
  // Rechercher la pagination associée à ce slider enfant .v-slider-card-experts
  // La pagination peut être dans le slider ou dans son parent immédiat
  // Mais il faut éviter de prendre la pagination du slider parent (v-toolkit-01)
  const paginationEl = element.querySelector<HTMLElement>(
    '.swiper-pagination.v-slider-card-experts'
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

export function inCardExpertsSlider() {
  // Pour sélectionner les deux types d'éléments (".swiper.v-slider-card-experts" ET ".swiper[data-dc-slider-config=\"incard-experts01\"]"),
  // on peut utiliser un sélecteur CSS séparé par une virgule dans querySelectorAll (ce qui équivaut à "OU").
  // Pour obtenir les deux types dans un seul NodeList :
  const inCardExpertsSliders = document.querySelectorAll<HTMLElement>(
    '.swiper.v-slider-card-experts'
  );
  if (!inCardExpertsSliders.length) {
    return;
  }
  const currentBreakpoint = getCurrentBreakpoint();

  inCardExpertsSliders.forEach((inCardExpertsSliderEl) => {
    const shouldInit = verifySliderInit(inCardExpertsSliderEl, currentBreakpoint);

    // Initialiser le slider seulement s'il y a plus d'une slide
    const slides = inCardExpertsSliderEl.querySelectorAll('.swiper-slide');
    const hasMultipleSlides = slides.length > 1;

    syncSlider(inCardExpertsSliderEl, shouldInit && hasMultipleSlides, inCardExpertsSliderConfig);
  });
}
