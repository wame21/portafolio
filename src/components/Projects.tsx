import { motion } from 'motion/react'
import type { CSSProperties, ComponentType } from 'react'
import { accents, type Content, type ProjectId } from '../content'
import { useLang } from '../i18n'
import { duration, ease, springs } from '../lib/motion'
import { ArrowUpRight, GithubIcon, LockIcon } from './icons'
import { RevealGroup, RevealItem, SectionHeading } from './Reveal'
import { CaelumVisual } from './visuals/CaelumVisual'
import { StratumVisual } from './visuals/StratumVisual'

type Project = Content['projects']['items'][number]

const visuals: Record<ProjectId, ComponentType> = {
  caelum: CaelumVisual,
  stratum: StratumVisual,
}

/**
 * Tints the whole night sky toward the project in view. `--tint` is a
 * registered @property, so the browser interpolates the colour smoothly.
 */
function setSkyTint(color: string | null) {
  const root = document.documentElement.style
  if (color) root.setProperty('--tint', color)
  else root.removeProperty('--tint')
}

function ProjectChapter({ project: p, flipped }: { project: Project; flipped: boolean }) {
  const { t } = useLang()
  const Visual = visuals[p.id]
  const accent = accents[p.id]

  return (
    <motion.article
      className={`project${flipped ? ' is-flipped' : ''}`}
      style={{ '--accent': accent } as CSSProperties}
      aria-labelledby={`project-${p.id}`}
      viewport={{ amount: 0.35 }}
      onViewportEnter={() => setSkyTint(accent)}
    >
      <RevealGroup className="project-copy">
        <RevealItem className="project-meta">
          <span className="project-index">{p.index}</span>
          <span>{p.kind}</span>
          <span className="meta-sep" aria-hidden="true" />
          <span>{p.role}</span>
        </RevealItem>
        <RevealItem>
          <h3 className="project-title" id={`project-${p.id}`}>
            {p.title}
          </h3>
        </RevealItem>
        <RevealItem>
          <p className="project-tagline">{p.tagline}</p>
        </RevealItem>
        <RevealItem>
          <p className="project-desc">{p.description}</p>
        </RevealItem>
        <RevealItem>
          <ul className="project-highlights">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </RevealItem>
        <RevealItem>
          <ul className="chips">
            {p.tech.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
        </RevealItem>
        <RevealItem className="project-links">
          {p.repoPrivate ? (
            <span className="link-muted">
              <LockIcon />
              {t.projects.private}
            </span>
          ) : (
            <a className="link-arrow" href={p.repo} target="_blank" rel="noreferrer">
              <GithubIcon />
              {t.projects.repo}
              <ArrowUpRight className="link-arrow-icon" />
            </a>
          )}
          {p.live && (
            <a className="link-arrow" href={p.live} target="_blank" rel="noreferrer">
              {t.projects.live}
              <ArrowUpRight className="link-arrow-icon" />
            </a>
          )}
        </RevealItem>
      </RevealGroup>

      <motion.div
        className="project-visual"
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(14px)' }}
        // `filter: none` once settled: a leftover filter would stop the demo's backdrop blur.
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{
          ...springs.gentle,
          filter: { duration: duration.crawl, ease: ease.out },
          opacity: { duration: duration.slow, ease: ease.out },
        }}
      >
        <Visual />
      </motion.div>
    </motion.article>
  )
}

export function Projects() {
  const { t } = useLang()

  return (
    <motion.section
      id="work"
      className="section projects"
      aria-labelledby="work-title"
      viewport={{ amount: 0 }}
      onViewportLeave={() => setSkyTint(null)}
    >
      <div className="container">
        <SectionHeading kicker={t.projects.kicker} title={t.projects.title} id="work-title" />

        <div className="project-list">
          {t.projects.items.map((project, i) => (
            <ProjectChapter key={project.id} project={project} flipped={i % 2 === 1} />
          ))}
        </div>

      </div>
    </motion.section>
  )
}
