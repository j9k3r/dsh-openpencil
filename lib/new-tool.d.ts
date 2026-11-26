/** Create a brand-new OpenPencil document from one transactional QuickJS build. */
import type FileSystem from '@deepseek-ai/dsh-fs';
import type { FsObservation, FsTarget } from '@deepseek-ai/dsh-fs';
import type SandboxPolicyService from '@deepseek-ai/dsh-sandbox-policy';
import { type ToolRunContext } from '@deepseek-ai/dsh-tools';
import type { JsonValue } from './json-value.js';
import type { EditorHostController } from './editor-host.js';
import { type DocumentSnapshot, RenderAccessController } from './renderer.js';
import { OPENPENCIL_NEW_TOOL_NAME } from './tool-names.js';
export interface DesignNewArgs {
    path: string;
    script: string;
    canvasWidth?: number;
}
export interface DesignNewServices {
    fs: FileSystem;
    sandboxPolicy: SandboxPolicyService;
    render: RenderAccessController;
    observe(target: FsTarget, observation: FsObservation, exec: ToolRunContext): void;
}
export interface DesignNewResult {
    path: string;
    filename: string;
    bytes: number;
    sha256: string;
    created: true;
    applied: true;
    saved: true;
    sourceTool: typeof OPENPENCIL_NEW_TOOL_NAME;
    previewIntent: 'document';
    editable: true;
    autoOpenEditor: true;
    document: DocumentSnapshot;
    result?: Record<string, JsonValue>;
    note: string;
}
/**
 * Build and atomically publish a new `.op` document. The QuickJS build runs in
 * a private managed daemon, so no existing file or browser-owned sidebar is
 * required and a failed design never leaves an empty target behind.
 */
export declare function createDesignNewTool(editorHost: EditorHostController, services: DesignNewServices): import("@deepseek-ai/dsh-tools").ToolDefinition;
