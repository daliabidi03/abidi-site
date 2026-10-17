/** FNV-1a 32-bit hash: turns a name into a reproducible seed. */
export function fnv(s: string): number {
  let h = 0x811c9dc5
  for (const ch of s) {
    h ^= ch.codePointAt(0) ?? 0
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

/** Mulberry32: small, fast, seedable PRNG returning uniforms in [0, 1). */
export function mulberry(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Box-Muller: standard normal draws from a uniform generator. */
export const gaussOf = (r: () => number) => (): number => {
  let u = 0
  while (!u) u = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * r())
}

export const G = gaussOf(Math.random)

export const hexId = (s: number) => '#' + s.toString(16).toUpperCase().padStart(8, '0')

export function corr(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length)
  let ma = 0, mb = 0
  for (let i = 0; i < n; i++) { ma += a[i]; mb += b[i] }
  ma /= n; mb /= n
  let c = 0, va = 0, vb = 0
  for (let i = 0; i < n; i++) {
    const x = a[i] - ma, y = b[i] - mb
    c += x * y; va += x * x; vb += y * y
  }
  return c / Math.sqrt(va * vb || 1)
}
