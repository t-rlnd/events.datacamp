import { gsap } from 'gsap';

import { ANIMATION_DEFAULTS, type RevealOptions } from '../config/animationKeys';
import { prefersReducedMotion } from '../core/reducedMotion';

/**
 * Reveals a single element by scaling it from 0 to 1 while fading in.
 *
 * Uses GSAP's default `transform-origin: 50% 50%` (centered scale).
 * Falls back to a quick fade-only when `prefers-reduced-motion: reduce`.
 */
export function scaleUpReveal(target: Element, opts: RevealOptions = {}): gsap.core.Tween {
  const start = opts.start ?? ANIMATION_DEFAULTS.scrollStart;
  const once = opts.once ?? ANIMATION_DEFAULTS.once;

  if (prefersReducedMotion()) {
    return gsap.fromTo(
      target,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: ANIMATION_DEFAULTS.reducedMotionDuration,
        scrollTrigger: { trigger: target, start, once },
      }
    );
  }

  return gsap.fromTo(
    target,
    {
      autoAlpha: 0,
      scale: 0,
    },
    {
      autoAlpha: 1,
      scale: 1,
      duration: opts.duration ?? ANIMATION_DEFAULTS.duration,
      delay: opts.delay ?? ANIMATION_DEFAULTS.delay,
      ease: opts.ease ?? ANIMATION_DEFAULTS.ease,
      scrollTrigger: { trigger: target, start, once },
    }
  );
}
