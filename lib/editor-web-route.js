import { timingSafeEqual } from 'node:crypto';
import { request } from 'node:http';
import { text } from 'node:stream/consumers';
import { pipeline } from 'node:stream/promises';
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
</script>`;
const staticAsset = /^\/(?:pkg|canvaskit)\/(?:[\w-]+\/)*[\w.-]+\.(?:js|wasm|ttf|otf|woff2?)$/;
const readApi = new Set(['document', 'indicators', 'selection', 'server', 'version']);
const writeApi = new Set(['document', 'selection', 'sync-reset']);
/** Only a current server-owned editor can supply the upstream address. */
export async function serveCanvas(req, res, session, path, search, prefix) {
    const method = req.method;
    const read = method === 'GET' || method === 'HEAD';
    const api = /^\/api\/mcp\/([a-z-]+)$/.exec(path)?.[1];
    const headers = {};
    if (api && ((read && readApi.has(api)) || (method === 'POST' && writeApi.has(api)))) {
        const key = Buffer.from(String(req.headers['x-openpencil-token'] ?? ''));
        const expected = Buffer.from(session.browserToken);
        if (key.length !== expected.length || !timingSafeEqual(key, expected)) {
            res.writeHead(403).end();
            return;
        }
        headers['X-OpenPencil-Token'] = session.daemonToken;
        if (method === 'POST')
            headers['Content-Type'] = 'application/json';
    }
    else if (!read || !(path === '/' || staticAsset.test(path))) {
        res.writeHead(404).end();
        return;
    }
    const url = new URL(session.iframeUrl);
    url.pathname = path;
    url.search = search;
    url.searchParams.delete('tenant');
    const upstream = await new Promise((resolve, reject) => {
        const outbound = request(url, { method, headers }, resolve);
        outbound.on('error', reject);
        res.once('close', () => outbound.destroy());
        if (method === 'POST')
            req.pipe(outbound);
        else
            outbound.end();
    });
    res.statusCode = upstream.statusCode ?? 502;
    res.setHeader('Content-Type', upstream.headers['content-type'] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (read && method !== 'HEAD' && path === '/' && res.statusCode === 200) {
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'; object-src 'none'; base-uri 'none'");
        res.end((await text(upstream)).replace('<head>', '<head>' + routeBootstrap)
            .replace("import('/pkg/op_host_web.js')", "import('./pkg/op_host_web.js')"));
    }
    else if (path.endsWith('/op_ck_bridge.js') && method === 'GET' && res.statusCode === 200) {
        res.end((await text(upstream)).replaceAll("'/canvaskit/", "'" + prefix + '/canvaskit/'));
    }
    else {
        await pipeline(upstream, res);
    }
}
