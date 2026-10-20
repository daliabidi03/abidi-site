export interface Tokens {
  ink: string; signal: string; cool: string; muted: string; rule: string
  paper: string; panel: string; mono: string; display: string
}

const css = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim()

let cache: Tokens | null = null
function read(): Tokens {
  return {
    ink: css('--ink'), signal: css('--signal'), cool: css('--cool'), muted: css('--muted'),
    rule: css('--rule'), paper: css('--paper'), panel: css('--panel'),
    mono: css('--mono') || 'monospace', display: css('--display') || 'sans-serif',
  }
}

/** Current color/font tokens, read from CSS custom properties. */
export function tokens(): Tokens {
  if (!cache) cache = read()
  return cache
}

const subs = new Set<() => void>()
function fire() { cache = read(); subs.forEach(f => f()) }
let wired = false
function wire() {
  if (wired) return
  wired = true
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', fire)
  new MutationObserver(fire).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}

/** Subscribe to light/dark changes; returns an unsubscribe function. */
export function onTheme(cb: () => void): () => void {
  wire()
  subs.add(cb)
  return () => { subs.delete(cb) }
}

export const DPR = () => Math.min(window.devicePixelRatio || 1, 2)
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/** Size a canvas to its CSS box at device pixel ratio; returns css width/height. */
export function fitCanvas(cv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const w = cv.clientWidth, h = cv.clientHeight, d = DPR()
  cv.width = Math.round(w * d); cv.height = Math.round(h * d)
  ctx.setTransform(d, 0, 0, d, 0, 0)
  ctx.clearRect(0, 0, w, h)
  return { w, h }
}
