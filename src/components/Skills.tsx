import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useLang } from '../i18n'
import { duration, springs, stagger } from '../lib/motion'
import { SectionHeading } from './Reveal'

// An orrery: one planet per skill group. Outer planets move slower, roughly
// following Kepler's third law (ω ∝ r^-1.5).
const ORBITS = [70, 102, 134, 166, 198, 230]
const COLORS = ['#d9a66f', '#7cc4ae', '#9fb0e6', '#c9cedb', '#d99590', '#b8a2dc']
const SIZES = [9, 10.5, 9.5, 11, 8.5, 10]
const START = [0.4, 2.3, 4.1, 1.2, 3.3, 5.4]
const TILT = 0.44
const BASE_SPEED = 0.42

interface PlanetProps {
  index: number
  time: MotionValue<number>
  active: boolean
  label: string
  onSelect: () => void
}

function OrreryPlanet({ index, time, active, label, onSelect }: PlanetProps) {
  const r = ORBITS[index]
  const speed = BASE_SPEED * Math.pow(ORBITS[0] / r, 1.5)
  const x = useTransform(time, (tt) => Math.cos(START[index] + tt * speed) * r)
  const y = useTransform(time, (tt) => Math.sin(START[index] + tt * speed) * r * TILT)
  // Planets on the near side of the orbit read slightly larger.
  const depth = useTransform(y, (v) => 0.84 + 0.16 * ((v / (r * TILT) + 1) / 2))
  const size = SIZES[index]

  return (
    <motion.g className={`orrery-planet${active ? ' is-active' : ''}`} style={{ x, y }} onClick={onSelect}>
      <circle r={size + 12} className="orrery-hit" />
      {active && (
        <motion.circle
          r={size + 7}
          className="orrery-ring"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springs.momentum}
          style={{ stroke: COLORS[index] }}
        />
      )}
      <motion.g style={{ scale: depth }}>
        <circle r={size} fill={COLORS[index]} />
        <circle r={size} fill="url(#planet-shine)" />
      </motion.g>
      {active && (
        <motion.text
          className="orrery-label"
          y={-size - 13}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.normal }}
        >
          {label}
        </motion.text>
      )}
    </motion.g>
  )
}

export function Skills() {
  const { t } = useLang()
  const groups = t.skills.groups
  const reduce = useReducedMotion() ?? false
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const orreryRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const inView = useInView(orreryRef)

  // Orbits pause while the pointer is over them, so planets are easy to click.
  const time = useMotionValue(0)
  useAnimationFrame((_, delta) => {
    if (reduce || !inView || hovering) return
    time.set(time.get() + Math.min(delta, 64) / 1000)
  })

  const select = (i: number, focus = false) => {
    const next = (i + groups.length) % groups.length
    setActive(next)
    if (focus) tabRefs.current[next]?.focus()
  }

  // Standard tablist keyboard model: arrows move, Home/End jump.
  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: groups.length - 1,
    }
    if (e.key in keys) {
      e.preventDefault()
      select(keys[e.key], true)
    }
  }

  const current = groups[active]

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading kicker={t.skills.kicker} title={t.skills.title} id="skills-title" />

        <div className="skills-grid">
          <div
            className="orrery"
            ref={orreryRef}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            aria-hidden="true"
          >
            <svg viewBox="-260 -140 520 280">
              <defs>
                <radialGradient id="sun-glow">
                  <stop offset="0" stopColor="#ffe6c4" stopOpacity="0.9" />
                  <stop offset="0.25" stopColor="#f2c48f" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#f2c48f" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="planet-shine" cx="0.35" cy="0.32" r="0.75">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
                  <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.55" />
                </radialGradient>
              </defs>
              {ORBITS.map((r, i) => (
                <ellipse
                  key={r}
                  rx={r}
                  ry={r * TILT}
                  className={`orbit${i === active ? ' is-active' : ''}`}
                  style={{ '--planet': COLORS[i] } as CSSProperties}
                />
              ))}
              <circle r={44} fill="url(#sun-glow)" />
              <circle r={6.5} className="orrery-sun" />
              {groups.map((g, i) => (
                <OrreryPlanet
                  key={g.id}
                  index={i}
                  time={time}
                  active={i === active}
                  label={g.name}
                  onSelect={() => select(i)}
                />
              ))}
            </svg>
            <p className="orrery-hint">{t.skills.hint}</p>
          </div>

          <div className="skills-panel">
            <div className="skill-tabs" role="tablist" aria-label={t.skills.kicker} onKeyDown={onKeyDown}>
              {groups.map((g, i) => (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`skill-tab-${g.id}`}
                  aria-selected={i === active}
                  aria-controls="skill-panel"
                  tabIndex={i === active ? 0 : -1}
                  className="skill-tab"
                  style={{ '--planet': COLORS[i] } as CSSProperties}
                  onClick={() => select(i)}
                >
                  {i === active && <motion.span layoutId="skill-pill" className="skill-pill" transition={springs.snappy} />}
                  <span className="skill-dot" aria-hidden="true" />
                  <span className="skill-tab-label">{g.name}</span>
                </button>
              ))}
            </div>

            <div
              className="skill-panel"
              id="skill-panel"
              role="tabpanel"
              aria-labelledby={`skill-tab-${current.id}`}
              style={{ '--planet': COLORS[active] } as CSSProperties}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={current.id}
                  className="skill-list"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{ visible: { transition: { staggerChildren: stagger.tight } } }}
                >
                  {current.items.map((item) => (
                    <motion.li
                      key={item}
                      className="skill-item"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: springs.snappy },
                        exit: { opacity: 0, transition: { duration: duration.fast } },
                      }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>

            <div className="skills-extra">
              <div>
                <p className="mini-label">{t.skills.languages}</p>
                <ul className="chips">
                  {t.skills.languageList.map((l) => (
                    <li key={l} className="chip">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mini-label">{t.skills.tools}</p>
                <ul className="chips">
                  {t.skills.toolList.map((l) => (
                    <li key={l} className="chip">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
