import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { site } from '../content'
import { useLang } from '../i18n'
import { springs } from '../lib/motion'
import { CheckIcon, CopyIcon, GithubIcon } from './icons'
import { Reveal, SectionHeading } from './Reveal'

const COPIED_MS = 2200

export function Contact() {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  const email = site.links.email

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), COPIED_MS)
    } catch {
      // Clipboard can be unavailable (insecure origin, permissions): open mail instead.
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <SectionHeading kicker={t.contact.kicker} title={t.contact.title} id="contact-title" />
        <Reveal>
          <p className="contact-text">{t.contact.text}</p>
        </Reveal>
        <Reveal className="contact-actions">
          <a className="contact-email" href={`mailto:${email}`}>
            {email}
          </a>
          <div className="contact-buttons">
            <button type="button" className="btn btn-ghost" onClick={copy}>
              <span className="btn-icon">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={copied ? 'done' : 'copy'}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={springs.snappy}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </motion.span>
                </AnimatePresence>
              </span>
              {copied ? t.contact.copied : t.contact.copy}
            </button>
            <a className="btn btn-ghost" href={site.links.github} target="_blank" rel="noreferrer">
              <GithubIcon />
              github.com/wame21
            </a>
          </div>
          <span className="sr-only" aria-live="polite">
            {copied ? t.contact.copied : ''}
          </span>
        </Reveal>
      </div>
      <div className="horizon" aria-hidden="true" />
    </section>
  )
}
