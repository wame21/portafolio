import { motion, useScroll, useTransform, type Variants } from 'motion/react'
import { useRef, type MouseEvent } from 'react'
import { site } from '../content'
import { useLang } from '../i18n'
import { distance, duration, springs, stagger } from '../lib/motion'
import { useSmoothScroll } from '../lib/scroll'
import { ArrowDown, ArrowUpRight } from './icons'
import { Planet } from './Planet'

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger.normal, delayChildren: 0.2 } },
}

// Lines rise out of a clipping mask, like type being set.
const rise: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: springs.gentle },
}

const fade: Variants = {
  hidden: { opacity: 0, y: distance.md },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
}

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useLang()
  const { scrollTo } = useSmoothScroll()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const state = ready ? 'visible' : 'hidden'

  const toWork = (e: MouseEvent) => {
    e.preventDefault()
    scrollTo('#work')
  }
  const toAbout = (e: MouseEvent) => {
    e.preventDefault()
    scrollTo('#about')
  }

  return (
    <section id="top" className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero-inner container">
        <motion.div
          className="hero-copy"
          style={{ y: copyY, opacity: copyOpacity }}
          variants={container}
          initial="hidden"
          animate={state}
        >
          <motion.p className="eyebrow" variants={fade}>
            <span className="eyebrow-dot" aria-hidden="true" />
            {t.hero.eyebrow}
          </motion.p>
          <h1 className="hero-title" id="hero-title">
            <span className="line-mask">
              <motion.span className="line" variants={rise}>
                {t.hero.greeting}
              </motion.span>
            </span>
            <span className="line-mask">
              <motion.span className="line accent" variants={rise}>
                {t.hero.name}
              </motion.span>
            </span>
          </h1>
          <motion.p className="hero-lede" variants={fade}>
            {t.hero.lede}
          </motion.p>
          <motion.div className="hero-actions" variants={fade}>
            <a className="btn btn-primary" href="#work" onClick={toWork}>
              {t.hero.primary}
              <ArrowDown />
            </a>
            <a className="btn btn-ghost" href={site.links.github} target="_blank" rel="noreferrer">
              {t.hero.secondary}
              <ArrowUpRight />
            </a>
          </motion.div>
        </motion.div>

        <Planet ready={ready} progress={scrollYProgress} />
      </div>

      <motion.div
        className="hero-foot container"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.2, duration: duration.slow }}
      >
        <p className="coords">
          <span>{t.hero.coords}</span>
          <span className="coords-place">{t.hero.place}</span>
        </p>
        <a href="#about" className="scroll-cue" onClick={toAbout}>
          <span className="scroll-cue-label">{t.hero.scroll}</span>
          <span className="scroll-cue-line" aria-hidden="true" />
        </a>
      </motion.div>
    </section>
  )
}
