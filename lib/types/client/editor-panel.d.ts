/** Full OpenPencil editor shared by native Tool details and plugin-owned surfaces. */
import type { PresentationGrant } from './index.js';
import { encodeEditorOutbound, type EditorColorScheme, type EditorLocale } from './editor-bridge.js';
import { type EditorRecoverySummary } from './editor-recovery.js';
export type { EditorRecoverySummary } from './editor-recovery.js';
export interface LaunchResponse {
    sessionId: string;
    iframeUrl: string;
    token: string;
    saveUrl: string;
    selectionUrl?: string;
    recoveryUrl?: string;
    recovery?: EditorRecoverySummary;
    closeUrl: string;
    docJson?: string;
    /** The iframe is attached to a pipeline-owned daemon instead of a persisted source session. */
    liveDraft?: boolean;
    /** Same-origin capability that acknowledges the live iframe after its bridge is ready. */
    readyUrl?: string;
    /** Client-only marker: the persisted launch capability was renewed. */
    renewed?: true;
}
/** Pipeline drafts publish through `pipeline_finish`; their canvas has no independent save edge. */
export declare function managedEditorAllowsSave(launch: Pick<LaunchResponse, 'liveDraft'> | undefined): boolean;
export interface EditorBootResult {
    launch: LaunchResponse;
    documentJson: string;
}
export interface EditorPanelCopy {
    save: string;
    saving: string;
    unsaved: string;
    saved: string;
    unavailable: string;
    loading: string;
    errorTitle: string;
    pngFallback: string;
    editorTitle: (title: string) => string;
    editorTimeout: string;
    editorBusy: string;
    discard: string;
    saveConflict: (serverVersion: number) => string;
    syncConflict: (serverVersion: number) => string;
}
/** Chrome copy for the locale already resolved by the DSH host. */
export declare function editorPanelCopy(locale: EditorLocale): EditorPanelCopy;
interface EditorBootOptions {
    signal?: AbortSignal;
    fetcher?: typeof fetch;
    sessionId?: string;
}
interface EditorCloseOptions {
    fetcher?: typeof fetch;
    dirty?: boolean;
    keepalive?: boolean;
}
/**
 * Launch one editor, renewing exactly once when a replayed launch capability
 * has expired. A refreshed capability is never persisted back into the Tool
 * block, and only same-origin control routes can receive document metadata.
 */
export declare function launchManagedEditor(editor: NonNullable<PresentationGrant['editor']>, document: NonNullable<PresentationGrant['document']>, options?: EditorBootOptions): Promise<LaunchResponse>;
/** Prefer the daemon's current source; fetch the immutable snapshot only for old hosts. */
export declare function prepareManagedEditor(editor: NonNullable<PresentationGrant['editor']>, document: NonNullable<PresentationGrant['document']>, options?: EditorBootOptions): Promise<EditorBootResult>;
/**
 * Complete the bridge-ready edge without confusing a live pipeline daemon
 * with a persisted editor session. Normal sessions receive their exact boot
 * document; live drafts acknowledge attachment through a same-origin host
 * capability and keep the daemon's current document untouched.
 */
export declare function completeManagedEditorBridgeReady(launch: LaunchResponse, documentJson: string, post: (message: Parameters<typeof encodeEditorOutbound>[0]) => void, options?: {
    fetcher?: typeof fetch;
    signal?: AbortSignal;
}): Promise<'document-open-requested' | 'live-draft-attached'>;
/** Close exactly the managed session returned by one launch response. */
export declare function closeManagedEditorLaunch(launch: LaunchResponse, options?: EditorCloseOptions): Promise<void>;
/**
 * Mount-aware boot boundary. React may cancel an effect after its launch POST
 * has committed; release that precise returned session before ignoring it.
 */
export declare function prepareManagedEditorForMount(editor: NonNullable<PresentationGrant['editor']>, document: NonNullable<PresentationGrant['document']>, accept: () => boolean, options?: EditorBootOptions): Promise<EditorBootResult | undefined>;
export type EditorLifecyclePhase = 'launching' | 'loading' | 'ready' | 'saving' | 'error';
export interface EditorLifecycleState {
    dirty: boolean;
    phase: EditorLifecyclePhase;
}
export interface EditorLifecycleController {
    /** Close through the guarded server capability while the React owner remains mounted. */
    requestClose: () => Promise<boolean>;
    /** Ask the host to persist an opaque, source-scoped daemon recovery snapshot. */
    captureRecovery: () => Promise<boolean>;
    /** Join a save the user already started; never starts a new source write. */
    awaitExistingSave: () => Promise<boolean>;
    /** HMR-only escape hatch: leave the daemon for the server lifecycle when capture failed. */
    retainServerSessionOnUnmount: () => void;
}
export declare const INITIAL_EDITOR_LIFECYCLE_STATE: EditorLifecycleState;
export type EditorUnmountDisposition = 'closed' | 'retained';
export interface EditorUnmountState {
    /** Explicit retention armed after a failed workbench recovery capture. */
    retainServerSession: boolean;
    /** Latest client dirty signal. */
    dirty: boolean;
    /** False after a successful explicit close cleared the exact launch. */
    hasLiveLaunch: boolean;
    /** Pipeline-owned daemons are only detached by this panel and never retained for recovery. */
    liveDraft?: boolean;
}
export interface EditorInitRetryTimer<T> {
    schedule: (callback: () => void, delayMs: number) => T;
    cancel: (handle: T) => void;
}
export interface EditorInitRetryController {
    /** Stop retrying and disarm the timeout budget. Called once `op-bridge/ready` arrives. */
    stop: () => void;
    /**
     * The editor announced its message listener (`op-bridge/listening`): deliver
     * init immediately and stop the periodic retries, because this init is now
     * guaranteed to arrive. The timeout stays armed so a listening editor that
     * never becomes ready still surfaces the bounded timeout error.
     */
    acknowledgeListening: () => void;
}
/**
 * Start the managed-editor init handshake immediately, then retry on a bounded
 * interval until the caller stops it after `op-bridge/ready` or the timeout
 * budget is exhausted.
 *
 * This deliberately starts before the iframe `load` event. OpenPencil waits
 * briefly for this token before starting daemon-backed services (including the
 * account-status request), while a browser may delay `load` until module/Wasm
 * startup is already complete. Waiting for `load` can therefore make the first
 * account request run unauthenticated and hide the login button until the
 * editor's later health refresh.
 *
 * postMessage drops messages sent before the iframe registered a listener, so
 * the budget must outlive the editor's first Wasm download (~24 MB on a cold
 * start). Newer editors announce that moment with `op-bridge/listening`;
 * `acknowledgeListening` then delivers init immediately and stops the now
 * redundant periodic retries. Older editors never announce it and simply keep
 * receiving retries until `ready` or the timeout.
 */
export declare function beginEditorInitRetry<T>(send: () => void, onExhausted: () => void, timer: EditorInitRetryTimer<T>, options?: {
    intervalMs?: number;
    timeoutMs?: number;
}): EditorInitRetryController;
export declare namespace beginEditorInitRetry {
    /** Accept the first ready edge only; duplicate readiness must not reopen a document. */
    function takeReady(latch: {
        current: boolean;
    }): boolean;
}
/**
 * Apply the unmount policy without letting React cleanup accidentally issue
 * DELETE for a dirty persisted editor. Pipeline-owned live drafts are the
 * inverse: DELETE only detaches this panel, so they are always released.
 */
export declare function applyManagedEditorUnmountPolicy(state: EditorUnmountState, closeDaemon: () => void): EditorUnmountDisposition;
/** Editable panel. The daemon is created lazily only while this component is mounted. */
export declare function ManagedOpenPencilEditor({ grant, colorScheme, locale, sessionId, onTakeoverRequest, onLifecycleState, onLifecycleController, workbenchActions, allowTakeover, }: {
    grant: PresentationGrant;
    colorScheme: EditorColorScheme;
    locale: EditorLocale;
    sessionId: string;
    onTakeoverRequest?: (state: EditorLifecycleState) => boolean;
    onLifecycleState?: (state: EditorLifecycleState) => void;
    onLifecycleController?: (controller: EditorLifecycleController | undefined) => void;
    workbenchActions?: React.ReactNode;
    allowTakeover?: boolean;
}): import("react").JSX.Element;
