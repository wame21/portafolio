import { motion, type Variants } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { distance, springs, stagger } from '../lib/motion'

// Scroll-reveal primitives. Everything reveals once — replaying on scroll-out
// is noise, not information.

const viewport = { once: true, margin: '0px 0px -12% 0px' }

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger.normal } },
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: distance.lg },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
}

const rise: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: springs.gentle },
}

interface RevealProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Reveal({ children, className, style }: RevealProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={revealItem}
    >
      {children}
    </motion.div>
  )
}

type GroupTag = 'div' | 'ul' | 'ol' | 'dl'

export function RevealGroup({ as = 'div', children, className }: RevealProps & { as?: GroupTag }) {
  const Component = motion[as] as typeof motion.div
  return (
    <Component className={className} initial="hidden" whileInView="visible" viewport={viewport} variants={group}>
      {children}
    </Component>
  )
}

export function RevealItem({ as = 'div', children, className }: RevealProps & { as?: 'div' | 'li' }) {
  const Component = motion[as] as typeof motion.div
  return (
    <Component className={className} variants={revealItem}>
      {children}
    </Component>
  )
}

interface SectionHeadingProps {
  kicker: string
  /** Title parts; the second one is set in the accent italic. */
  title: string[]
  id?: string
}

export function SectionHeading({ kicker, title, id }: SectionHeadingProps) {
  return (
    <RevealGroup className="section-heading">
      <RevealItem className="kicker">
        <span className="kicker-star" aria-hidden="true">
          ✦
        </span>
        {kicker}
      </RevealItem>
      <h2 className="section-title" id={id}>
        {title.map((part, i) => (
          <span className="line-mask" key={i}>
            <motion.span className={`line${i === 1 ? ' accent' : ''}`} variants={rise}>
              {part}
            </motion.span>
          </span>
        ))}
      </h2>
    </RevealGroup>
  )
}
