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

  // 1. Desktop Homepage Hero & Video section with photo
  console.log('Capturing homepage at 1280px...');
  await page.setViewport({ width: 1280, height: 850 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage-hero-photo-1280px.png'),
    fullPage: false
  });

  const videoSec = await page.$('#drilling-video');
  if (videoSec) {
    await videoSec.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'homepage-video-section-photo-1280px.png'),
      fullPage: false
    });
  }

  // 2. Open Watch Demo Modal and capture rounded corners
  console.log('Opening Watch Demo popup...');
  const watchDemoBtn = await page.$('button[title="Watch in popup"]');
  if (watchDemoBtn) {
    await watchDemoBtn.click();
    await new Promise(r => setTimeout(r, 700));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'watch-demo-modal-rounded-1280px.png'),
      fullPage: false
    });
  }

  // 3. Capture About page
  console.log('Capturing About page...');
  await page.goto('http://127.0.0.1:5173/about', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'about-page-photo-1280px.png'),
    fullPage: false
  });

  // 4. Mobile 375px
  console.log('Capturing Mobile at 375px...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage-hero-photo-375px.png'),
    fullPage: false
  });

  // Click Watch Demo button in mobile hero
  const watchDemoMobileBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    return buttons.find(b => b.textContent && b.textContent.includes('Watch Demo'));
  });

  if (watchDemoMobileBtn && watchDemoMobileBtn.asElement()) {
    await watchDemoMobileBtn.asElement().click();
    await new Promise(r => setTimeout(r, 700));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'watch-demo-modal-rounded-375px.png'),
      fullPage: false
    });
  }

  await browser.close();
  console.log('Finished capturing all new update screenshots!');
})();
