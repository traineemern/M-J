const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\f15eacc2-6aea-48e4-8d2a-5422ebb0e1f1\\screenshots';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

(async () => {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = { desktop: [], mobile: [] };

  try {
    // =========================================================================
    // 1. DESKTOP AUDIT & CAPTURE (1280 x 900)
    // =========================================================================
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Capture Hero
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'homepage-hero-1280px.png'),
      clip: { x: 0, y: 0, width: 1280, height: 850 }
    });
    console.log('Captured homepage-hero-1280px.png');

    // Capture Journey at 0%, 25%, 50%, 75%, 100%
    const journeyEl = await page.$('#journey-video-section');
    if (journeyEl) {
      const pinTrigger = await page.evaluate(() => {
        const el = document.querySelector('#journey-video-section');
        return el ? el.offsetTop : 0;
      });

      // Pinned range is +=400% (4 * 900 = 3600px)
      const pinDistance = 3600;
      const steps = [
        { pct: 0, file: 'journey-scroll-0pct-1280px.png' },
        { pct: 25, file: 'journey-scroll-25pct-1280px.png' },
        { pct: 50, file: 'journey-scroll-50pct-1280px.png' },
        { pct: 75, file: 'journey-scroll-75pct-1280px.png' },
        { pct: 100, file: 'journey-scroll-100pct-1280px.png' },
      ];

      for (const step of steps) {
        const scrollTarget = pinTrigger + (pinDistance * (step.pct / 100));
        await page.evaluate((y) => {
          if (window.__lenis) {
            window.__lenis.scrollTo(y, { immediate: true });
          } else {
            window.scrollTo(0, y);
          }
        }, scrollTarget);
        await new Promise(r => setTimeout(r, 400));

        await page.screenshot({
          path: path.join(ARTIFACT_DIR, step.file),
          clip: { x: 0, y: 0, width: 1280, height: 900 }
        });
        console.log(`Captured ${step.file}`);
      }
    }

    // List of sections to audit
    const sectionsToAudit = [
      { name: 'Header', sel: 'header' },
      { name: 'Hero Section', sel: 'section:has(h1)' },
      { name: 'Video Journey', sel: '#journey-video-section' },
      { name: 'Core Services', sel: '#services' },
      { name: 'See How We Drill', sel: '#drilling-video' },
      { name: 'Common Questions (FAQ)', sel: 'section.overflow-hidden' },
      { name: 'Contact Estimate Form', sel: '#contact-estimate' },
      { name: 'Footer', sel: 'footer' }
    ];

    for (const item of sectionsToAudit) {
      const audit = await page.evaluate(async (target) => {
        let el = document.querySelector(target.sel);
        if (!el && target.name.includes('Hero')) el = document.querySelector('section');
        if (!el && target.name.includes('FAQ')) {
          el = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Common questions'));
        }
        if (!el) return { name: target.name, found: false };

        if (window.__lenis) {
          window.__lenis.scrollTo(el, { immediate: true });
        } else {
          el.scrollIntoView();
        }
        await new Promise(r => setTimeout(r, 150));

        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const testX = Math.min(window.innerWidth - 30, Math.max(30, rect.left + 50));
        const testY = Math.min(window.innerHeight - 30, Math.max(85, rect.top + 50));
        const topEl = document.elementFromPoint(testX, testY);
        const isSelfOrChild = el === topEl || el.contains(topEl);

        return {
          name: target.name,
          found: true,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          position: style.position,
          zIndex: style.zIndex,
          height: Math.round(rect.height),
          top: Math.round(rect.top),
          visibleInFinalState: style.opacity === '1' && style.visibility === 'visible' && style.display !== 'none',
          topElement: topEl ? topEl.tagName + (topEl.id ? '#' + topEl.id : '') : 'none',
          isCoveredByCanvas: topEl?.tagName === 'CANVAS',
          isNotCovered: isSelfOrChild
        };
      }, item);

      results.desktop.push(audit);
    }

    // Capture Services screenshot
    await page.evaluate(() => window.__lenis ? window.__lenis.scrollTo('#services', { immediate: true }) : document.querySelector('#services')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'homepage-services-1280px.png'),
      clip: { x: 0, y: 0, width: 1280, height: 900 }
    });
    console.log('Captured homepage-services-1280px.png');

    // Capture See How We Drill screenshot
    await page.evaluate(() => window.__lenis ? window.__lenis.scrollTo('#drilling-video', { immediate: true }) : document.querySelector('#drilling-video')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'homepage-see-how-we-drill-1280px.png'),
      clip: { x: 0, y: 0, width: 1280, height: 900 }
    });
    console.log('Captured homepage-see-how-we-drill-1280px.png');

    // Capture FAQ Carousel screenshot
    await page.evaluate(() => {
      const faq = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Common questions'));
      if (window.__lenis) {
        window.__lenis.scrollTo(faq, { immediate: true });
      } else {
        faq?.scrollIntoView();
      }
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'homepage-faq-carousel-1280px.png'),
      clip: { x: 0, y: 0, width: 1280, height: 900 }
    });
    console.log('Captured homepage-faq-carousel-1280px.png');

    // Capture Footer screenshot
    await page.evaluate(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo('footer', { immediate: true });
      } else {
        document.querySelector('footer')?.scrollIntoView();
      }
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'homepage-footer-1280px.png'),
      clip: { x: 0, y: 0, width: 1280, height: 900 }
    });
    console.log('Captured homepage-footer-1280px.png');

    await page.close();

    // =========================================================================
    // 2. MOBILE AUDIT & CAPTURE (375 x 812)
    // =========================================================================
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 812 });
    await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Audit mobile sections
    for (const item of sectionsToAudit) {
      const audit = await mobilePage.evaluate((target) => {
        let el = document.querySelector(target.sel);
        if (!el && target.name.includes('Hero')) el = document.querySelector('section');
        if (!el && target.name.includes('FAQ')) {
          el = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Common questions'));
        }
        if (!el) return { name: target.name, found: false };

        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          name: target.name,
          found: true,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          height: Math.round(rect.height),
          visibleInFinalState: style.opacity === '1' && style.visibility === 'visible' && style.display !== 'none'
        };
      }, item);
      results.mobile.push(audit);
    }

    // Scroll to Journey and capture on Mobile
    await mobilePage.evaluate(() => {
      document.querySelector('#journey-video-section')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 500));
    await mobilePage.screenshot({
      path: path.join(ARTIFACT_DIR, 'journey-mobile-375px.png'),
      clip: { x: 0, y: 0, width: 375, height: 750 }
    });
    console.log('Captured journey-mobile-375px.png');

    // Scroll to Footer on Mobile
    await mobilePage.evaluate(() => {
      document.querySelector('footer')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 500));
    await mobilePage.screenshot({
      path: path.join(ARTIFACT_DIR, 'homepage-mobile-footer-375px.png'),
      clip: { x: 0, y: 0, width: 375, height: 812 }
    });
    console.log('Captured homepage-mobile-footer-375px.png');

    await mobilePage.close();

    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'final_audit_results.json'),
      JSON.stringify(results, null, 2)
    );
    console.log('Final audit results saved successfully.');
  } finally {
    await browser.close();
  }
})();
