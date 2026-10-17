import { useState, type ReactNode } from 'react'
import { useI18n } from '../i18n'

export function Section({ id, n, label, aside, children }: { id: string; n: number; label: string; aside: string; children: ReactNode }) {
  return (
    <section id={id}>
      <div className="sec">
        <div className="sec-label"><b>§ {n}</b>{label}<p>{aside}</p></div>
        <div>{children}</div>
      </div>
    </section>
  )
}

/** Copies text; falls back to selecting the target element when the clipboard is refused. */
export function CopyButton({ text, targetId, label, done, className }: { text: string; targetId?: string; label: string; done: string; className?: string }) {
  const [ok, setOk] = useState(false)
  const select = () => {
    const el = targetId && document.getElementById(targetId)
    if (!el) return
    const r = document.createRange(); r.selectNodeContents(el)
    const s = getSelection(); s?.removeAllRanges(); s?.addRange(r)
  }
  const click = () => {
    if (!navigator.clipboard) { select(); return }
    navigator.clipboard.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1600) }, select)
  }
  return <button type="button" className={className} onClick={click}>{ok ? done : label}</button>
}

export function LangSwitch() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className="lsw" role="group" aria-label={t.top.langLabel}>
      {(['fr', 'en'] as const).map(l => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
