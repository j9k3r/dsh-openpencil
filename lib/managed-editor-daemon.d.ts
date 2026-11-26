/** Shared lifecycle primitives for plugin-owned OpenPencil managed daemons. */
import { type ChildProcessWithoutNullStreams } from 'node:child_process';
import { type ManagedDaemonDocument } from './editor-recovery.js';
import type { EditorRuntime } from './editor-runtime.js';
export interface ManagedEditorDaemon {
    /** Internal child handle. Never include this object in a model-facing result. */
    readonly child: ChildProcessWithoutNullStreams;
    readonly baseUrl: string;
    /** Internal managed credential. Never include this object in a model-facing result. */
    readonly token: string;
    readonly sourcePath: string;
    readonly runtimeVersion: string;
}
/** Revocable browser-only view of one managed daemon. */
export interface ManagedEditorReadOnlyProxy {
    readonly baseUrl: string;
    /** Browser credential for this proxy only; never accepted by the daemon. */
    readonly token: string;
    /** Synchronously revoke the browser endpoint and all open proxy sockets. */
    stop(): void;
}
export interface StartManagedEditorDaemonOptions {
    sourcePath: string;
    allowOrigin: string;
    signal?: AbortSignal;
    /** Lifecycle seam used by the controller to join children during disposal. */
    onSpawn?: (child: ChildProcessWithoutNullStreams) => void;
}
/** Stop a child even if startup has not produced a daemon handshake yet. */
export declare function stopManagedEditorChild(child: ChildProcessWithoutNullStreams): Promise<void>;
/** Start a managed host bound to one already-created `.op` document. */
export declare function startManagedEditorDaemon(runtime: EditorRuntime, options: StartManagedEditorDaemonOptions): Promise<ManagedEditorDaemon>;
/**
 * Expose a managed daemon to one live browser mount without delegating its
 * writer credential. Static resources are public on this ephemeral loopback
 * origin; daemon data requires a per-attach browser token and only GET/HEAD
 * requests are forwarded. The Web shell's mandatory bootstrap reset receives
 * a synthetic already-consumed acknowledgement, while every other mutation is
 * rejected before any bytes can reach the daemon.
 */
export declare function startManagedEditorReadOnlyProxy(daemon: ManagedEditorDaemon, signal?: AbortSignal): Promise<ManagedEditorReadOnlyProxy>;
export declare function stopManagedEditorDaemon(daemon: ManagedEditorDaemon): Promise<void>;
/**
 * Consume the daemon's one-shot sync reset after the controller has refreshed
 * its private backing file. The credential and backing path never enter a returned
 * value or diagnostic; a browser mount can therefore only receive the later
 * `skipped: true` reset response.
 */
export declare function resetManagedEditorDaemonFromSource(daemon: ManagedEditorDaemon, signal?: AbortSignal): Promise<{
    version: number;
    skipped: boolean;
}>;
/** Read an authoritative bounded snapshot without exposing daemon credentials. */
export declare function readManagedEditorDaemon(daemon: ManagedEditorDaemon, signal?: AbortSignal): Promise<ManagedDaemonDocument>;
