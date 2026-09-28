import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useRef } from 'react'
import { useLang } from '../i18n'
import { duration, ease, follow, springs } from '../lib/motion'

// Ring radii in the ring SVG's viewBox (-100..100); the planet's radius is 50.
const RINGS = [
  { rx: 61, width: 1.6, opacity: 0.12 },
  { rx: 67, width: 6, opacity: 0.24 },
  { rx: 74.5, width: 5, opacity: 0.34 },
  { rx: 80.5, width: 1, opacity: 0.08 },
  { rx: 86, width: 5.5, opacity: 0.2 },
  { rx: 92.5, width: 1.4, opacity: 0.12 },
]
const RING_TILT = 0.2
const MOON_PERIOD = 22

function Rings({ half }: { half: 'back' | 'front' }) {
  const clipId = `ring-clip-${half}`
  return (
    <svg className={`ring ring-${half}`} viewBox="-100 -100 200 200" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x={-100} y={half === 'back' ? -100 : 0} width={200} height={100} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {RINGS.map((r) => (
          <ellipse
            key={r.rx}
            rx={r.rx}
            ry={r.rx * RING_TILT}
            fill="none"
            stroke={`rgba(226, 196, 160, ${r.opacity})`}
            strokeWidth={r.width}
          />
        ))}
      </g>
    </svg>
  )
}

interface PlanetProps {
  ready: boolean
  /** Hero scroll progress (0 at top, 1 once the hero has scrolled away). */
  progress: MotionValue<number>
}

export function Planet({ ready, progress }: PlanetProps) {
  const { t } = useLang()
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  // Direction of the light, as a vector from the planet's centre (-1..1).
  const lightDirX = useMotionValue(-0.62)
  const lightDirY = useMotionValue(-0.48)
  const sx = useSpring(lightDirX, follow)
  const sy = useSpring(lightDirY, follow)

  const lightX = useTransform(sx, (v) => 50 + v * 36)
  const lightY = useTransform(sy, (v) => 50 + v * 36)
  const shade = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 234, 206, 0.5) 0%, rgba(255, 212, 170, 0.14) 20%, rgba(5, 6, 11, 0) 40%, rgba(5, 6, 11, 0.6) 60%, rgba(3, 4, 8, 0.97) 82%)`
  const moonShade = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, #efe9df 0%, #b9b3aa 30%, #3a3a40 62%, #0b0c11 85%)`

  const glowX = useTransform(sx, (v) => v * 28)
  const glowY = useTransform(sy, (v) => v * 28)
  const glow = useMotionTemplate`${glowX}px ${glowY}px 130px -34px rgba(227, 183, 123, 0.38)`

  // The whole system leans gently toward the light.
  const rotateY = useTransform(sx, [-1, 1], [-9, 9])
  const rotateX = useTransform(sy, [-1, 1], [7, -7])

  // Scroll: drift down and recede as the hero leaves.
  const y = useTransform(progress, [0, 1], [0, 180])
  const scale = useTransform(progress, [0, 1], [1, 0.82])
  const opacity = useTransform(progress, [0, 0.85], [1, 0.15])

  // The moon orbits in the ring plane and passes behind the planet.
  const angle = useMotionValue(0.7)
  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return
    angle.set(angle.get() + (Math.min(delta, 64) / 1000) * ((Math.PI * 2) / MOON_PERIOD))
  })
  const moonX = useTransform(angle, (a) => `${Math.cos(a) * 58}%`)
  const moonY = useTransform(angle, (a) => `${Math.sin(a) * 58 * RING_TILT * 1.4}%`)
  const moonZ = useTransform(angle, (a) => (Math.sin(a) > 0 ? 4 : 0))
  const moonScale = useTransform(angle, (a) => 0.86 + 0.14 * Math.sin(a))

  useEffect(() => {
    if (reduce) return
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    if (finePointer) {
      const onMove = (e: PointerEvent) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        const dx = e.clientX - (rect.left + rect.width / 2)
        const dy = e.clientY - (rect.top + rect.height / 2)
        const len = Math.hypot(dx, dy) || 1
        // Far pointer → light at the limb; near pointer → light closer to centre.
        const reach = 0.35 + 0.65 * Math.min(1, len / (rect.width * 0.8))
        lightDirX.set((dx / len) * reach)
        lightDirY.set((dy / len) * reach)
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      return () => window.removeEventListener('pointermove', onMove)
    }

    // Touch screens have no cursor: let the sun drift slowly around instead.
    const controls = animate(0, Math.PI * 2, {
      duration: 28,
      ease: 'linear',
      repeat: Infinity,
      onUpdate: (a) => {
        lightDirX.set(Math.cos(a - 2.3) * 0.75)
        lightDirY.set(Math.sin(a - 2.3) * 0.55 - 0.15)
      },
    })
    return () => controls.stop()
  }, [reduce, lightDirX, lightDirY])

  return (
    <motion.div className="planet-wrap" ref={ref} style={{ y, scale, opacity }} aria-hidden="true">
      <motion.div
        className="planet-materialize"
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(18px)' }}
        animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : undefined}
        transition={{
          ...springs.gentle,
          delay: 0.35,
          filter: { duration: duration.crawl * 1.2, ease: ease.out, delay: 0.35 },
          opacity: { duration: duration.crawl, ease: ease.out, delay: 0.35 },
        }}
      >
        <motion.div className="planet-tilt" style={{ rotateX, rotateY }}>
          <div className="planet-system">
            <Rings half="back" />
            <motion.div className="planet" style={{ boxShadow: glow }}>
              <div className="planet-surface" />
              <div className="planet-storm" />
              <motion.div className="planet-shade" style={{ background: shade }} />
            </motion.div>
            <Rings half="front" />
            <motion.div className="moon-orbit" style={{ x: moonX, y: moonY, zIndex: moonZ }}>
              <motion.div className="moon" style={{ scale: moonScale, background: moonShade }} />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <motion.p
        className="sun-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.6, duration: duration.slow }}
      >
        <span className="sun-dot" /> {t.hero.sunHint}
      </motion.p>
    </motion.div>
  )
}
