import type { EditorRuntime } from './editor-runtime.js';
export declare function managedEditorProcessOptions(runtime: EditorRuntime, sourcePath: string, allowOrigin: string): Promise<{
    args: string[];
    env: NodeJS.ProcessEnv;
}>;
