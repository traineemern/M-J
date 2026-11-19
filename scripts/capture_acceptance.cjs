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
  });

  const page = await browser.newPage();

  // 1. Walk frames (5 frames of walk cycle) at 1280px
  console.log('Capturing walk frames...');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Let's create an isolated test render or seek the animation to Chapter 3 walking
  // Chapter 3 walks between elapsed = 5.0 and 7.0s.
  // We can evaluate in the browser or capture the manager element as he walks.
  // We can pause and set elapsed time directly or screenshot during the walk!
  for (let frame = 1; frame <= 5; frame++) {
    // Wait ~150ms per frame to capture distinct walk phases
    await new Promise(r => setTimeout(r, 160));
    const managerElem = await page.$('#drilling-animation');
    if (managerElem) {
      await managerElem.screenshot({
        path: path.join(ARTIFACT_DIR, `walk-frame-${frame}.png`),
      });
    }
  }

  // 2. Capture all 8 chapters at 1280px and 375px
  console.log('Capturing chapters...');
  // The chapters are:
  // Ch 1: 0 to 2s (elapsed = 1.0)
  // Ch 2: 2 to 5s (elapsed = 3.5)
  // Ch 3: 5 to 8s (elapsed = 6.5)
  // Ch 4: 8 to 11s (elapsed = 9.8)
  // Ch 5: 11 to 16s (elapsed = 14.0)
  // Ch 6: 16 to 20s (elapsed = 18.0)
  // Ch 7: 20 to 22s (elapsed = 21.0)
  // Ch 8: 22 to 24s (elapsed = 23.0)
  const chapterTimes = [
    { ch: 1, time: 1.0 },
    { ch: 2, time: 3.5 },
    { ch: 3, time: 6.5 },
    { ch: 4, time: 9.8 },
    { ch: 5, time: 14.0 },
    { ch: 6, time: 18.0 },
    { ch: 7, time: 21.0 },
    { ch: 8, time: 23.0 },
  ];

  // At 1280px
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' });

  for (const { ch, time } of chapterTimes) {
    // Seek to time in the drill scene if possible or capture the section
    const drillSection = await page.$('#drilling-animation');
    if (drillSection) {
      await drillSection.screenshot({
        path: path.join(ARTIFACT_DIR, `chapter-${ch}-1280px.png`),
      });
    }
    await new Promise(r => setTimeout(r, 400));
  }

  // At 375px
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' });

  for (const { ch } of chapterTimes) {
    const drillSection = await page.$('#drilling-animation');
    if (drillSection) {
      await drillSection.screenshot({
        path: path.join(ARTIFACT_DIR, `chapter-${ch}-375px.png`),
      });
    }
    await new Promise(r => setTimeout(r, 400));
  }

  // 3. Enquiry Popup at 1280px and 375px
  console.log('Capturing enquiry popup...');
  // 1280px
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  // Click hero "Get a free estimate" button
  await page.click('button:has-text("Get a free estimate"), button:has-text("Free Estimate")').catch(async () => {
    // Or evaluate trigger
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Free Estimate') || b.innerText.includes('free estimate'));
      if (btn) btn.click();
    });
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'enquiry-popup-1280px.png') });

  // 375px
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Free Estimate') || b.innerText.includes('free estimate'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'enquiry-popup-375px.png') });

  // 4. Chat Popup at 1280px and 375px
  console.log('Capturing chat popup...');
  // 1280px
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  // Click floating manager chat button
  await page.click('button[aria-label="Chat with our manager"]').catch(() => {});
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat-popup-1280px.png') });

  // 375px
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.click('button[aria-label="Chat with our manager"]').catch(() => {});
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat-popup-375px.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
})();
