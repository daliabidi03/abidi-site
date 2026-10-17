import { useEffect, useRef, useState } from 'react'
import { Html, useI18n } from '../i18n'
import { fmtNum } from '../lib/finance'
import { fitCanvas, onTheme, reduceMotion, tokens } from '../lib/theme'
import { Section } from './common'

const fn = (x: number) => x * x * x / 3 - x + 1
const fd = (x: number) => x * x - 1
const XR = [-2.7, 2.7], YR = [-2.4, 4.4]
const hOf = (v: number) => 1.6 * Math.pow(10, -3 * v / 100)

function DerivativeBoard() {
  const { t, lang } = useI18n()
  const tt = t.beyond.teach
  const [A, setA] = useState(-1.7)
  const [hv, setHv] = useState(8)
  const cv = useRef<HTMLCanvasElement>(null)
  const anim = useRef(0)
  const drag = useRef(false)
  const h = hOf(hv), dir = A + h <= 2.6 ? 1 : -1, m = A + dir * h
  const fa = fn(A), fm = fn(m), rate = (fm - fa) / (m - A), d1 = fd(A), gap = Math.abs(rate - d1)
  const f = (x: number, n = 4) => fmtNum(x, n, lang)
  const hs = h >= 0.01 ? h.toFixed(3) : h.toExponential(1).replace('-', '−')

  useEffect(() => {
    const draw = () => {
      const c = cv.current, ctx = c?.getContext('2d')
      if (!c || !ctx) return
      const { w: BW, h: BH } = fitCanvas(c, ctx)
      if (!BW) return
      const C = tokens()
      const X = (x: number) => (x - XR[0]) / (XR[1] - XR[0]) * BW, Y = (y: number) => BH - (y - YR[0]) / (YR[1] - YR[0]) * BH
      ctx.lineWidth = 1; ctx.strokeStyle = C.rule
      for (let x = -2.5; x <= 2.51; x += 0.5) { ctx.beginPath(); ctx.moveTo(X(x), 0); ctx.lineTo(X(x), BH); ctx.stroke() }
      for (let y = -2; y <= 4.01; y += 0.5) { ctx.beginPath(); ctx.moveTo(0, Y(y)); ctx.lineTo(BW, Y(y)); ctx.stroke() }
      ctx.strokeStyle = C.muted; ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(BW, Y(0)); ctx.moveTo(X(0), 0); ctx.lineTo(X(0), BH); ctx.stroke()
      ctx.font = '11px ' + C.mono; ctx.fillStyle = C.muted
      ;[-2, -1, 1, 2].forEach(v => ctx.fillText(String(v), X(v) - 4, Y(0) + 14))
      ;[1, 2, 3, 4].forEach(v => ctx.fillText(String(v), X(0) + 5, Y(v) + 4))
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath()
      for (let i = 0; i <= 300; i++) { const x = XR[0] + (XR[1] - XR[0]) * i / 300; if (i) ctx.lineTo(X(x), Y(fn(x))); else ctx.moveTo(X(x), Y(fn(x))) }
      ctx.stroke()
      const line = (k: number, col: string, wd: number, dash: number[]) => {
        ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.setLineDash(dash); ctx.beginPath()
        ctx.moveTo(X(XR[0]), Y(fa + k * (XR[0] - A))); ctx.lineTo(X(XR[1]), Y(fa + k * (XR[1] - A))); ctx.stroke(); ctx.setLineDash([])
      }
      line(d1, C.muted, 1.2, [5, 5])
      line(rate, C.signal, 2.2, [])
      if (h > 0.12) {
        ctx.strokeStyle = C.cool; ctx.lineWidth = 1.6; ctx.beginPath()
        ctx.moveTo(X(A), Y(fa)); ctx.lineTo(X(m), Y(fa)); ctx.lineTo(X(m), Y(fm)); ctx.stroke()
        ctx.fillStyle = C.cool
        ctx.fillText('h', (X(A) + X(m)) / 2 - 3, Y(fa) + (fm > fa ? 14 : -6))
        ctx.fillText('Δy', X(m) + 6, (Y(fa) + Y(fm)) / 2 + 4)
      }
      const dot = (x: number, y: number, col: string, lab: string) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X(x), Y(y), 5, 0, 6.2832); ctx.fill()
        ctx.font = '600 12px ' + C.mono; ctx.fillText(lab, X(x) - 14, Y(y) - 9); ctx.font = '11px ' + C.mono
      }
      dot(m, fm, C.signal, 'M'); dot(A, fa, C.ink, 'A')
    }
    draw()
    const off = onTheme(draw)
    window.addEventListener('resize', draw)
    return () => { off(); window.removeEventListener('resize', draw) }
  }, [A, hv, h, m, fa, fm, rate, d1])

  useEffect(() => () => cancelAnimationFrame(anim.current), [])

  const go = () => {
    cancelAnimationFrame(anim.current)
    if (reduceMotion()) { setHv(100); return }
    const from = hv >= 99 ? 8 : hv, t0 = performance.now(), dur = 2400
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      setHv(from + (100 - from) * e)
      if (k < 1) anim.current = requestAnimationFrame(tick)
    }
    anim.current = requestAnimationFrame(tick)
  }
  const setFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setA(Math.max(-2.4, Math.min(2.4, XR[0] + (e.clientX - r.left) / r.width * (XR[1] - XR[0]))))
  }

  return (
    <div className="teach">
      <div className="teach-head">
        <span className="when">{tt.when}</span>
        <h3>{tt.title}</h3>
        <p>{tt.p1}</p>
        <Html as="p" s={tt.p2Html} />
        <ol className="steps">
          <li><b>{tt.steps[0]}</b><p>{tt.see}</p></li>
          <li><b>{tt.steps[1]}</b><p className="mono">[f(a+h) − f(a)] / h = ({f(fm)} − {f(fa)}) / {dir < 0 ? '−' : ''}{hs} = {f(rate)}</p></li>
          <li><b>{tt.steps[2]}</b><p>{gap < 0.002 ? tt.keepDone(f(d1)) : tt.keep(f(d1), gap.toFixed(4))}</p></li>
        </ol>
      </div>
      <div className="board">
        <div className="board-top"><span className="mono">f(x) = x³/3 − x + 1</span><span className="mono">a = {f(A, 2)}</span></div>
        <canvas
          ref={cv} id="bd" tabIndex={0} aria-label={tt.aria}
          onPointerDown={e => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); setFromEvent(e) }}
          onPointerMove={e => { if (drag.current) setFromEvent(e) }}
          onPointerUp={() => { drag.current = false }}
          onPointerCancel={() => { drag.current = false }}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault()
              setA(a => Math.max(-2.4, Math.min(2.4, a + (e.key === 'ArrowRight' ? 0.05 : -0.05))))
            }
          }}
        />
        <div className="board-ctrl">
          <label htmlFor="hS"><span>{tt.hLabel}</span><output>{hs}</output>
            <input type="range" id="hS" min={0} max={100} step={0.1} value={hv} onChange={e => { cancelAnimationFrame(anim.current); setHv(+e.target.value) }} />
          </label>
          <button type="button" onClick={go}>{tt.go}</button>
        </div>
        <p className="board-hint">{tt.hint}</p>
      </div>
    </div>
  )
}

export function Beyond() {
  const { t } = useI18n()
  return (
    <Section id="au-dela" n={7} label={t.beyond.label} aside={t.beyond.aside}>
      <h2>{t.beyond.h2}</h2>
      <DerivativeBoard />
      <div className="beyond">
        {t.beyond.others.map((o, i) => (
          <article key={i}><span className="when">{o.when}</span><Html as="h3" s={o.titleHtml} /><p>{o.text}</p></article>
        ))}
      </div>
    </Section>
  )
}
