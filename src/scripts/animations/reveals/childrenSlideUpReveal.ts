import { gsap } from 'gsap';

import { ANIMATION_DEFAULTS, type RevealOptions } from '../config/animationKeys';
import { prefersReducedMotion } from '../core/reducedMotion';

/**
 * Reveals the direct children of `parent` one after the other (stagger),
 * each sliding up while fading in.
 *
 * The parent acts as the ScrollTrigger trigger; children are the animated
 * targets. Falls back to a short staggered fade when reduced motion is on.
 */
export function childrenSlideUpReveal(
  parent: Element,
  opts: RevealOptions = {}
): gsap.core.Tween | undefined {
  const children = Array.from(parent.children) as Element[];
  if (children.length === 0) return undefined;

  const start = opts.start ?? ANIMATION_DEFAULTS.scrollStart;
  const once = opts.once ?? ANIMATION_DEFAULTS.once;
  const stagger = opts.stagger ?? ANIMATION_DEFAULTS.stagger;

  if (prefersReducedMotion()) {
    return gsap.fromTo(
      children,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: ANIMATION_DEFAULTS.reducedMotionDuration,
        stagger,
        scrollTrigger: { trigger: parent, start, once },
      }
    );
  }

  return gsap.fromTo(
    children,
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
      stagger,
      scrollTrigger: { trigger: parent, start, once },
    }
  );
}
