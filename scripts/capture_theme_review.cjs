const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer-core')

const base = process.env.SITE_URL || 'http://127.0.0.1:5174'
const output = path.resolve('artifacts/theme-review')
fs.mkdirSync(output, { recursive: true })

;(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--no-sandbox'] })
  try {
    for (const [name, route] of [['home', '/'], ['services', '/services'], ['about', '/about'], ['faq', '/faq'], ['contact', '/contact']]) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 })
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' })
      await new Promise((resolve) => setTimeout(resolve, 900))
      await page.screenshot({ path: path.join(output, `${name}-1366.png`) })
      if (name === 'contact' || name === 'faq') {
        await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true })
        await new Promise((resolve) => setTimeout(resolve, 250))
        await page.screenshot({ path: path.join(output, `${name}-375.png`) })
      }
      await page.close()
    }
    console.log(`Theme screenshots saved in ${output}`)
  } finally { await browser.close() }
})().catch((error) => { console.error(error); process.exitCode = 1 })
