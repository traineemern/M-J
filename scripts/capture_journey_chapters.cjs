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
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Chapter 1
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'journey-chapter1-1280px.png'),
  });
  console.log('Saved journey-chapter1-1280px.png');

  // Chapter 4 (Descent)
  await page.evaluate(() => {
    const el = document.getElementById('chapter-descent');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'journey-chapter4-1280px.png'),
  });
  console.log('Saved journey-chapter4-1280px.png');

  // Chapter 5 (Water Tunnel)
  await page.evaluate(() => {
    const el = document.getElementById('chapter-water-tunnel');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'journey-chapter5-1280px.png'),
  });
  console.log('Saved journey-chapter5-1280px.png');

  // Chapter 6 (Surface & Finale)
  await page.evaluate(() => {
    const el = document.getElementById('chapter-finale');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'journey-chapter6-1280px.png'),
  });
  console.log('Saved journey-chapter6-1280px.png');

  await browser.close();
})();
