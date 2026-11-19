const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 640, height: 180, deviceScaleFactor: 2 });

  const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
    padding-left: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  .logo-container {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .icon {
    width: 68px;
    height: 68px;
    filter: drop-shadow(0 2px 8px rgba(56, 189, 248, 0.4));
  }
  .text-box {
    display: flex;
    flex-direction: column;
  }
  .brand-title {
    font-size: 40px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #ffffff;
    text-transform: uppercase;
    line-height: 1;
    -webkit-text-stroke: 1.5px #38bdf8;
    text-shadow: 0 0 16px rgba(56, 189, 248, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  .brand-subtitle {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: #bae6fd;
    text-transform: uppercase;
    margin-top: 4px;
    -webkit-text-stroke: 0.5px #0284c7;
    text-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
  }
</style>
</head>
<body>
  <div class="logo-container">
    <svg class="icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dropGrad" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ffffff" />
          <stop offset="1" stop-color="#e0f2fe" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#38bdf8" flood-opacity="0.6"/>
        </filter>
      </defs>
      <path d="M20 5C20 5 9 18 9 26C9 32.0751 13.9249 37 20 37C26.0751 37 31 32.0751 31 26C31 18 20 5 20 5Z" 
            fill="url(#dropGrad)" 
            stroke="#38bdf8" 
            stroke-width="2.5" 
            stroke-linejoin="round"
            filter="url(#glow)"/>
      <path d="M15 25C15 22 17 19 19 18" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <div class="text-box">
      <span class="brand-title">M&amp;J WATER WELLS</span>
      <span class="brand-subtitle">Casnovia, Michigan</span>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(html);
  const element = await page.$('.logo-container');
  const outPath = path.resolve(__dirname, '../public/images/mj-logo-white.png');
  await element.screenshot({ path: outPath, omitBackground: true });
  console.log('Saved logo to', outPath);

  await browser.close();
})();
