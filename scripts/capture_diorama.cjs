const puppeteer = require('puppeteer-core')
const fs = require('node:fs')
const path = require('node:path')

const outputDir = path.resolve('artifacts/diorama')
const siteUrl = process.env.DIORAMA_URL || 'http://127.0.0.1:5174/'
fs.mkdirSync(outputDir, { recursive: true })

async function scrollToProgress(page, progress, stageTop, distance) {
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' }), stageTop + distance * progress)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const measured = await page.$eval('#journey-3d-section [class*="font-mono"]', (el) => Number.parseInt(el.textContent || '0', 10) / 100)
    const scrollY = await page.evaluate(() => window.scrollY)
    const correctedTarget = scrollY + (progress - measured) * distance
    await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' }), correctedTarget)
    await new Promise((resolve) => setTimeout(resolve, 650))
  }
}

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    page.on('pageerror', (error) => console.error('PAGE_ERROR', error.message))
    page.on('console', (message) => { if (message.type() === 'error') console.error('PAGE_CONSOLE_ERROR', message.text()) })
    page.on('requestfailed', (request) => console.error('REQUEST_FAILED', request.url(), request.failure()?.errorText))
    await page.setViewport({ width: 1280, height: 850 })
    await page.goto(siteUrl, { waitUntil: 'networkidle0' })
    await page.waitForSelector('#journey-3d-section canvas', { timeout: 15000 })
    const stageTop = await page.$eval('#journey-3d-section', (el) => el.getBoundingClientRect().top + window.scrollY)
    const distance = await page.evaluate(() => window.innerHeight * 3.45)
    const requestedBeats = [
      ['beat-5-end', 0.535],
      ['beat-6-start', 0.54],
      ['beat-6-end', 0.70],
      ['beat-7-water', 0.76],
      ['beat-8-end', 0.90],
      ['beat-9-end', 0.995],
    ]
    for (const [name, progress] of requestedBeats) {
      await scrollToProgress(page, progress, stageTop, distance)
      const state = await page.evaluate(() => ({
        scrollY: Math.round(window.scrollY),
        rect: document.querySelector('#journey-3d-section')?.getBoundingClientRect().toJSON(),
        progress: document.querySelector('#journey-3d-section [class*="font-mono"]')?.textContent,
      }))
      console.log(name, JSON.stringify(state))
      await page.screenshot({ path: path.join(outputDir, `diorama-${name}-1280.png`) })
      if (name === 'beat-7-water') fs.copyFileSync(path.join(outputDir, `diorama-${name}-1280.png`), path.join(outputDir, 'diorama-cards-1280.png'))
    }
    const metrics = await page.$eval('#journey-3d-section', (el) => ({
      drawCalls: Number(el.getAttribute('data-draw-calls') || 0),
      canvas: Boolean(el.querySelector('canvas')),
    }))
    console.log(JSON.stringify({ metrics, outputDir }, null, 2))

    const mobile = await browser.newPage()
    await mobile.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true })
    await mobile.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await mobile.goto(siteUrl, { waitUntil: 'networkidle0' })
    const mobileStageTop = await mobile.$eval('[aria-label="M&J Water Wells: Step-by-Step Well Journey"]', (el) => el.getBoundingClientRect().top + window.scrollY)
    await mobile.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), mobileStageTop)
    await new Promise((resolve) => setTimeout(resolve, 500))
    await mobile.screenshot({ path: path.join(outputDir, 'diorama-poster-375.png') })
    await mobile.close()

    await page.close()
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
