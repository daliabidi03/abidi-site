import { useRef, useState } from 'react'
import { QUOTES } from '../content'
import { useI18n } from '../i18n'
import { fmtNum, fmtPct } from '../lib/finance'
import { Section } from './common'
import { InsurancePolicy } from './Insurance'
import { LoanOffer } from './Loan'
import { OptionTicket } from './Pricer'

const DESKS = ['banque', 'assurance', 'bourse']

/** Trading floor: three finance desks (bank, insurance, markets), each one a live document. */
export function Finance() {
  const { t, lang } = useI18n()
  const [tab, setTab] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const date = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern, automatic activation).
  const onKey = (e: React.KeyboardEvent) => {
    const n = DESKS.length
    const to = ({ ArrowRight: (tab + 1) % n, ArrowLeft: (tab + n - 1) % n, Home: 0, End: n - 1 } as Record<string, number | undefined>)[e.key]
    if (to === undefined) return
    e.preventDefault()
    setTab(to)
    tabs.current[to]?.focus()
  }

  const panels = [<LoanOffer date={date} />, <InsurancePolicy />, <OptionTicket date={date} />]
  return (
    <Section id="finance" n={1} label={t.fin.label} aside={t.fin.aside}>
      <div className="quotes" role="group" aria-label={t.fin.quotes}>
        {QUOTES.map(q => (
          <span key={q.name}><b>{q.name}</b>{q.pct ? fmtPct(q.value, q.dec, lang) : fmtNum(q.value, q.dec, lang)}</span>
        ))}
        <em>{t.fin.indicative}</em>
      </div>
      <h2>{t.fin.h2}</h2>
      <p className="lede">{t.fin.lede}</p>
      <div className="desks" role="tablist" aria-label={t.fin.desks} onKeyDown={onKey}>
        {t.fin.tabs.map((label, i) => (
          <button
            key={DESKS[i]} ref={el => { tabs.current[i] = el }} type="button" role="tab"
            id={'tab-' + DESKS[i]} aria-controls={'desk-' + DESKS[i]} aria-selected={tab === i} tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)}
          >
            <b>{String(i + 1).padStart(2, '0')}</b>{label}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div key={DESKS[i]} role="tabpanel" id={'desk-' + DESKS[i]} aria-labelledby={'tab-' + DESKS[i]} hidden={tab !== i} className="desk">
          {panel}
        </div>
      ))}
    </Section>
  )
}
