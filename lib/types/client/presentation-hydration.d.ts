/** Recover browser-only presentation metadata omitted from nested Tool results. */
export declare const PRESENTATION_HYDRATION_ENDPOINT = "/_dsh/dsh-openpencil/presentation";
export declare const PRESENTATION_HYDRATION_META_KEY = "$dshOpenPencil";
export interface PresentationHydrationRequest {
    sessionId: string;
    callId: string;
    documentSha256: string;
}
export interface PresentationHydrationCandidate {
    block: unknown;
    toolName: string;
    sessionId: string;
    callId: string;
    embeddedGrant: unknown;
}
export type PresentationHydrationFetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export interface PresentationHydrationOptions {
    fetcher?: PresentationHydrationFetcher;
    signal?: AbortSignal;
}
export interface PresentationHydrationRetryTimer {
    schedule: (callback: () => void, delayMs: number) => unknown;
    cancel: (handle: unknown) => void;
}
export interface PresentationHydrationRetryOptions extends PresentationHydrationOptions {
    delaysMs?: readonly number[];
    timer?: PresentationHydrationRetryTimer;
}
type PresentationMetaParser<Grant> = (meta: unknown) => Grant | undefined;
export declare function canonicalResultObjectFromText(text: string): Record<string, unknown> | undefined;
/**
 * Read only one immutable artifact fingerprint from a canonical text result.
 * Nested run_code may echo the same JSON object once through console.log and
 * once as its return value; tolerate exactly that duplicate and nothing else.
 * Document tools use document.sha256; a stage preview uses screenshot.sha256.
 * Paths, image data, and every other model-visible result field are ignored.
 */
export declare function documentSha256FromCanonicalResult(block: unknown): string | undefined;
/** Select only canonical nested OpenPencil presentation results that need hydration. */
export declare function presentationHydrationRequestOf(candidate: PresentationHydrationCandidate): PresentationHydrationRequest | undefined;
/**
 * Exchange a non-secret result fingerprint for a same-origin presentation
 * grant. Concurrent subscribers share one request; an unmounted subscriber
 * can abort independently, and the network request is cancelled once nobody
 * is waiting for it.
 */
export declare function requestPresentationGrant<Grant>(request: PresentationHydrationRequest, parseMeta: PresentationMetaParser<Grant>, options?: PresentationHydrationOptions): Promise<Grant | undefined>;
/**
 * Retry a newly settled nested result while SessionStore catches up with the
 * live observer. The schedule is deliberately short and finite: historical
 * results that have no recoverable authority are attempted only five times.
 */
export declare function requestPresentationGrantWithRetry<Grant>(request: PresentationHydrationRequest, parseMeta: PresentationMetaParser<Grant>, options?: PresentationHydrationRetryOptions): Promise<Grant | undefined>;
export {};
