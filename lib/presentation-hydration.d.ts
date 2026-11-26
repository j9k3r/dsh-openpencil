/**
 * Safe recovery of browser-only presentation metadata for nested Code Mode
 * tool calls.
 *
 * DSH persists nested `openpencil_render` / document-publication outcomes as a
 * `tool/code-dispatch` event, but published DSH through 0.1.0-rc.6 omits the native
 * `tool/result` presentation metadata from that event. The browser can ask
 * this same-origin endpoint to re-project that metadata without submitting
 * any path or tool result of its own. Live results are remembered briefly so
 * an explicitly requested editor grant can be restored. Durable ordinary
 * renders remain preview-only; strictly parsed new/pipeline publications may
 * recover a loopback-only explicit Edit action, but never historical auto-open.
 *
 * @module dsh-openpencil/presentation-hydration
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { type SessionStore } from '@deepseek-ai/dsh-session';
import type { ToolExecution, ToolExecutionResult } from '@deepseek-ai/dsh-tools';
import { type EditorHostController } from './editor-host.js';
import type { DesignNewResult } from './new-tool.js';
import type { BegunDraft, PublishedDraft } from './design-draft-tools.js';
import { RenderAccessController, type RenderResult } from './renderer.js';
import type { ViewerAssetController } from './viewer-assets.js';
/** Exact same-origin endpoint used by the client to recover nested metadata. */
export declare const PRESENTATION_HYDRATION_ROUTE = "/_dsh/dsh-openpencil/presentation";
interface HydratableInspectionResult {
    draftId: string;
    kind: 'screenshot';
    version: number;
    screenshot: {
        path: string;
        filename: string;
        mimeType: 'image/png';
        bytes: number;
        sha256: string;
        width: number;
        height: number;
    };
    next: string;
}
interface HydratableBatchResult {
    draftId: string;
    version: number;
    screenshot: HydratableInspectionResult['screenshot'];
}
interface HydratablePendingPipelineResult {
    draftId: string;
    path: string;
    published: false;
    stage: 'needs_preview' | 'needs_visual_review';
    reason?: 'preview_unavailable';
    digest?: string[];
    checklist?: string[];
    version: number;
    diagnostics: unknown[];
    canContinue: true;
    next: string;
    screenshot: HydratableInspectionResult['screenshot'];
    finalization: {
        version: number;
        changed: boolean;
        documentChanged: boolean;
        reused: boolean;
        documentSha256: string;
        note: string;
    };
}
interface PresentationHydrationOptions {
    ttlMs?: number;
    maxEntries?: number;
    maxRecordBytes?: number;
    maxBytes?: number;
    now?: () => number;
}
interface PresentationHydrationDependencies {
    sessions: Pick<SessionStore, 'get'>;
    render: RenderAccessController;
    viewer?: Pick<ViewerAssetController, 'viewerGrant'>;
    editor?: Pick<EditorHostController, 'grantFor' | 'grantForDraft'>;
    /** DSH Web authorities derived from `webRuntime.trustedHosts`. */
    trustedHosts?: readonly string[] | (() => readonly string[]);
}
/**
 * Accept only the canonical, content-addressed result shape emitted by this
 * plugin. Hydration never signs a legacy absolute-path-only render.
 */
export declare function parseHydratableRenderResult(value: unknown): RenderResult | undefined;
/** Accept only the canonical document-only result emitted by openpencil_new. */
export declare function parseHydratableNewResult(value: unknown): DesignNewResult | undefined;
/** Accept a published pipeline result or its immutable post-final preview wait. */
export declare function parseHydratablePipelineResult(value: unknown): PublishedDraft | HydratablePendingPipelineResult | undefined;
/** Accept only the compact live-draft settlement emitted by pipeline_begin. */
export declare function parseHydratableBeginResult(value: unknown): BegunDraft | undefined;
/** Accept only a private content-addressed screenshot settlement. */
export declare function parseHydratableInspectionResult(value: unknown): HydratableInspectionResult | undefined;
/** Accept a committed pipeline batch only when it carries a concrete PNG artifact. */
export declare function parseHydratableBatchResult(value: unknown): HydratableBatchResult | undefined;
/** Accept a landed app-agent run only when it carries a concrete PNG artifact. */
export declare function parseHydratableAgentRunResult(value: unknown): HydratableBatchResult | undefined;
/** TTL/LRU cache plus fail-closed hydration endpoint. */
export declare class PresentationHydrationController {
    #private;
    private readonly dependencies;
    constructor(dependencies: PresentationHydrationDependencies, options?: PresentationHydrationOptions);
    /** Observe one trusted in-process result before Code Mode drops its meta. */
    observeToolResult(exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>): void;
    /** Drop all live editor-capable records owned by a disposed session. */
    forgetSession(sessionId: string): void;
    /** Handle the exact same-origin POST hydration route. */
    handle(req: IncomingMessage, res: ServerResponse): Promise<void>;
}
export {};
