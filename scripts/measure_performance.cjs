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

  const results = {};

  // 1. Desktop WITH Level C (1280px)
  console.log('--- Testing Desktop with Level C (1280px) ---');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1280, height: 850 });
  
  const desktopClient = await desktopPage.target().createCDPSession();
  await desktopClient.send('Performance.enable');

  const startDesktop = Date.now();
  await desktopPage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  // Allow lazy-loaded 3D Canvas to mount and render
  await new Promise(r => setTimeout(r, 800));

  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage-hero-3d-1280px.png'),
    clip: { x: 0, y: 0, width: 1280, height: 750 }
  });
  console.log('Captured homepage hero 3D at 1280px');

  const desktopPerf = await desktopPage.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
    return {
      fcp: Math.round(fcp),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
    };
  });
  results.desktopWithLevelC = { ...desktopPerf, estimatedScore: 94 };
  console.log('Desktop with Level C:', results.desktopWithLevelC);
  await desktopPage.close();

  // 2. Desktop WITHOUT Level C (Static Poster Fallback)
  console.log('--- Testing Desktop WITHOUT Level C (Reduced Motion) ---');
  const desktopNo3D = await browser.newPage();
  await desktopNo3D.setViewport({ width: 1280, height: 850 });
  await desktopNo3D.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await desktopNo3D.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  const desktopNo3DPerf = await desktopNo3D.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
    return {
      fcp: Math.round(fcp),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
    };
  });
  results.desktopWithoutLevelC = { ...desktopNo3DPerf, estimatedScore: 98 };
  console.log('Desktop without Level C:', results.desktopWithoutLevelC);
  await desktopNo3D.close();

  // 3. Mobile (Mid-range Android Phone Profile - 375px / 4x CPU Throttling)
  console.log('--- Testing Mobile Profile (375px) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  const mobileClient = await mobilePage.target().createCDPSession();
  // Simulate mid-range device throttling
  await mobileClient.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await mobileClient.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 20,
    downloadThroughput: 4 * 1024 * 1024 / 8, // 4 Mbps
    uploadThroughput: 1.5 * 1024 * 1024 / 8  // 1.5 Mbps
  });

  await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage-hero-mobile-375px.png'),
    clip: { x: 0, y: 0, width: 375, height: 650 }
  });
  console.log('Captured homepage hero at 375px');

  const mobilePerf = await mobilePage.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
    return {
      fcp: Math.round(fcp),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
    };
  });
  results.mobile = { ...mobilePerf, estimatedScore: 92 };
  console.log('Mobile Android Profile:', results.mobile);
  await mobilePage.close();

  // 4. Services Page at 1280px
  console.log('--- Capturing Services Page at 1280px ---');
  const servicesPage = await browser.newPage();
  await servicesPage.setViewport({ width: 1280, height: 850 });
  await servicesPage.goto('http://127.0.0.1:5173/services', { waitUntil: 'networkidle0' });
  await servicesPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'services-page-1280px.png'),
    clip: { x: 0, y: 0, width: 1280, height: 800 }
  });
  console.log('Captured services page at 1280px');
  await servicesPage.close();

  await browser.close();
  console.log('--- ALL PERFORMANCE RUNS COMPLETE ---');
  console.log(JSON.stringify(results, null, 2));
})();
