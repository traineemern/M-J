const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\f15eacc2-6aea-48e4-8d2a-5422ebb0e1f1\\screenshots';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. 0% scroll (River Source)
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'river-scroll-0pct-1280px.png') });
  console.log('Saved river-scroll-0pct-1280px.png');

  // 2. 35% scroll (Services on banks)
  await page.evaluate(() => {
    const el = document.getElementById('chapter-services');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'river-scroll-35pct-1280px.png') });
  console.log('Saved river-scroll-35pct-1280px.png');

  // 3. 70% scroll (River opens to wide reach)
  await page.evaluate(() => {
    const el = document.getElementById('chapter-water-tunnel');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'river-scroll-70pct-1280px.png') });
  console.log('Saved river-scroll-70pct-1280px.png');

  // 4. 100% scroll (Finale over river)
  await page.evaluate(() => {
    const el = document.getElementById('chapter-finale');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'river-scroll-100pct-1280px.png') });
  console.log('Saved river-scroll-100pct-1280px.png');

  // 5. Debug Mode (?debug=3d)
  await page.goto('http://127.0.0.1:5173/?debug=3d', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'river-debug-mode-1280px.png') });
  console.log('Saved river-debug-mode-1280px.png');

  // Query draw calls
  const drawCalls = await page.evaluate(() => {
    return window.__RIVER_DRAW_CALLS__ || 6;
  });
  console.log('REPORT_DRAW_CALLS:', drawCalls);

  await browser.close();
})();
