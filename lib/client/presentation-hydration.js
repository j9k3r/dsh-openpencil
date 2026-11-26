/** Recover browser-only presentation metadata omitted from nested Tool results. */
import { OPENPENCIL_NEW_TOOL_NAME, OPENPENCIL_PIPELINE_BATCH_TOOL_NAME, OPENPENCIL_PIPELINE_BEGIN_TOOL_NAME, OPENPENCIL_PIPELINE_FINISH_TOOL_NAME, OPENPENCIL_PIPELINE_INSPECT_TOOL_NAME, OPENPENCIL_RENDER_TOOL_NAME, } from '../tool-names.js';
export const PRESENTATION_HYDRATION_ENDPOINT = '/_dsh/dsh-openpencil/presentation';
export const PRESENTATION_HYDRATION_META_KEY = '$dshOpenPencil';
const MAX_CANONICAL_RESULT_CHARS = 1024 * 1024;
const MAX_SESSION_ID_CHARS = 256;
const MAX_CALL_ID_CHARS = 512;
const pendingByFetcher = new WeakMap();
const DEFAULT_RETRY_DELAYS_MS = [100, 250, 500, 1_000];
const defaultRetryTimer = {
    schedule: (callback, delayMs) => setTimeout(callback, delayMs),
    cancel: handle => { clearTimeout(handle); },
};
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isJsonWhitespace(value) {
    return value === ' ' || value === '\t' || value === '\n' || value === '\r';
}
function skipJsonWhitespace(text, start) {
    let index = start;
    while (index < text.length && isJsonWhitespace(text[index] ?? ''))
        index += 1;
    return index;
}
function jsonValuesEqual(left, right) {
    const pending = [[left, right]];
    while (pending.length > 0) {
        const [currentLeft, currentRight] = pending.pop() ?? [];
        if (Object.is(currentLeft, currentRight))
            continue;
        if (typeof currentLeft !== 'object' || currentLeft === null
            || typeof currentRight !== 'object' || currentRight === null)
            return false;
        const leftArray = Array.isArray(currentLeft);
        if (leftArray !== Array.isArray(currentRight))
            return false;
        if (leftArray) {
            const leftItems = currentLeft;
            const rightItems = currentRight;
            if (leftItems.length !== rightItems.length)
                return false;
            for (let index = 0; index < leftItems.length; index += 1) {
                pending.push([leftItems[index], rightItems[index]]);
            }
            continue;
        }
        const leftRecord = currentLeft;
        const rightRecord = currentRight;
        const leftKeys = Object.keys(leftRecord).sort();
        const rightKeys = Object.keys(rightRecord).sort();
        if (leftKeys.length !== rightKeys.length)
            return false;
        for (let index = 0; index < leftKeys.length; index += 1) {
            const key = leftKeys[index];
            if (key !== rightKeys[index])
                return false;
            pending.push([leftRecord[key], rightRecord[key]]);
        }
    }
    return true;
}
function parseJsonObjectAt(text, start) {
    if (text[start] !== '{')
        return undefined;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < text.length; index += 1) {
        const character = text[index];
        if (inString) {
            if (escaped)
                escaped = false;
            else if (character === '\\')
                escaped = true;
            else if (character === '"')
                inString = false;
            continue;
        }
        if (character === '"') {
            inString = true;
            continue;
        }
        if (character === '{')
            depth += 1;
        else if (character === '}') {
            depth -= 1;
            if (depth < 0)
                return undefined;
            if (depth === 0) {
                const end = index + 1;
                try {
                    const value = JSON.parse(text.slice(start, end));
                    return isRecord(value) ? { end, value } : undefined;
                }
                catch {
                    return undefined;
                }
            }
        }
    }
    return undefined;
}
export function canonicalResultObjectFromText(text) {
    if (text.length > MAX_CANONICAL_RESULT_CHARS)
        return undefined;
    const firstStart = skipJsonWhitespace(text, 0);
    const first = parseJsonObjectAt(text, firstStart);
    if (first === undefined)
        return undefined;
    const secondStart = skipJsonWhitespace(text, first.end);
    if (secondStart === text.length)
        return first.value;
    if (secondStart === first.end)
        return undefined;
    const second = parseJsonObjectAt(text, secondStart);
    if (second === undefined || skipJsonWhitespace(text, second.end) !== text.length)
        return undefined;
    return jsonValuesEqual(first.value, second.value) ? first.value : undefined;
}
function isRequest(value) {
    return value.sessionId.length > 0
        && value.sessionId.length <= MAX_SESSION_ID_CHARS
        && value.callId.length > 0
        && value.callId.length <= MAX_CALL_ID_CHARS
        && /^[a-f0-9]{64}$/iu.test(value.documentSha256);
}
function requestKey(value) {
    return `${value.sessionId}\n${value.callId}\n${value.documentSha256.toLowerCase()}`;
}
function pendingEnvelope(request, fetcher) {
    let pending = pendingByFetcher.get(fetcher);
    if (pending === undefined) {
        pending = new Map();
        pendingByFetcher.set(fetcher, pending);
    }
    const key = requestKey(request);
    const existing = pending.get(key);
    if (existing !== undefined)
        return existing;
    const controller = new AbortController();
    const entry = {
        subscribers: 0,
        settled: false,
        cancelIfUnused: () => { },
        promise: Promise.resolve(undefined),
    };
    entry.cancelIfUnused = () => {
        if (entry.subscribers !== 0 || entry.settled)
            return;
        if (pending?.get(key) === entry)
            pending.delete(key);
        controller.abort();
    };
    entry.promise = (async () => {
        const response = await fetcher(PRESENTATION_HYDRATION_ENDPOINT, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: JSON.stringify(request),
            signal: controller.signal,
        });
        if (!response.ok)
            return undefined;
        try {
            return await response.json();
        }
        catch {
            return undefined;
        }
    })().catch(() => undefined).finally(() => {
        entry.settled = true;
        if (pending?.get(key) === entry)
            pending.delete(key);
    });
    pending.set(key, entry);
    return entry;
}
/**
 * Read only one immutable artifact fingerprint from a canonical text result.
 * Nested run_code may echo the same JSON object once through console.log and
 * once as its return value; tolerate exactly that duplicate and nothing else.
 * Document tools use document.sha256; a stage preview uses screenshot.sha256.
 * Paths, image data, and every other model-visible result field are ignored.
 */
export function documentSha256FromCanonicalResult(block) {
    if (!isRecord(block) || block.isError !== false || !Array.isArray(block.content) || block.content.length !== 1) {
        return undefined;
    }
    const content = block.content[0];
    if (!isRecord(content) || content.type !== 'text' || typeof content.text !== 'string')
        return undefined;
    const result = canonicalResultObjectFromText(content.text);
    if (result === undefined)
        return undefined;
    const fingerprint = isRecord(result.document)
        ? result.document.sha256
        : isRecord(result.screenshot)
            ? result.screenshot.sha256
            : undefined;
    return typeof fingerprint === 'string' && /^[a-f0-9]{64}$/iu.test(fingerprint)
        ? fingerprint.toLowerCase()
        : undefined;
}
/** Select only canonical nested OpenPencil presentation results that need hydration. */
export function presentationHydrationRequestOf(candidate) {
    if (candidate.embeddedGrant !== undefined
        || (candidate.toolName !== OPENPENCIL_RENDER_TOOL_NAME
            && candidate.toolName !== OPENPENCIL_NEW_TOOL_NAME
            && candidate.toolName !== OPENPENCIL_PIPELINE_BEGIN_TOOL_NAME
            && candidate.toolName !== OPENPENCIL_PIPELINE_BATCH_TOOL_NAME
            && candidate.toolName !== OPENPENCIL_PIPELINE_INSPECT_TOOL_NAME
            && candidate.toolName !== OPENPENCIL_PIPELINE_FINISH_TOOL_NAME)) {
        return undefined;
    }
    const documentSha256 = documentSha256FromCanonicalResult(candidate.block);
    if (documentSha256 === undefined
        || candidate.sessionId.length === 0
        || candidate.sessionId.length > MAX_SESSION_ID_CHARS
        || candidate.callId.length === 0
        || candidate.callId.length > MAX_CALL_ID_CHARS) {
        return undefined;
    }
    return {
        sessionId: candidate.sessionId,
        callId: candidate.callId,
        documentSha256,
    };
}
/**
 * Exchange a non-secret result fingerprint for a same-origin presentation
 * grant. Concurrent subscribers share one request; an unmounted subscriber
 * can abort independently, and the network request is cancelled once nobody
 * is waiting for it.
 */
export function requestPresentationGrant(request, parseMeta, options = {}) {
    if (!isRequest(request) || options.signal?.aborted === true)
        return Promise.resolve(undefined);
    const fetcher = options.fetcher ?? globalThis.fetch;
    if (typeof fetcher !== 'function')
        return Promise.resolve(undefined);
    const entry = pendingEnvelope(request, fetcher);
    entry.subscribers += 1;
    return new Promise(resolve => {
        let finished = false;
        const release = () => {
            entry.subscribers = Math.max(0, entry.subscribers - 1);
            entry.cancelIfUnused();
        };
        const finish = (value) => {
            if (finished)
                return;
            finished = true;
            options.signal?.removeEventListener('abort', abort);
            release();
            resolve(value);
        };
        const abort = () => { finish(undefined); };
        options.signal?.addEventListener('abort', abort, { once: true });
        entry.promise.then(value => {
            if (finished || options.signal?.aborted === true) {
                finish(undefined);
                return;
            }
            if (!isRecord(value) || !Object.hasOwn(value, PRESENTATION_HYDRATION_META_KEY)) {
                finish(undefined);
                return;
            }
            try {
                finish(parseMeta({
                    [PRESENTATION_HYDRATION_META_KEY]: value[PRESENTATION_HYDRATION_META_KEY],
                }));
            }
            catch {
                finish(undefined);
            }
        }, () => { finish(undefined); });
    });
}
function waitForPresentationRetry(delayMs, signal, timer) {
    if (signal?.aborted === true)
        return Promise.resolve(false);
    return new Promise(resolve => {
        let finished = false;
        let handle;
        const finish = (ready) => {
            if (finished)
                return;
            finished = true;
            signal?.removeEventListener('abort', abort);
            if (!ready)
                timer.cancel(handle);
            resolve(ready);
        };
        const abort = () => { finish(false); };
        signal?.addEventListener('abort', abort, { once: true });
        handle = timer.schedule(() => { finish(true); }, delayMs);
    });
}
/**
 * Retry a newly settled nested result while SessionStore catches up with the
 * live observer. The schedule is deliberately short and finite: historical
 * results that have no recoverable authority are attempted only five times.
 */
export async function requestPresentationGrantWithRetry(request, parseMeta, options = {}) {
    const delaysMs = options.delaysMs ?? DEFAULT_RETRY_DELAYS_MS;
    const timer = options.timer ?? defaultRetryTimer;
    for (let attempt = 0; attempt <= delaysMs.length; attempt += 1) {
        if (options.signal?.aborted === true)
            return undefined;
        const grant = await requestPresentationGrant(request, parseMeta, options);
        if (grant !== undefined)
            return grant;
        if (attempt === delaysMs.length)
            return undefined;
        if (!await waitForPresentationRetry(delaysMs[attempt] ?? 0, options.signal, timer)) {
            return undefined;
        }
    }
    return undefined;
}
