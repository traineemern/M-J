const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer-core')

const base = process.env.SITE_URL || 'http://127.0.0.1:5174'
const output = path.resolve('artifacts/roadmap')
fs.mkdirSync(output, { recursive: true })

;(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--no-sandbox'] })
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 900 })
    await page.goto(`${base}/services`, { waitUntil: 'networkidle0' })
    await page.waitForSelector('.roadmap-node:nth-of-type(8)')
    const measurements = await page.evaluate(() => {
      const path = document.querySelector('.roadmap-route-visited')
      const svg = path.ownerSVGElement
      const rect = svg.getBoundingClientRect()
      const length = path.getTotalLength()
      const targets = [70, 223.333, 376.667, 530, 530, 376.667, 223.333, 70].map((x, index) => ({ x, y: index < 4 ? 90 : 180 }))
      const stops = targets.map((target) => {
        let best = { deviation: Infinity, distance: 0, x: 0, y: 0 }
        for (let sample = 0; sample <= 20000; sample++) {
          const distance = length * sample / 20000
          const point = path.getPointAtLength(distance)
          const deviation = Math.hypot(point.x-target.x, point.y-target.y)
          if (deviation < best.deviation) best = { deviation, distance, x: point.x, y: point.y }
        }
        return { svgX: best.x, svgY: best.y, ratio: best.distance / length, deviationSvgUnits: best.deviation, viewportX: rect.left + best.x / 600 * rect.width, viewportY: rect.top + best.y / 210 * rect.height }
      })
      const nodes = [...document.querySelectorAll('.roadmap-node')].map((node) => {
        const box = node.getBoundingClientRect()
        return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
      })
      return { routeLengthSvgUnits: length, stops, nodes }
    })
    measurements.maxAlignmentDeviationPx = Math.max(...measurements.stops.map((stop, index) => Math.hypot(stop.viewportX-measurements.nodes[index].x, stop.viewportY-measurements.nodes[index].y)))
    fs.writeFileSync(path.join(output, 'roadmap-stop-positions.json'), JSON.stringify(measurements, null, 2))
    console.log(JSON.stringify({ routeLengthSvgUnits: measurements.routeLengthSvgUnits, stops: measurements.stops.map((stop, index) => ({ step: index + 1, x: stop.svgX, y: stop.svgY, ratio: Number(stop.ratio.toFixed(5)) })), maxAlignmentDeviationPx: measurements.maxAlignmentDeviationPx }, null, 2))
    if (measurements.maxAlignmentDeviationPx > 2) process.exitCode = 1
  } finally { await browser.close() }
})().catch((error) => { console.error(error); process.exitCode = 1 })
