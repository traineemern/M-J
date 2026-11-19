const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\f15eacc2-6aea-48e4-8d2a-5422ebb0e1f1\\screenshots';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  // Find common questions heading and capture element
  const section = await page.evaluateHandle(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const h2 = headings.find(h => h.textContent.includes('Common questions'));
    return h2 ? h2.closest('section') : null;
  });

  if (section) {
    await section.screenshot({
      path: path.join(ARTIFACT_DIR, 'homepage-common-questions-1280px.png')
    });
    console.log('Successfully captured homepage common questions section!');
  }

  // Also capture mobile /faq full view with buttons
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 850, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://127.0.0.1:5173/faq', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));

  const mobileCarousel = await mobilePage.evaluateHandle(() => {
    return document.querySelector('[role="region"][aria-roledescription="carousel"]');
  });

  if (mobileCarousel) {
    await mobileCarousel.screenshot({
      path: path.join(ARTIFACT_DIR, 'faq-carousel-375px.png')
    });
    console.log('Successfully captured mobile carousel with buttons!');
  }

  await browser.close();
})();
