/**
 * Plugin-owned environment variables live under `DSHPLUGIN_`, never `DSH_`.
 *
 * DSH reserves the ENTIRE `DSH_` prefix for host bootstrap settings and
 * refuses to load any `.env` file that sets one: `@deepseek-ai/dsh-app-boot`
 * (`BOOTSTRAP_PREFIXES`) throws on the first match and rejects the whole file,
 * so `dsh web` aborts at startup. A user who configured this plugin the way
 * DSH teaches — `~/.dsh/.env`, or the working directory's `.env` — therefore
 * took the host down with an error naming a variable this plugin owns
 * (dsh-openpencil issue #6).
 *
 * Legacy `DSH_`-prefixed names are still READ so existing shell exports keep
 * working; they are removed in the first 1.0.0 prerelease. Reading them cannot
 * make them work in a `.env` file — the host rejects that file before any
 * plugin loads — which is why migration means REPLACING the old assignment,
 * never adding the new name beside it.
 */
export declare const PLUGIN_ENV_PREFIX = "DSHPLUGIN_";
export declare const LEGACY_ENV_PREFIX = "DSH_";
/** Reset the once-per-process warning ledger (tests only). */
export declare function resetPluginEnvWarnings(): void;
/** Current name of a plugin variable, given the suffix after the prefix. */
export declare function pluginEnvName(suffix: string): string;
/** Legacy (pre-rename) name of the same variable. */
export declare function legacyEnvName(suffix: string): string;
export interface PluginEnvOptions {
    env?: Readonly<Record<string, string | undefined>>;
    warn?: (message: string) => void;
}
/**
 * Read one plugin variable by its suffix (e.g. `OPENPENCIL_BINARY`).
 *
 * Resolution is by PRESENCE, not truthiness: a new variable set to the empty
 * string is a deliberate "no override" and must not silently resurrect a stale
 * legacy value. Validation of the value itself stays with the caller.
 */
export declare function pluginEnv(suffix: string, options?: PluginEnvOptions): string | undefined;
