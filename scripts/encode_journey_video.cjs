const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const srcVideo = path.join(root, 'source-video', 'mj_drilling_captioned.mp4');
const outMedia = path.join(root, 'public', 'media');

if (!fs.existsSync(outMedia)) {
  fs.mkdirSync(outMedia, { recursive: true });
}

console.log('Using ffmpeg binary:', ffmpeg);
console.log('Source video:', srcVideo);

// 1. Poster
const posterOut = path.join(outMedia, 'mj-journey-poster.jpg');
console.log('Generating poster...');
execSync(`"${ffmpeg}" -y -ss 0 -i "${srcVideo}" -frames:v 1 -vf "scale=1280:-2" -q:v 3 "${posterOut}"`, { stdio: 'inherit' });

// 2. Desktop MP4
const desktopMp4 = path.join(outMedia, 'mj-journey-desktop.mp4');
console.log('Encoding desktop MP4...');
execSync(`"${ffmpeg}" -y -i "${srcVideo}" -an -c:v libx264 -crf 24 -preset fast -g 12 -keyint_min 12 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart "${desktopMp4}"`, { stdio: 'inherit' });

// 3. Mobile MP4
const mobileMp4 = path.join(outMedia, 'mj-journey-mobile.mp4');
console.log('Encoding mobile MP4...');
execSync(`"${ffmpeg}" -y -i "${srcVideo}" -an -vf "scale=960:-2" -c:v libx264 -crf 26 -preset fast -g 12 -keyint_min 12 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart "${mobileMp4}"`, { stdio: 'inherit' });

console.log('Encoding complete. Checking files:');
[posterOut, desktopMp4, mobileMp4].forEach(f => {
  const stat = fs.statSync(f);
  console.log(`${path.basename(f)}: ${(stat.size / (1024 * 1024)).toFixed(2)} MB (${stat.size} bytes)`);
});
