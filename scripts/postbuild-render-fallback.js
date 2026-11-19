import fs from 'fs'

try {
  fs.cpSync('dist', 'npm run build', { recursive: true })
  console.log('Successfully prepared publish directory fallback for Render.')
} catch (err) {
  console.error('Failed to create render publish fallback:', err)
}
