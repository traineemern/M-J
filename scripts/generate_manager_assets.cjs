const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer-core')

const outputDir = path.resolve('public/models')
const siteUrl = process.env.DIORAMA_URL || 'http://127.0.0.1:5174/scripts/export_manager_assets.html'
fs.mkdirSync(outputDir, { recursive: true })

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    page.on('pageerror', (error) => console.error('PAGE_ERROR', error.message))
    await page.goto(siteUrl, { waitUntil: 'networkidle0' })
    await page.waitForFunction(() => typeof window.generateManagerAssets === 'function', { timeout: 15000 })
    const files = await page.evaluate(() => window.generateManagerAssets())
    for (const [name, base64] of Object.entries(files)) {
      const target = path.join(outputDir, name)
      const data = Buffer.from(base64, 'base64')
      fs.writeFileSync(target, data)
      console.log(`${name}\t${data.byteLength} bytes`)
    }
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
