import { useEffect, useState, type MouseEvent } from 'react'
import { site } from '../content'
import { useLang } from '../i18n'
import { moonLitPath, moonPhase } from '../lib/astro'
import { useSmoothScroll } from '../lib/scroll'
import { BrandMark } from './BrandMark'

function MoonGlyph({ phase }: { phase: number }) {
  return (
    <svg className="moon-glyph" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx={10} cy={10} r={8} className="moon-dark" />
      <path d={moonLitPath(phase, 10, 10, 8)} className="moon-lit" />
    </svg>
  )
}

export function Footer() {
  const { t, lang } = useLang()
  const { scrollTo } = useSmoothScroll()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 20_000)
    return () => window.clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: site.timeZone,
  }).format(now)
  const moon = moonPhase(now)

  const toTop = (e: MouseEvent) => {
    e.preventDefault()
    scrollTo(0)
  }

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <BrandMark className="footer-mark" />
          <span>
            © {now.getFullYear()} {site.name}
          </span>
        </div>
        <p className="footer-made">{t.footer.madeIn}</p>
        <dl className="footer-sky">
          <div>
            <dt>{t.footer.localTime}</dt>
            <dd>
              <time>{time}</time>
            </dd>
          </div>
          <div>
            <dt>{t.footer.moon}</dt>
            <dd className="footer-moon">
              <MoonGlyph phase={moon.phase} />
              {t.footer.phases[moon.index]} · {Math.round(moon.illumination * 100)}%
            </dd>
          </div>
        </dl>
        <a href="#top" className="footer-top" onClick={toTop}>
          {t.footer.top} ↑
        </a>
      </div>
    </footer>
  )
}
