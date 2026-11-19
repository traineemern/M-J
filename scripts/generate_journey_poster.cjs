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
  await page.setViewport({ width: 1920, height: 1080 });

  const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at 50% 30%, #0369a1 0%, #075985 30%, #0c4a6e 60%, #082f49 100%);
    overflow: hidden;
    position: relative;
    font-family: sans-serif;
  }
  .layer {
    position: absolute;
    width: 100%;
    left: 0;
  }
  .soil {
    top: 0;
    height: 25%;
    background: linear-gradient(180deg, #3f2e1e 0%, #291e13 100%);
    border-bottom: 3px solid #574029;
  }
  .subsoil {
    top: 25%;
    height: 25%;
    background: linear-gradient(180deg, #5c442c 0%, #453220 100%);
    border-bottom: 3px solid #785a3a;
  }
  .groundwater {
    top: 50%;
    height: 25%;
    background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%);
    border-bottom: 3px solid #38bdf8;
    opacity: 0.9;
  }
  .bedrock {
    top: 75%;
    height: 25%;
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  }
  .ambient-glow {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 600px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%);
  }
</style>
</head>
<body>
  <div class="soil"></div>
  <div class="subsoil"></div>
  <div class="groundwater"></div>
  <div class="bedrock"></div>
  <div class="ambient-glow"></div>
</body>
</html>
  `;

  await page.setContent(html);
  const outPath = path.resolve(__dirname, '../public/images/journey-poster.webp');
  await page.screenshot({ path: outPath, type: 'webp', quality: 90 });
  console.log('Saved journey-poster.webp to', outPath);
  await browser.close();
})();
