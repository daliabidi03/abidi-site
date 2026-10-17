import { useI18n } from '../i18n'
import { LangSwitch } from './common'

export function Header({ onTerminal }: { onTerminal: () => void }) {
  const { t } = useI18n()
  const tape = t.ticker.concat(t.ticker)
  return (
    <>
      <div className="tape" aria-hidden="true">
        <div className="tape-track">
          {tape.map(([a, b], i) => <span key={i}><b>{a}</b> <span className="up">{b}</span></span>)}
        </div>
      </div>
      <div className="wrap">
        <header className="top">
          <span className="live"><i />{t.top.live}</span>
          <nav>{t.top.nav.map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}</nav>
          <div className="tools">
            <button type="button" className="tool" onClick={onTerminal} aria-label={t.hero.terminal}>
              <span aria-hidden="true">›_</span><span className="tool-txt">{t.top.terminal}</span>
            </button>
            <LangSwitch />
          </div>
        </header>
      </div>
    </>
  )
}
