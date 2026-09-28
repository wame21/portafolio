import type { Transition } from 'motion/react'

// Motion tokens. Every duration, easing and spring in the app comes from here.

type Bezier = [number, number, number, number]

export const ease = {
  smooth: [0.22, 1, 0.36, 1] as Bezier,
  out: [0.16, 1, 0.3, 1] as Bezier,
  inOut: [0.65, 0, 0.35, 1] as Bezier,
}

export const duration = {
  instant: 0.08,
  fast: 0.18,
  normal: 0.35,
  slow: 0.6,
  crawl: 1,
}

export const distance = { xs: 4, sm: 8, md: 16, lg: 24, xl: 48 }

export const scale = { subtle: 0.98, press: 0.96, pop: 1.03 }

export const stagger = { tight: 0.05, normal: 0.07, loose: 0.1 }

// Springs expressed the way Apple tunes them: `bounce` ≈ 1 − damping ratio and
// `visualDuration` ≈ response. Critically damped (bounce 0) is the default;
// overshoot is reserved for moments where the user's gesture carried momentum.
export const springs = {
  snappy: { type: 'spring', bounce: 0, visualDuration: 0.3 },
  gentle: { type: 'spring', bounce: 0, visualDuration: 0.6 },
  sheet: { type: 'spring', bounce: 0.15, visualDuration: 0.35 },
  momentum: { type: 'spring', bounce: 0.35, visualDuration: 0.45 },
  // Long, calm reposition: the loader constellation travelling into the nav.
  travel: { type: 'spring', bounce: 0, visualDuration: 1.1 },
} as const satisfies Record<string, Transition>

// Physical spring for values that chase continuous input (pointer, scroll).
export const follow = { stiffness: 70, damping: 18, mass: 0.9 }

// Critically damped spring for numbers that roll to a new value (prices, counters).
export const numberSpring = { stiffness: 260, damping: 32 }
