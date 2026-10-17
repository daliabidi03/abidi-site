import { gaussOf, mulberry } from './random'

/** Standard normal CDF (Abramowitz & Stegun 7.1.26, error < 1.5e-7). */
export function Ncdf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2)
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2)
  return x >= 0 ? (1 + y) / 2 : (1 - y) / 2
}

export const npdf = (x: number) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI)

export interface BS { C: number; d1: number; d2: number }

/** Black-Scholes price of a European call. */
export function bsCall(S: number, K: number, T: number, v: number, r: number): BS {
  if (T <= 0 || S <= 0) return { C: Math.max(S - K, 0), d1: 0, d2: 0 }
  const sq = v * Math.sqrt(T)
  const d1 = (Math.log(S / K) + (r + v * v / 2) * T) / sq
  const d2 = d1 - sq
  return { C: S * Ncdf(d1) - K * Math.exp(-r * T) * Ncdf(d2), d1, d2 }
}

export function greeks(S: number, K: number, T: number, v: number, r: number) {
  const { d1, d2 } = bsCall(S, K, T, v, r)
  const sT = Math.sqrt(T)
  return {
    delta: Ncdf(d1),
    gamma: npdf(d1) / (S * v * sT),
    vega: S * npdf(d1) * sT / 100,
    theta: (-S * npdf(d1) * v / (2 * sT) - r * K * Math.exp(-r * T) * Ncdf(d2)) / 365,
    pITM: Ncdf(d2),
  }
}

/** Monte Carlo price of the same call, with standard error. */
export function mcCall(S: number, K: number, T: number, v: number, r: number, n = 20000) {
  const g = gaussOf(mulberry((Math.random() * 4294967296) >>> 0))
  const df = Math.exp(-r * T), dr = (r - v * v / 2) * T, vs = v * Math.sqrt(T)
  let s1 = 0, s2 = 0
  for (let i = 0; i < n; i++) {
    const p = df * Math.max(S * Math.exp(dr + vs * g()) - K, 0)
    s1 += p; s2 += p * p
  }
  const m = s1 / n
  return { price: m, se: Math.sqrt((s2 / n - m * m) / n) }
}

/** One geometric Brownian motion path (used by the terminal's `simulate`). */
export function gbmPath(steps: number, mu: number, sigma: number, T = 1): number[] {
  const g = gaussOf(Math.random), dt = T / steps, out = [1]
  let S = 1
  for (let k = 0; k < steps; k++) {
    S *= Math.exp((mu - sigma * sigma / 2) * dt + sigma * Math.sqrt(dt) * g())
    out.push(S)
  }
  return out
}

export const fmtNum = (x: number, n: number, lang: 'fr' | 'en') => {
  const s = Math.abs(x).toFixed(n)
  return (x < 0 ? '−' : '') + (lang === 'fr' ? s.replace('.', ',') : s)
}
