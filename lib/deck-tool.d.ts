import type { DesignNewServices } from './new-tool.js';
export declare function createDeckTool(services: Pick<DesignNewServices, 'fs' | 'sandboxPolicy' | 'observe'>): import("@deepseek-ai/dsh-tools").ToolDefinition;
