// A little real astronomy for the page.

export interface ConstellationStar {
  name: string
  x: number
  y: number
  magnitude: number
}

// Cassiopeia's five bright stars, projected from their real RA/Dec and rotated
// so Segin and Caph sit level (the W turns around Polaris all night anyway).
// Coordinates are normalised to 0..1; the drawing order traces the W.
export const cassiopeia: ConstellationStar[] = [
  { name: 'Segin', x: 0, y: 0, magnitude: 3.37 },
  { name: 'Ruchbah', x: 0.322, y: 0.558, magnitude: 2.68 },
  { name: 'Navi', x: 0.559, y: 0.11, magnitude: 2.15 },
  { name: 'Schedar', x: 0.796, y: 1, magnitude: 2.24 },
  { name: 'Caph', x: 1, y: 0, magnitude: 2.28 },
]

/**
 * Maps normalised constellation coordinates into an SVG viewBox.
 * `brightness` runs 0..1 (dimmest → brightest) so each renderer can size stars
 * for its own scale.
 */
export function projectStars(width: number, height: number, pad: number) {
  return cassiopeia.map((s) => ({
    ...s,
    cx: pad + s.x * (width - pad * 2),
    cy: pad + s.y * (height - pad * 2),
    brightness: (3.6 - s.magnitude) / 1.45,
  }))
}

export const MARK_VIEWBOX = { width: 100, height: 46, pad: 5 }

export function markPath() {
  const stars = projectStars(MARK_VIEWBOX.width, MARK_VIEWBOX.height, MARK_VIEWBOX.pad)
  return 'M ' + stars.map((s) => `${s.cx.toFixed(2)} ${s.cy.toFixed(2)}`).join(' L ')
}

const SYNODIC_MONTH = 29.530588853
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14)
const DAY_MS = 86_400_000

export interface MoonPhase {
  /** 0 = new, 0.5 = full, → 1 = new again */
  phase: number
  /** 0..1 fraction of the disc that is lit */
  illumination: number
  /** 0..7 index into the eight named phases */
  index: number
}

export function moonPhase(date = new Date()): MoonPhase {
  const days = (date.getTime() - REFERENCE_NEW_MOON) / DAY_MS
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH
  const phase = age / SYNODIC_MONTH
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2
  const index = Math.floor(phase * 8 + 0.5) % 8
  return { phase, illumination, index }
}

/**
 * SVG path for the lit part of the moon as seen from the northern hemisphere:
 * the bright limb is one half-circle, the terminator is a half-ellipse whose
 * width follows the phase.
 */
export function moonLitPath(phase: number, cx: number, cy: number, r: number) {
  const k = Math.cos(2 * Math.PI * phase)
  const waxing = phase < 0.5
  const limbSweep = waxing ? 1 : 0
  const terminatorSweep = waxing ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0
  const rx = Math.abs(k) * r
  return [
    `M ${cx} ${cy - r}`,
    `A ${r} ${r} 0 0 ${limbSweep} ${cx} ${cy + r}`,
    `A ${rx} ${r} 0 0 ${terminatorSweep} ${cx} ${cy - r}`,
    'Z',
  ].join(' ')
}
