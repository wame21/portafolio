import { AnimatePresence, MotionConfig } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Journey } from './components/Journey'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Starfield } from './components/Starfield'
import { useLang } from './i18n'
import { useSmoothScroll } from './lib/scroll'

export default function App() {
  const { t } = useLang()
  const { setLocked } = useSmoothScroll()
  const [ready, setReady] = useState(false)
  const [markLanded, setMarkLanded] = useState(false)

  // Always open on the sky, never halfway down a restored scroll position.
  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    setLocked(true)
  }, [setLocked])

  const handleLoaded = useCallback(() => {
    setReady(true)
    setLocked(false)
  }, [setLocked])

  const handleLanded = useCallback(() => setMarkLanded(true), [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        {t.meta.skip}
      </a>

      <div className="sky" aria-hidden="true">
        <div className="sky-tint" />
        <div className="sky-band" />
        <Starfield />
        <div className="sky-grain" />
      </div>

      <AnimatePresence>
        {!ready && <Loader key="loader" onDone={handleLoaded} onLanded={handleLanded} />}
      </AnimatePresence>
      <Nav ready={ready} markVisible={markLanded} />

      <main id="main" inert={!ready}>
        <Hero ready={ready} />
        <About />
        <Projects />
        <Journey />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
