// Writes public/favicon.svg: my fingerprint (the rings of drawPrint), in the signal orange.
// Run: npx esbuild scripts/favicon.ts --bundle --platform=node --format=esm --log-level=warning | node --input-type=module
import { writeFileSync } from 'node:fs'
import { ME } from '../src/content'
import { printRings } from '../src/lib/print'

const S = 64
const path = printRings(ME, S)
  .map(({ pts, closed }) => {
    // Every third point is plenty at icon size and keeps the file small.
    const kept = pts.filter((_, i) => i % 3 === 0 || i === pts.length - 1)
    return 'M' + kept.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L') + (closed ? 'Z' : '')
  })
  .join('')

writeFileSync(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><path d="${path}" fill="none" stroke="#E4572E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>\n`,
)
