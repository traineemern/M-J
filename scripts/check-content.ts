import { siteContent } from '../src/data/site'

type Count = Record<'legacy' | 'verify' | 'dummy', number>
const totals: Count = { legacy: 0, verify: 0, dummy: 0 }
const sections = new Map<string, Count>()

function visit(value: unknown, path: string[]) {
  if (!value || typeof value !== 'object') return
  const record = value as Record<string, unknown>
  if (record.source === 'legacy' || record.source === 'verify' || record.source === 'dummy') {
    const source = record.source
    const section = path[0] ?? 'root'
    totals[source] += 1
    const count = sections.get(section) ?? { legacy: 0, verify: 0, dummy: 0 }
    count[source] += 1
    sections.set(section, count)
    return
  }
  for (const [key, child] of Object.entries(record)) visit(child, [...path, key])
}

visit(siteContent, [])
console.log('Content source counts by section')
console.log('Section                 legacy   verify   dummy')
for (const [section, count] of sections) {
  console.log(`${section.padEnd(24)}${String(count.legacy).padStart(6)}${String(count.verify).padStart(9)}${String(count.dummy).padStart(8)}`)
}
console.log(`TOTAL                   ${String(totals.legacy).padStart(6)}${String(totals.verify).padStart(9)}${String(totals.dummy).padStart(8)}`)
