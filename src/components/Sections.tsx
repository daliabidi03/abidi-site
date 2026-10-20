import { LINKS } from '../content'
import { Html, useI18n } from '../i18n'
import { CopyButton, Section } from './common'

export function Experience() {
  const { t } = useI18n()
  return (
    <Section id="experience" n={3} label={t.exp.label} aside={t.exp.aside}>
      <h2>{t.exp.h2}</h2>
      {t.exp.items.map(x => (
        <article className="pos" key={x.company}>
          <div className="meta"><span className="when">{x.when}</span><span>{x.where}</span></div>
          <div>
            <h3><span><a className="ext" href={x.url} target="_blank" rel="noopener">{x.company}</a></span>{x.role}</h3>
            <p>{x.desc}</p>
            <ul>{x.bullets.map(b => <li key={b}>{b}</li>)}</ul>
            <div className="tags">{x.tags.map(g => <span key={g}>{g}</span>)}</div>
          </div>
        </article>
      ))}
    </Section>
  )
}

export function Projects() {
  const { t } = useI18n()
  return (
    <Section id="projets" n={4} label={t.proj.label} aside={t.proj.aside}>
      <h2>{t.proj.h2}</h2>
      <div className="projs">
        {t.proj.items.map(p => (
          <article className="proj" key={p.name}>
            <div className="k"><span>{p.when}</span><span>{p.kind}</span></div>
            <h3>{p.name}</h3>
            <p className="sub">{p.sub}</p>
            <p>{p.desc}</p>
            <div className="fig"><strong>{p.figStrong}</strong><span>{p.figText}</span></div>
            <div className="tags">{p.tags.map(g => <span key={g}>{g}</span>)}</div>
            {p.repo && (
              <div className="repo-row">
                <a className="ext repo" href={p.repo} target="_blank" rel="noopener">{t.proj.code}</a>
                {p.note && <small>{p.note}</small>}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  )
}

export function Skills() {
  const { t } = useI18n()
  return (
    <Section id="competences" n={5} label={t.skills.label} aside={t.skills.aside}>
      <h2>{t.skills.h2}</h2>
      <div className="pf">{t.skills.groups.map(([k, v]) => <div key={k}><small>{k}</small><p>{v}</p></div>)}</div>
    </Section>
  )
}

export function Education() {
  const { t } = useI18n()
  return (
    <Section id="formation" n={7} label={t.edu.label} aside={t.edu.aside}>
      <div className="edu">
        <div>
          <h2>{t.edu.h2}</h2>
          <table><tbody>
            {t.edu.rows.map(([when, title, school]) => (
              <tr key={when}><td>{when}</td><td><b>{title}</b><Html s={school} /></td></tr>
            ))}
          </tbody></table>
        </div>
        <div>
          <h2>{t.edu.langH2}</h2>
          <div className="lang">{t.edu.langs.map(([l, lv]) => <div key={l}><b>{l}</b><span>{lv}</span></div>)}</div>
        </div>
      </div>
    </Section>
  )
}

export function Contact() {
  const { t } = useI18n()
  const c = t.contact
  return (
    <Section id="contact" n={8} label={c.label} aside={c.aside}>
      <h2>{c.h2}</h2>
      <div className="order">
        <div><small>{c.email}</small><a href={'mailto:' + LINKS.email} id="mail">{LINKS.email}</a><CopyButton text={LINKS.email} targetId="mail" label={c.copy} done={c.copied} /></div>
        <div><small>{c.phone}</small><code id="tel">{LINKS.phone}</code><CopyButton text={LINKS.phone} targetId="tel" label={c.copy} done={c.copied} /></div>
        <div><small>LinkedIn</small><a href={LINKS.linkedin} target="_blank" rel="noopener">linkedin.com/in/abidi-mouhamed-ali</a></div>
        <div><small>GitHub</small><a href={LINKS.github} target="_blank" rel="noopener">github.com/abidimouhamedali2-ops</a></div>
      </div>
    </Section>
  )
}
