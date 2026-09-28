import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect, useId, useMemo, useState, type CSSProperties } from 'react'
import { useLang } from '../../i18n'
import { numberSpring } from '../../lib/motion'

// Illustrative sample for CAELUM's pricing rule:
//   price = (historical cost + packaging) / (1 − target margin)
// with a global per-gram floor that flags prices that are too low.
const SAMPLE = { weight: 12.4, costPerGram: 28, packaging: 35, floorPerGram: 62 }
const BASE = SAMPLE.weight * SAMPLE.costPerGram + SAMPLE.packaging
const FLOOR = SAMPLE.weight * SAMPLE.floorPerGram
const SCALE_MAX = 1300
const MIN_MARGIN = 30
const MAX_MARGIN = 70

export function CaelumVisual() {
  const { t, lang } = useLang()
  const d = t.demos.caelum
  const inputId = useId()
  const [margin, setMargin] = useState(55)

  const price = BASE / (1 - margin / 100)
  const below = price < FLOOR

  const locale = lang === 'es' ? 'es-MX' : 'en-US'
  const money = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }),
    [locale],
  )
  const moneyCents = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }),
    [locale],
  )

  // The price rolls to its new value instead of snapping.
  const animatedPrice = useSpring(price, numberSpring)
  useEffect(() => animatedPrice.set(price), [animatedPrice, price])
  const priceText = useTransform(animatedPrice, (v) => money.format(v))
  const barScale = useTransform(animatedPrice, (v) => Math.min(1, v / SCALE_MAX))

  const fill = ((margin - MIN_MARGIN) / (MAX_MARGIN - MIN_MARGIN)) * 100

  return (
    <div className="demo demo-caelum">
      <header className="demo-head">
        <span className="demo-title">{d.title}</span>
        <span className="demo-sub">{d.sample}</span>
      </header>

      <dl className="demo-kv">
        <div>
          <dt>{d.weight}</dt>
          <dd>{SAMPLE.weight} g</dd>
        </div>
        <div>
          <dt>{d.costPerGram}</dt>
          <dd>{moneyCents.format(SAMPLE.costPerGram)}</dd>
        </div>
        <div>
          <dt>{d.packaging}</dt>
          <dd>{money.format(SAMPLE.packaging)}</dd>
        </div>
      </dl>

      <div className="demo-slider">
        <div className="demo-slider-row">
          <label htmlFor={inputId}>{d.margin}</label>
          <output htmlFor={inputId}>{margin}%</output>
        </div>
        <input
          id={inputId}
          type="range"
          min={MIN_MARGIN}
          max={MAX_MARGIN}
          step={1}
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
          style={{ '--fill': `${fill}%` } as CSSProperties}
        />
      </div>

      <div className="price-bar" aria-hidden="true">
        <motion.span className="price-bar-fill" data-below={below} style={{ scaleX: barScale }} />
        <span className="price-bar-cost" style={{ transform: `scaleX(${BASE / SCALE_MAX})` }} />
        <span className="price-bar-floor" style={{ left: `${(FLOOR / SCALE_MAX) * 100}%` }}>
          <span>{d.floor}</span>
        </span>
      </div>

      <div className="demo-result">
        <span className="demo-result-label">{d.suggested}</span>
        <motion.span className="demo-result-value">{priceText}</motion.span>
      </div>

      <p className={`demo-status ${below ? 'is-warn' : 'is-ok'}`} role="status">
        <span className="status-dot" aria-hidden="true" />
        {below ? d.belowFloor : d.ok}
      </p>
      <p className="demo-formula">{d.formula}</p>
    </div>
  )
}
