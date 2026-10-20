import { useEffect, useRef } from 'react'
import { ME } from '../content'
import { drawPrint } from '../lib/print'
import { onTheme, tokens } from '../lib/theme'

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
