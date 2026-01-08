import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

import { getCurrentBreakpoint } from './utils/breakpoints';
import { verifySliderInit } from './utils/initalization';

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
  const inCardExpertsSliders = document.querySelectorAll<HTMLElement>(
    '.swiper.v-slider-card-experts'
  );
  if (!inCardExpertsSliders.length) {
    return;
  }
  const swiperInstances = new Map<HTMLElement, Swiper>();

  function initSliders() {
    const currentBreakpoint = getCurrentBreakpoint();

    inCardExpertsSliders.forEach((inCardExpertsSliderEl) => {
      const shouldInit = verifySliderInit(inCardExpertsSliderEl, currentBreakpoint);
      const existingInstance = swiperInstances.get(inCardExpertsSliderEl);

      // Compter le nombre de slides
      const slides = inCardExpertsSliderEl.querySelectorAll('.swiper-slide');
      const hasMultipleSlides = slides.length > 1;

      if (shouldInit && !existingInstance && hasMultipleSlides) {
        // Initialiser le slider seulement s'il y a plus d'une slide
        const swiper = inCardExpertsSliderConfig(inCardExpertsSliderEl);
        if (swiper) {
          swiperInstances.set(inCardExpertsSliderEl, swiper);
        }
      } else if ((!shouldInit || !hasMultipleSlides) && existingInstance) {
        // Détruire le slider si la condition n'est plus remplie ou s'il n'y a plus qu'une slide
        existingInstance.destroy(true, true);
        swiperInstances.delete(inCardExpertsSliderEl);
      }
    });
  }

  // Initialisation au chargement
  initSliders();
}
