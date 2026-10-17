import { useCallback, useEffect, useRef, useState } from 'react'
import { ME } from '../content'
import { useI18n } from '../i18n'
import { corr, fnv, gaussOf, hexId, mulberry } from '../lib/random'
import { DPR, onTheme, tokens } from '../lib/theme'
import { Section } from './common'

/** Draws 15 Brownian bridges as rings, seeded by the name. Returns the seed and one ring's increments. */
export function drawPrint(canvas: HTMLCanvasElement | null, name: string, color: string) {
  const seed = fnv(name.trim().toLowerCase() || '∅')
  const r = mulberry(seed), g = gaussOf(r)
  const K = 15, n = 220
  let inc: number[] = []
  const ctx = canvas?.getContext('2d')
  const S = canvas?.clientWidth || 300, d = DPR()
  if (canvas && ctx) {
    canvas.width = S * d; canvas.height = S * d; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, S, S)
    ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1, S / 240)
  }
  const cx = S / 2 + (r() - 0.5) * S * 0.05, cy = S / 2 + (r() - 0.5) * S * 0.05, ell = 0.82 + r() * 0.22, rot = r() * Math.PI
  for (let k = 0; k < K; k++) {
    const R = S * (0.05 + 0.4 * k / (K - 1))
    const Wp = [0]
    for (let i = 0; i < n; i++) Wp.push(Wp[i] + g() / Math.sqrt(n))
    const B = Wp.map((w, i) => w - i / n * Wp[n])
    if (k === 4) inc = B.slice(1).map((b, i) => b - B[i])
    const a = S * 0.04 * (0.6 + k / K)
    const full = k < 3, span = full ? 2 * Math.PI : 2 * Math.PI * (0.62 + r() * 0.3), st = r() * 2 * Math.PI
    if (!ctx) continue
    ctx.beginPath()
    for (let i = 0; i <= n; i++) {
      const tt = st + span * i / n, rr = Math.max(1, R + a * B[i])
      const x0 = rr * Math.cos(tt) * ell, y0 = rr * Math.sin(tt)
      const x = cx + x0 * Math.cos(rot) - y0 * Math.sin(rot), y = cy + x0 * Math.sin(rot) + y0 * Math.cos(rot)
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y)
    }
    if (full) ctx.closePath()
    ctx.stroke()
  }
  return { seed, inc }
}

export function printCorr(name: string) {
  const a = drawPrint(null, ME, ''), b = drawPrint(null, name, '')
  const same = name.trim().toLowerCase() === ME.toLowerCase()
  return { id: hexId(b.seed), rho: same ? 1 : corr(a.inc, b.inc) }
}

export function Fingerprint() {
  const { t } = useI18n()
  const [typed, setTyped] = useState<string | null>(null)
  const value = typed ?? t.print.def
  const aRef = useRef<HTMLCanvasElement>(null), bRef = useRef<HTMLCanvasElement>(null)
  const [ids, setIds] = useState({ a: '', b: '' })
  const [rho, setRho] = useState(0)
  const same = value.trim().toLowerCase() === ME.toLowerCase()

  const draw = useCallback(() => {
    const C = tokens()
    const mine = drawPrint(aRef.current, ME, C.signal)
    const yours = drawPrint(bRef.current, value, C.cool)
    setIds({ a: hexId(mine.seed), b: hexId(yours.seed) })
    setRho(same ? 1 : corr(mine.inc, yours.inc))
  }, [value, same])

  useEffect(() => {
    draw()
    const off = onTheme(draw)
    window.addEventListener('resize', draw)
    return () => { off(); window.removeEventListener('resize', draw) }
  }, [draw])

  const msg = same ? t.print.same : Math.abs(rho) < 0.08 ? t.print.zero : rho > 0 ? t.print.pos : t.print.neg
  return (
    <Section id="empreinte" n={1} label={t.print.label} aside={t.print.aside}>
      <h2>{t.print.h2}</h2>
      <p className="lede">{t.print.lede}</p>
      <div className="prints">
        <div className="print">
          <header><b>{ME}</b><span>{ids.a}</span></header>
          <canvas ref={aRef} aria-label={t.print.ariaMine} />
        </div>
        <div className="print">
          <header><b>{value.trim() || t.print.you}</b><span>{ids.b}</span></header>
          <canvas ref={bRef} aria-label={t.print.ariaYours} />
          <label htmlFor="you" className="sr">{t.print.yourName}</label>
          <input id="you" type="text" value={value} onChange={e => setTyped(e.target.value)} autoComplete="off" spellCheck={false} maxLength={40} />
        </div>
      </div>
      <div className="rho">
        <strong>ρ = {(rho >= 0 ? '+' : '−') + Math.abs(rho).toFixed(2)}</strong>
        <span>{msg}</span>
      </div>
    </Section>
  )
}

/** Small signature version of my fingerprint, for the footer. */
export function Signature() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const d = () => drawPrint(ref.current, ME, tokens().signal)
    d()
    return onTheme(d)
  }, [])
  return <canvas ref={ref} aria-hidden="true" className="sigcv" />
}
