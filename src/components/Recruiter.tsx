import { useEffect, useRef } from 'react'
import { LINKS, ME } from '../content'
import { Html, useI18n } from '../i18n'
import portraitUrl from '../assets/portrait.jpg'
import { CopyButton, LangSwitch } from './common'

/** One-page summary for recruiters who have 30 seconds. */
export function Recruiter({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const R = t.recruiter
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { closeRef.current?.focus() }, [])

  const plain = [
    `${ME} · ${t.hero.roleStrong}`,
    R.summary,
    '',
    R.exp.toUpperCase(),
    ...t.exp.items.map(x => `- ${x.role}, ${x.company} (${x.when}, ${x.where})`),
    '',
    R.proj.toUpperCase(),
    ...t.proj.items.map(p => `- ${p.name}: ${p.sub}`),
    '',
    R.skills.toUpperCase(),
    ...t.skills.groups.map(([k, v]) => `- ${k}: ${v}`),
    '',
    R.edu.toUpperCase(),
    ...t.edu.rows.map(([w, title, school]) => `- ${title}, ${school.replace(/<[^>]+>/g, '')} (${w})`),
    '',
    `${LINKS.email} · ${LINKS.phone} · ${LINKS.linkedin} · ${LINKS.github}`,
  ].join('\n')

  return (
    <div className="rec-wrap" role="dialog" aria-modal="true" aria-label={R.title}>
      <div className="rec">
        <div className="rec-bar">
          <span className="mono">{R.title} · {R.sub}</span>
          <div className="rec-tools">
            <LangSwitch />
            <button type="button" ref={closeRef} className="ghost" onClick={onClose}>{R.back}</button>
          </div>
        </div>

        <header className="rec-head">
          <img src={portraitUrl} alt={t.hero.photoAlt} />
          <div>
            <h2>{ME}</h2>
            <p className="rec-role">{t.hero.roleStrong}</p>
            <p className="avail"><i aria-hidden="true" />{t.hero.avail}</p>
            <p className="rec-sum">{R.summary}</p>
            <div className="links">
              <a href={'mailto:' + LINKS.email}>{LINKS.email}</a>
              <a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
              <a href={LINKS.github} target="_blank" rel="noopener">GitHub ↗</a>
              <span>{LINKS.phone}</span>
            </div>
          </div>
        </header>

        <div className="rec-hi">
          {R.highlights.map(([a, b]) => <div key={a}><strong>{a}</strong><span>{b}</span></div>)}
        </div>

        <div className="rec-body">
          <div>
            <h3>{R.exp}</h3>
            <ul className="rec-list">
              {t.exp.items.map(x => (
                <li key={x.company}>
                  <b>{x.role}</b>
                  <span><a className="ext" href={x.url} target="_blank" rel="noopener">{x.company}</a> · {x.where}</span>
                  <small>{x.when}</small>
                  <p>{x.desc}</p>
                </li>
              ))}
            </ul>
            <h3>{R.proj}</h3>
            <ul className="rec-list">
              {t.proj.items.map(p => <li key={p.name}><b>{p.name}</b><span>{p.sub}</span><small>{p.when}</small></li>)}
            </ul>
          </div>
          <div>
            <h3>{R.skills}</h3>
            <dl className="rec-dl">{t.skills.groups.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <h3>{R.edu}</h3>
            <ul className="rec-list">
              {t.edu.rows.map(([w, title, school]) => <li key={w}><b>{title}</b><Html s={school} /><small>{w}</small></li>)}
            </ul>
            <h3>{R.langs}</h3>
            <p className="rec-langs">{t.edu.langs.map(([l, lv]) => `${l} (${lv.toLowerCase()})`).join(' · ')}</p>
          </div>
        </div>

        <div className="rec-foot">
          <CopyButton text={plain} label={R.copy} done={R.copied} />
          <button type="button" className="ghost" onClick={onClose}>{R.back}</button>
        </div>
      </div>
    </div>
  )
}
