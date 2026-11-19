import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('screenshots')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const chapters = [
  { id: 1, name: 'ch1-open-ground', time: 1.0, caption: 'Every project starts on open ground.' },
  { id: 2, name: 'ch2-rig-arrives', time: 3.5, caption: 'Our rig arrives on site.' },
  { id: 3, name: 'ch3-manager-walks', time: 6.5, caption: 'Our manager walks the site first.' },
  { id: 4, name: 'ch4-ground-check', time: 9.5, caption: 'We check access, ground, and setbacks.' },
  { id: 5, name: 'ch5-drilling-layers', time: 14.5, caption: 'We drill through each layer.' },
  { id: 6, name: 'ch6-clean-water', time: 18.0, caption: 'Clean water found.' },
  { id: 7, name: 'ch7-drilling-complete', time: 21.0, caption: 'Drilling complete. Next, we set the pump.' },
  { id: 8, name: 'ch8-site-visit', time: 23.0, caption: 'Every well starts with a site visit.' },
]

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()

  console.log('=== ROADMAP ACCEPTANCE CHECKS ===')

  // 1. Desktop 1280px
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 600))
  const desktopOl = await page.$('section ol')
  const desktopBox = await desktopOl.boundingBox()
  const desktopHeight = Math.round(desktopBox.height)
  console.log(`Desktop Roadmap Height: ${desktopHeight}px (Target: at most ~450px)`)
  const roadmapSection1280 = await page.$('section:has(ol)')
  await roadmapSection1280.screenshot({ path: path.join(OUTPUT_DIR, 'roadmap-1280px.png') })
  console.log('Saved roadmap-1280px.png')

  // 2. Tablet 768px
  await page.setViewport({ width: 768, height: 1024 })
  await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 600))
  const tabletOl = await page.$('section ol')
  const tabletBox = await tabletOl.boundingBox()
  const tabletHeight = Math.round(tabletBox.height)
  console.log(`Tablet Roadmap Height: ${tabletHeight}px`)
  const roadmapSection768 = await page.$('section:has(ol)')
  await roadmapSection768.screenshot({ path: path.join(OUTPUT_DIR, 'roadmap-768px.png') })
  console.log('Saved roadmap-768px.png')

  // 3. Mobile 375px
  await page.setViewport({ width: 375, height: 1200 })
  await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 600))
  const mobileOl = await page.$('section ol')
  const mobileBox = await mobileOl.boundingBox()
  const mobileHeight = Math.round(mobileBox.height)
  console.log(`Mobile Roadmap Height: ${mobileHeight}px (Previous was ~2800px; reduction: ${Math.round((1 - mobileHeight / 2800) * 100)}%)`)
  const roadmapSection375 = await page.$('section:has(ol)')
  await roadmapSection375.screenshot({ path: path.join(OUTPUT_DIR, 'roadmap-375px.png') })
  console.log('Saved roadmap-375px.png')

  console.log('\n=== DRILLING ANIMATION CHAPTER SCREENSHOTS (1280px & 375px) ===')

  // Navigate to Home
  for (const width of [1280, 375]) {
    await page.setViewport({ width, height: 900 })
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 600))

    for (const ch of chapters) {
      // Find caption and wait/capture
      const filename = `drilling-${width}px-${ch.id}-${ch.name}.png`
      const card = await page.$('#drilling-animation')
      if (card) {
        await card.screenshot({ path: path.join(OUTPUT_DIR, filename) })
        console.log(`Captured ${filename}`)
      }
      // Wait roughly 2.5s for timeline progression
      await new Promise((r) => setTimeout(r, 2800))
    }
  }

  await browser.close()
  console.log('\nAll acceptance check screenshots generated successfully!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
