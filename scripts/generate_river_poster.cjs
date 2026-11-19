const puppeteer = require('puppeteer-core');
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
    background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 45%, #bae6fd 60%, #0c4a6e 100%);
    overflow: hidden;
    position: relative;
    font-family: sans-serif;
  }
  .sky {
    position: absolute;
    top: 0;
    width: 100%;
    height: 55%;
    background: linear-gradient(180deg, #f8fafc 0%, #e0f2fe 70%, #bae6fd 100%);
  }
  .sun {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(186,230,253,0.4) 50%, transparent 70%);
  }
  .river {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 50%;
    clip-path: polygon(44% 0%, 56% 0%, 85% 100%, 15% 100%);
    background: linear-gradient(180deg, #0284c7 0%, #0369a1 40%, #0c4a6e 100%);
    box-shadow: inset 0 0 40px rgba(56, 189, 248, 0.4);
  }
  .bank-left {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50%;
    height: 50%;
    clip-path: polygon(0 0, 44% 0, 15% 100%, 0 100%);
    background: linear-gradient(135deg, #334155 0%, #1e293b 60%, #0f172a 100%);
  }
  .bank-right {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 50%;
    height: 50%;
    clip-path: polygon(56% 0, 100% 0, 100% 100%, 85% 100%);
    background: linear-gradient(225deg, #334155 0%, #1e293b 60%, #0f172a 100%);
  }
  .water-ripple {
    position: absolute;
    top: 20%;
    left: 20%;
    right: 20%;
    bottom: 10%;
    background: repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.12) 16px, transparent 18px);
  }
</style>
</head>
<body>
  <div class="sky"></div>
  <div class="sun"></div>
  <div class="bank-left"></div>
  <div class="bank-right"></div>
  <div class="river">
    <div class="water-ripple"></div>
  </div>
</body>
</html>
  `;

  await page.setContent(html);
  const outPath = path.resolve(__dirname, '../public/images/river-poster.webp');
  await page.screenshot({ path: outPath, type: 'webp', quality: 90 });
  console.log('Saved river-poster.webp to', outPath);
  await browser.close();
})();
