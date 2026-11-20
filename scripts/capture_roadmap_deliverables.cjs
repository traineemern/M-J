const fs = require('node:fs')
const path = require('node:path')
const { spawn } = require('node:child_process')
const puppeteer = require('puppeteer-core')
const ffmpeg = require('ffmpeg-static')

const base = process.env.SITE_URL || 'http://127.0.0.1:5174'
const output = path.resolve('artifacts/roadmap')
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
fs.mkdirSync(output, { recursive: true })

async function recordJourney(browser, { mobile = false } = {}) {
  const page = await browser.newPage()
  const width = mobile ? 375 : 1280
  const height = mobile ? 812 : 900
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile })
  await page.goto(`${base}/services`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.roadmap-stage')
  await pause(1200)
  const stageTop = await page.$eval('.roadmap-stage', (node) => node.getBoundingClientRect().top + window.scrollY)
  const stageStart = mobile ? stageTop - 72 : stageTop - 72
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), stageStart)
  await pause(1000)

  if (mobile) {
    await page.evaluate(() => document.querySelector('.roadmap-mobile-list')?.scrollIntoView({ block: 'start' }))
    await pause(500)
    await page.screenshot({ path: path.join(output, 'roadmap-mobile-375.png') })
  } else {
    for (const [step, progress] of [[1, 0], [4, 3 / 7], [8, 1]]) {
      await page.evaluate(({ top, progress }) => window.scrollTo({ top: top + window.innerHeight * 7 * progress, behavior: 'instant' }), { top: stageStart, progress })
      await pause(700)
      await page.screenshot({ path: path.join(output, `roadmap-step-${step}-1280.png`) })
    }
  }

  const framesDir = path.join(output, mobile ? 'mobile-frames' : 'desktop-frames')
  fs.rmSync(framesDir, { recursive: true, force: true })
  fs.mkdirSync(framesDir, { recursive: true })
  const client = await page.target().createCDPSession()
  let frame = 0
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    fs.writeFileSync(path.join(framesDir, `frame-${String(frame++).padStart(5, '0')}.jpg`), Buffer.from(data, 'base64'))
    await client.send('Page.screencastFrameAck', { sessionId })
  })
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 72, everyNthFrame: 4 })
  const start = stageStart
  const span = mobile ? Math.max(1, await page.evaluate(() => document.querySelector('.roadmap-mobile-list')?.scrollHeight ?? 1)) : height * 7
  const duration = mobile ? 8000 : 14000
  const frames = mobile ? 64 : 112
  for (let index = 0; index <= frames; index++) {
    const progress = index / frames
    const target = mobile ? start + span * progress : start + span * progress
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), target)
    await pause(duration / frames)
  }
  await client.send('Page.stopScreencast')
  await pause(500)
  await page.close()
  const videoPath = path.join(output, mobile ? 'roadmap-mobile.webm' : 'roadmap-desktop.webm')
  await new Promise((resolve, reject) => {
    const proc = spawn(ffmpeg, ['-y', '-framerate', mobile ? '8' : '8', '-i', path.join(framesDir, 'frame-%05d.jpg'), '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-crf', '34', '-b:v', '0', videoPath], { stdio: 'ignore' })
    proc.on('error', reject)
    proc.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)))
  })
  fs.rmSync(framesDir, { recursive: true, force: true })
}

;(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--no-sandbox'] })
  try {
    await recordJourney(browser)
    await recordJourney(browser, { mobile: true })
    console.log(`Captured roadmap screenshots and recordings in ${output}`)
  } finally { await browser.close() }
})().catch((error) => { console.error(error); process.exitCode = 1 })
