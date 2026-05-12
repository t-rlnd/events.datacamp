import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ANIMATE_ATTR, BREAKPOINT_PREFIXES } from '../config/animationKeys';
import { childrenSlideUpReveal } from '../reveals/childrenSlideUpReveal';
import { fadeInReveal } from '../reveals/fadeInReveal';
import { scaleUpReveal } from '../reveals/scaleUpReveal';
import { slideUpReveal } from '../reveals/slideUpReveal';

type RevealFn = (target: Element) => unknown;

/**
 * Mapping from `data-dc-animate` value (without breakpoint prefix) to the
 * reveal function that should be applied. Adding a new reveal here is the
 * only place to wire it up for declarative usage in markup.
 */
const REVEAL_MAP: Record<string, RevealFn> = {
  'slide-up': (el) => slideUpReveal(el),
  'children-slide-up': (el) => childrenSlideUpReveal(el),
  'fade-in': (el) => fadeInReveal(el),
  'scale-up': (el) => scaleUpReveal(el),
};

/**
 * Splits a `data-dc-animate` value into its breakpoint prefix (if any) and
 * the bare reveal type. Example: `"d-children-slide-up"` →
 * `{ type: "children-slide-up", mediaQuery: "(min-width: 992px)" }`.
 */
function parseRevealAttr(value: string): { type: string; mediaQuery?: string } {
  for (const prefix of Object.keys(BREAKPOINT_PREFIXES)) {
    if (value.startsWith(prefix)) {
      return {
        type: value.slice(prefix.length),
        mediaQuery: BREAKPOINT_PREFIXES[prefix],
      };
    }
  }
  return { type: value };
}

/**
 * Scans `root` for `[data-dc-animate]` elements and applies the matching
 * reveal to each one.
 *
 * Breakpoint-scoped reveals (e.g. `d-slide-up`) are wired through
 * `gsap.matchMedia()` so they are created and disposed automatically when
 * the viewport crosses the breakpoint.
 */
export function initAutoReveal(root: ParentNode = document): void {
  const elements = root.querySelectorAll<HTMLElement>(`[${ANIMATE_ATTR}]`);
  if (elements.length === 0) return;

  const mm = gsap.matchMedia();

  elements.forEach((el) => {
    const raw = el.getAttribute(ANIMATE_ATTR);
    if (!raw) return;

    const { type, mediaQuery } = parseRevealAttr(raw.trim());
    const reveal = REVEAL_MAP[type];
    if (!reveal) {
      console.error(
        `[animations] Unknown data-dc-animate value: "${raw}". Available: ${Object.keys(
          REVEAL_MAP
        ).join(', ')} (optionally prefixed with ${Object.keys(BREAKPOINT_PREFIXES).join(', ')}).`,
        el
      );
      return;
    }

    if (mediaQuery) {
      mm.add(mediaQuery, () => {
        reveal(el);
      });
    } else {
      reveal(el);
    }
  });

  // ScrollTrigger reads element positions once at creation.
  // On Webflow pages, images, fonts, sliders and IX2 keep mutating the layout
  // after DOMContentLoaded, so the initial positions are stale and triggers
  // can fail to fire. Refreshing once everything has settled fixes it.
  if (document.readyState === 'complete') {
    ScrollTrigger.refresh();
  } else {
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
}
