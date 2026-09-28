import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '../../i18n'
import { duration, ease, springs } from '../../lib/motion'
import { CoffeeBean, Sparkle } from '../icons'

// Leal Café's flow in miniature: every paid coffee walks through the
// PaymentIntent steps and only then earns a stamp. Eight stamps, one reward.

const TOTAL = 8
const STEP_MS = 480
const DONE_HOLD_MS = 900
// Fixed, hand-picked tilts so the stamps look pressed by hand.
const TILTS = [-8, 6, -3, 10, -11, 4, -6, 9]
const BURST = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2)

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

export function LealVisual() {
  const { t } = useLang()
  const d = t.demos.leal
  const reduce = useReducedMotion() ?? false
  const [stamps, setStamps] = useState(5)
  const [step, setStep] = useState(-1)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const stepCount = d.steps.length
  const busy = step >= 0 && step < stepCount
  const complete = stamps >= TOTAL

  async function buy() {
    if (busy) return
    if (complete) {
      setStamps(0)
      return
    }
    // A stamp is only granted after the payment is confirmed.
    for (let i = 0; i < stepCount; i++) {
      setStep(i)
      await sleep(reduce ? 120 : STEP_MS)
      if (!alive.current) return
    }
    setStamps((s) => Math.min(TOTAL, s + 1))
    setStep(stepCount)
    await sleep(DONE_HOLD_MS)
    if (alive.current) setStep(-1)
  }

  return (
    <div className="demo demo-leal">
      <div className={`loyalty-card${complete ? ' is-complete' : ''}`}>
        <div className="loyalty-head">
          <div>
            <p className="loyalty-brand">Leal Café</p>
            <p className="loyalty-sub">{d.card}</p>
          </div>
          <p className="loyalty-count">
            <span>{stamps}</span>/{TOTAL} {d.stamps}
          </p>
        </div>

        <ol className="stamp-grid">
          {Array.from({ length: TOTAL }, (_, i) => (
            <li key={i} className="stamp-slot">
              <AnimatePresence>
                {i < stamps && (
                  <motion.span
                    key="stamp"
                    className="stamp"
                    initial={{ scale: 1.9, opacity: 0, rotate: TILTS[i] - 24 }}
                    animate={{ scale: 1, opacity: 1, rotate: TILTS[i] }}
                    exit={{ scale: 0.6, opacity: 0, transition: { duration: duration.fast } }}
                    transition={springs.momentum}
                  >
                    <CoffeeBean />
                  </motion.span>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ol>

        <AnimatePresence>
          {complete && (
            <motion.div
              key="reward"
              className="reward"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={springs.snappy}
            >
              <span className="reward-burst" aria-hidden="true">
                {BURST.map((a, i) => (
                  <motion.span
                    key={i}
                    className="reward-spark"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                    animate={{ x: Math.cos(a) * 64, y: Math.sin(a) * 40, opacity: 0, scale: 1 }}
                    transition={{ duration: duration.crawl, ease: ease.out }}
                  >
                    <Sparkle />
                  </motion.span>
                ))}
              </span>
              <Sparkle className="reward-icon" />
              {d.reward}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ol className="pay-steps">
        {d.steps.map((label, i) => (
          <li
            key={label}
            className={`pay-step${step === i ? ' is-active' : ''}${step > i ? ' is-done' : ''}`}
            aria-current={step === i ? 'step' : undefined}
          >
            <span className="pay-dot" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ol>

      <button type="button" className="btn btn-accent" onClick={buy} disabled={busy} aria-busy={busy}>
        {busy ? (
          d.processing
        ) : complete ? (
          d.reset
        ) : (
          <>
            {d.buy}
            <span className="btn-price">{d.price}</span>
          </>
        )}
      </button>
    </div>
  )
}
