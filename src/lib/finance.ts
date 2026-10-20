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

/** Fixed decimals, the language's decimal separator, non-breaking thousands groups in FR; never "−0". */
export const fmtNum = (x: number, n: number, lang: 'fr' | 'en') => {
  const [int, dec] = Math.abs(x).toFixed(n).split('.')
  const g = int.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'fr' ? '\u00a0' : ',')
  const neg = x < 0 && Number(Math.abs(x).toFixed(n)) !== 0
  return (neg ? '−' : '') + g + (dec ? (lang === 'fr' ? ',' : '.') + dec : '')
}

/** A number as typed (no forced decimals), with the language's decimal separator. */
export const fmtRaw = (x: number, lang: 'fr' | 'en') =>
  (x < 0 ? '−' : '') + String(Math.abs(x)).replace('.', lang === 'fr' ? ',' : '.')

/** "8,5 %" in French, "8.5%" in English. */
export const fmtPct = (x: number, n: number, lang: 'fr' | 'en') => fmtNum(x, n, lang) + (lang === 'fr' ? '\u00a0%' : '%')

/** "80 000,00 TND" in French, "TND 80,000.00" in English. */
export const fmtTND = (x: number, lang: 'fr' | 'en', n = 2) =>
  lang === 'fr' ? fmtNum(x, n, lang) + '\u00a0TND' : 'TND\u00a0' + fmtNum(x, n, lang)

/** Monthly payment of an amortizing loan: M = C·i / (1 − (1+i)^−n), i = annual rate / 12. */
export function loanPayment(C: number, months: number, ratePct: number): number {
  const i = ratePct / 100 / 12
  return i === 0 ? C / months : C * i / (1 - Math.pow(1 + i, -months))
}

/** Amortization schedule summed by year: principal repaid and interest paid. */
export function amortizationByYear(C: number, months: number, ratePct: number) {
  const i = ratePct / 100 / 12, M = loanPayment(C, months, ratePct)
  const years: { principal: number; interest: number }[] = []
  let bal = C
  for (let k = 0; k < months; k++) {
    const int = bal * i, pr = M - int
    bal -= pr
    if (k % 12 === 0) years.push({ principal: 0, interest: 0 })
    years[years.length - 1].principal += pr
    years[years.length - 1].interest += int
  }
  return years
}

/** Premiums per policyholder and per year: pure = p × mean claim, gross = pure × (1 + loading). */
export function premiums(p: number, cost: number, loading: number) {
  const pure = p * cost
  return { pure, gross: pure * (1 + loading) }
}

/** Binomial(N, p) draws by inverse CDF of the uniforms `us` (pmf built in log space, so large N does not underflow). */
export function binomialQuantiles(N: number, p: number, us: ArrayLike<number>): Int32Array {
  const logs = new Float64Array(N + 1), lr = Math.log(p / (1 - p))
  let lp = N * Math.log1p(-p), mx = -Infinity
  for (let k = 0; k <= N; k++) { logs[k] = lp; if (lp > mx) mx = lp; lp += Math.log((N - k) / (k + 1)) + lr }
  const cdf = new Float64Array(N + 1)
  let s = 0
  for (let k = 0; k <= N; k++) { s += Math.exp(logs[k] - mx); cdf[k] = s }
  const out = new Int32Array(us.length)
  for (let j = 0; j < us.length; j++) {
    const u = us[j] * s
    let lo = 0, hi = N
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < u) lo = mid + 1; else hi = mid }
    out[j] = lo
  }
  return out
}
