import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { useLang } from '../i18n'
import { RevealGroup, RevealItem } from './Reveal'

interface Token {
  text: string
  emphasis: boolean
}

/** Splits the statement into words; `*like this*` marks an emphasised run. */
function tokenize(statement: string): Token[] {
  let emphasis = false
  return statement.split(' ').map((raw) => {
    let text = raw
    const opens = text.startsWith('*')
    if (opens) text = text.slice(1)
    const closes = text.endsWith('*')
    if (closes) text = text.slice(0, -1)
    if (opens) emphasis = true
    const token = { text, emphasis }
    if (closes) emphasis = false
    return token
  })
}

function Word({ token, progress, range }: { token: Token; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <>
      <motion.span className={token.emphasis ? 'word is-em' : 'word'} style={{ opacity }}>
        {token.text}
      </motion.span>{' '}
    </>
  )
}

export function About() {
  const { t } = useLang()
  const ref = useRef<HTMLParagraphElement>(null)
  // Words light up one after another as the paragraph crosses the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const tokens = tokenize(t.about.statement)

  return (
    <section id="about" className="section about" aria-label={t.about.kicker}>
      <div className="container">
        <RevealGroup>
          <RevealItem className="kicker">
            <span className="kicker-star" aria-hidden="true">
              ✦
            </span>
            {t.about.kicker}
          </RevealItem>
        </RevealGroup>
        <p ref={ref} className="about-statement">
          {tokens.map((token, i) => (
            <Word
              key={i}
              token={token}
              progress={scrollYProgress}
              range={[i / tokens.length, (i + 1) / tokens.length]}
            />
          ))}
        </p>
        <RevealGroup as="dl" className="about-facts">
          {t.about.facts.map((fact) => (
            <RevealItem key={fact.label} className="fact">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
