import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { seo } from './seo'

// Public URL of the site: the only place to change it (canonical, Open Graph, JSON-LD, robots.txt, sitemap.xml).
const SITE_URL = 'https://mouhamed-ali-abidi.pages.dev'

// `npm run build`        → dist/ (to deploy on Cloudflare Pages)
// `npm run build:single` → dist-single/index.html, everything inlined in one file
export default defineConfig(({ mode }) => ({
  plugins: [react(), seo(SITE_URL), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build:
    mode === 'single'
      ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000 }
      : { outDir: 'dist' },
}))
