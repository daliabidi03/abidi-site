import { useEffect, useRef, useState } from 'react'
import { useI18n, type Lang } from '../i18n'
import { bsCall, fmtNum, fmtPct, fmtRaw, fmtTND, gbmPath, greeks, loanPayment, premiums } from '../lib/finance'
import { scrollToId } from './common'

// "help" lines keep the command and its description apart, so small screens can stack them.
type Line = { kind: 'in' | 'out' | 'err' | 'ok'; text: string } | { kind: 'help'; cmd: string; text: string; w: number }
const SECTIONS = ['top', 'finance', 'trajectoire', 'experience', 'projets', 'competences', 'au-dela', 'formation', 'contact']
const ALIAS: Record<string, string> = {
  home: 'top', accueil: 'top', pricer: 'finance', trajectory: 'trajectoire',
  projects: 'projets', skills: 'competences', education: 'formation', beyond: 'au-dela',
}
const COMMANDS = ['help', 'aide', 'whoami', 'exp', 'experience', 'projets', 'projects', 'skills', 'competences', 'formation', 'education',
  'contact', 'price', 'loan', 'premium', 'simulate', 'goto', 'lang', 'recruteur', 'recruiter', 'sudo', 'clear', 'exit']

/** Reads a number typed with either a dot or a comma ("8.5" or "8,5"). */
const num = (s?: string) => (s === undefined ? NaN : Number(s.replace(',', '.')))

const SPARK = '▁▂▃▄▅▆▇█'
function sparkline(p: number[], width = 56) {
  const step = (p.length - 1) / (width - 1), pick = Array.from({ length: width }, (_, i) => p[Math.round(i * step)])
  const lo = Math.min(...pick), hi = Math.max(...pick)
  return pick.map(v => SPARK[Math.min(7, Math.floor((v - lo) / (hi - lo || 1) * 8))]).join('')
}

export function Terminal({ onClose, onRecruiter }: { onClose: () => void; onRecruiter: () => void }) {
  const { t, lang, setLang } = useI18n()
  const T = t.term
  const [lines, setLines] = useState<Line[]>(() => T.welcome.map(text => ({ kind: 'out' as const, text })))
  const [val, setVal] = useState('')
  const hist = useRef<string[]>([])
  const hi = useRef(-1)
  const inRef = useRef<HTMLInputElement>(null)
  const outRef = useRef<HTMLDivElement>(null)

  useEffect(() => { inRef.current?.focus() }, [])
  useEffect(() => { outRef.current?.scrollTo({ top: outRef.current.scrollHeight }) }, [lines])

  const f = (x: number, n = 2, l: Lang = lang) => fmtNum(x, n, l)
  const raw = (x: number) => fmtRaw(x, lang)

  function run(raw0: string): Line[] {
    const [cmd0, ...args] = raw0.trim().split(/\s+/)
    const cmd = (cmd0 || '').toLowerCase()
    const out = (text: string, kind: 'out' | 'err' | 'ok' = 'out'): Line => ({ kind, text })
    switch (cmd) {
      case '': return []
      case 'help': case 'aide': {
        const w = Math.max(...T.help.map(h => h[0].length)) + 2
        return T.help.map(([c, d]) => ({ kind: 'help', cmd: c, text: d, w }))
      }
      case 'whoami': return [out(T.whoami, 'ok')]
      case 'exp': case 'experience':
        return t.exp.items.flatMap(x => [out(`${x.when}  ${x.role} · ${x.company}`, 'ok'), out('           ' + x.where)])
      case 'projets': case 'projects':
        return t.proj.items.map(p => out(`${p.name.padEnd(12)}${p.sub} (${p.when})`))
      case 'skills': case 'competences':
        return t.skills.groups.map(([k, v]) => out(`${k.padEnd(18)}${v}`))
      case 'formation': case 'education':
        return t.edu.rows.map(([w, title, school]) => out(`${w.padEnd(16)}${title} · ${school.replace(/<[^>]+>/g, '')}`))
      case 'contact': return T.contactLines.map(l => out(l))
      case 'price': {
        const [K, TT, v, r] = [num(args[0]), num(args[1]), num(args[2]), args[3] === undefined ? 0.04 : num(args[3])]
        if (![K, TT, v, r].every(Number.isFinite) || K <= 0 || TT <= 0 || v <= 0) return [out(T.priceUsage, 'err')]
        const c = bsCall(100, K, TT, v, r).C, g = greeks(100, K, TT, v, r)
        return [
          out(`Call  S₀=100  K=${raw(K)}  T=${raw(TT)}  σ=${raw(v)}  r=${raw(r)}`),
          out(`C = ${f(c)}   Δ = ${f(g.delta, 3)}   P(S_T > K) = ${fmtPct(Math.round(g.pITM * 100), 0, lang)}`, 'ok'),
        ]
      }
      case 'loan': {
        const [C, n, rate] = [num(args[0]), num(args[1]), num(args[2])]
        if (![C, n, rate].every(Number.isFinite) || C <= 0 || n < 1 || !Number.isInteger(n) || rate < 0) return [out(T.loanUsage, 'err')]
        const M = loanPayment(C, n, rate)
        return [
          out(T.loanIn(fmtTND(C, lang), String(n), fmtPct(rate, 2, lang))),
          out(T.loanOut(fmtTND(M, lang), fmtTND(M * n - C, lang), fmtTND(M * n, lang)), 'ok'),
        ]
      }
      case 'premium': {
        const [pr, cost, load] = [num(args[0]), num(args[1]), num(args[2])]
        if (![pr, cost, load].every(Number.isFinite) || pr <= 0 || pr > 100 || cost <= 0 || load < 0) return [out(T.premiumUsage, 'err')]
        const { pure, gross } = premiums(pr / 100, cost, load / 100)
        return [
          out(T.premiumIn(fmtPct(pr, 2, lang), fmtTND(cost, lang), fmtPct(load, 2, lang))),
          out(T.premiumOut(fmtTND(pure, lang), fmtTND(gross, lang)), 'ok'),
        ]
      }
      case 'simulate': {
        const p = gbmPath(400, 0.18, 0.35)
        return [out(sparkline(p), 'ok'), out(T.simulate(f(p[p.length - 1])))]
      }
      case 'goto': {
        const s0 = (args[0] || '').toLowerCase(), s = ALIAS[s0] || s0
        if (!SECTIONS.includes(s)) return [out(T.gotoKo, 'err')]
        setTimeout(() => { onClose(); scrollToId(s) }, 250)
        return [out(T.gotoOk(s), 'ok')]
      }
      case 'lang': {
        const l = (args[0] || '').toLowerCase()
        if (l !== 'fr' && l !== 'en') return [out('lang fr | lang en', 'err')]
        setLang(l)
        return [out(l === 'fr' ? 'Langue : français.' : 'Language: English.', 'ok')]
      }
      case 'recruteur': case 'recruiter':
        setTimeout(onRecruiter, 200)
        return [out('…', 'ok')]
      case 'sudo':
        return args.join(' ').toLowerCase() === 'hire abidi' ? [out(T.hire, 'ok')] : [out(T.sudo, 'err')]
      case 'clear': setLines([]); return []
      case 'exit': case 'quit': setTimeout(onClose, 0); return []
      default: return [out(T.unknown(cmd0), 'err')]
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const cmd = val
    if (cmd.trim()) { hist.current.push(cmd); hi.current = hist.current.length }
    setVal('')
    const res = run(cmd)
    if (cmd.trim().toLowerCase() === 'clear') return
    setLines(ls => [...ls, { kind: 'in', text: cmd }, ...res])
  }

  function key(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { e.preventDefault(); onClose() }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!hist.current.length) return
      hi.current = Math.max(0, hi.current - 1); setVal(hist.current[hi.current])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      hi.current = Math.min(hist.current.length, hi.current + 1); setVal(hist.current[hi.current] ?? '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const m = COMMANDS.filter(c => c.startsWith(val.trim().toLowerCase()))
      if (m.length === 1) setVal(m[0] + ' ')
      else if (m.length > 1) setLines(ls => [...ls, { kind: 'out', text: m.join('  ') }])
    }
  }

  return (
    <div className="term-wrap" role="dialog" aria-modal="true" aria-label={T.title} onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="term" onClick={() => inRef.current?.focus()}>
        <div className="term-bar">
          <span><i /><i /><i /></span>
          <b>{T.title}</b>
          <button type="button" onClick={onClose} aria-label="Fermer / Close">esc</button>
        </div>
        <div className="term-out" ref={outRef} aria-live="polite">
          {lines.map((l, i) =>
            l.kind === 'help'
              ? <div key={i} className="tl help" style={{ '--cw': l.w + 'ch' } as React.CSSProperties}><span>{l.cmd}</span><span>{l.text}</span></div>
              : <div key={i} className={'tl ' + l.kind}>{l.kind === 'in' ? <><span className="pr">abidi@ma:~$</span> {l.text}</> : l.text}</div>,
          )}
        </div>
        <form className="term-in" onSubmit={submit}>
          <label htmlFor="termIn" className="pr">abidi@ma:~$</label>
          <input id="termIn" ref={inRef} value={val} onChange={e => setVal(e.target.value)} onKeyDown={key}
            autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="send" />
        </form>
      </div>
    </div>
  )
}
