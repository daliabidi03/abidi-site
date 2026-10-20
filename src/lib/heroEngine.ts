// Hero animation: the name and the portrait are made of dots, each one an
// Ornstein-Uhlenbeck process  dX = θ(μ − X)dt + σ dW  pulled back to its target μ.
import { G } from './random'
import { DPR, onTheme, reduceMotion, tokens } from './theme'

interface Dot { tx: number; ty: number; x: number; y: number; hot: boolean }
interface Tone { tx: number; ty: number; x: number; y: number; t: number }
type Pt = { x: number; y: number } | null

const PORTRAIT_INK = '#0F1A2A', PORTRAIT_SIGNAL = '#E4572E'

export interface HeroEls {
  name: HTMLCanvasElement
  portrait: HTMLCanvasElement
  frame: HTMLElement
  img: HTMLImageElement
  spreadOut: HTMLElement
  fmt: (spread: number) => string
  onCount: (n: number) => void
}

export function startHero(el: HeroEls) {
  const reduce = reduceMotion()
  const hx = el.name.getContext('2d')!
  const px = el.portrait.getContext('2d')!
  const sq = Math.sqrt(1 / 60), dt = 1 / 60

  // ---- name ----
  let P: Dot[] = [], W = 0, H = 0, gap = 4, first = true, ptr: Pt = null, visible = true, calm = 0
  function build() {
    const fam = tokens().display
    W = el.name.parentElement!.clientWidth
    if (!W) return
    const lines = W < 640 ? ['MOUHAMED', 'ALI ABIDI'] : ['MOUHAMED ALI', 'ABIDI']
    const m = document.createElement('canvas').getContext('2d')!
    m.font = `900 100px ${fam}`
    const mw = Math.max(...lines.map(l => m.measureText(l).width))
    const size = Math.min((W / mw) * 100 * 0.985, 210)
    const lh = size * 0.86
    H = Math.ceil(lh * lines.length + size * 0.06)
    gap = size > 150 ? 5 : size > 90 ? 4 : 3
    const d = DPR()
    el.name.width = W * d; el.name.height = H * d; el.name.style.height = H + 'px'
    hx.setTransform(d, 0, 0, d, 0, 0)
    const oc = document.createElement('canvas'); oc.width = W; oc.height = H
    const o = oc.getContext('2d')!
    o.font = `900 ${size}px ${fam}`
    lines.forEach((l, i) => { o.fillStyle = i === lines.length - 1 ? '#f00' : '#00f'; o.fillText(l, 0, lh * (i + 1) - size * 0.04) })
    const data = o.getImageData(0, 0, W, H).data
    const np: Dot[] = []
    for (let y = 0; y < H; y += gap) for (let x = 0; x < W; x += gap) {
      const k = (y * W + x) * 4
      if (data[k + 3] > 140) np.push({
        tx: x, ty: y,
        x: first ? x + G() * 2 : Math.random() * W, y: first ? y + G() * 2 : Math.random() * H,
        hot: data[k] > data[k + 2],
      })
    }
    P = np; first = false
    draw()
  }
  function step() {
    const th = calm > 0 ? 14 : 4
    if (calm > 0) calm--
    for (const p of P) {
      let s = 4.5
      if (ptr) { const dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy; if (d2 < 18000) s += 120 * Math.exp(-d2 / 4500) }
      p.x += th * (p.tx - p.x) * dt + s * sq * G()
      p.y += th * (p.ty - p.y) * dt + s * sq * G()
    }
  }
  let frame = 0
  function draw() {
    const C = tokens()
    hx.clearRect(0, 0, W, H)
    const s = gap * 0.72
    let sum = 0
    const far: boolean[] = new Array(P.length)
    P.forEach((p, i) => { const d = Math.hypot(p.x - p.tx, p.y - p.ty); far[i] = d > 9; sum += d })
    const pass = (col: string, f: (p: Dot, i: number) => boolean) => { hx.fillStyle = col; P.forEach((p, i) => { if (f(p, i)) hx.fillRect(p.x, p.y, s, s) }) }
    pass(C.ink, (p, i) => !p.hot && !far[i])
    pass(C.signal, (p, i) => p.hot && !far[i])
    pass(C.cool, (_p, i) => far[i])
    if (frame % 12 === 0) el.spreadOut.textContent = el.fmt(sum / Math.max(P.length, 1))
  }
  function kick(at: Pt, R: number, f: number) {
    for (const p of P) {
      if (at) { const dx = p.x - at.x, dy = p.y - at.y, d = Math.hypot(dx, dy) || 1; if (d < R) { const k = (1 - d / R) * f; p.x += dx / d * k + G() * 8; p.y += dy / d * k + G() * 8 } }
      else { p.x += G() * f; p.y += G() * f }
    }
    if (reduce) { draw(); setTimeout(() => { P.forEach(p => { p.x = p.tx; p.y = p.ty }); draw() }, 700) }
  }

  // ---- portrait ----
  let Q: Tone[] = [], PW = 0, PH = 0, pstep = 3.5, pptr: Pt = null, pvis = true, pcalm = 0, clear = false
  function pBuild() {
    if (!el.img.complete || !el.img.naturalWidth) return
    PW = el.frame.clientWidth; PH = el.frame.clientHeight
    if (!PW || !PH) return
    const d = DPR()
    el.portrait.width = PW * d; el.portrait.height = PH * d; px.setTransform(d, 0, 0, d, 0, 0)
    pstep = PW > 380 ? 3.6 : 3.4
    const cols = Math.floor(PW / pstep), rows = Math.floor(PH / pstep)
    const oc = document.createElement('canvas'); oc.width = cols; oc.height = rows
    const o = oc.getContext('2d')!
    o.drawImage(el.img, 0, 0, cols, rows)
    const data = o.getImageData(0, 0, cols, rows).data
    Q = []
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const k = (y * cols + x) * 4, r = data[k] / 255, g = data[k + 1] / 255, b = data[k + 2] / 255
      const l = 0.299 * r + 0.587 * g + 0.114 * b, mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = (mx - mn) / (mx + 1e-6)
      if (l > 0.7 && sat < 0.1) continue // light grey studio background
      const t = Math.min(1, Math.max(0, (l - 0.12) / 0.66)), tx = (x + 0.5) * pstep, ty = (y + 0.5) * pstep
      Q.push({ tx, ty, x: tx, y: ty, t })
    }
    el.onCount(Q.length)
    pDraw()
  }
  function pStep() {
    const th = pcalm > 0 ? 14 : 4
    if (pcalm > 0) pcalm--
    for (const q of Q) {
      let s = 2.5
      if (pptr) { const dx = q.x - pptr.x, dy = q.y - pptr.y, d2 = dx * dx + dy * dy; if (d2 < 9000) s += 90 * Math.exp(-d2 / 2400) }
      q.x += th * (q.tx - q.x) * dt + s * sq * G()
      q.y += th * (q.ty - q.y) * dt + s * sq * G()
    }
  }
  // The portrait is a halftone of a light photo: it keeps light-theme colors in both themes
  // (in dark mode, inverted dots would turn the white shirt into a hole and the face into a negative).
  function pDraw() {
    const m = pstep * 0.58
    px.clearRect(0, 0, PW, PH)
    for (const [col, wantFar] of [[PORTRAIT_INK, false], [PORTRAIT_SIGNAL, true]] as [string, boolean][]) {
      px.fillStyle = col; px.beginPath()
      for (const q of Q) {
        const far = Math.abs(q.x - q.tx) + Math.abs(q.y - q.ty) > 7
        if (far !== wantFar) continue
        const r = Math.pow(1 - q.t, 1.1) * m
        if (r < 0.32) continue
        px.moveTo(q.x + r, q.y); px.arc(q.x, q.y, r, 0, 6.2832)
      }
      px.fill()
    }
  }
  function pKick(at: Pt, R: number, f: number) {
    for (const q of Q) {
      if (at) { const dx = q.x - at.x, dy = q.y - at.y, d = Math.hypot(dx, dy) || 1; if (d < R) { const k = (1 - d / R) * f; q.x += dx / d * k + G() * 5; q.y += dy / d * k + G() * 5 } }
      else { q.x += G() * f; q.y += G() * f }
    }
    if (reduce) { pDraw(); setTimeout(() => { Q.forEach(q => { q.x = q.tx; q.y = q.ty }); pDraw() }, 700) }
  }

  // ---- loop ----
  let raf = 0
  function loop() {
    frame++
    if (visible) { step(); draw() }
    const pOn = pvis && Q.length > 0 && !clear
    if (pOn) { pStep(); pDraw() }
    raf = visible || pOn ? requestAnimationFrame(loop) : 0
  }
  function start() { if (!reduce && !raf && (visible || pvis)) raf = requestAnimationFrame(loop) }

  // ---- events ----
  const rel = (cv: HTMLCanvasElement, e: PointerEvent) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  const on = <K extends keyof HTMLElementEventMap>(t: HTMLElement, ev: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    t.addEventListener(ev, fn as EventListener); return () => t.removeEventListener(ev, fn as EventListener)
  }
  const offs: (() => void)[] = [
    on(el.name, 'pointermove', e => { if (e.pointerType === 'mouse') { ptr = rel(el.name, e); start() } }),
    on(el.name, 'pointerleave', () => { ptr = null }),
    on(el.name, 'pointerdown', e => { kick(rel(el.name, e), 170, 90); start() }),
    on(el.portrait, 'pointermove', e => { if (e.pointerType === 'mouse') { pptr = rel(el.portrait, e); start() } }),
    on(el.portrait, 'pointerleave', () => { pptr = null }),
    on(el.portrait, 'pointerdown', e => { pKick(rel(el.portrait, e), 110, 45); start() }),
  ]
  const io1 = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) start() }); io1.observe(el.name)
  const io2 = new IntersectionObserver(es => { pvis = es[0].isIntersecting; if (pvis) start() }); io2.observe(el.frame)
  let rt = 0
  const onResize = () => {
    clearTimeout(rt)
    rt = window.setTimeout(() => {
      if (Math.abs(el.name.parentElement!.clientWidth - W) > 2) { first = true; build() }
      if (el.frame.clientWidth !== PW) pBuild()
    }, 150)
  }
  window.addEventListener('resize', onResize)
  const offTheme = onTheme(() => { draw(); pDraw() })
  const onImg = () => { pBuild(); start() }
  if (el.img.complete) pBuild(); else el.img.addEventListener('load', onImg)

  build()
  document.fonts?.ready.then(() => { first = true; build() })
  start()

  return {
    api: {
      shock() { kick(null, 0, 70); pKick(null, 0, 40); start() },
      calm() {
        calm = 90; pcalm = 90; ptr = null; pptr = null
        if (reduce) { P.forEach(p => { p.x = p.tx; p.y = p.ty }); Q.forEach(q => { q.x = q.tx; q.y = q.ty }); draw(); pDraw() }
      },
      setClear(b: boolean) { clear = b; if (!b) { pDraw(); start() } },
    },
    dispose() {
      cancelAnimationFrame(raf); raf = 0
      offs.forEach(f => f()); io1.disconnect(); io2.disconnect()
      window.removeEventListener('resize', onResize); offTheme()
      el.img.removeEventListener('load', onImg)
    },
  }
}
