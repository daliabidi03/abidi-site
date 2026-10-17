import { useEffect, useRef, useState } from 'react'
import { Html, useI18n } from '../i18n'
import { bsCall, fmtNum, greeks, mcCall } from '../lib/finance'
import { fitCanvas, onTheme, tokens } from '../lib/theme'
import { Section } from './common'

const S0 = 100

export function Pricer() {
  const { t, lang } = useI18n()
  const [K, setK] = useState(90)
  const [T, setT] = useState(2)
  const [v, setV] = useState(0.35)
  const [r, setR] = useState(0.04)
  const [mc, setMc] = useState<{ price: number; se: number } | null>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const f = (x: number, n = 2) => fmtNum(x, n, lang)
  const C = bsCall(S0, K, T, v, r).C
  const gk = greeks(S0, K, T, v, r)

  useEffect(() => { setMc(null) }, [K, T, v, r])

  useEffect(() => {
    const draw = () => {
      const c = cv.current, ctx = c?.getContext('2d')
      if (!c || !ctx) return
      const { w, h } = fitCanvas(c, ctx)
      if (!w) return
      const tk = tokens(), p = { l: 34, r: 10, t: 10, b: 24 }, xm = 220
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
    }
    draw()
    const off = onTheme(draw)
    window.addEventListener('resize', draw)
    return () => { off(); window.removeEventListener('resize', draw) }
  }, [K, T, v, r])

  const slider = (id: string, label: string, val: number, set: (n: number) => void, min: number, max: number, step: number, out: string) => (
    <label htmlFor={id}>
      <span>{label}</span><output>{out}</output>
      <input id={id} type="range" min={min} max={max} step={step} value={val} onChange={e => set(+e.target.value)} />
    </label>
  )

  return (
    <Section id="pricer" n={3} label={t.pricer.label} aside={t.pricer.aside}>
      <h2>{t.pricer.h2}</h2>
      <p className="lede">{t.pricer.lede}</p>
      <div className="px">
        <div className="px-ctrl">
          <div className="px-s0"><small>{t.pricer.s0}</small><strong>S₀ = 100</strong></div>
          {slider('kS', t.pricer.K, K, setK, 60, 160, 1, String(K))}
          {slider('tS', t.pricer.T, T, setT, 0.25, 5, 0.25, f(T) + ' ' + (T >= 2 ? t.pricer.years : t.pricer.year))}
          {slider('vS', t.pricer.v, v, setV, 0.1, 0.8, 0.01, Math.round(v * 100) + ' %')}
          {slider('rS', t.pricer.r, r, setR, 0, 0.1, 0.0025, f(r * 100) + ' %')}
        </div>
        <div className="px-out">
          <div className="px-price"><small>{t.pricer.price}</small><strong>{f(C)}</strong><span className="mono">C = S₀N(d₁) − Ke<sup>−rT</sup>N(d₂)</span></div>
          <div className="greeks">
            {[gk.delta, gk.gamma, gk.vega, gk.theta].map((g, i) => (
              <div key={i}><small>{t.pricer.greeks[i]}</small><b>{f(g, [3, 4, 3, 4][i])}</b></div>
            ))}
          </div>
          <canvas ref={cv} id="pxCv" aria-label={t.pricer.aria} />
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
    </Section>
  )
}
