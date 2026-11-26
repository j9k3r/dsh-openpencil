/** Persistent, owner-isolated design drafts backed by managed OpenPencil daemons. */
import type { EditorRuntime } from './editor-runtime.js';
export type DesignDraftToolMode = 'read' | 'must-change' | 'may-noop';
export declare function designDraftToolMode(tool: string): DesignDraftToolMode | undefined;
export interface DesignDraftTarget {
    id: string;
    label?: string;
    kind?: string;
}
export interface DesignDraftMetadata {
    draftId: string;
    target: DesignDraftTarget;
    createdAt: number;
    idleExpiresAt: number;
    absoluteExpiresAt: number;
    version: number;
}
export interface DesignDraftBeginOptions {
    ownerSessionId: string;
    target: DesignDraftTarget;
    signal: AbortSignal;
}
export interface DesignDraftCallOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
    /** Optional optimistic guard for a controller-owned compound operation. */
    expectedVersion?: number;
}
export interface DesignDraftCallResult {
    draftId: string;
    target: DesignDraftTarget;
    tool: string;
    value: unknown;
    text: string;
    version: number;
    changed: boolean;
    hasImage: boolean;
}
export interface DesignDraftSnapshot {
    draftId: string;
    target: DesignDraftTarget;
    version: number;
    documentJson: string;
}
export interface DesignDraftScreenshot {
    draftId: string;
    target: DesignDraftTarget;
    version: number;
    documentSha256: string;
    bytes: Buffer;
    mimeType: string;
    metadata: unknown;
}
/** Browser attachment to the exact daemon that owns an unpublished draft. */
export interface DesignDraftLiveLaunch {
    draftId: string;
    target: DesignDraftTarget;
    attachId: string;
    baseUrl: string;
    token: string;
    sourcePath: string;
    documentJson: string;
    version: number;
}
export interface DesignDraftFinishOptions<Published> {
    signal?: AbortSignal;
    requireCurrentScreenshot?: boolean;
    /** Optional finalized checkpoint expected by the caller. Both fields must be supplied together. */
    expectedVersion?: number;
    expectedDocumentSha256?: string;
    /** Runs while the draft's serialized operation lock is still held. */
    publish: (snapshot: DesignDraftSnapshot) => Promise<Published>;
}
export interface DesignDraftFinishResult<Published> {
    draftId: string;
    target: DesignDraftTarget;
    version: number;
    published: Published;
}
export interface DesignDraftControllerOptions {
    maxDrafts?: number;
    idleMs?: number;
    absoluteMs?: number;
    now?: () => number;
    runtimeUnavailableMessage?: string;
    onDraftEnded?: (draftId: string, ownerSessionId: string) => void;
}
export declare class DesignDraftPreviewRequiredError extends Error {
    readonly code = "OPENPENCIL_DRAFT_PREVIEW_REQUIRED";
    readonly currentVersion: number;
    readonly finalizedVersion?: number;
    readonly screenshotVersion?: number;
    readonly screenshotDocumentSha256?: string;
    readonly screenshotFinalizedVersion?: number;
    readonly screenshotFinalizedDocumentSha256?: string;
    constructor(state: {
        currentVersion: number;
        finalizedVersion?: number;
        screenshotVersion?: number;
        screenshotDocumentSha256?: string;
        screenshotFinalizedVersion?: number;
        screenshotFinalizedDocumentSha256?: string;
    });
}
export declare class DesignDraftCheckpointDriftError extends Error {
    readonly expectedVersion: number;
    readonly expectedDocumentSha256: string;
    readonly currentVersion: number;
    readonly currentDocumentSha256: string;
    readonly code = "OPENPENCIL_DRAFT_CHECKPOINT_DRIFT";
    constructor(expectedVersion: number, expectedDocumentSha256: string, currentVersion: number, currentDocumentSha256: string);
}
/** A separate draft map; browser-visible EditorSession authority is never reused. */
export declare class DesignDraftController {
    #private;
    constructor(runtime: EditorRuntime | undefined, options?: DesignDraftControllerOptions);
    begin(options: DesignDraftBeginOptions): Promise<DesignDraftMetadata>;
    call(draftId: string, ownerSessionId: string, tool: string, args: Record<string, unknown>, options?: DesignDraftCallOptions): Promise<DesignDraftCallResult>;
    snapshot(draftId: string, ownerSessionId: string, options?: Pick<DesignDraftCallOptions, 'signal'>): Promise<DesignDraftSnapshot>;
    /**
     * Atomically restore a controller-owned snapshot after a rejected batch.
     * The current daemon version is used as the optimistic base so a concurrent
     * live-canvas edit conflicts instead of being overwritten.
     */
    restoreSnapshot(draftId: string, ownerSessionId: string, snapshot: DesignDraftSnapshot, options?: Pick<DesignDraftCallOptions, 'signal' | 'expectedVersion'>): Promise<DesignDraftSnapshot>;
    finalize(draftId: string, ownerSessionId: string, options?: DesignDraftCallOptions): Promise<DesignDraftCallResult>;
    screenshot(draftId: string, ownerSessionId: string, options?: Pick<DesignDraftCallOptions, 'signal' | 'timeoutMs'> & {
        nodeId?: string;
    }): Promise<DesignDraftScreenshot>;
    finish<Published>(draftId: string, ownerSessionId: string, options: DesignDraftFinishOptions<Published>): Promise<DesignDraftFinishResult<Published>>;
    abort(draftId: string, ownerSessionId: string): Promise<boolean>;
    /**
     * Freeze the current daemon document into its private starter file and
     * consume the daemon's one-shot sync reset before exposing the iframe. The
     * browser's later bootstrap reset is therefore an idempotent skipped call,
     * so subsequent Agent writes never wait on (or race) Web/Wasm startup.
     */
    prepareLiveLaunch(draftId: string, ownerSessionId: string, signal?: AbortSignal): Promise<DesignDraftLiveLaunch>;
    /** Record that the browser bridge mounted; data safety no longer depends on this edge. */
    markLiveReady(draftId: string, ownerSessionId: string, attachId: string): boolean;
    /** Detach a sidebar without retiring the Agent-owned draft daemon. */
    detachLive(draftId: string, ownerSessionId: string, attachId: string): boolean;
    abortOwner(ownerSessionId: string): Promise<number>;
    dispose(): Promise<void>;
}
