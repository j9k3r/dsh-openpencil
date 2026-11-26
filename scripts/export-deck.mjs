import { execFileSync } from 'node:child_process'
import { mkdtemp, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { resolveEditorRuntime } from '../lib/editor-runtime.js'
import { startManagedEditorDaemon, stopManagedEditorDaemon } from '../lib/managed-editor-daemon.js'
import { callOpenPencilMcp } from '../lib/mcp-client.js'

const [, , source, ...formats] = process.argv
if (!source || !formats.length || formats.some(f => !['html', 'pptx', 'otp'].includes(f))) {
  throw new Error('Usage: node scripts/export-deck.mjs saved.op html pptx otp')
}
const sourcePath = await realpath(source)
const stem = sourcePath.slice(0, -path.extname(sourcePath).length)
const daemon = await startManagedEditorDaemon(resolveEditorRuntime(), { sourcePath, allowOrigin: 'http://127.0.0.1' })
try {
  for (const format of new Set(formats.map(f => f === 'otp' ? 'pptx' : f))) {
    const result = await callOpenPencilMcp({ baseUrl: daemon.baseUrl, token: daemon.token, tool: 'export_deck',
      arguments: { filePath: sourcePath, format, outputPath: stem + '.' + format } })
    console.log(result.text)
  }
} finally {
  await stopManagedEditorDaemon(daemon)
}
if (formats.includes('otp')) {
  const profile = await mkdtemp(path.join(tmpdir(), 'impress-deck-'))
  try {
    execFileSync('soffice', ['-env:UserInstallation=' + pathToFileURL(profile).href, '--headless',
      '--convert-to', 'otp:impress8_template', '--outdir', path.dirname(sourcePath), stem + '.pptx'], { stdio: 'inherit' })
  } finally {
    await rm(profile, { recursive: true, force: true })
  }
}
