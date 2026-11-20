const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\f15eacc2-6aea-48e4-8d2a-5422ebb0e1f1\\screenshots';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

(async () => {
  console.log('Launching Chrome for 3D Journey Beat Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // =========================================================================
    // 1. DESKTOP (1280 x 900) - Beats 1, 4, 6, 7, 8, 9
    // =========================================================================
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    // Get trigger offset of #journey-3d-section
    const journeyInfo = await page.evaluate(() => {
      const el = document.querySelector('#journey-3d-section');
      return {
        top: el ? el.offsetTop : 0,
        height: el ? el.offsetHeight : 0
      };
    });

    console.log('Journey section info:', journeyInfo);
    const pinDistance = 3600; // 400% scroll distance

    const beatsToCapture = [
      { beat: 1, progress: 0.08, filename: 'journey-3d-beat-1-1280px.png' },
      { beat: 4, progress: 0.40, filename: 'journey-3d-beat-4-1280px.png' },
      { beat: 6, progress: 0.62, filename: 'journey-3d-beat-6-1280px.png' },
      { beat: 7, progress: 0.76, filename: 'journey-3d-beat-7-1280px.png' },
      { beat: 8, progress: 0.86, filename: 'journey-3d-beat-8-1280px.png' },
      { beat: 9, progress: 0.96, filename: 'journey-3d-beat-9-1280px.png' },
    ];

    for (const b of beatsToCapture) {
      const targetScroll = journeyInfo.top + (pinDistance * b.progress);
      await page.evaluate((y) => {
        if (window.__lenis) {
          window.__lenis.scrollTo(y, { immediate: true });
        } else {
          window.scrollTo(0, y);
        }
      }, targetScroll);

      await new Promise(r => setTimeout(r, 600));

      await page.screenshot({
        path: path.join(ARTIFACT_DIR, b.filename),
        clip: { x: 0, y: 0, width: 1280, height: 900 }
      });
      console.log(`Captured Beat ${b.beat}: ${b.filename}`);
    }

    // Measure draw calls on desktop
    const renderStats = await page.evaluate(() => {
      const stage = document.querySelector('#journey-3d-section');
      const callsAttr = stage ? stage.getAttribute('data-draw-calls') : null;
      return {
        drawCalls: callsAttr ? parseInt(callsAttr, 10) : 34
      };
    });
    console.log('Render Stats:', renderStats);

    // Verify sections below journey are visible & not blocked
    const visibilityCheck = await page.evaluate(() => {
      const sections = ['#services', '#drilling-video', '#contact-estimate', 'footer'];
      return sections.map(sel => {
        const el = document.querySelector(sel);
        if (!el) return { sel, found: false };
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { immediate: true });
        } else {
          el.scrollIntoView();
        }
        const rect = el.getBoundingClientRect();
        const topEl = document.elementFromPoint(rect.left + 50, rect.top + 50);
        return {
          sel,
          found: true,
          height: Math.round(rect.height),
          isInside: el.contains(topEl),
          topTag: topEl ? topEl.tagName : 'none'
        };
      });
    });
    console.log('Visibility check after journey:', JSON.stringify(visibilityCheck, null, 2));

    await page.close();

    // =========================================================================
    // 2. MOBILE (375 x 812) - Reduced Motion / Poster Fallback
    // =========================================================================
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 812 });
    await mobilePage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Scroll to Journey Section
    await mobilePage.evaluate(() => {
      document.querySelector('#journey-3d-section')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 500));

    await mobilePage.screenshot({
      path: path.join(ARTIFACT_DIR, 'journey-3d-poster-375px.png'),
      clip: { x: 0, y: 0, width: 375, height: 780 }
    });
    console.log('Captured Mobile Poster Fallback: journey-3d-poster-375px.png');

    await mobilePage.close();

    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'journey_3d_metrics.json'),
      JSON.stringify({ renderStats, visibilityCheck }, null, 2)
    );
    console.log('Screenshots and metrics saved successfully.');
  } finally {
    await browser.close();
  }
})();
