/**
 * Atomic OpenPencil editor runtime resolution.
 *
 * A runtime is always selected as one complete package root. The daemon and
 * both web asset directories are never assembled from unrelated installs.
 */
import { createHash } from 'node:crypto';
import { chmodSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pluginEnv, pluginEnvName } from './plugin-env.js';
export const EDITOR_RUNTIME_SCHEMA_VERSION = 1;
/** Suffixes of the three editor-runtime overrides — see plugin-env.ts. */
export const EDITOR_RUNTIME_ENV_SUFFIX = Object.freeze({
    binary: 'OPENPENCIL_EDITOR_BINARY',
    webBundleDir: 'OPENPENCIL_EDITOR_WEB_BUNDLE_DIR',
    canvasKitDir: 'OPENPENCIL_EDITOR_CANVASKIT_DIR',
});
/** Current names of those overrides; the legacy DSH_ names are still read. */
export const EDITOR_RUNTIME_ENV = Object.freeze({
    binary: pluginEnvName(EDITOR_RUNTIME_ENV_SUFFIX.binary),
    webBundleDir: pluginEnvName(EDITOR_RUNTIME_ENV_SUFFIX.webBundleDir),
    canvasKitDir: pluginEnvName(EDITOR_RUNTIME_ENV_SUFFIX.canvasKitDir),
});
/** A stable, machine-readable error with concise operator diagnostics. */
export class EditorRuntimeUnavailableError extends Error {
    code;
    diagnostics;
    constructor(code, message, diagnostics = [], options) {
        super(message, options);
        this.code = code;
        this.diagnostics = diagnostics;
        this.name = 'EditorRuntimeUnavailableError';
    }
}
const requireFromPlugin = createRequire(import.meta.url);
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const REVISION_PATTERN = /^[a-f0-9]{40,64}$/;
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const SAFE_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
function recordFrom(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
        ? value
        : undefined;
}
function nonEmptyString(value) {
    return typeof value === 'string' && value.trim() === value && value.length > 0;
}
function catalogError(message) {
    throw new EditorRuntimeUnavailableError('invalid-catalog', `Invalid OpenPencil runtime catalog: ${message}`);
}
/** Parse and validate platforms.json without performing any I/O. */
export function parseEditorRuntimeCatalog(value) {
    const catalog = recordFrom(value);
    if (catalog === undefined)
        catalogError('root must be an object');
    if (catalog.schemaVersion !== EDITOR_RUNTIME_SCHEMA_VERSION) {
        catalogError(`schemaVersion must be ${EDITOR_RUNTIME_SCHEMA_VERSION}`);
    }
    const openPencil = recordFrom(catalog.openPencil);
    if (openPencil === undefined)
        catalogError('openPencil must be an object');
    if (!nonEmptyString(openPencil.version) || !VERSION_PATTERN.test(openPencil.version)) {
        catalogError('openPencil.version must be a semantic version');
    }
    if (!nonEmptyString(openPencil.revision) || !REVISION_PATTERN.test(openPencil.revision)) {
        catalogError('openPencil.revision must be a full hexadecimal Git revision');
    }
    if (!Array.isArray(catalog.platforms) || catalog.platforms.length === 0) {
        catalogError('platforms must be a non-empty array');
    }
    const platforms = [];
    const ids = new Set();
    const selectors = new Set();
    const packageNames = new Set();
    for (const [index, rawPlatform] of catalog.platforms.entries()) {
        const entry = recordFrom(rawPlatform);
        if (entry === undefined)
            catalogError(`platforms[${index}] must be an object`);
        for (const field of ['id', 'os', 'cpu', 'rustTarget', 'runner', 'packageName', 'binaryName']) {
            if (!nonEmptyString(entry[field]))
                catalogError(`platforms[${index}].${field} must be a non-empty string`);
        }
        if (!SAFE_ID_PATTERN.test(entry.id))
            catalogError(`platforms[${index}].id is invalid`);
        if (!SAFE_ID_PATTERN.test(entry.os))
            catalogError(`platforms[${index}].os is invalid`);
        if (!SAFE_ID_PATTERN.test(entry.cpu))
            catalogError(`platforms[${index}].cpu is invalid`);
        if (entry.libc !== undefined && !nonEmptyString(entry.libc)) {
            catalogError(`platforms[${index}].libc must be a non-empty string when present`);
        }
        const platform = entry;
        const selector = `${platform.os}-${platform.cpu}`;
        if (platform.id !== selector)
            catalogError(`platforms[${index}].id must equal ${selector}`);
        const expectedPackageName = `@zseven-w/dsh-openpencil-${platform.id}`;
        if (platform.packageName !== expectedPackageName) {
            catalogError(`platforms[${index}].packageName must equal ${expectedPackageName}`);
        }
        const expectedBinaryName = platform.os === 'win32'
            ? 'op-host-web-server.exe'
            : 'op-host-web-server';
        if (platform.binaryName !== expectedBinaryName) {
            catalogError(`platforms[${index}].binaryName must equal ${expectedBinaryName}`);
        }
        if (ids.has(platform.id))
            catalogError(`duplicate platform id ${platform.id}`);
        if (selectors.has(selector))
            catalogError(`duplicate platform selector ${selector}`);
        if (packageNames.has(platform.packageName))
            catalogError(`duplicate packageName ${platform.packageName}`);
        ids.add(platform.id);
        selectors.add(selector);
        packageNames.add(platform.packageName);
        platforms.push(Object.freeze({ ...platform }));
    }
    return Object.freeze({
        schemaVersion: EDITOR_RUNTIME_SCHEMA_VERSION,
        openPencil: Object.freeze({
            version: openPencil.version,
            revision: openPencil.revision,
        }),
        platforms: Object.freeze(platforms),
    });
}
function safeManifestPath(path) {
    if (!nonEmptyString(path) || isAbsolute(path) || path.includes('\\'))
        return false;
    const segments = path.split('/');
    return segments.every(segment => segment !== '' && segment !== '.' && segment !== '..');
}
/** Parse one openpencil-runtime.json and bind it to its expected release. */
export function parseEditorRuntimeManifest(value, expected) {
    const fail = (message) => {
        throw new EditorRuntimeUnavailableError('invalid-runtime', `Invalid OpenPencil runtime manifest: ${message}`);
    };
    const rawManifest = recordFrom(value);
    if (rawManifest === undefined)
        fail('root must be an object');
    const manifest = rawManifest;
    if (manifest.schemaVersion !== EDITOR_RUNTIME_SCHEMA_VERSION) {
        fail(`schemaVersion must be ${EDITOR_RUNTIME_SCHEMA_VERSION}`);
    }
    if (manifest.platform !== expected.platform)
        fail(`platform must equal ${expected.platform}`);
    if (manifest.packageName !== expected.packageName)
        fail(`packageName must equal ${expected.packageName}`);
    if (manifest.openPencilVersion !== expected.openPencilVersion) {
        fail(`openPencilVersion must equal ${expected.openPencilVersion}`);
    }
    if (manifest.openPencilRevision !== expected.openPencilRevision) {
        fail(`openPencilRevision must equal ${expected.openPencilRevision}`);
    }
    const rawFiles = recordFrom(manifest.files);
    if (rawFiles === undefined)
        fail('files must be an object');
    const files = rawFiles;
    for (const [path, digest] of Object.entries(files)) {
        if (!safeManifestPath(path))
            fail(`files contains unsafe path ${JSON.stringify(path)}`);
        if (typeof digest !== 'string' || !SHA256_PATTERN.test(digest)) {
            fail(`files[${JSON.stringify(path)}] must be a lowercase SHA-256 digest`);
        }
    }
    return Object.freeze({
        schemaVersion: EDITOR_RUNTIME_SCHEMA_VERSION,
        platform: manifest.platform,
        packageName: manifest.packageName,
        openPencilVersion: manifest.openPencilVersion,
        openPencilRevision: manifest.openPencilRevision,
        files: Object.freeze({ ...files }),
    });
}
/** Stable selector used by both npm package names and npm/<platform> staging. */
export function editorRuntimePlatformKey(platform = process.platform, arch = process.arch) {
    return `${platform}-${arch}`;
}
/** The five files that make one atomic staged runtime minimally bootable. */
export function editorRuntimeRequiredFiles(binaryName, layout = 'canonical') {
    const webRoot = layout === 'canonical' ? 'bin/web-bundle' : 'web/pkg';
    const canvasKitRoot = layout === 'canonical' ? `${webRoot}/canvaskit` : 'web/canvaskit';
    return Object.freeze([
        `bin/${binaryName}`,
        `${webRoot}/op_host_web.js`,
        `${webRoot}/op_host_web_bg.wasm`,
        `${canvasKitRoot}/canvaskit.js`,
        `${canvasKitRoot}/canvaskit.wasm`,
    ]);
}
function defaultProjectRoot() {
    return resolve(dirname(fileURLToPath(import.meta.url)), '..');
}
function readJson(path, io, kind) {
    let bytes;
    try {
        bytes = io.readFile(path);
    }
    catch (error) {
        throw new EditorRuntimeUnavailableError(kind === 'catalog' ? 'catalog-unavailable' : 'invalid-runtime', `Unable to read OpenPencil ${kind} at ${path}`, [error instanceof Error ? error.message : String(error)], { cause: error });
    }
    try {
        return JSON.parse(bytes.toString('utf8'));
    }
    catch (error) {
        throw new EditorRuntimeUnavailableError(kind === 'catalog' ? 'invalid-catalog' : 'invalid-runtime', `OpenPencil ${kind} at ${path} is not valid JSON`, [error instanceof Error ? error.message : String(error)], { cause: error });
    }
}
function isFile(path, io) {
    try {
        return io.stat(path).isFile();
    }
    catch {
        return false;
    }
}
function isDirectory(path, io) {
    try {
        return io.stat(path).isDirectory();
    }
    catch {
        return false;
    }
}
function sha256(path, io) {
    try {
        return createHash('sha256').update(io.readFile(path)).digest('hex');
    }
    catch (error) {
        throw new EditorRuntimeUnavailableError('invalid-runtime', `Unable to hash OpenPencil runtime file ${path}`, [error instanceof Error ? error.message : String(error)], { cause: error });
    }
}
function runtimeLayoutPaths(root, binaryName, kind) {
    const webBundleDir = kind === 'canonical'
        ? join(root, 'bin', 'web-bundle')
        : join(root, 'web', 'pkg');
    return {
        kind,
        webBundleDir,
        canvasKitDir: kind === 'canonical'
            ? join(webBundleDir, 'canvaskit')
            : join(root, 'web', 'canvaskit'),
        requiredFiles: editorRuntimeRequiredFiles(binaryName, kind),
    };
}
function layoutHasEvidence(layout, manifest, io) {
    if (isDirectory(layout.webBundleDir, io) || isDirectory(layout.canvasKitDir, io))
        return true;
    const assetPaths = new Set(layout.requiredFiles.slice(1));
    return Object.keys(manifest.files).some(path => assetPaths.has(path));
}
function layoutPayloadIsComplete(root, layout, io) {
    return (isDirectory(layout.webBundleDir, io)
        && isDirectory(layout.canvasKitDir, io)
        && layout.requiredFiles.slice(1).every(relativePath => (isFile(join(root, ...relativePath.split('/')), io))));
}
function selectRuntimeLayout(root, binaryName, manifest, io, forcedLayout) {
    const canonical = runtimeLayoutPaths(root, binaryName, 'canonical');
    const legacy = runtimeLayoutPaths(root, binaryName, 'legacy');
    if (layoutPayloadIsComplete(root, canonical, io) && layoutPayloadIsComplete(root, legacy, io)) {
        throw new EditorRuntimeUnavailableError('invalid-runtime', `OpenPencil runtime under ${root} contains both canonical and legacy web layouts; remove the legacy web directory so daemon discovery and injected paths cannot diverge`);
    }
    const layout = forcedLayout === 'canonical'
        ? canonical
        : forcedLayout === 'legacy'
            ? legacy
            : layoutHasEvidence(canonical, manifest, io)
                ? canonical
                : layoutHasEvidence(legacy, manifest, io)
                    ? legacy
                    : undefined;
    if (layout === undefined) {
        throw new EditorRuntimeUnavailableError('invalid-runtime', `OpenPencil runtime under ${root} has neither the canonical bin/web-bundle layout nor the legacy web/{pkg,canvaskit} layout`);
    }
    if (!isDirectory(layout.webBundleDir, io) || !isDirectory(layout.canvasKitDir, io)) {
        const description = layout.kind === 'canonical'
            ? 'bin/web-bundle with its canvaskit subdirectory'
            : 'web/pkg and web/canvaskit directories';
        throw new EditorRuntimeUnavailableError('invalid-runtime', `OpenPencil runtime under ${root} must contain the complete ${description}`);
    }
    return layout;
}
function validateRuntimeRoot(root, source, expected, io, forcedLayout) {
    const manifestPath = join(root, 'openpencil-runtime.json');
    if (!isFile(manifestPath, io)) {
        throw new EditorRuntimeUnavailableError('invalid-runtime', `OpenPencil ${source} runtime is missing ${manifestPath}`);
    }
    let manifest;
    try {
        manifest = parseEditorRuntimeManifest(readJson(manifestPath, io, 'runtime manifest'), {
            platform: expected.platform.id,
            packageName: expected.platform.packageName,
            openPencilVersion: expected.version,
            openPencilRevision: expected.revision,
        });
    }
    catch (error) {
        if (error instanceof EditorRuntimeUnavailableError) {
            throw new EditorRuntimeUnavailableError('invalid-runtime', `${error.message} (${manifestPath})`, error.diagnostics, { cause: error });
        }
        throw error;
    }
    const layout = selectRuntimeLayout(root, expected.platform.binaryName, manifest, io, forcedLayout);
    for (const relativePath of layout.requiredFiles) {
        if (manifest.files[relativePath] === undefined) {
            throw new EditorRuntimeUnavailableError('invalid-runtime', `OpenPencil runtime manifest ${manifestPath} is missing SHA-256 for ${relativePath}`);
        }
    }
    for (const [relativePath, expectedDigest] of Object.entries(manifest.files)) {
        const absolutePath = join(root, ...relativePath.split('/'));
        if (!isFile(absolutePath, io)) {
            throw new EditorRuntimeUnavailableError('invalid-runtime', `OpenPencil runtime file is missing or not regular: ${absolutePath}`);
        }
        const actualDigest = sha256(absolutePath, io);
        if (actualDigest !== expectedDigest) {
            throw new EditorRuntimeUnavailableError('invalid-runtime', `OpenPencil runtime SHA-256 mismatch for ${absolutePath}`, [`expected ${expectedDigest}`, `actual ${actualDigest}`]);
        }
    }
    const binary = join(root, 'bin', expected.platform.binaryName);
    if (expected.platform.os !== 'win32') {
        try {
            io.chmod(binary, 0o755);
        }
        catch {
            // Best effort, matching op-vscode. spawn will surface a real permissions
            // failure, while immutable package stores remain usable when already +x.
        }
    }
    return Object.freeze({
        binary,
        webBundleDir: layout.webBundleDir,
        canvasKitDir: layout.canvasKitDir,
        openPencilVersion: expected.version,
        revision: expected.revision,
        source,
    });
}
function overridePaths(env) {
    const values = {
        binary: pluginEnv(EDITOR_RUNTIME_ENV_SUFFIX.binary, { env })?.trim(),
        webBundleDir: pluginEnv(EDITOR_RUNTIME_ENV_SUFFIX.webBundleDir, { env })?.trim(),
        canvasKitDir: pluginEnv(EDITOR_RUNTIME_ENV_SUFFIX.canvasKitDir, { env })?.trim(),
    };
    const present = Object.entries(values).filter(([, value]) => value !== undefined && value.length > 0);
    if (present.length === 0)
        return undefined;
    if (present.length !== 3) {
        const missing = Object.entries(values)
            .filter(([, value]) => value === undefined || value.length === 0)
            .map(([key]) => EDITOR_RUNTIME_ENV[key]);
        throw new EditorRuntimeUnavailableError('partial-override', `OpenPencil editor runtime override is partial; set all three variables together. Missing: ${missing.join(', ')}`);
    }
    return {
        binary: resolve(values.binary),
        webBundleDir: resolve(values.webBundleDir),
        canvasKitDir: resolve(values.canvasKitDir),
    };
}
function overrideRoot(paths, platform) {
    const root = dirname(dirname(paths.binary));
    const expectedBinary = join(root, 'bin', platform.binaryName);
    if (paths.binary === expectedBinary) {
        for (const layout of ['canonical', 'legacy']) {
            const expected = runtimeLayoutPaths(root, platform.binaryName, layout);
            if (paths.webBundleDir === expected.webBundleDir
                && paths.canvasKitDir === expected.canvasKitDir)
                return { root, layout };
        }
    }
    throw new EditorRuntimeUnavailableError('invalid-override', 'OpenPencil editor runtime overrides must identify one atomic runtime root using either bin/web-bundle/{canvaskit} or legacy web/{pkg,canvaskit}', [
        `binary: ${paths.binary}`,
        `web bundle: ${paths.webBundleDir}`,
        `CanvasKit: ${paths.canvasKitDir}`,
    ]);
}
function runtimeIo(options) {
    return {
        readFile: options.readFile ?? (path => readFileSync(path)),
        stat: options.stat ?? (path => statSync(path)),
        chmod: options.chmod ?? ((path, mode) => chmodSync(path, mode)),
    };
}
/** Resolve and fully verify one atomic editor runtime, or throw diagnostics. */
export function resolveEditorRuntime(options = {}) {
    const platformName = options.platform ?? process.platform;
    const architecture = options.arch ?? process.arch;
    const key = editorRuntimePlatformKey(platformName, architecture);
    const env = options.env ?? process.env;
    // A partial explicit override is a configuration error even when the catalog
    // or optional dependency is unavailable.
    const override = overridePaths(env);
    const projectRoot = options.projectRoot === undefined
        ? defaultProjectRoot()
        : resolve(options.projectRoot);
    const io = runtimeIo(options);
    let rawCatalog;
    if (options.catalog !== undefined) {
        rawCatalog = options.catalog;
    }
    else {
        rawCatalog = readJson(join(projectRoot, 'platforms.json'), io, 'catalog');
    }
    const catalog = parseEditorRuntimeCatalog(rawCatalog);
    const platform = catalog.platforms.find(entry => entry.os === platformName && entry.cpu === architecture);
    if (platform === undefined) {
        throw new EditorRuntimeUnavailableError('unsupported-platform', `No OpenPencil editor runtime is published for ${key}`, [`supported: ${catalog.platforms.map(entry => entry.id).join(', ')}`]);
    }
    const expected = {
        platform,
        version: catalog.openPencil.version,
        revision: catalog.openPencil.revision,
    };
    if (override !== undefined) {
        const selected = overrideRoot(override, platform);
        return validateRuntimeRoot(selected.root, 'override', expected, io, selected.layout);
    }
    const resolvePackageJson = options.resolvePackageJson
        ?? (specifier => requireFromPlugin.resolve(specifier));
    let packageJson;
    let packageResolutionDiagnostic;
    try {
        packageJson = resolvePackageJson(`${platform.packageName}/package.json`);
    }
    catch (error) {
        packageResolutionDiagnostic = error instanceof Error ? error.message : String(error);
    }
    const developmentRoot = join(projectRoot, 'npm', platform.id);
    if (packageJson !== undefined && resolve(dirname(packageJson)) !== resolve(developmentRoot)) {
        return validateRuntimeRoot(dirname(packageJson), 'optional-package', expected, io);
    }
    const developmentManifest = join(developmentRoot, 'openpencil-runtime.json');
    if (isFile(developmentManifest, io)) {
        return validateRuntimeRoot(developmentRoot, 'development-package', expected, io);
    }
    throw new EditorRuntimeUnavailableError('runtime-not-found', `OpenPencil editor runtime ${platform.id} is unavailable`, [
        `optional package: ${platform.packageName}`,
        `development runtime: ${developmentRoot}`,
        ...(packageResolutionDiagnostic === undefined ? [] : [`package resolution: ${packageResolutionDiagnostic}`]),
    ]);
}
/**
 * Optional form for hosts where the editor is an add-on. Integrity and
 * configuration failures still throw; only an absent/unsupported runtime is
 * represented as undefined.
 */
export function tryResolveEditorRuntime(options = {}) {
    try {
        return resolveEditorRuntime(options);
    }
    catch (error) {
        if (error instanceof EditorRuntimeUnavailableError
            && (error.code === 'runtime-not-found' || error.code === 'unsupported-platform'))
            return undefined;
        throw error;
    }
}
