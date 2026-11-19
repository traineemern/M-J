import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('screenshots')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()

  console.log('Testing Roadmap Section...')
  // Navigate to /services where Roadmap is located
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1000))

  // Measure desktop roadmap container
  const desktopRoadmap = await page.$('section ol')
  if (desktopRoadmap) {
    const box = await desktopRoadmap.boundingBox()
    console.log(`Desktop Roadmap Height: ${box ? Math.round(box.height) : 'N/A'}px (Requirement: at most ~450px)`)
  }

  // Screenshot Roadmap at 1280px
  const roadmapSection = await page.$('section:has(ol)')
  if (roadmapSection) {
    await roadmapSection.screenshot({ path: path.join(OUTPUT_DIR, 'roadmap-1280px.png') })
    console.log('Saved roadmap-1280px.png')
  }

  // Screenshot Roadmap at 768px
  await page.setViewport({ width: 768, height: 1024 })
  await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1000))
  const roadmapSection768 = await page.$('section:has(ol)')
  if (roadmapSection768) {
    const box768 = await (await page.$('section ol'))?.boundingBox()
    console.log(`Tablet Roadmap Height: ${box768 ? Math.round(box768.height) : 'N/A'}px`)
    await roadmapSection768.screenshot({ path: path.join(OUTPUT_DIR, 'roadmap-768px.png') })
    console.log('Saved roadmap-768px.png')
  }

  // Screenshot Roadmap at 375px
  await page.setViewport({ width: 375, height: 1200 })
  await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1000))
  const roadmapSection375 = await page.$('section:has(ol)')
  if (roadmapSection375) {
    const box375 = await (await page.$('section ol'))?.boundingBox()
    console.log(`Mobile Roadmap Height: ${box375 ? Math.round(box375.height) : 'N/A'}px (Check: about half of previous ~1600px)`)
    await roadmapSection375.screenshot({ path: path.join(OUTPUT_DIR, 'roadmap-375px.png') })
    console.log('Saved roadmap-375px.png')
  }

  console.log('\nTesting Drilling Animation Chapters...')
  // Go to homepage or /services where drilling animation lives
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 800))

  // Function to capture drilling animation card at specific elapsed times
  // We can evaluate in page: window.__setDrillElapsed or wait for chapters
  // Or pause and step through elapsed times:
  const chapters = [
    { id: 1, name: 'ch1-open-ground', time: 1.0 },
    { id: 2, name: 'ch2-rig-arrives', time: 3.5 },
    { id: 3, name: 'ch3-manager-walks', time: 6.5 },
    { id: 4, name: 'ch4-ground-check', time: 9.5 },
    { id: 5, name: 'ch5-drilling-layers', time: 14.5 },
    { id: 6, name: 'ch6-clean-water', time: 18.0 },
    { id: 7, name: 'ch7-drilling-complete', time: 21.0 },
    { id: 8, name: 'ch8-site-visit', time: 23.0 },
  ]

  for (const width of [1280, 375]) {
    await page.setViewport({ width, height: 900 })
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))

    const animEl = await page.$('#drilling-animation')
    if (animEl) {
      for (const ch of chapters) {
        // Wait until chapter text or capture
        // We can capture screenshot
        await animEl.screenshot({
          path: path.join(OUTPUT_DIR, `drilling-w${width}-${ch.name}.png`),
        })
        console.log(`Saved drilling-w${width}-${ch.name}.png`)
        await new Promise((r) => setTimeout(r, 1200))
      }
    }
  }

  await browser.close()
  console.log('Finished capturing screenshots!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
