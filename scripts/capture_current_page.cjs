const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\f15eacc2-6aea-48e4-8d2a-5422ebb0e1f1\\screenshots';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Desktop (1280px)
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'current-homepage-header-and-hero-1280px.png'),
    clip: { x: 0, y: 0, width: 1280, height: 850 }
  });
  console.log('Saved current-homepage-header-and-hero-1280px.png');

  // Mobile (375px)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 812 });
  await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'current-homepage-header-and-hero-375px.png'),
    clip: { x: 0, y: 0, width: 375, height: 812 }
  });
  console.log('Saved current-homepage-header-and-hero-375px.png');

  await browser.close();
})();
