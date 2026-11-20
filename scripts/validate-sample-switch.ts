import { readFileSync } from 'node:fs'

const productionEnv = readFileSync('.env.production', 'utf8')
const setting = productionEnv.match(/^VITE_SHOW_SAMPLE_DATA\s*=\s*(.*?)\s*$/m)?.[1]
if (setting !== 'false') {
  throw new Error('Production builds require VITE_SHOW_SAMPLE_DATA=false so SAMPLE badges and sample values are gated off.')
}
console.log('Production sample data switch is off.')
