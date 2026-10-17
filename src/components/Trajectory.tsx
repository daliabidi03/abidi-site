import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { fnv, gaussOf, mulberry } from '../lib/random'
import { Section } from './common'

// [decimal year, display date, jump size in log-value]
const EV: [number, string, number][] = [
  [2018.05, '2018', 0.16], [2022.45, '06/2022', 0.14], [2022.7, '09/2022', 0.2], [2023.68, '09/2023', 0.12],
  [2024.05, '2024', 0.1], [2024.68, '09/2024', 0.2], [2025.42, '06/2025', 0.16], [2025.76, '10/2025', 0.12],
  [2026.0, '01/2026', 0.15], [2026.5, '07/2026', 0.22], [2026.75, '10/2026', 0.17],
]
const T0 = 2017.7
const VW = 1000, VH = 380
const pad = { l: 46, r: 16, t: 40, b: 34 }

function decimalYear(d: Date) {
  const y = d.getFullYear(), start = new Date(y, 0, 1).getTime(), end = new Date(y + 1, 0, 1).getTime()
  return y + (d.getTime() - start) / (end - start)
}

function useModel() {
  return useMemo(() => {
    const now = Math.max(decimalYear(new Date()), 2026.79)
    const T1 = Math.ceil(now + 0.5)
    const g = gaussOf(mulberry(fnv('abidi-trajectoire')))
    const pts: [number, number][] = []
    const jumps: { t: number; pre: number; post: number; i: number }[] = []
    let L = 0, ei = 0
    for (let t = T0; t <= now + 1e-9; t += 0.01) {
      L += (0.04 - 0.5 * 0.18 * 0.18) * 0.01 + 0.18 * Math.sqrt(0.01) * g()
      while (ei < EV.length && EV[ei][0] <= t) { const pre = L; L += EV[ei][2]; jumps.push({ t, pre, post: L, i: ei }); ei++ }
      pts.push([t, L])
    }
    const Lend = L + 0.12 * (T1 - now)
    const all = pts.map(p => p[1]).concat([Lend])
    const lo = Math.min(...all) - 0.08, hi = Math.max(...all) + 0.06
    const w = VW - pad.l - pad.r, h = VH - pad.t - pad.b
    const X = (t: number) => pad.l + (t - T0) / (T1 - T0) * w
    const Y = (v: number) => pad.t + h * (1 - (v - lo) / (hi - lo))
    const d = pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join('')
    let lastX = -99, lvl = 0
    const marks = jumps.map(j => {
      const x = X(j.t), y = Y(j.post)
      lvl = x - lastX < 28 ? (lvl + 1) % 3 : 0
      lastX = x
      return { ...j, x, y, my: y - 22 - lvl * 24 }
    })
    const years: number[] = []
    for (let y = 2018; y <= T1; y++) years.push(y)
    return { now, T1, d, marks, years, X, Y, Lnow: L, Lend, h, w }
  }, [])
}

export function Trajectory() {
  const { t } = useI18n()
  const m = useModel()
  const [on, setOn] = useState(-1)
  const xn = m.X(m.now)
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear()
  const bind = (i: number) => ({
    onMouseEnter: () => setOn(i), onFocus: () => setOn(i), onClick: () => setOn(i),
    onMouseLeave: () => setOn(-1), onBlur: () => setOn(-1), tabIndex: 0,
  })
  return (
    <Section id="trajectoire" n={2} label={t.traj.label} aside={t.traj.aside}>
      <h2>{t.traj.h2}</h2>
      <p className="lede">{t.traj.lede}</p>
      <p className="mono" style={{ margin: '0 0 14px', fontSize: 14 }}>dS<sub>t</sub> = μS<sub>t</sub>dt + σS<sub>t</sub>dW<sub>t</sub> + S<sub>t−</sub>dJ<sub>t</sub></p>
      <div className="chart">
        <svg viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label={t.traj.aria}>
          {m.years.map(y => (
            <g key={y}>
              <line x1={m.X(y)} y1={pad.t - 14} x2={m.X(y)} y2={pad.t + m.h} stroke="var(--rule)" />
              <text x={m.X(y)} y={VH - 12} textAnchor="middle" fontSize="11" fill="var(--muted)">{y}</text>
            </g>
          ))}
          <line x1={pad.l} y1={pad.t + m.h} x2={pad.l + m.w} y2={pad.t + m.h} stroke="var(--ink)" />
          <rect x={xn} y={pad.t - 14} width={pad.l + m.w - xn} height={m.h + 14} fill="var(--cool)" opacity=".07" />
          <line x1={xn} y1={pad.t - 14} x2={xn} y2={pad.t + m.h} stroke="var(--signal)" strokeDasharray="2 3" />
          <text x={xn - 6} y={pad.t + m.h - 8} textAnchor="end" fontSize="11" fill="var(--signal)">{t.traj.today} · {dd}</text>
          <text x={pad.l + m.w - 4} y={pad.t - 20} textAnchor="end" fontSize="11" fill="var(--muted)">{t.traj.projection}</text>
          <text x={pad.l} y={pad.t - 22} fontSize="11" fill="var(--muted)">log S</text>
          <path d={m.d} fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
          <path d={`M${xn} ${m.Y(m.Lnow)}L${m.X(m.T1)} ${m.Y(m.Lend)}`} fill="none" stroke="var(--cool)" strokeWidth="1.6" strokeDasharray="5 4" />
          {m.marks.map(j => <line key={'j' + j.i} x1={j.x} y1={m.Y(j.pre)} x2={j.x} y2={j.y} stroke="var(--signal)" strokeWidth="2.4" />)}
          {m.marks.map(j => (
            <g key={'m' + j.i} className={'mk' + (on === j.i ? ' on' : '')} role="button" aria-label={t.traj.events[j.i]} {...bind(j.i)}>
              <line x1={j.x} y1={j.y - 4} x2={j.x} y2={j.my + 10} stroke="var(--muted)" />
              <circle cx={j.x} cy={j.my} r="10" />
              <text x={j.x} y={j.my + 4} textAnchor="middle">{j.i + 1}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="swipe">{t.traj.swipe}</p>
      <ol className="key">
        {EV.map((e, i) => (
          <li key={i} className={on === i ? 'on' : ''} {...bind(i)}>
            <span>{t.traj.events[i]}</span><small>{e[1]}</small>
          </li>
        ))}
      </ol>
    </Section>
  )
}
