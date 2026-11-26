import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import ts from 'typescript'
import { siteContent, type Tagged } from '../src/data/site'

const invalidPaths: string[] = []
const directDummyReads: string[] = []

function visit(value: unknown, path: string[]) {
  if (!value || typeof value !== 'object') return
  const record = value as Record<string, unknown>
  if (record.source === 'dummy') {
    const field = record as Tagged<unknown>
    if (field.availability !== 'development-only' || !field.note?.startsWith('TODO:')) {
      invalidPaths.push(path.join('.'))
    }
    return
  }
  for (const [key, child] of Object.entries(record)) visit(child, [...path, key])
}

visit(siteContent, [])

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts') ? [path] : []
  })
}

function accessPath(node: ts.Expression): Array<string | number> | undefined {
  if (ts.isIdentifier(node)) return [node.text]
  if (ts.isPropertyAccessExpression(node)) {
    const parent = accessPath(node.expression)
    return parent ? [...parent, node.name.text] : undefined
  }
  if (ts.isElementAccessExpression(node) && node.argumentExpression) {
    const parent = accessPath(node.expression)
    if (!parent) return undefined
    const argument = node.argumentExpression
    if (ts.isNumericLiteral(argument)) return [...parent, Number(argument.text)]
    if (ts.isStringLiteral(argument)) return [...parent, argument.text]
  }
  return undefined
}

for (const file of sourceFiles('src')) {
  if (relative('src', file).replace(/\\/g, '/') === 'data/site.ts') continue
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
  const inspect = (node: ts.Node) => {
    if (ts.isPropertyAccessExpression(node) && node.name.text === 'value') {
      const path = accessPath(node.expression)
      if (path?.[0] === 'siteContent') {
        let current: unknown = siteContent
        for (const part of path.slice(1)) {
          if (current === null || typeof current !== 'object') {
            current = undefined
            break
          }
          current = (current as Record<string | number, unknown>)[part]
        }
        if (current && typeof current === 'object' && (current as Tagged<unknown>).source === 'dummy') {
          directDummyReads.push(`${relative('src', file).replace(/\\/g, '/')}:${path.join('.')}`)
        }
      }
    }
    ts.forEachChild(node, inspect)
  }
  inspect(source)
}

if (directDummyReads.length) {
  throw new Error(
    `Production content guard failed. Dummy fields must be accessed through resolveContent() and gated from production:\n${directDummyReads.map((path) => `- ${path}`).join('\n')}`,
  )
}

if (invalidPaths.length) {
  throw new Error(`Production content guard failed. Dummy fields must be dev-only and have TODO notes:\n${invalidPaths.map((path) => `- ${path}`).join('\n')}`)
}

console.log('Production content guard passed: dummy fields are tagged, dev-only, and have no direct source reads.')
