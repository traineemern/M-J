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

  // 1. Desktop 1280px screenshot of /faq carousel
  console.log('Capturing /faq at 1280px...');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1280, height: 900 });
  await desktopPage.goto('http://127.0.0.1:5173/faq', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'faq-carousel-1280px.png'),
    clip: { x: 0, y: 120, width: 1280, height: 550 }
  });
  console.log('Saved faq-carousel-1280px.png');

  // Capture frame sequence during transition (click next)
  console.log('Capturing transition frame sequence...');
  const nextButton = await desktopPage.$('button[aria-label="Next question"]');
  if (nextButton) {
    // Frame 0: Start
    await desktopPage.screenshot({
      path: path.join(ARTIFACT_DIR, 'faq-transition-frame-0ms.png'),
      clip: { x: 200, y: 150, width: 880, height: 450 }
    });

    // Click next
    await nextButton.click();

    // Frame 1: ~150ms into transition (sliding and fading)
    await new Promise(r => setTimeout(r, 150));
    await desktopPage.screenshot({
      path: path.join(ARTIFACT_DIR, 'faq-transition-frame-150ms.png'),
      clip: { x: 200, y: 150, width: 880, height: 450 }
    });

    // Frame 2: ~320ms into transition
    await new Promise(r => setTimeout(r, 170));
    await desktopPage.screenshot({
      path: path.join(ARTIFACT_DIR, 'faq-transition-frame-320ms.png'),
      clip: { x: 200, y: 150, width: 880, height: 450 }
    });

    // Frame 3: ~500ms (settled on next card)
    await new Promise(r => setTimeout(r, 200));
    await desktopPage.screenshot({
      path: path.join(ARTIFACT_DIR, 'faq-transition-frame-500ms.png'),
      clip: { x: 200, y: 150, width: 880, height: 450 }
    });
    console.log('Saved transition frames');
  }

  // 2. Mobile 375px screenshot of /faq carousel
  console.log('Capturing /faq at 375px...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 750, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://127.0.0.1:5173/faq', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'faq-carousel-375px.png'),
    clip: { x: 0, y: 80, width: 375, height: 500 }
  });
  console.log('Saved faq-carousel-375px.png');

  // 3. Homepage with common questions carousel at 1280px
  console.log('Capturing homepage FAQ carousel at 1280px...');
  await desktopPage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const homeFaqSection = await desktopPage.$('section:has(h2)');
  await desktopPage.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const faqHeading = headings.find(h => h.textContent.includes('Common questions'));
    if (faqHeading) {
      faqHeading.scrollIntoView();
    }
  });
  await new Promise(r => setTimeout(r, 400));

  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage-common-questions-1280px.png'),
    clip: { x: 0, y: 150, width: 1280, height: 600 }
  });
  console.log('Saved homepage-common-questions-1280px.png');

  await desktopPage.close();
  await mobilePage.close();
  await browser.close();
  console.log('All carousel captures complete.');
})();
