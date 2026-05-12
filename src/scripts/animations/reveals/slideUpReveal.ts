import { gsap } from 'gsap';

import { ANIMATION_DEFAULTS, type RevealOptions } from '../config/animationKeys';
import { prefersReducedMotion } from '../core/reducedMotion';

/**
 * Reveals a single element by sliding it up while fading in.
 *
 * Triggered when the element's top reaches `scrollStart` (default `top 85%`).
 * If the element is already past that point at load, GSAP fires immediately.
 *
 * Falls back to a quick fade-only when `prefers-reduced-motion: reduce`.
 */
export function slideUpReveal(target: Element, opts: RevealOptions = {}): gsap.core.Tween {
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
      y: opts.yDistance ?? ANIMATION_DEFAULTS.yDistance,
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: opts.duration ?? ANIMATION_DEFAULTS.duration,
      delay: opts.delay ?? ANIMATION_DEFAULTS.delay,
      ease: opts.ease ?? ANIMATION_DEFAULTS.ease,
      scrollTrigger: { trigger: target, start, once },
    }
  );
}
