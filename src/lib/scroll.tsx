import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'

interface ScrollApi {
  scrollTo: (target: string | number) => void
  setLocked: (locked: boolean) => void
}

const ScrollContext = createContext<ScrollApi | null>(null)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Smooth, inertial wheel scrolling via Lenis. Lenis drives the native scroll
 * position, so `useScroll` and IntersectionObserver keep working untouched.
 * With reduced motion it is never created and everything falls back to native.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const lockedRef = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 })
    lenisRef.current = lenis
    if (lockedRef.current) lenis.stop()
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback((target: string | number) => {
    const lenis = lenisRef.current
    if (lenis) {
      // Lenis honours the CSS `scroll-padding-top`, which already clears the nav.
      lenis.scrollTo(target, { duration: 1.4 })
      return
    }
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'auto' })
      return
    }
    document.querySelector(target)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [])

  const setLocked = useCallback((locked: boolean) => {
    lockedRef.current = locked
    document.documentElement.classList.toggle('is-locked', locked)
    if (locked) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [])

  const api = useMemo(() => ({ scrollTo, setLocked }), [scrollTo, setLocked])
  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useSmoothScroll must be used inside <SmoothScroll>')
  return ctx
}
