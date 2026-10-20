// My fingerprint: 15 Brownian bridges closed into rings, seeded by the name.
// Used by the footer signature and, through scripts/favicon.ts, by the favicon.
import { fnv, gaussOf, mulberry } from './random'
import { DPR } from './theme'

export interface Ring { pts: [number, number][]; closed: boolean }

/** Geometry of the rings in an S×S box: always the same for the same name. */
export function printRings(name: string, S: number): Ring[] {
  const r = mulberry(fnv(name.trim().toLowerCase() || '∅')), g = gaussOf(r)
  const K = 15, n = 220
  const cx = S / 2 + (r() - 0.5) * S * 0.05, cy = S / 2 + (r() - 0.5) * S * 0.05, ell = 0.82 + r() * 0.22, rot = r() * Math.PI
  const rings: Ring[] = []
  for (let k = 0; k < K; k++) {
    const R = S * (0.05 + 0.4 * k / (K - 1))
    const Wp = [0]
    for (let i = 0; i < n; i++) Wp.push(Wp[i] + g() / Math.sqrt(n))
    const B = Wp.map((w, i) => w - i / n * Wp[n])
    const a = S * 0.04 * (0.6 + k / K)
    const full = k < 3, span = full ? 2 * Math.PI : 2 * Math.PI * (0.62 + r() * 0.3), st = r() * 2 * Math.PI
    const pts: [number, number][] = []
    for (let i = 0; i <= n; i++) {
      const tt = st + span * i / n, rr = Math.max(1, R + a * B[i])
      const x0 = rr * Math.cos(tt) * ell, y0 = rr * Math.sin(tt)
      pts.push([cx + x0 * Math.cos(rot) - y0 * Math.sin(rot), cy + x0 * Math.sin(rot) + y0 * Math.cos(rot)])
    }
    rings.push({ pts, closed: full })
  }
  return rings
}

/** Draws the fingerprint of `name` on a square canvas, at device pixel ratio. */
export function drawPrint(canvas: HTMLCanvasElement | null, name: string, color: string) {
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return
  const S = canvas.clientWidth || 300, d = DPR()
  canvas.width = S * d; canvas.height = S * d; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, S, S)
  ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1, S / 240)
  for (const { pts, closed } of printRings(name, S)) {
    ctx.beginPath()
    pts.forEach(([x, y], i) => { if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y) })
    if (closed) ctx.closePath()
    ctx.stroke()
  }
}
