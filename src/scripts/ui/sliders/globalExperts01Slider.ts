import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

/**
 * Duplique les slides X fois pour garantir un flux continu (effet marquee)
 */
function duplicateSlides(wrapper: HTMLElement, times: number = 3): void {
  const originalSlides = Array.from(wrapper.querySelectorAll('.swiper-slide'));
  for (let i = 0; i < times; i++) {
    originalSlides.forEach((slide) => {
      wrapper.appendChild(slide.cloneNode(true));
    });
  }
}

/**
 * Effet "marquee" / bandeau défilant continu
 * - Slides dupliquées manuellement pour avoir du contenu d'avance
 * - Transition linéaire (pas de ralentissement)
 * - Pas de pause entre les slides
 * - Ajout : pause du défilement au survol du slider
 * - Ajout : support du drag (touch et souris)
 */
function experts01SliderConfig(element: HTMLElement): Swiper | null {
  const wrapper = element.querySelector<HTMLElement>('.swiper-wrapper');
  if (!wrapper) return null;

  // Récupérer la direction depuis l'attribut data-dc-slider-direction
  const directionAttr = element.getAttribute('data-dc-slider-direction');
  let reverseDirection = false;
  if (directionAttr === 'ltr') {
    reverseDirection = true;
  } else {
    reverseDirection = false;
  }
  // Récupérer la vitesse depuis l'attribut data-dc-slider-speed
  const speedAttr = element.getAttribute('data-dc-slider-speed');
  let speed = 2000;
  if (speedAttr) {
    speed = parseInt(speedAttr);
  }
  // Duplique les slides 3x pour avoir ~4 sets au total (ajuste si besoin)
  duplicateSlides(wrapper, 3);

  // Force la transition linéaire (sinon Swiper utilise ease-out)
  wrapper.style.transitionTimingFunction = 'linear';

  const swiper = new Swiper(element, {
    modules: [Autoplay],
    slidesPerView: 'auto',
    spaceBetween: 24,
    loop: true,
    speed: speed, // Vitesse du défilement (plus élevé = plus lent)
    allowTouchMove: true, // ==> Permet le drag / swipe par souris et touch
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      reverseDirection: reverseDirection,
    },
  });

  return swiper;
}

/**
 * Initialise les sliders globaux (.v-toolkit-01) sur mobile/tablette.
 * À appeler une fois le DOM chargé.
 */
export function experts01Slider() {
  // Sliders principaux
  const experts01Sliders = document.querySelectorAll<HTMLElement>(
    '.swiper[data-dc-slider-config="experts01"]'
  );

  // Sliders principaux
  experts01Sliders.forEach((sliderEl) => {
    experts01SliderConfig(sliderEl);
  });
}
