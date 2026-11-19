const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\f15eacc2-6aea-48e4-8d2a-5422ebb0e1f1\\screenshots';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to homepage at 1280px...');
  await page.setViewport({ width: 1280, height: 850 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  // 1. Desktop Homepage Hero
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage-hero-1280px.png'),
    fullPage: false
  });
  console.log('Saved homepage-hero-1280px.png');

  // 2. Desktop Video Section
  const videoSec = await page.$('#drilling-video');
  if (videoSec) {
    await videoSec.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'drilling-video-1280px.png'),
      fullPage: false
    });
    console.log('Saved drilling-video-1280px.png');
  }

  // 3. Desktop Watch Demo Modal
  console.log('Triggering Watch Demo modal...');
  const watchDemoBtn = await page.$('button[title="Watch in popup"]');
  if (watchDemoBtn) {
    await watchDemoBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'watch-demo-modal-1280px.png'),
      fullPage: false
    });
    console.log('Saved watch-demo-modal-1280px.png');
  }

  // 4. Mobile 375px
  console.log('Testing Mobile 375px...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage-hero-375px.png'),
    fullPage: false
  });
  console.log('Saved homepage-hero-375px.png');

  // Trigger modal on mobile
  const heroDemoCard = await page.$('div[aria-label="Open Watch Demo popup window"]');
  if (heroDemoCard) {
    await heroDemoCard.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'watch-demo-modal-375px.png'),
      fullPage: false
    });
    console.log('Saved watch-demo-modal-375px.png');
  }

  // 5. Services Page
  console.log('Testing Services page...');
  await page.setViewport({ width: 1280, height: 850 });
  await page.goto('http://127.0.0.1:5173/services', { waitUntil: 'networkidle0' });
  const servVideo = await page.$('#drilling-video');
  if (servVideo) {
    await servVideo.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'services-drilling-video.png'),
      fullPage: false
    });
    console.log('Saved services-drilling-video.png');
  }

  await browser.close();
  console.log('All acceptance captures completed successfully!');
})();
