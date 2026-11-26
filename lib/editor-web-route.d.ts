import type { IncomingMessage, ServerResponse } from 'node:http';
export interface CanvasRelaySession {
    iframeUrl: string;
    daemonToken: string;
    browserToken: string;
}
/** Only a current server-owned editor can supply the upstream address. */
export declare function serveCanvas(req: IncomingMessage, res: ServerResponse, session: CanvasRelaySession, path: string, search: string, prefix: string): Promise<void>;
