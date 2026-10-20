import { useEffect, useRef, type DependencyList } from 'react'
import { fitCanvas, onTheme, tokens, type Tokens } from './theme'

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, tk: Tokens) => void

/**
 * Canvas redrawn when `deps` change, when its box is resized (including when a hidden tab
 * becomes visible) and when the theme changes. The canvas needs a fixed CSS height.
 */
export function useCanvas(draw: Draw, deps: DependencyList) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current, ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const paint = () => { const { w, h } = fitCanvas(c, ctx); if (w) draw(ctx, w, h, tokens()) }
    paint()
    const off = onTheme(paint)
    const ro = new ResizeObserver(paint)
    ro.observe(c)
    return () => { off(); ro.disconnect() }
  }, deps)
  return ref
}

/** A round axis step (1, 2, 2.5, 5 × 10ⁿ) giving about `target` intervals over `range`. */
export function niceStep(range: number, target: number) {
  const raw = range / target, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p
}
