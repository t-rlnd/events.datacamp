import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ANIMATION_DEFAULTS } from '../config/animationKeys';

let isSetup = false;

/**
 * Registers GSAP plugins and applies project-wide defaults.
 * Idempotent: safe to call multiple times.
 */
export function setupGsap(): void {
  if (isSetup) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    ease: ANIMATION_DEFAULTS.ease,
    duration: ANIMATION_DEFAULTS.duration,
  });

  isSetup = true;
}
