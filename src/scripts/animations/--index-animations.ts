import { initAutoReveal } from './auto/autoReveal';
import { setupGsap } from './core/gsapSetup';
import { initHomeAnimations } from './pages/homeAnimations';
import { initThankYouAnimations } from './pages/thankYouAnimations';

/**
 * Animations facade. Sets GSAP up once, then exposes the entry points
 * that `src/index.ts` wires into its `PAGE_TRIGGERS`.
 */
export function indexAnimations() {
  setupGsap();
  return {
    initAutoReveal,
    initHomeAnimations,
    initThankYouAnimations,
  };
}
