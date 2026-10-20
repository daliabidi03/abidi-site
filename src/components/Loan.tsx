import { useMemo, useRef, useState } from 'react'
import { ME } from '../content'
import { useI18n } from '../i18n'
import { amortizationByYear, fmtNum, fmtPct, fmtTND, loanPayment } from '../lib/finance'
import { niceStep, useCanvas } from '../lib/canvas'
import { Slider } from './common'

/** Rubber stamp of the bank, printed as a watermark behind the offer. */
function Seal() {
  return (
    <svg className="seal" viewBox="0 0 120 120" aria-hidden="true">
      <defs><path id="sealArc" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" /></defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="60" cy="60" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
      <text fontSize="10.5" fontWeight="700" letterSpacing="2.6" fill="currentColor">
        <textPath href="#sealArc">ABIDI BANK · TUNIS · ABIDI BANK · TUNIS ·</textPath>
      </text>
      <text x="60" y="67" textAnchor="middle" fontSize="21" fontWeight="800" fill="currentColor">AB</text>
    </svg>
  )
}

/** Loan offer: monthly payment of an amortizing loan and its yearly schedule. */
export function LoanOffer({ date }: { date: string }) {
  const { t, lang } = useI18n()
  const L = t.loan
  const [C, setC] = useState(80000)
  const [n, setN] = useState(120)
  const [rate, setRate] = useState(8.5)
  const [on, setOn] = useState(-1)
  const M = loanPayment(C, n, rate), total = M * n, interest = total - C
  const years = useMemo(() => amortizationByYear(C, n, rate), [C, n, rate])
  const geo = useRef({ l: 0, bw: 1 })

  const cv = useCanvas((ctx, w, h, tk) => {
    // Every year repays 12 × M: the bars have the same height, only the split moves.
    const top = 12 * M, step = niceStep(top, 4), ymax = Math.ceil(top / step - 1e-9) * step
    ctx.font = '11px ' + tk.mono
    const ticks: number[] = []
    for (let v = 0; v <= ymax + 1e-6; v += step) ticks.push(v)
    const lab = (v: number) => fmtNum(v, 0, lang)
    const lw = Math.max(...ticks.map(v => ctx.measureText(lab(v)).width), ctx.measureText(L.year).width)
    const p = { l: lw + 10, r: 4, t: 22, b: 26 }
    const bwFull = (w - p.l - p.r) / years.length
    geo.current = { l: p.l, bw: bwFull }
    const Y = (v: number) => p.t + (1 - v / ymax) * (h - p.t - p.b)
    ctx.textAlign = 'right'; ctx.lineWidth = 1
    for (const v of ticks) {
      ctx.strokeStyle = v ? tk.rule : tk.ink
      ctx.beginPath(); ctx.moveTo(p.l, Y(v)); ctx.lineTo(w - p.r, Y(v)); ctx.stroke()
      ctx.fillStyle = tk.muted; ctx.fillText(lab(v), p.l - 6, Y(v) + 4)
    }
    ctx.fillText(L.year, p.l - 6, h - 8)
    ctx.textAlign = 'left'; ctx.fillText('TND', 0, 11)
    const bw = Math.max(2, Math.min(30, bwFull * 0.68))
    const every = [1, 2, 5, 10].find(k => k * bwFull >= 24) ?? 10
    const bar = (x: number, y0: number, y1: number, round: boolean) => {
      if (y0 - y1 <= 0) return
      ctx.beginPath()
      if (round && ctx.roundRect) ctx.roundRect(x, y1, bw, y0 - y1, [3, 3, 0, 0]); else ctx.rect(x, y1, bw, y0 - y1)
      ctx.fill()
    }
    ctx.textAlign = 'center'
    years.forEach((y, i) => {
      const x = p.l + (i + 0.5) * bwFull - bw / 2
      ctx.globalAlpha = on < 0 || on === i ? 1 : 0.4
      ctx.fillStyle = tk.cool; bar(x, Y(0), Y(y.principal), false)
      ctx.fillStyle = tk.signal; bar(x, Y(y.principal) - 2, Y(y.principal + y.interest), true)
      ctx.globalAlpha = 1
      if ((i + 1) % every === 0 || (i === 0 && every > 2)) { ctx.fillStyle = on === i ? tk.ink : tk.muted; ctx.fillText(String(i + 1), x + bw / 2, h - 8) }
    })
  }, [years, M, lang, on, L.year])

  const pick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect(), i = Math.floor((e.clientX - r.left - geo.current.l) / geo.current.bw)
    setOn(i >= 0 && i < years.length ? i : -1)
  }
  const y = years[on]

  return (
    <article className="doc loan">
      <Seal />
      <header className="doc-head"><h3>{L.no}</h3><span>{L.issuer}</span></header>
      <div className="terms-in">
        <Slider id="lC" label={L.amount} value={C} set={setC} min={5000} max={300000} step={1000} out={fmtTND(C, lang, 0)} />
        <Slider id="lN" label={L.months} value={n} set={v => { setN(v); setOn(-1) }} min={12} max={300} step={12} out={L.duration(n, n / 12)} />
        <Slider id="lR" label={L.rate} value={rate} set={setRate} min={4} max={14} step={0.1} out={fmtPct(rate, 1, lang)} />
      </div>
      <div className="loan-res">
        <div className="big">
          <small>{L.payment}</small><strong>{fmtTND(M, lang)}</strong><span>{L.perMonth}</span>
          <span className="mono formula">M = C·i / (1 − (1 + i)<sup>−n</sup>)</span>
        </div>
        <dl className="terms-out">
          <div><dt>{L.interest}</dt><dd>{fmtTND(interest, lang)}</dd></div>
          <div><dt>{L.total}</dt><dd>{fmtTND(total, lang)}</dd></div>
          <div><dt>{L.share}</dt><dd>{fmtPct(interest / total * 100, 1, lang)}</dd></div>
        </dl>
      </div>
      <canvas
        ref={cv} className="fin-cv" role="img" aria-label={L.aria} tabIndex={0}
        onPointerMove={pick} onPointerDown={pick} onPointerLeave={e => { if (e.pointerType === 'mouse') setOn(-1) }}
        onBlur={() => setOn(-1)}
        onKeyDown={e => {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
          e.preventDefault()
          setOn(i => Math.max(0, Math.min(years.length - 1, (i < 0 ? 0 : i) + (e.key === 'ArrowRight' ? 1 : -1))))
        }}
      />
      <div className="px-leg mono">
        <span><i className="sw" style={{ background: 'var(--cool)' }} />{L.principal}</span>
        <span><i className="sw" style={{ background: 'var(--signal)' }} />{L.interestPaid}</span>
      </div>
      <p className="readout mono" aria-live="polite">
        {y ? L.yearRead(on + 1, fmtTND(y.principal, lang, 0), fmtTND(y.interest, lang, 0)) : L.hover}
      </p>
      <p className="doc-note">{L.note}</p>
      <footer className="doc-foot">
        <span>{L.place(date)}</span>
        <div className="sign">
          <span>{L.signed}</span>
          <svg viewBox="0 0 170 48" aria-hidden="true">
            <path d="M4 36C14 32 18 9 27 11S22 41 31 39 42 15 49 18 51 35 58 33 67 13 75 16 75 35 83 31 99 11 108 14 108 31 118 29 140 19 158 22M36 44C70 40 112 41 150 37" />
          </svg>
          <b>{ME}</b>
        </div>
      </footer>
      <p className="doc-disclaimer">{t.fin.disclaimer}</p>
    </article>
  )
}
