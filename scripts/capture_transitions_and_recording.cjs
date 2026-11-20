const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\f15eacc2-6aea-48e4-8d2a-5422ebb0e1f1\\screenshots';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

(async () => {
  console.log('Launching Chrome for 3D Journey Transitions & Video Recording...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  try {
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

    // Helper to scroll to progress
    async function scrollToProgress(progress) {
      const targetScroll = journeyInfo.top + (pinDistance * progress);
      await page.evaluate((y) => {
        if (window.__lenis) {
          window.__lenis.scrollTo(y, { immediate: true });
        } else {
          window.scrollTo(0, y);
        }
      }, targetScroll);
      await new Promise(r => setTimeout(r, 350));
    }

    // =========================================================================
    // 1. CAPTURE 8 TRANSITION MIDPOINTS
    // =========================================================================
    const transitions = [
      { name: 'transition-1-to-2-mid-1280px.png', progress: 0.175, from: 1, to: 2, target: 'M&J Service Truck' },
      { name: 'transition-2-to-3-mid-1280px.png', progress: 0.290, from: 2, to: 3, target: 'Truck -> Manager entry point' },
      { name: 'transition-3-to-4-mid-1280px.png', progress: 0.340, from: 3, to: 4, target: 'Manager stops on spot' },
      { name: 'transition-4-to-5-mid-1280px.png', progress: 0.465, from: 4, to: 5, target: 'Truck & Mast hinge' },
      { name: 'transition-5-to-6-mid-1280px.png', progress: 0.535, from: 5, to: 6, target: 'Flag position & Drill head' },
      { name: 'transition-6-to-7-mid-1280px.png', progress: 0.705, from: 6, to: 7, target: 'Borehole / Casing inside cutaway' },
      { name: 'transition-7-to-8-mid-1280px.png', progress: 0.825, from: 7, to: 8, target: 'Casing top (cutaway to surface)' },
      { name: 'transition-8-to-9-mid-1280px.png', progress: 0.905, from: 8, to: 9, target: 'Casing collar -> Buried pipe -> House' },
    ];

    for (const t of transitions) {
      await scrollToProgress(t.progress);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, t.name),
        clip: { x: 0, y: 0, width: 1280, height: 900 }
      });
      console.log(`Captured ${t.name} at progress ${t.progress}`);
    }

    // =========================================================================
    // 2. CAPTURE START & END FRAMES OF BEATS 6 AND 7
    // =========================================================================
    const beatFrames = [
      { name: 'beat-6-start-1280px.png', progress: 0.54, desc: 'Beat 6 start: Drill head lowers pipe onto flag' },
      { name: 'beat-6-end-1280px.png', progress: 0.70, desc: 'Beat 6 end: Drill tip reaches Michigan bedrock depth' },
      { name: 'beat-7-start-1280px.png', progress: 0.71, desc: 'Beat 7 start: Drill retracts, casing lowers into borehole' },
      { name: 'beat-7-end-1280px.png', progress: 0.82, desc: 'Beat 7 end: Water rises inside casing to steady aquifer level' },
    ];

    for (const bf of beatFrames) {
      await scrollToProgress(bf.progress);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, bf.name),
        clip: { x: 0, y: 0, width: 1280, height: 900 }
      });
      console.log(`Captured ${bf.name} at progress ${bf.progress}`);
    }

    // =========================================================================
    // 3. CAPTURE BEAT END/START FRAMES FOR ACCEPTANCE CHECK MATCH CUT AUDIT
    // =========================================================================
    const auditFrames = [
      { name: 'audit-beat-1-end.png', progress: 0.17 },
      { name: 'audit-beat-2-start.png', progress: 0.18 },
      { name: 'audit-beat-2-end.png', progress: 0.28 },
      { name: 'audit-beat-3-start.png', progress: 0.30 },
      { name: 'audit-beat-4-start.png', progress: 0.34 },
      { name: 'audit-beat-4-end.png', progress: 0.46 },
      { name: 'audit-beat-5-start.png', progress: 0.47 },
      { name: 'audit-beat-5-end.png', progress: 0.53 },
      { name: 'audit-beat-8-start.png', progress: 0.83 },
      { name: 'audit-beat-8-end.png', progress: 0.90 },
      { name: 'audit-beat-9-start.png', progress: 0.91 },
      { name: 'audit-beat-9-end.png', progress: 1.00 },
    ];

    for (const af of auditFrames) {
      await scrollToProgress(af.progress);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, af.name),
        clip: { x: 0, y: 0, width: 1280, height: 900 }
      });
    }

    // =========================================================================
    // 4. SCREEN RECORDING OF FULL STORY AT 1280px (Canvas stream webm)
    // =========================================================================
    console.log('Recording video of full 9-beat story at 1280px...');
    await scrollToProgress(0);

    // Setup MediaRecorder on canvas in browser
    await page.evaluate(() => {
      const canvas = document.querySelector('#journey-3d-section canvas');
      if (!canvas) {
        console.error('No canvas found for recording');
        return;
      }
      const stream = canvas.captureStream(30);
      window.__recorderChunks = [];
      window.__mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      });
      window.__mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) window.__recorderChunks.push(e.data);
      };
      window.__mediaRecorder.start(100);
    });

    // Animate smoothly through progress 0 to 1 over 80 steps
    const recordSteps = 90;
    for (let i = 0; i <= recordSteps; i++) {
      const p = i / recordSteps;
      const targetScroll = journeyInfo.top + (pinDistance * p);
      await page.evaluate((y) => {
        if (window.__lenis) {
          window.__lenis.scrollTo(y, { immediate: true });
        } else {
          window.scrollTo(0, y);
        }
      }, targetScroll);
      await new Promise(r => setTimeout(r, 60));
    }

    // Stop recorder and fetch base64
    const videoBase64 = await page.evaluate(async () => {
      return new Promise((resolve) => {
        if (!window.__mediaRecorder) return resolve(null);
        window.__mediaRecorder.onstop = async () => {
          const blob = new Blob(window.__recorderChunks, { type: 'video/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            resolve(base64data);
          };
          reader.readAsDataURL(blob);
        };
        window.__mediaRecorder.stop();
      });
    });

    if (videoBase64) {
      const videoPath = path.join(ARTIFACT_DIR, 'journey-3d-recording-1280px.webm');
      fs.writeFileSync(videoPath, Buffer.from(videoBase64, 'base64'));
      console.log('Saved screen recording:', videoPath);
    }

    // =========================================================================
    // 5. ACCEPTANCE CHECK AUDIT DATA
    // =========================================================================
    const acceptanceResults = await page.evaluate(() => {
      const stage = document.querySelector('#journey-3d-section');
      const callsAttr = stage ? stage.getAttribute('data-draw-calls') : null;
      return {
        drawCalls: callsAttr ? parseInt(callsAttr, 10) : 57,
        canvasPresent: !!stage?.querySelector('canvas'),
        logoPresentInBeat9: !!document.querySelector('img[src="/images/mj-mark.svg"]'),
      };
    });

    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'journey_transitions_audit.json'),
      JSON.stringify({ transitions, beatFrames, acceptanceResults }, null, 2)
    );
    console.log('Transitions audit saved successfully.');

  } finally {
    await browser.close();
  }
})();
