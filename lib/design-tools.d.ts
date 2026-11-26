/** Model-facing tools that directly drive the active OpenPencil canvas. */
import type { JsonValue } from './json-value.js';
import type { EditorHostController } from './editor-host.js';
/** Read the exact selection the user currently has on the editable canvas. */
export declare function createDesignSelectionTool(editorHost: EditorHostController): import("@deepseek-ai/dsh-tools").ToolDefinition;
export interface DesignCreateArgs {
    path: string;
    operations: string;
    pageId?: string;
    canvasWidth?: number;
    postProcess?: boolean;
}
/** Apply one transactional OpenPencil batch program to generate design nodes. */
export declare function createDesignCreateTool(editorHost: EditorHostController): import("@deepseek-ai/dsh-tools").ToolDefinition;
export interface DesignEditArgs {
    path: string;
    nodeId?: string;
    imageFile?: string;
    changes?: Record<string, JsonValue>;
}
export declare function projectImage(workspace: string, input: string): Promise<string>;
/** Patch one explicit node, or the single node the user selected. */
export declare function createDesignEditTool(editorHost: EditorHostController): import("@deepseek-ai/dsh-tools").ToolDefinition;
