import { MARK_VIEWBOX, markPath, projectStars } from '../lib/astro'

const stars = projectStars(MARK_VIEWBOX.width, MARK_VIEWBOX.height, MARK_VIEWBOX.pad)
const path = markPath()

/** Cassiopeia's W — the brand mark, sized for small UI. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${MARK_VIEWBOX.width} ${MARK_VIEWBOX.height}`} aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {stars.map((s) => (
        <circle key={s.name} cx={s.cx} cy={s.cy} r={3.2 + s.brightness * 2.4} fill="currentColor" />
      ))}
    </svg>
  )
}
