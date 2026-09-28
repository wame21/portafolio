import { motion, useScroll, useSpring, type Variants } from 'motion/react'
import { useRef } from 'react'
import type { Content } from '../content'
import { useLang } from '../i18n'
import { follow, springs } from '../lib/motion'
import { SectionHeading } from './Reveal'

type Item = Content['journey']['items'][number]

const node: Variants = {
  hidden: { scale: 0.4, opacity: 0.25 },
  visible: { scale: 1, opacity: 1, transition: springs.momentum },
}

const card: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: springs.gentle },
}

function TimelineItem({ item }: { item: Item }) {
  return (
    <motion.li
      className="timeline-item"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -30% 0px' }}
    >
      <motion.span className="timeline-node" variants={node} aria-hidden="true" />
      <motion.div className="timeline-card" variants={card}>
        <div className="timeline-meta">
          <span className="pill">{item.type}</span>
          <span className="timeline-period">{item.period}</span>
        </div>
        <h3 className="timeline-title">{item.title}</h3>
        <p className="timeline-org">{item.org}</p>
        <p className="timeline-text">{item.text}</p>
      </motion.div>
    </motion.li>
  )
}

export function Journey() {
  const { t } = useLang()
  const ref = useRef<HTMLOListElement>(null)
  // The track fills like a light trail as you read down the timeline.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, follow)

  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <div className="container journey-grid">
        <div className="journey-intro">
          <SectionHeading kicker={t.journey.kicker} title={t.journey.title} id="journey-title" />
        </div>
        <div className="timeline">
          <div className="timeline-track" aria-hidden="true">
            <motion.div className="timeline-fill" style={{ scaleY: fill }} />
          </div>
          <ol ref={ref} className="timeline-list">
            {t.journey.items.map((item) => (
              <TimelineItem key={item.title} item={item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
