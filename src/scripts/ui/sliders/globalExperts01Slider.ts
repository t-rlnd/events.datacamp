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

function isPauseOnHoverEnabled(element: HTMLElement): boolean {
  return element.getAttribute('data-dc-slider-pause-on-hover')?.toLowerCase() === 'true';
}

function getWrapperTranslateX(wrapper: HTMLElement): number {
  const transform = getComputedStyle(wrapper).transform;
  if (!transform || transform === 'none') return 0;
  return new DOMMatrix(transform).m41;
}

/**
 * Freezes the marquee at its current visual position. Swiper's native
 * pauseOnMouseEnter waits for the in-flight slide (speed can be 4000ms).
 *
 * Loop mode blocks slideNext while `animating` is true, so we must clear
 * that flag or autoplay never restarts on mouseleave.
 */
function bindPauseOnHover(swiper: Swiper, element: HTMLElement): void {
  const wrapper = swiper.wrapperEl;

  const freeze = () => {
    const currentX = getWrapperTranslateX(wrapper);
    swiper.autoplay.stop();
    swiper.setTransition(0);
    swiper.setTranslate(currentX);
    swiper.animating = false;
  };

  const unfreeze = () => {
    swiper.animating = false;
    swiper.setTransition(swiper.params.speed);
    wrapper.style.transitionTimingFunction = 'linear';
    swiper.autoplay.start();
  };

  element.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    freeze();
  });

  element.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    unfreeze();
  });
}

/**
 * Creates a "marquee" continuous scrolling effect:
 * - Linear transition, no pause between slides
 * - Optional pause on hover via data-dc-slider-pause-on-hover="true"
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

  const pauseOnHover = isPauseOnHoverEnabled(element);

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

  if (pauseOnHover) {
    bindPauseOnHover(swiper, element);
  }

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
