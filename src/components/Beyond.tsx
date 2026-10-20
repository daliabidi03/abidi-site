import { useState } from 'react'
import { Html, useI18n } from '../i18n'
import { fmtNum, fmtPct, Ncdf, npdf } from '../lib/finance'
import { useCanvas } from '../lib/canvas'
import { Section, Seg, Slider } from './common'

const KS = [1, 2, 3] as const
const ZR = 3.6 // half-width of the plot, in standard deviations

/** Bell curve of a class's grades: the 68-95-99.7 rule, with the real grades on the axis. */
function NormalBoard() {
  const { t, lang } = useI18n()
  const tt = t.beyond.teach
  const [k, setK] = useState<typeof KS[number]>(1)
  const [mu, setMu] = useState(12)
  const [sd, setSd] = useState(2)
  const g = (x: number) => fmtNum(x, Number.isInteger(x) ? 0 : 1, lang)
  const lo = g(mu - k * sd), hi = g(mu + k * sd)
  const pct = fmtPct((2 * Ncdf(k) - 1) * 100, 2, lang)

  const cv = useCanvas((ctx, w, h, tk) => {
    const p = { l: 16, r: 16, t: 12, b: 46 }
    const X = (z: number) => p.l + (z + ZR) / (2 * ZR) * (w - p.l - p.r)
    const Y = (y: number) => p.t + (1 - y / (npdf(0) * 1.08)) * (h - p.t - p.b)
    const curve = (a: number, b: number, steps: number) => {
      for (let i = 0; i <= steps; i++) { const z = a + (b - a) * i / steps; ctx.lineTo(X(z), Y(npdf(z))) }
    }
    ctx.beginPath(); ctx.moveTo(X(-k), Y(0)); curve(-k, k, 120); ctx.lineTo(X(k), Y(0)); ctx.closePath()
    ctx.globalAlpha = 0.22; ctx.fillStyle = tk.signal; ctx.fill(); ctx.globalAlpha = 1
    ctx.strokeStyle = tk.signal; ctx.lineWidth = 1.5
    for (const z of [-k, k]) { ctx.beginPath(); ctx.moveTo(X(z), Y(0)); ctx.lineTo(X(z), Y(npdf(z))); ctx.stroke() }
    ctx.strokeStyle = tk.ink; ctx.lineWidth = 2; ctx.lineJoin = 'round'
    ctx.beginPath(); ctx.moveTo(X(-ZR), Y(npdf(ZR))); curve(-ZR, ZR, 240); ctx.stroke()
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.l, Y(0)); ctx.lineTo(w - p.r, Y(0)); ctx.stroke()
    ctx.textAlign = 'center'
    for (let z = -3; z <= 3; z++) {
      const x = X(z), a = Math.abs(z)
      ctx.strokeStyle = tk.muted; ctx.beginPath(); ctx.moveTo(x, Y(0)); ctx.lineTo(x, Y(0) + 5); ctx.stroke()
      ctx.fillStyle = a <= k ? tk.ink : tk.muted; ctx.font = (a <= k ? '600 ' : '') + '12px ' + tk.mono
      ctx.fillText(g(mu + z * sd), x, Y(0) + 20)
      ctx.fillStyle = tk.muted; ctx.font = '10.5px ' + tk.mono
      ctx.fillText(z ? `μ${z < 0 ? '−' : '+'}${a > 1 ? a : ''}σ` : 'μ', x, Y(0) + 37)
    }
  }, [k, mu, sd, lang])

  return (
    <div className="teach">
      <div className="teach-head">
        <span className="when">{tt.when}</span>
        <h3>{tt.title}</h3>
        <p>{tt.p1}</p>
        <Html as="p" s={tt.p2Html} />
        <ol className="steps">
          <li><b>{tt.steps[0]}</b><p>{tt.see}</p></li>
          <li><b>{tt.steps[1]}</b><Html as="p" s={tt.calcHtml(k, pct, g(mu), g(sd), lo, hi)} /></li>
          <li><b>{tt.steps[2]}</b><p>{tt.keep}</p></li>
        </ol>
      </div>
      <div className="board">
        <div className="board-top"><span>{tt.grades}</span><span className="mono">μ = {g(mu)} · σ = {g(sd)}</span></div>
        <div className="nd-head">
          <Seg label={tt.range} options={KS} value={k} set={setK} show={v => `±${v}σ`} />
          <p className="nd-big" aria-live="polite"><strong>{pct}</strong><span>{tt.share(lo, hi)}</span></p>
        </div>
        <canvas ref={cv} id="nd" role="img" aria-label={tt.aria(k, lo, hi)} />
        <div className="board-ctrl">
          <Slider id="ndMu" label={tt.mean} value={mu} set={setMu} min={8} max={16} step={0.5} out={g(mu)} />
          <Slider id="ndSd" label={tt.sd} value={sd} set={setSd} min={1} max={4} step={0.5} out={g(sd)} />
        </div>
      </div>
    </div>
  )
}

export function Beyond() {
  const { t } = useI18n()
  return (
    <Section id="au-dela" n={6} label={t.beyond.label} aside={t.beyond.aside}>
      <h2>{t.beyond.h2}</h2>
      <NormalBoard />
      <div className="beyond">
        {t.beyond.others.map((o, i) => (
          <article key={i}><span className="when">{o.when}</span><Html as="h3" s={o.titleHtml} /><p>{o.text}</p></article>
        ))}
      </div>
    </Section>
  )
}
