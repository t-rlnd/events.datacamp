import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

/**
 * Duplicates the slides multiple times to ensure a continuous marquee effect.
 */
/* Old function to duplicate slides 

function duplicateSlides(wrapper: HTMLElement, times: number = 3): void {
  const originalSlides = Array.from(wrapper.querySelectorAll('.swiper-slide'));
  for (let i = 0; i < times; i++) {
    originalSlides.forEach((slide) => {
      wrapper.appendChild(slide.cloneNode(true));
    });
  }
}

*/

/**
 * Creates a "marquee" continuous scrolling effect:
 * - Linear transition, no pause between slides
 */
function globalExperts01SliderConfig(element: HTMLElement): Swiper | null {
  const wrapper = element.querySelector<HTMLElement>('.swiper-wrapper');
  if (!wrapper) return null;

  // Determine direction. If "ltr", reverse. Default false.
  const directionAttr = element.getAttribute('data-dc-slider-direction');
  const reverseDirection = directionAttr === 'ltr';

  // Get speed from attribute or use default
  const speedAttr = element.getAttribute('data-dc-slider-speed');
  let speed = 2000;
  if (speedAttr) {
    speed = parseInt(speedAttr, 10);
  }

  // Force linear transition for continuous effect
  wrapper.style.transitionTimingFunction = 'linear';

  const swiper = new Swiper(element, {
    modules: [Autoplay],
    slidesPerView: 'auto',
    spaceBetween: 24,
    loop: true,
    speed: speed,
    allowTouchMove: false,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: reverseDirection,
    },
  });

  return swiper;
}

/**
 * Initialize global sliders (.v-toolkit-01) for mobile/tablet.
 * Call after DOM is loaded.
 */
export function globalExperts01Slider() {
  const experts01Sliders = document.querySelectorAll<HTMLElement>(
    '.swiper[data-dc-slider-config="experts01"]'
  );
  experts01Sliders.forEach((sliderEl) => {
    globalExperts01SliderConfig(sliderEl);
  });
}
