export declare const EDITOR_RUNTIME_SCHEMA_VERSION = 1;
/** Suffixes of the three editor-runtime overrides — see plugin-env.ts. */
export declare const EDITOR_RUNTIME_ENV_SUFFIX: Readonly<{
    binary: "OPENPENCIL_EDITOR_BINARY";
    webBundleDir: "OPENPENCIL_EDITOR_WEB_BUNDLE_DIR";
    canvasKitDir: "OPENPENCIL_EDITOR_CANVASKIT_DIR";
}>;
/** Current names of those overrides; the legacy DSH_ names are still read. */
export declare const EDITOR_RUNTIME_ENV: Readonly<{
    binary: string;
    webBundleDir: string;
    canvasKitDir: string;
}>;
export type EditorRuntimeSource = 'override' | 'optional-package' | 'development-package';
export interface EditorRuntime {
    binary: string;
    webBundleDir: string;
    canvasKitDir: string;
    openPencilVersion: string;
    revision: string;
    source: EditorRuntimeSource;
}
export type EditorRuntimeLayout = 'canonical' | 'legacy';
export interface EditorRuntimePlatform {
    id: string;
    os: string;
    cpu: string;
    libc?: string;
    rustTarget: string;
    runner: string;
    packageName: string;
    binaryName: string;
}
export interface EditorRuntimeCatalog {
    schemaVersion: 1;
    openPencil: {
        version: string;
        revision: string;
    };
    platforms: readonly EditorRuntimePlatform[];
}
export interface EditorRuntimeManifest {
    schemaVersion: 1;
    platform: string;
    packageName: string;
    openPencilVersion: string;
    openPencilRevision: string;
    files: Readonly<Record<string, string>>;
}
export type EditorRuntimeErrorCode = 'catalog-unavailable' | 'invalid-catalog' | 'unsupported-platform' | 'partial-override' | 'invalid-override' | 'runtime-not-found' | 'invalid-runtime';
/** A stable, machine-readable error with concise operator diagnostics. */
export declare class EditorRuntimeUnavailableError extends Error {
    readonly code: EditorRuntimeErrorCode;
    readonly diagnostics: readonly string[];
    constructor(code: EditorRuntimeErrorCode, message: string, diagnostics?: readonly string[], options?: ErrorOptions);
}
interface FileStat {
    isFile(): boolean;
    isDirectory(): boolean;
}
export interface ResolveEditorRuntimeOptions {
    platform?: string;
    arch?: string;
    env?: Readonly<Record<string, string | undefined>>;
    /** Repository/package root containing platforms.json and npm/<platform>. */
    projectRoot?: string;
    /** Inject parsed catalog data to make resolution independent of disk state. */
    catalog?: unknown;
    resolvePackageJson?: (specifier: string) => string;
    readFile?: (path: string) => Buffer;
    stat?: (path: string) => FileStat;
    chmod?: (path: string, mode: number) => void;
}
/** Parse and validate platforms.json without performing any I/O. */
export declare function parseEditorRuntimeCatalog(value: unknown): EditorRuntimeCatalog;
/** Parse one openpencil-runtime.json and bind it to its expected release. */
export declare function parseEditorRuntimeManifest(value: unknown, expected: Readonly<{
    platform: string;
    packageName: string;
    openPencilVersion: string;
    openPencilRevision: string;
}>): EditorRuntimeManifest;
/** Stable selector used by both npm package names and npm/<platform> staging. */
export declare function editorRuntimePlatformKey(platform?: string, arch?: string): string;
/** The five files that make one atomic staged runtime minimally bootable. */
export declare function editorRuntimeRequiredFiles(binaryName: string, layout?: EditorRuntimeLayout): readonly string[];
/** Resolve and fully verify one atomic editor runtime, or throw diagnostics. */
export declare function resolveEditorRuntime(options?: ResolveEditorRuntimeOptions): EditorRuntime;
/**
 * Optional form for hosts where the editor is an add-on. Integrity and
 * configuration failures still throw; only an absent/unsupported runtime is
 * represented as undefined.
 */
export declare function tryResolveEditorRuntime(options?: ResolveEditorRuntimeOptions): EditorRuntime | undefined;
export {};
