const puppeteer = require('puppeteer-core')

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  try {
    const page = await browser.newPage()
    await page.setJavaScriptEnabled(false)
    await page.goto(process.env.HOMEPAGE_URL || 'http://127.0.0.1:5181/', { waitUntil: 'domcontentloaded' })
    const result = await page.evaluate(() => ({
      headline: document.querySelector('.nojs-hero h1')?.textContent?.trim(),
      links: [...document.querySelectorAll('.nojs-nav a')].map((anchor) => anchor.textContent?.trim()),
      phone: document.querySelector('.nojs-contact')?.getAttribute('href'),
      estimate: document.querySelector('.nojs-estimate')?.textContent?.trim(),
      roadmapSteps: [...document.querySelectorAll('.nojs-roadmap li strong')].map((step) => step.textContent?.trim()),
    }))
    if (result.headline !== "West Michigan's well drilling specialists" || result.links.length !== 5 || result.phone !== 'tel:6166754875' || !result.estimate?.toLowerCase().includes('free estimate') || result.roadmapSteps.length !== 8) {
      throw new Error(`No-JS content incomplete: ${JSON.stringify(result)}`)
    }
    console.log(JSON.stringify(result))
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
