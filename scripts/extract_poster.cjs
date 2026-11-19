const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const server = http.createServer((req, res) => {
  const filePath = path.resolve('public' + decodeURIComponent(req.url));
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': filePath.endsWith('.mp4') ? 'video/mp4' : 'text/html',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3456, async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <video id="vid" src="http://localhost:3456/media/mj-drilling.mp4" muted></video>
        </body>
      </html>
    `);

    const dataUrl = await page.evaluate(async () => {
      const video = document.getElementById('vid');
      return new Promise((resolve, reject) => {
        video.onloadeddata = () => {
          video.currentTime = 5.0;
        };
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        video.onerror = () => reject('Video error: ' + (video.error ? video.error.message : 'unknown'));
        video.load();
      });
    });

    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync('public/media/mj-drilling-poster.jpg', base64Data, 'base64');
    console.log('SUCCESS! Poster saved! File size:', fs.statSync('public/media/mj-drilling-poster.jpg').size);

    await browser.close();
  } catch (err) {
    console.error('Error during poster extraction:', err);
  } finally {
    server.close();
  }
});
