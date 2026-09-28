import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { content, type Content, type Lang } from './content'

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Content
}

const LangContext = createContext<LangState | null>(null)

const STORAGE_KEY = 'lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    // Storage can be blocked (private mode); fall through to the browser language.
  }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = content[lang].meta.title
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Non-essential preference; ignore storage failures.
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: content[lang] }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}
