const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const puppeteer = require('puppeteer-core')

const output = path.resolve('artifacts/homepage-redesign-final')
const siteUrl = process.env.HOMEPAGE_URL || 'http://127.0.0.1:5181/'
fs.mkdirSync(output, { recursive: true })
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const desktop = await browser.newPage()
    await desktop.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
    await desktop.goto(siteUrl, { waitUntil: 'domcontentloaded' })
    await desktop.waitForSelector('#home-hero-title')
    await pause(180)
    await desktop.screenshot({ path: path.join(output, 'hero-intro-1280.png') })
    await pause(1820)
    await desktop.screenshot({ path: path.join(output, 'hero-2s-1280.png') })
    await pause(4800)
    await desktop.screenshot({ path: path.join(output, 'hero-revealed-1280.png') })
    await desktop.evaluate(() => window.scrollTo(0, 0))
    await pause(250)
    await desktop.screenshot({ path: path.join(output, 'header-top-1280.png'), clip: { x: 0, y: 0, width: 1280, height: 110 } })
    await desktop.evaluate(() => window.scrollTo(0, 100))
    await pause(300)
    await desktop.screenshot({ path: path.join(output, 'header-scrolled-1280.png'), clip: { x: 0, y: 0, width: 1280, height: 110 } })

    const banners = await desktop.$$('.service-banner')
    for (let index = 0; index < Math.min(2, banners.length); index += 1) {
      await banners[index].evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await pause(1100)
      await desktop.screenshot({ path: path.join(output, `service-banner-${index + 1}-1280.png`) })
    }
    await desktop.close()

    const mobile = await browser.newPage()
    await mobile.setViewport({ width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    await mobile.goto(siteUrl, { waitUntil: 'domcontentloaded' })
    await mobile.waitForSelector('#home-hero-title')
    await pause(6500)
    await mobile.screenshot({ path: path.join(output, 'hero-375.png') })
    await mobile.screenshot({ path: path.join(output, 'mobile-menu-closed-375.png') })
    await mobile.click('button[aria-label="Open menu"]')
    await pause(350)
    await mobile.screenshot({ path: path.join(output, 'mobile-menu-open-active-home-375.png') })
    await mobile.keyboard.press('Escape')
    await pause(250)
    await mobile.setViewport({ width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    const mobileBanners = await mobile.$$('.service-banner')
    if (mobileBanners[0]) {
      await mobileBanners[0].evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await pause(1100)
      await mobile.screenshot({ path: path.join(output, 'service-banner-375.png') })
    }
    await mobile.close()

    const recording = await browser.newPage()
    await recording.setViewport({ width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    await recording.goto(siteUrl, { waitUntil: 'domcontentloaded' })
    await recording.waitForSelector('button[aria-label="Open menu"]')
    await pause(200)
    const client = await recording.target().createCDPSession()
    const frames = []
    client.on('Page.screencastFrame', async ({ data, sessionId }) => {
      frames.push(Buffer.from(data, 'base64'))
      await client.send('Page.screencastFrameAck', { sessionId })
    })
    await client.send('Page.startScreencast', { format: 'jpeg', quality: 72, everyNthFrame: 2 })
    await pause(350)
    await recording.click('button[aria-label="Open menu"]')
    await pause(1100)
    await recording.keyboard.press('Escape')
    await pause(600)
    await recording.click('button[aria-label="Open menu"]')
    await pause(900)
    await recording.click('.mobile-nav-close')
    await pause(350)
    await client.send('Page.stopScreencast')
    await pause(200)
    const frameDir = path.join(output, 'menu-recording-frames')
    fs.mkdirSync(frameDir, { recursive: true })
    frames.forEach((frame, index) => fs.writeFileSync(path.join(frameDir, `frame-${String(index).padStart(5, '0')}.jpg`), frame))
    execFileSync('ffmpeg', ['-y', '-framerate', '12', '-i', path.join(frameDir, 'frame-%05d.jpg'), '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(output, 'mobile-menu-open-close.mp4')], { stdio: 'ignore' })
    fs.rmSync(frameDir, { recursive: true, force: true })
    console.log(JSON.stringify({ output, frames: frames.length }))
    await recording.close()
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
