/** Model-facing orchestration for OpenPencil's complete, unpublished design pipeline. */
import type FileSystem from '@deepseek-ai/dsh-fs';
import type { FsObservation, FsTarget } from '@deepseek-ai/dsh-fs';
import type SandboxPolicyService from '@deepseek-ai/dsh-sandbox-policy';
import { type ToolRunContext } from '@deepseek-ai/dsh-tools';
import type { JsonValue } from './json-value.js';
import type { EditorHostController } from './editor-host.js';
import { type DocumentSnapshot, RenderAccessController, createDocumentSnapshotFromText, type RenderFrame } from './renderer.js';
import { OPENPENCIL_PIPELINE_BEGIN_TOOL_NAME, OPENPENCIL_PIPELINE_FINISH_TOOL_NAME } from './tool-names.js';
import { type StyleCatalogSnapshot } from './style-catalog.js';
import { type StyleRecommendationProvider } from './style-planner.js';
export declare const COMMERCE_BRIEF: RegExp;
export interface DesignDraftToolServices {
    fs: FileSystem;
    sandboxPolicy: SandboxPolicyService;
    render: RenderAccessController;
    observe(target: FsTarget, observation: FsObservation, exec: ToolRunContext): void;
    /** Test seam and pre-commit artifact builder; defaults to the real cache. */
    createDocumentSnapshot?: typeof createDocumentSnapshotFromText;
    /** Optional advisory provider fixture; the planner ships off by default. */
    styleProvider?: StyleRecommendationProvider;
    /** Test seam for handle expiry; defaults to the wall clock. */
    styleClock?: () => number;
    /** Test seam over the installed catalog snapshot (value or loader). */
    styleCatalog?: StyleCatalogSnapshot | (() => StyleCatalogSnapshot);
    /** Whether begin exposes the style_selection handoff input; default true. */
    styleHandoff?: {
        enabled: boolean;
    };
}
export interface DraftCanvasContract {
    platform: 'web' | 'mobile';
    width: number;
    seedHeight: number;
    finalHeight: number | 'fit_content';
    fixedViewport: boolean;
    rootCount: 1;
    rootType: 'frame';
}
export interface PublishedDraft {
    draftId: string;
    path: string;
    filename: string;
    bytes: number;
    sha256: string;
    created: true;
    applied: true;
    saved: true;
    published: true;
    sourceTool: typeof OPENPENCIL_PIPELINE_FINISH_TOOL_NAME;
    previewIntent: 'document';
    editable: true;
    autoOpenEditor: true;
    preview: RenderFrame;
    document: DocumentSnapshot;
    note: string;
    /** Immutable confirmed style section retained through publication (§4). */
    selectedStyle?: JsonValue;
}
/** Compact unpublished result projected into the live editor workbench. */
export interface BegunDraft {
    draftId: string;
    path: string;
    version: number;
    createdAt?: number;
    platform: 'web' | 'mobile';
    canvas: DraftCanvasContract;
    buildContract: JsonValue;
    rootNodeId: string;
    continuationStyle: JsonValue;
    editorState: JsonValue;
    styleGuideTags: JsonValue;
    document: DocumentSnapshot;
    sourceTool: typeof OPENPENCIL_PIPELINE_BEGIN_TOOL_NAME;
    previewIntent: 'document';
    editable: true;
    autoOpenEditor: true;
    liveCanvas: true;
    published: false;
    next: string;
}
export declare function latestDirectUserText(exec: ToolRunContext): string | undefined;
/** Choice-only replies do not declare a new viewport or platform. */
export declare function hasExplicitCanvasIntent(text: string): boolean;
export declare function draftCanvasContract(brief: string, directUserText?: string): DraftCanvasContract;
/** Owns model tool definitions and the publication metadata kept outside the daemon. */
export declare class DesignDraftToolController {
    #private;
    constructor(editorHost: EditorHostController, services: DesignDraftToolServices);
    createTools(): readonly [import("@deepseek-ai/dsh-tools").ToolDefinition, import("@deepseek-ai/dsh-tools").ToolDefinition, import("@deepseek-ai/dsh-tools").ToolDefinition, import("@deepseek-ai/dsh-tools").ToolDefinition, import("@deepseek-ai/dsh-tools").ToolDefinition, import("@deepseek-ai/dsh-tools").ToolDefinition, import("@deepseek-ai/dsh-tools").ToolDefinition, ...import("@deepseek-ai/dsh-tools").ToolDefinition[]];
    /** Whether this DSH agent currently owns an unpublished pipeline draft. */
    hasActiveDraft(owner: string): boolean;
    abortOwner(owner: string): Promise<void>;
    dispose(): Promise<void>;
}
export declare function createDesignDraftToolController(editorHost: EditorHostController, services: DesignDraftToolServices): DesignDraftToolController;
