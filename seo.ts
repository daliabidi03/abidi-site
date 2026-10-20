// SEO, applied at build time (and in dev):
// - replaces %SITE_URL% in index.html,
// - injects the schema.org Person JSON-LD and a static fallback inside #root, both built
//   from src/content.ts so they never drift from the site (React replaces the fallback on load),
// - serves/emits robots.txt and sitemap.xml.
import type { Plugin } from 'vite'
import { LINKS, ME, fr } from './src/content'

const ALT_NAMES = ['Abidi Mouhamed Ali', 'Mohamed Ali Abidi', 'Abidi Mohamed Ali']
const JOB_TITLE = 'Ingénieur Full-Stack, Fintech & IA'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const stripTags = (html: string) => html.replace(/<[^>]*>/g, '')
const list = (items: string[]) => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`

function jsonLd(url: string) {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: ME,
    alternateName: ALT_NAMES,
    jobTitle: JOB_TITLE,
    description: fr.recruiter.summary,
    image: `${url}/og.jpg`,
    url: `${url}/`,
    email: `mailto:${LINKS.email}`,
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'ESPRIT', alternateName: "École Supérieure Privée d'Ingénierie et de Technologies", url: LINKS.esprit },
      { '@type': 'CollegeOrUniversity', name: 'École Polytechnique de Tunis', url: LINKS.polytech },
    ],
    sameAs: [LINKS.linkedin, LINKS.github],
  }
  // "<" escaped so the JSON can never close the <script> early.
  return `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`
}

function fallback() {
  const { hero, recruiter, exp, edu, contact } = fr
  return `<main class="wrap seo-fallback">
<h1>${esc(ME)}</h1>
<p><strong>${esc(hero.roleStrong)}</strong>${esc(hero.role)}</p>
<p>${esc(hero.avail)}</p>
<p>${esc(recruiter.summary)}</p>
<h2>${esc(exp.h2)}</h2>
${exp.items.map(e => `<h3>${esc(e.role)} · <a href="${esc(e.url)}">${esc(e.company)}</a></h3>
<p>${esc(e.when)} · ${esc(e.where)}</p>
<p>${esc(e.desc)}</p>
${list(e.bullets.map(esc))}`).join('\n')}
<h2>${esc(edu.h2)}</h2>
${list(edu.rows.map(([when, what, where]) => esc(`${when} · ${what} · ${stripTags(where)}`)))}
<h2>${esc(contact.h2)}</h2>
${list([
  `<a href="mailto:${esc(LINKS.email)}">${esc(LINKS.email)}</a>`,
  `<a href="${esc(LINKS.linkedin)}">LinkedIn</a>`,
  `<a href="${esc(LINKS.github)}">GitHub</a>`,
])}
</main>`
}

export function seo(siteUrl: string): Plugin {
  const url = siteUrl.replace(/\/+$/, '')
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`
  const sitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
  </url>
</urlset>
`
  return {
    name: 'seo',
    transformIndexHtml: {
      order: 'pre', // before Vite's own %ENV% replacement
      handler: html => html
        .replaceAll('%SITE_URL%', url)
        .replace('<!--json-ld-->', jsonLd(url))
        .replace('<!--fallback-->', fallback()),
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/robots.txt') { res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.end(robots) }
        else if (req.url === '/sitemap.xml') { res.setHeader('Content-Type', 'application/xml; charset=utf-8'); res.end(sitemap()) }
        else next()
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() })
    },
  }
}
