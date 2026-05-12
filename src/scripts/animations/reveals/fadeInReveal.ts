import { gsap } from 'gsap';

import { ANIMATION_DEFAULTS, type RevealOptions } from '../config/animationKeys';

/**
 * Reveals a single element with a plain opacity fade-in.
 *
 * Always uses opacity-only (no transforms), so it is already reduced-motion
 * friendly. Useful for elements where movement isn't desired.
 */
export function fadeInReveal(target: Element, opts: RevealOptions = {}): gsap.core.Tween {
  return gsap.fromTo(
    target,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: opts.duration ?? ANIMATION_DEFAULTS.duration,
      delay: opts.delay ?? ANIMATION_DEFAULTS.delay,
      ease: opts.ease ?? ANIMATION_DEFAULTS.ease,
      scrollTrigger: {
        trigger: target,
        start: opts.start ?? ANIMATION_DEFAULTS.scrollStart,
        once: opts.once ?? ANIMATION_DEFAULTS.once,
      },
    }
  );
}
