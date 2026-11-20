const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer-core')

const base = process.env.SITE_URL || 'http://localhost:5173'
const out = path.resolve('artifacts/phase-deliverables')
fs.mkdirSync(out, { recursive: true })

;(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--no-sandbox'] })
  try {
    const desktop = await browser.newPage()
    await desktop.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 })
    await desktop.goto(base, { waitUntil: 'networkidle0' })
    await desktop.waitForSelector('#home-hero')
    await desktop.screenshot({ path: path.join(out, 'home-1280.png') })
    await desktop.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }))
    await new Promise((resolve) => setTimeout(resolve, 1200))
    await desktop.evaluate(() => document.querySelector('#journey-3d-section')?.scrollIntoView())
    await desktop.waitForSelector('#journey-3d-section canvas', { timeout: 20000 })
    await new Promise((resolve) => setTimeout(resolve, 4000))
    const section = await desktop.$('#journey-3d-section')
    await section.screenshot({ path: path.join(out, 'home-diorama-1280.png') })

    // Capture the 3D drilling story from its first frame through the final beat.
    await desktop.evaluate(() => {
      const canvas = document.querySelector('#journey-3d-section canvas')
      window.__chunks = []
      window.__rec = new MediaRecorder(canvas.captureStream(24), { mimeType: 'video/webm' })
      window.__rec.ondataavailable = (e) => { if (e.data.size) window.__chunks.push(e.data) }
      window.__rec.start()
    })
    const stageTop = await desktop.$eval('#journey-3d-section', (node) => node.getBoundingClientRect().top + window.scrollY)
    for (let i = 0; i <= 72; i++) {
      await desktop.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), stageTop + 900 * 4 * i / 72)
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
    const movie = await desktop.evaluate(async () => new Promise((resolve) => {
      window.__rec.onstop = async () => {
        const bytes = new Uint8Array(await new Blob(window.__chunks, { type: 'video/webm' }).arrayBuffer())
        let binary = ''
        bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
        resolve(btoa(binary))
      }
      window.__rec.stop()
    }))
    fs.writeFileSync(path.join(out, 'home-drilling-story.webm'), Buffer.from(movie, 'base64'))

    await desktop.goto(`${base}/services`, { waitUntil: 'networkidle0' })
    await desktop.screenshot({ path: path.join(out, 'services-1280.png'), fullPage: true })
    await desktop.goto(`${base}/about`, { waitUntil: 'networkidle0' })
    await desktop.screenshot({ path: path.join(out, 'about-1280.png'), fullPage: true })
    await desktop.evaluate(() => [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Newaygo')?.click())
    await desktop.screenshot({ path: path.join(out, 'about-service-area-1280.png') })
    await desktop.goto(`${base}/faq`, { waitUntil: 'networkidle0' })
    await desktop.screenshot({ path: path.join(out, 'faq-cards-1280.png'), fullPage: true })
    await desktop.goto(`${base}/contact`, { waitUntil: 'networkidle0' })
    await desktop.screenshot({ path: path.join(out, 'contact-1280.png'), fullPage: true })
    await desktop.close()

    const mobile = await browser.newPage()
    await mobile.setViewport({ width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    await mobile.goto(base, { waitUntil: 'networkidle0' })
    await mobile.screenshot({ path: path.join(out, 'home-375.png') })
    await mobile.evaluate(() => window.scrollTo({ top: 850, behavior: 'instant' }))
    await new Promise((resolve) => setTimeout(resolve, 1200))
    await mobile.evaluate(() => document.querySelector('#journey-3d-section')?.scrollIntoView())
    await mobile.waitForSelector('#journey-3d-section canvas', { timeout: 20000 })
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await (await mobile.$('#journey-3d-section')).screenshot({ path: path.join(out, 'home-diorama-375.png') })
    await mobile.goto(`${base}/services`, { waitUntil: 'networkidle0' })
    await mobile.screenshot({ path: path.join(out, 'services-375.png'), fullPage: true })
    await mobile.goto(`${base}/about`, { waitUntil: 'networkidle0' })
    await mobile.screenshot({ path: path.join(out, 'about-375.png'), fullPage: true })
    await mobile.goto(`${base}/faq`, { waitUntil: 'networkidle0' })
    await mobile.goto(`${base}/contact`, { waitUntil: 'networkidle0' })
    await mobile.screenshot({ path: path.join(out, 'contact-step-1-375.png'), fullPage: true })
    await mobile.$eval('input[name="name"]', (input) => { input.value = 'Jamie Example'; input.dispatchEvent(new Event('input', { bubbles: true })) })
    await mobile.$eval('input[name="phone"]', (input) => { input.value = '616-555-0123'; input.dispatchEvent(new Event('input', { bubbles: true })) })
    await mobile.$eval('input[name="cityTownship"]', (input) => { input.value = 'Casnovia'; input.dispatchEvent(new Event('input', { bubbles: true })) })
    await mobile.evaluate(() => [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Next')?.click())
    await mobile.screenshot({ path: path.join(out, 'contact-step-2-375.png'), fullPage: true })
    await mobile.close()
    console.log(`Captured screenshots and recording in ${out}`)
  } finally { await browser.close() }
})().catch((error) => { console.error(error); process.exitCode = 1 })
