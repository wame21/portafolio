import { motion, useAnimate, usePresence, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { useLang } from '../i18n'
import { MARK_VIEWBOX, markPath, projectStars } from '../lib/astro'
import { duration, ease, springs, stagger } from '../lib/motion'

const { width: W, height: H, pad: PAD } = MARK_VIEWBOX
const stars = projectStars(W, H, PAD)
const path = markPath()

// Seconds. Stars ignite one by one, then the W is traced, then the name appears.
const T = {
  starsAt: 0.35,
  starGap: 0.2,
  lineAt: 1.3,
  lineFor: 1.1,
  titleAt: 1.75,
  // Everything is drawn by ~2.9s; hold the finished sky for a beat before leaving.
  minimum: 4.4,
  minimumReduced: 0.9,
  // How far into the flight the nav mark takes over from the big constellation.
  handoff: 0.6,
}

const sleep = (s: number) => new Promise((resolve) => window.setTimeout(resolve, s * 1000))

interface LoaderProps {
  /** The intro has played (or was skipped): reveal the page. */
  onDone: () => void
  /** The constellation has reached the nav: show the small brand mark there. */
  onLanded: () => void
}

export function Loader({ onDone, onLanded }: LoaderProps) {
  const { t } = useLang()
  const reduce = useReducedMotion() ?? false
  const minimum = reduce ? T.minimumReduced : T.minimum
  const [isPresent, safeToRemove] = usePresence()
  const [scope, animate] = useAnimate<HTMLDivElement>()

  useEffect(() => {
    let cancelled = false
    const finish = () => {
      if (!cancelled) onDone()
    }
    let timer = 0
    const elapsed = new Promise<void>((resolve) => {
      timer = window.setTimeout(resolve, minimum * 1000)
    })
    // Wait for the display fonts so the hero never flashes a fallback face.
    Promise.all([elapsed, document.fonts.ready]).then(finish)

    // Any key or tap skips straight in — never hold the user hostage.
    window.addEventListener('keydown', finish)
    window.addEventListener('pointerdown', finish)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
    }
  }, [onDone, minimum])

  // Exit: the page becomes interactive immediately, the sky clears, and the
  // constellation flies into the nav where it becomes the brand mark (FLIP:
  // measure both boxes, animate the transform between them).
  useEffect(() => {
    if (isPresent) return
    const root = scope.current
    root.style.pointerEvents = 'none'

    const exit = async () => {
      animate('.loader-chrome', { opacity: 0 }, { duration: duration.fast, ease: ease.out })
      const clearSky = animate('.loader-backdrop', { opacity: 0 }, { duration: duration.slow * 1.5, ease: ease.smooth })

      const stage = root.querySelector('.loader-stage')
      const target = document.querySelector('.nav-mark')
      const from = stage?.getBoundingClientRect()
      const to = target?.getBoundingClientRect()

      if (!reduce && stage && from?.width && to?.width) {
        const flight = animate(
          stage,
          {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: to.width / from.width,
          },
          springs.travel,
        )
        await sleep(springs.travel.visualDuration * T.handoff)
        onLanded()
        await animate(stage, { opacity: 0 }, { duration: duration.normal, ease: ease.out })
        flight.stop()
      } else {
        onLanded()
        await animate(root, { opacity: 0 }, { duration: duration.normal })
      }
      await clearSky
      safeToRemove?.()
    }
    exit()
  }, [isPresent, animate, scope, reduce, onLanded, safeToRemove])

  const at = (i: number) => (reduce ? 0 : T.starsAt + i * T.starGap)

  return (
    <div ref={scope} className="loader" role="status" aria-label={t.loader.loading}>
      <div className="loader-backdrop" aria-hidden="true" />

      <div className="loader-stage">
        <svg className="loader-mark" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <defs>
            <filter id="loader-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="1.3" />
            </filter>
          </defs>
          <motion.path
            d={path}
            className="loader-line"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { delay: T.lineAt, duration: T.lineFor, ease: ease.inOut },
              opacity: { delay: T.lineAt, duration: duration.fast },
            }}
          />
          {stars.map((s, i) => (
            <g key={s.name}>
              <motion.circle
                className="loader-halo"
                cx={s.cx}
                cy={s.cy}
                r={1.8 + s.brightness * 2.4}
                filter="url(#loader-glow)"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: at(i) + 0.1, duration: duration.crawl }}
              />
              <motion.circle
                className="loader-star"
                cx={s.cx}
                cy={s.cy}
                r={0.6 + s.brightness * 0.8}
                initial={reduce ? false : { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...springs.momentum, delay: at(i) }}
              />
            </g>
          ))}
        </svg>

        {stars.map((s, i) => (
          <motion.span
            key={s.name}
            className={`loader-label loader-chrome${s.y < 0.5 ? ' is-above' : ''}`}
            style={{ left: `${(s.cx / W) * 100}%`, top: `${(s.cy / H) * 100}%` }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: at(i) + 0.15, duration: duration.slow }}
          >
            {t.loader.stars[i]}
          </motion.span>
        ))}
      </div>

      <div className="loader-text loader-chrome">
        <motion.p
          className="loader-title"
          aria-hidden="true"
          initial={reduce ? false : 'hidden'}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: stagger.tight, delayChildren: T.titleAt } } }}
        >
          {Array.from(t.loader.constellation).map((ch, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, filter: 'blur(8px)' },
                visible: {
                  opacity: 1,
                  filter: 'blur(0px)',
                  transition: { duration: duration.slow, ease: ease.out },
                },
              }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.p>
        <motion.p
          className="loader-caption"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: T.titleAt + 0.5, duration: duration.slow }}
        >
          {t.loader.caption}
        </motion.p>
      </div>

      <div className="loader-progress loader-chrome" aria-hidden="true">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: minimum, ease: ease.inOut }}
        />
      </div>
      <p className="loader-skip loader-chrome">{t.loader.skip}</p>
    </div>
  )
}
