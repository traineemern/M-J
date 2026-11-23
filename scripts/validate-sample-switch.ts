import { existsSync, readFileSync } from 'node:fs'

const productionEnv = existsSync('.env.production') ? readFileSync('.env.production', 'utf8') : ''
const fileSetting = productionEnv.match(/^VITE_SHOW_SAMPLE_DATA\s*=\s*(.*?)\s*$/m)?.[1]
const setting = process.env.VITE_SHOW_SAMPLE_DATA ?? fileSetting
if (setting !== undefined && setting !== 'false') {
  throw new Error('Production builds require VITE_SHOW_SAMPLE_DATA=false when the sample-data flag is set.')
}
console.log(setting === undefined
  ? 'Production sample data switch is unset and defaults to off.'
  : 'Production sample data switch is off.')
