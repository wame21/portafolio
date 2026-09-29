import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import type { Lang } from '../content'
import { useLang } from '../i18n'
import { duration, ease, springs, stagger } from '../lib/motion'
import { useSmoothScroll } from '../lib/scroll'
import { BrandMark } from './BrandMark'

const SECTIONS = ['skills', 'work', 'journey', 'contact'] as const
type SectionId = (typeof SECTIONS)[number]

/** Which section sits in the middle band of the viewport right now. */
function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId
          if (entry.isIntersecting) setActive(id)
          else setActive((prev) => (prev === id ? null : prev))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return active
}

function LangToggle() {
  const { lang, setLang, t } = useLang()
  const options: Lang[] = ['es', 'en']
  return (
    <div className="lang-toggle" role="group" aria-label={t.nav.language}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="lang-btn"
          aria-pressed={lang === option}
          onClick={() => setLang(option)}
        >
          {lang === option && <motion.span layoutId="lang-thumb" className="lang-thumb" transition={springs.snappy} />}
          <span className="lang-label">{option.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}

const MOBILE_QUERY = '(max-width: 820px)'

interface NavProps {
  ready: boolean
  /** The loader's constellation has arrived; show the brand mark. */
  markVisible: boolean
}

export function Nav({ ready, markVisible }: NavProps) {
  const { t } = useLang()
  const { scrollTo, setLocked } = useSmoothScroll()
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  // Where to scroll once the sheet has closed and released the scroll lock.
  const pendingTarget = useRef<string | number | null>(null)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  // The open sheet owns the screen: lock scroll, trap Escape, move focus in,
  // and give focus back to the button that opened it.
  useEffect(() => {
    if (!open) return
    setLocked(true)
    sheetRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const media = window.matchMedia(MOBILE_QUERY)
    const onMedia = () => {
      if (!media.matches) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    media.addEventListener('change', onMedia)
    const button = menuButtonRef.current
    return () => {
      setLocked(false)
      window.removeEventListener('keydown', onKey)
      media.removeEventListener('change', onMedia)
      button?.focus({ preventScroll: true })
      if (pendingTarget.current !== null) {
        scrollTo(pendingTarget.current)
        pendingTarget.current = null
      }
    }
  }, [open, setLocked, scrollTo])

  // Scrolling is locked while the sheet is open, so defer until it closes.
  const navigate = (target: string | number) => {
    if (open) {
      pendingTarget.current = target
      setOpen(false)
    } else {
      scrollTo(target)
    }
  }

  const go = (id: SectionId) => (e: MouseEvent) => {
    e.preventDefault()
    navigate(`#${id}`)
    history.replaceState(null, '', `#${id}`)
  }

  const goTop = (e: MouseEvent) => {
    e.preventDefault()
    navigate(0)
    history.replaceState(null, '', location.pathname)
  }

  const appear = {
    initial: { opacity: 0 },
    animate: { opacity: ready ? 1 : 0 },
    transition: { duration: duration.slow, ease: ease.smooth, delay: 0.35 },
  }

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav-bar">
        <motion.div className="nav-glass" aria-hidden="true" {...appear} />

        <a href="#top" className="nav-brand" onClick={goTop}>
          <motion.span
            className="nav-mark-slot"
            initial={{ opacity: 0 }}
            animate={{ opacity: markVisible ? 1 : 0 }}
            transition={{ duration: duration.normal, ease: ease.out }}
          >
            <BrandMark className="nav-mark" />
          </motion.span>
          <motion.span className="nav-name" {...appear}>
            Wilver Meraz
          </motion.span>
        </a>

        <motion.nav className="nav-right" aria-label={t.nav.menu} {...appear}>
          <ul className="nav-links">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`nav-link${active === id ? ' is-active' : ''}`}
                  aria-current={active === id ? 'true' : undefined}
                  onClick={go(id)}
                >
                  {active === id && <motion.span layoutId="nav-pill" className="nav-pill" transition={springs.snappy} />}
                  <span className="nav-link-label">{t.nav[id]}</span>
                </a>
              </li>
            ))}
          </ul>
          <LangToggle />
          <a href="#contact" className="nav-cta" onClick={go('contact')}>
            {t.nav.cta}
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="nav-menu-btn"
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? t.nav.close : t.nav.menu}</span>
            <span className="burger" data-open={open} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </motion.nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            className="nav-scrim"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.normal }}
          />
        )}
        {open && (
          <motion.div
            key="sheet"
            id="nav-sheet"
            ref={sheetRef}
            className="nav-sheet"
            initial={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(10px)' }}
            // Drop the filter once settled: a lingering filter would disable backdrop-filter.
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            exit={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(10px)' }}
            transition={{ ...springs.sheet, filter: { duration: duration.normal, ease: ease.out } }}
          >
            <motion.ul
              className="nav-sheet-links"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: stagger.tight, delayChildren: 0.05 } } }}
            >
              {SECTIONS.map((id) => (
                <motion.li
                  key={id}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: springs.snappy } }}
                >
                  <a href={`#${id}`} className="nav-sheet-link" aria-current={active === id ? 'true' : undefined} onClick={go(id)}>
                    {t.nav[id]}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
