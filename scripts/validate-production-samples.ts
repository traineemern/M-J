import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const productionFlag = process.env.VITE_SHOW_SAMPLE_DATA
if (productionFlag === 'true') {
  throw new Error('Production must not enable About sample data (VITE_SHOW_SAMPLE_DATA=true).')
}

async function findBundles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map((entry) => {
    const fullPath = join(directory, entry.name)
    return entry.isDirectory() ? findBundles(fullPath) : entry.name.endsWith('.js') ? [fullPath] : []
  }))
  return files.flat()
}

const bundles = await findBundles('dist/assets')
const forbidden = ['data-sample-badge', 'Sample Customer', 'SAMPLE-000']
for (const file of bundles) {
  const contents = await readFile(file, 'utf8')
  const found = forbidden.find((value) => contents.includes(value))
  if (found) throw new Error(`Production bundle ${file} contains About sample content (${found}).`)
}
console.log('Production bundles do not include About sample content.')
