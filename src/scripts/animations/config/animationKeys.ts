/**
 * Shared keys, defaults and types for the animations domain.
 *
 * Anything that should be reusable across reveals (durations, easings,
 * stagger amount, scroll start point...) lives here. Tweaking a value in
 * this file propagates everywhere the constant is consumed.
 */

/** Attribute used on the markup to declare an auto-reveal animation. */
const ID = 'dc';
export const ANIMATE_ATTR = `data-${ID}-animate`;

/**
 * Breakpoints used by the `d-`, `t-`, `m-` prefixes of `data-${ID}-animate`.
 * Aligned with Webflow's default breakpoints.
 */
export const BREAKPOINTS = {
  desktop: '(min-width: 992px)',
  tablet: '(min-width: 768px)',
  mobile: '(max-width: 767px)',
} as const;

/** Prefix → media query mapping for breakpoint-scoped reveals. */
export const BREAKPOINT_PREFIXES: Record<string, string> = {
  'd-': BREAKPOINTS.desktop,
  't-': BREAKPOINTS.tablet,
  'm-': BREAKPOINTS.mobile,
  'dt-': `${BREAKPOINTS.desktop} and ${BREAKPOINTS.tablet}`,
  'dm-': `${BREAKPOINTS.desktop} and ${BREAKPOINTS.mobile}`,
  'tm-': `${BREAKPOINTS.tablet} and ${BREAKPOINTS.mobile}`,
  'dtm-': `${BREAKPOINTS.desktop} and ${BREAKPOINTS.tablet} and ${BREAKPOINTS.mobile}`,
};

/**
 * Single source of truth for reveal animation values.
 * Override on a per-call basis through `RevealOptions`.
 */
export const ANIMATION_DEFAULTS = {
  duration: 0.8,
  delay: 0,
  ease: 'power3.out',
  stagger: 0.1,
  yDistance: '3rem',
  scrollStart: 'top 98%',
  once: true,
  reducedMotionDuration: 0.2,
} as const;

export interface RevealOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  yDistance?: number;
  start?: string;
  once?: boolean;
}
