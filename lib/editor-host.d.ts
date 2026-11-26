/** Lazy managed OpenPencil editor sessions for the DSH details panel. */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { type OpenPencilMcpResult, type OpenPencilSelectionSnapshot } from './mcp-client.js';
import { type EditorRuntime } from './editor-runtime.js';
import { DesignDraftController } from './design-draft-controller.js';
export declare const EDITOR_ROUTE_PREFIX = "/_dsh/dsh-openpencil/editor";
export interface EditorGrant {
    enabled: true;
    launchUrl: string;
    refreshUrl: string;
}
export type OpenPencilLiveTool = 'get_selection' | 'update_node' | 'batch_design';
export interface ActiveMcpCallOptions {
    /** Refuse to drive a different transcript card's live editor. */
    sourcePath?: string;
    ownerSessionId?: string;
    signal?: AbortSignal;
}
export interface CreateDocumentBatchOptions {
    script: string;
    canvasWidth?: number;
    signal: AbortSignal;
}
export interface CreateDocumentBatchResult {
    documentJson: string;
    result: unknown;
}
/** Locate the plugin-owned GUI-free managed host without probing a desktop app. */
export declare function findEditorHostBinary(): string | undefined;
/** Host-owned authentication for Desktop requests whose proxy omits Origin. */
export type EditorRequestAuthentication = (req: IncomingMessage) => boolean;
/**
 * Trust the transport peer, never forwarded or caller-controlled host data.
 * Node may expose an IPv4 peer either directly or as an IPv4-mapped IPv6
 * address, including the compact hexadecimal form used by some platforms.
 */
export declare function isLoopbackRemoteAddress(address: string | undefined): boolean;
/** Owns opaque launch capabilities and all live managed editor children. */
export declare class EditorHostController {
    #private;
    private readonly editableWorkspace?;
    readonly runtime: EditorRuntime | undefined;
    readonly runtimeError: Error | undefined;
    readonly binary: string | undefined;
    readonly designDrafts: DesignDraftController;
    constructor(masterKey: Buffer, runtime?: EditorRuntime, editableWorkspace?: ((sessionId: string) => Promise<string | undefined>) | undefined);
    get available(): boolean;
    get routeAvailable(): boolean;
    /** Bind optional Host authentication until its providing service is disposed. */
    attachRequestAuthentication(authenticate: EditorRequestAuthentication): () => void;
    attachRoute(): () => void;
    /** Mint an opaque, runtime-only launch URL; no source path enters metadata. */
    grantFor(sourcePath: string | undefined, sourceSha256: string | undefined): EditorGrant | undefined;
    /** Mint an owner-bound capability for the exact unpublished draft daemon. */
    grantForDraft(draftId: string, ownerSessionId: string): EditorGrant | undefined;
    handle(req: IncomingMessage, res: ServerResponse): Promise<void>;
    dispose(): Promise<void>;
    /**
     * Build one brand-new document without requiring a browser-owned editor.
     * The managed daemon is transient and never enters the visible-session map,
     * so this operation neither depends on nor retires an existing workbench.
     * Callers publish the returned authoritative JSON through DSH's filesystem
     * capability only after the whole batch succeeds.
     */
    createDocumentBatch(options: CreateDocumentBatchOptions): Promise<CreateDocumentBatchResult>;
    /** Current live editor selection, suitable for Agent context and UI chips. */
    getActiveSelection(options?: ActiveMcpCallOptions): Promise<OpenPencilSelectionSnapshot>;
    /**
     * Drive one allowlisted first-party MCP tool on the currently visible
     * editor. The managed daemon token never crosses this controller boundary.
     */
    callActiveMcp(tool: OpenPencilLiveTool, args: Record<string, unknown>, options?: ActiveMcpCallOptions): Promise<OpenPencilMcpResult>;
}
