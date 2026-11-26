import { timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

// The pinned web shell uses root-relative URLs for its daemon API and CanvasKit.
// Scope those URLs to this editor instance; leave the surrounding Harness page alone.
const routeBootstrap = `<script>
(() => {
  const base = new URL('.', location.href);
  const scoped = value => {
    const url = new URL(value, location.href);
    if (url.origin === location.origin && /^\\/(api|canvaskit|pkg)\\//.test(url.pathname))
      return new URL(url.pathname.slice(1) + url.search, base).href;
    return url.href;
  };
  const original = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    const target = scoped(url);
    return original(target === new URL(url, location.href).href ? input :
      input instanceof Request ? new Request(target, input) : target, init);
  };
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...options) {
    return open.call(this, method, scoped(url), ...options);
  };
  const Events = window.EventSource;
  window.EventSource = class extends Events {
    constructor(url, options) { super(scoped(url), options); }
  };
})();
</script>`

const staticAsset = /^\/(?:pkg|canvaskit)\/(?:[\w-]+\/)*[\w.-]+\.(?:js|wasm|ttf|otf|woff2?)$/
const readApi = new Set(['document', 'indicators', 'selection', 'server', 'version'])
const writeApi = new Set(['document', 'selection', 'sync-reset'])

export interface CanvasRelaySession {
  iframeUrl: string
  daemonToken: string
  browserToken: string
}

/** Only a current server-owned editor can supply the upstream address. */
export async function serveCanvas(req: IncomingMessage, res: ServerResponse, session: CanvasRelaySession,
  path: string, search: string, prefix: string): Promise<void> {
  const method = req.method
  const read = method === 'GET' || method === 'HEAD'
  const api = /^\/api\/mcp\/([a-z-]+)$/.exec(path)?.[1]
  const headers: Record<string, string> = {}
  if (api && ((read && readApi.has(api)) || (method === 'POST' && writeApi.has(api)))) {
    const key = Buffer.from(String(req.headers['x-openpencil-token'] ?? ''))
    const expected = Buffer.from(session.browserToken)
    if (key.length !== expected.length || !timingSafeEqual(key, expected)) {
      res.writeHead(403).end()
      return
    }
    headers['X-OpenPencil-Token'] = session.daemonToken
    if (method === 'POST') headers['Content-Type'] = 'application/json'
  } else if (!read || !(path === '/' || staticAsset.test(path))) {
    res.writeHead(404).end()
    return
  }
  const url = new URL(session.iframeUrl)
  url.pathname = path
  url.search = search
  const abort = new AbortController()
  res.once('close', () => abort.abort())
  const upstream = await fetch(url, {
    method, headers, signal: abort.signal, redirect: 'error',
    ...(method === 'POST' ? { body: Readable.toWeb(req) as ReadableStream<Uint8Array>, duplex: 'half' as const } : {}),
  })
  res.statusCode = upstream.status
  res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/octet-stream')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  if (read && method !== 'HEAD' && path === '/' && upstream.ok) {
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'; object-src 'none'; base-uri 'none'")
    res.end((await upstream.text()).replace('<head>', '<head>' + routeBootstrap)
      .replace("import('/pkg/op_host_web.js')", "import('./pkg/op_host_web.js')"))
  } else if (path.endsWith('/op_ck_bridge.js') && method === 'GET' && upstream.ok) {
    res.end((await upstream.text()).replaceAll("'/canvaskit/", "'" + prefix + '/canvaskit/'))
  } else if (upstream.body) {
    await pipeline(Readable.fromWeb(upstream.body as import("node:stream/web").ReadableStream<Uint8Array>), res)
  } else res.end()
}
