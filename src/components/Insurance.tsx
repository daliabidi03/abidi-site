import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { binomialQuantiles, fmtNum, fmtPct, fmtTND, premiums } from '../lib/finance'
import { mulberry } from '../lib/random'
import { niceStep, useCanvas } from '../lib/canvas'
import { Seg, Slider } from './common'

const SIZES = [10, 100, 1000, 10000] as const
const YEARS = 2000

const Art = ({ n }: { n: number }) => <b className="art">Art. {n}</b>

/** Insurance policy: premiums, then a Monte Carlo of the yearly claims cost per policyholder (risk pooling). */
export function InsurancePolicy() {
  const { t, lang } = useI18n()
  const I = t.ins
  const [pPct, setP] = useState(8)
  const [cost, setCost] = useState(4000)
  const [loadPct, setLoad] = useState(25)
  const [N, setN] = useState<typeof SIZES[number]>(100)
  const [seed, setSeed] = useState(2026)
  const p = pPct / 100
  const { pure, gross } = premiums(p, cost, loadPct / 100)

  // One uniform per simulated year, turned into a Binomial(N, p) claim count by inverse CDF:
  // the same draws serve every portfolio size, so switching N changes only the pooling.
  const us = useMemo(() => { const r = mulberry(seed); return Float64Array.from({ length: YEARS }, () => r()) }, [seed])
  const sim = useMemo(() => {
    const ks = binomialQuantiles(N, p, us), step = cost / N
    let kmax = 0
    for (const k of ks) if (k > kmax) kmax = k
    // The x axis is set by the most dispersed portfolio (10 policyholders, 99% quantile), so it stays put
    // when N changes; it only stretches if a rare year would not fit.
    const xmax = Math.max((binomialQuantiles(10, p, [0.99])[0] + 1) * cost / 10, gross * 1.5, (kmax + 1) * step)
    const m = Math.max(1, Math.ceil(xmax / 48 / step)), nb = Math.floor(xmax / (m * step)) + 1
    const all = new Array<number>(nb).fill(0), loss = new Array<number>(nb).fill(0)
    let losses = 0
    for (const k of ks) {
      const b = Math.min(nb - 1, Math.floor(k / m))
      all[b]++
      if (k * step > gross + 1e-9) { loss[b]++; losses++ }
    }
    return { all, loss, m, step, xmax, pLoss: losses / YEARS }
  }, [N, p, cost, gross, us])

  const cv = useCanvas((ctx, w, h, tk) => {
    const { all, loss, m, step, xmax } = sim
    const top = Math.max(...all) / YEARS * 100, ys = niceStep(top, 3), ymax = Math.ceil(top / ys - 1e-9) * ys
    ctx.font = '11px ' + tk.mono
    const ticks: number[] = []
    for (let v = 0; v <= ymax + 1e-6; v += ys) ticks.push(v)
    const lab = (v: number) => fmtPct(v, ys < 1 ? 1 : 0, lang)
    const lw = Math.max(...ticks.map(v => ctx.measureText(lab(v)).width))
    const p = { l: lw + 10, r: 8, t: 10, b: 24 }, x0 = -m * step / 2
    const X = (x: number) => p.l + (x - x0) / (xmax - x0) * (w - p.l - p.r)
    const Y = (v: number) => p.t + (1 - v / ymax) * (h - p.t - p.b)
    ctx.textAlign = 'right'; ctx.lineWidth = 1
    for (const v of ticks) {
      ctx.strokeStyle = v ? tk.rule : tk.ink
      ctx.beginPath(); ctx.moveTo(p.l, Y(v)); ctx.lineTo(w - p.r, Y(v)); ctx.stroke()
      ctx.fillStyle = tk.muted; ctx.fillText(lab(v), p.l - 6, Y(v) + 4)
    }
    ctx.textAlign = 'center'
    const xs = niceStep(xmax, Math.max(3, Math.floor((w - p.l) / 90)))
    for (let x = 0; x <= xmax; x += xs) {
      const s = fmtNum(x, 0, lang), half = ctx.measureText(s).width / 2
      if (X(x) + half > w) continue // a label that would be cut at the right edge is left out
      ctx.fillText(s, X(x), h - 7); ctx.beginPath(); ctx.moveTo(X(x), Y(0)); ctx.lineTo(X(x), Y(0) + 4); ctx.stroke()
    }
    all.forEach((c, b) => {
      if (!c) return
      const xa = X((b * m - 0.5) * step), xb = X((b * m + m - 0.5) * step), gap = xb - xa > 5 ? 1 : 0
      const hAll = Y(0) - Y(c / YEARS * 100), hLoss = Y(0) - Y(loss[b] / YEARS * 100)
      ctx.fillStyle = tk.cool; ctx.fillRect(xa + gap, Y(0) - hAll, xb - xa - 2 * gap, hAll - hLoss)
      ctx.fillStyle = tk.signal; ctx.fillRect(xa + gap, Y(0) - hLoss, xb - xa - 2 * gap, hLoss)
    })
    const vline = (x: number, col: string, dash: number[]) => {
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash(dash)
      ctx.beginPath(); ctx.moveTo(X(x), p.t); ctx.lineTo(X(x), Y(0)); ctx.stroke(); ctx.setLineDash([])
    }
    vline(pure, tk.ink, [4, 3])
    vline(gross, tk.signal, [])
  }, [sim, pure, gross, lang])

  return (
    <article className="doc ins">
      <header className="doc-head"><h3>{I.no}</h3><span>{I.issuer}</span></header>
      <p className="doc-title">{I.title}</p>
      <div className="terms-in">
        <Slider id="iP" label={<><Art n={1} />{I.p}</>} value={pPct} set={setP} min={1} max={30} step={1} out={fmtPct(pPct, 0, lang)} />
        <Slider id="iC" label={<><Art n={2} />{I.cost}</>} value={cost} set={setCost} min={500} max={20000} step={100} out={fmtTND(cost, lang, 0)} />
        <Slider id="iL" label={<><Art n={3} />{I.load}</>} value={loadPct} set={setLoad} min={10} max={60} step={1} out={fmtPct(loadPct, 0, lang)} />
        <div className="seg-field">
          <span><Art n={4} />{I.n}</span>
          <Seg label={I.n} options={SIZES} value={N} set={setN} show={v => fmtNum(v, 0, lang)} />
        </div>
      </div>
      <div className="prem">
        <div className="big"><small>{I.pure}</small><strong>{fmtTND(pure, lang)}</strong></div>
        <div className="big"><small>{I.gross}</small><strong>{fmtTND(gross, lang)}</strong></div>
        <p className="prem-per">{I.per}</p>
        <p className="mono formula">{I.pureF}<br />{I.grossF}</p>
      </div>
      <div className="mutual">
        <p className="mutual-k"><b>{I.mutual}</b><span>{I.sims}</span></p>
        <canvas ref={cv} className="fin-cv" role="img" aria-label={I.aria(fmtNum(N, 0, lang))} />
        <p className="axis-cap mono">{I.axis} (TND)</p>
        <div className="px-leg mono">
          <span><i style={{ background: 'var(--ink)' }} className="dash" />{I.pure}</span>
          <span><i style={{ background: 'var(--signal)' }} />{I.gross}</span>
          <span><i className="sw" style={{ background: 'var(--cool)' }} />{I.okYears}</span>
          <span><i className="sw" style={{ background: 'var(--signal)' }} />{I.lossYears}</span>
        </div>
        <p className="loss"><span>{I.loss}</span><strong>{fmtPct(sim.pLoss * 100, 1, lang)}</strong></p>
        <p className="doc-note">{I.note}</p>
        <button type="button" className="ghost" onClick={() => setSeed((Math.random() * 4294967296) >>> 0)}>{I.rerun}</button>
      </div>
    </article>
  )
}
