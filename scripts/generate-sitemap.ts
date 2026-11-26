import fs from 'node:fs'
import path from 'node:path'

const BASE_URL = process.env.VITE_SITE_URL || 'https://mandjwaterwells.com'

const routes = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: 'services', changefreq: 'weekly', priority: '0.9' },
  { path: 'areas/newaygo', changefreq: 'weekly', priority: '0.9' },
  { path: 'about', changefreq: 'monthly', priority: '0.8' },
  { path: 'faq', changefreq: 'monthly', priority: '0.8' },
  { path: 'warranty', changefreq: 'monthly', priority: '0.8' },
  { path: 'contact', changefreq: 'monthly', priority: '0.8' },
]

const today = new Date().toISOString().split('T')[0]

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}/${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`

// Write to public folder
const publicDir = path.resolve(process.cwd(), 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8')
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8')

// If dist directory exists, write to dist as well
const distDir = path.resolve(process.cwd(), 'dist')
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8')
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8')
}

console.log('Successfully generated sitemap.xml and robots.txt')
