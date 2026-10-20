import { useEffect, useState } from 'react'
import { Html, useI18n } from '../i18n'
import { bsCall, fmtNum, fmtPct, greeks, mcCall } from '../lib/finance'
import { useCanvas } from '../lib/canvas'
import { Slider } from './common'

const S0 = 100

/** Black-Scholes pricer of a European call on ABIDI.MA, laid out as a trading-floor ticket. */
export function OptionTicket({ date }: { date: string }) {
  const { t, lang } = useI18n()
  const [K, setK] = useState(90)
  const [T, setT] = useState(2)
  const [v, setV] = useState(0.35)
  const [r, setR] = useState(0.04)
  const [mc, setMc] = useState<{ price: number; se: number } | null>(null)
  const f = (x: number, n = 2) => fmtNum(x, n, lang)
  const C = bsCall(S0, K, T, v, r).C
  const gk = greeks(S0, K, T, v, r)

  useEffect(() => { setMc(null) }, [K, T, v, r])

  const cv = useCanvas((ctx, w, h, tk) => {
    const p = { l: 34, r: 10, t: 10, b: 24 }, xm = 220
    const ym = Math.max(xm - K * Math.exp(-r * T), bsCall(xm, K, T, v, r).C) * 1.05
    const X = (s: number) => p.l + s / xm * (w - p.l - p.r), Y = (c2: number) => p.t + (1 - c2 / ym) * (h - p.t - p.b)
    ctx.font = '11px ' + tk.mono; ctx.lineWidth = 1; ctx.strokeStyle = tk.rule; ctx.fillStyle = tk.muted
    ;[0, 50, 100, 150, 200].forEach(s => { ctx.beginPath(); ctx.moveTo(X(s), p.t); ctx.lineTo(X(s), h - p.b); ctx.stroke(); ctx.fillText(String(s), X(s) - (s ? 9 : 3), h - 8) })
    const step = ym > 120 ? 40 : ym > 60 ? 20 : 10
    for (let c2 = step; c2 < ym; c2 += step) { ctx.beginPath(); ctx.moveTo(p.l, Y(c2)); ctx.lineTo(w - p.r, Y(c2)); ctx.stroke(); ctx.fillText(String(c2), 4, Y(c2) + 4) }
    ctx.strokeStyle = tk.ink; ctx.beginPath(); ctx.moveTo(p.l, Y(0)); ctx.lineTo(w - p.r, Y(0)); ctx.stroke()
    ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(K), Y(0)); ctx.lineTo(X(xm), Y(xm - K)); ctx.stroke()
    ctx.strokeStyle = tk.signal; ctx.lineWidth = 2.4; ctx.beginPath()
    for (let i = 1; i <= 220; i++) { const s = i / 220 * xm, c2 = bsCall(s, K, T, v, r).C; if (i > 1) ctx.lineTo(X(s), Y(c2)); else ctx.moveTo(X(s), Y(c2)) }
    ctx.stroke()
    const c0 = bsCall(S0, K, T, v, r).C
    ctx.setLineDash([3, 3]); ctx.strokeStyle = tk.muted; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(X(S0), Y(c0)); ctx.lineTo(X(S0), Y(0)); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = tk.signal; ctx.beginPath(); ctx.arc(X(S0), Y(c0), 5, 0, 6.2832); ctx.fill()
    ctx.fillStyle = tk.ink; ctx.fillText('S₀', X(S0) + 7, Y(c0) + 4)
    ctx.fillStyle = tk.muted; ctx.fillText('K', X(K) - 3, Y(0) - 6)
  }, [K, T, v, r])

  return (
    <article className="doc ticket">
      <header className="doc-head"><h3>{t.pricer.no}</h3><span>{date}</span></header>
      <div className="ticket-body">
        <p className="doc-title">{t.pricer.title}</p>
        <p className="doc-lede">{t.pricer.lede}</p>
        <div className="px">
          <div className="px-ctrl ctl">
            <div className="px-s0"><small>{t.pricer.s0}</small><strong>S₀ = 100</strong></div>
            <Slider id="kS" label={t.pricer.K} value={K} set={setK} min={60} max={160} step={1} out={String(K)} />
            <Slider id="tS" label={t.pricer.T} value={T} set={setT} min={0.25} max={5} step={0.25} out={f(T) + ' ' + (T >= 2 ? t.pricer.years : t.pricer.year)} />
            <Slider id="vS" label={t.pricer.v} value={v} set={setV} min={0.1} max={0.8} step={0.01} out={fmtPct(v * 100, 0, lang)} />
            <Slider id="rS" label={t.pricer.r} value={r} set={setR} min={0} max={0.1} step={0.0025} out={fmtPct(r * 100, 2, lang)} />
          </div>
          <div className="px-out">
            <div className="big"><small>{t.pricer.price}</small><strong>{f(C)}</strong><span className="mono">C = S₀N(d₁) − Ke<sup>−rT</sup>N(d₂)</span></div>
            <div className="greeks">
              {[gk.delta, gk.gamma, gk.vega, gk.theta].map((g, i) => (
                <div key={i}><small>{t.pricer.greeks[i]}</small><b>{f(g, [3, 4, 3, 4][i])}</b></div>
              ))}
            </div>
            <canvas ref={cv} id="pxCv" role="img" aria-label={t.pricer.aria} />
            <div className="px-leg mono">
              <span><i style={{ background: 'var(--ink)' }} />{t.pricer.payoff}</span>
              <span><i style={{ background: 'var(--signal)' }} />{t.pricer.value}</span>
            </div>
            <Html as="p" className="px-read" s={t.pricer.readHtml(K, Math.round(gk.pITM * 100), f(gk.delta))} />
            <div className="mc">
              <button type="button" onClick={() => setMc(mcCall(S0, K, T, v, r))}>{t.pricer.mc}</button>
              {mc
                ? <Html className="mono" s={t.pricer.mcHtml(f(mc.price), f(1.96 * mc.se), f(C), f(Math.abs(mc.price - C) / C * 100, 1))} />
                : <span className="mono">{t.pricer.mcIdle}</span>}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
