/**
 * App-agent engine support for the OpenPencil pipeline.
 *
 * `openpencil_pipeline_begin({engine:"app-agent"})` routes generation through
 * the daemon's built-in design-agent loop (`run_design_agent`): the same
 * skills-assembled system prompt, 15-tool loop, screenshot verification, and
 * finalize-on-exit the OpenPencil App uses. DSH keeps ownership of the
 * transaction shell — draft lifecycle, quality gates, enrichment, and atomic
 * publication stay exactly the script-engine path.
 *
 * The single hard budget is the plugin's MCP HTTP layer (5-minute request
 * cap): one blocking loop call must finish inside it, so the defaults here
 * are deliberately tighter than the daemon's own 600s/28-turn defaults.
 * @module dsh-openpencil/design-agent-run
 */
import type { JsonValue } from './json-value.js';
/** Engine selector accepted by `openpencil_pipeline_begin`. */
export type PipelineEngine = 'script' | 'app-agent';
/** Loop-call wall clock (seconds) forwarded to `run_design_agent`. */
export declare const DEFAULT_AGENT_RUN_TIMEOUT_SECONDS = 240;
export declare const MIN_AGENT_RUN_TIMEOUT_SECONDS = 30;
export declare const MAX_AGENT_RUN_TIMEOUT_SECONDS = 270;
/**
 * Turn budget forwarded to the loop. The daemon default (28) is sized for a
 * 600s wall clock; inside the plugin's tighter clock an overshoot times out
 * atomically and loses the whole run, so the default halves.
 */
export declare const DEFAULT_AGENT_RUN_MAX_TURNS = 12;
export declare const MIN_AGENT_RUN_MAX_TURNS = 4;
export declare const MAX_AGENT_RUN_MAX_TURNS = 28;
export declare function parsePipelineEngine(value: unknown, toolName: string): PipelineEngine;
export declare function validateAgentRunTimeoutSeconds(value: unknown, toolName: string): number;
export declare function validateAgentRunMaxTurns(value: unknown, toolName: string): number;
/** Public, bounded projection of the daemon loop report. */
export interface AgentRunSummary {
    toolCalls: number;
    stopReason: string;
    landedRoots: number;
    finalize?: {
        committedScreens: number;
        unfilledScreens: number;
        qualityChecks: number;
        qualityRepairs: number;
        qualityNotes: number;
    };
    loopError?: string;
}
/**
 * Reduce the raw `run_design_agent` JSON to the fixed public summary. The
 * daemon result is trusted infrastructure but still bounded here so the tool
 * result (which reaches the model verbatim) cannot balloon.
 */
export declare function summarizeAgentRun(value: JsonValue | undefined): AgentRunSummary;
/**
 * Provider/key problems come back as structured daemon errors. They are
 * terminal configuration states, never retry targets, so the pipeline
 * message routes the operator to the daemon's agent settings.
 */
export declare function isProviderConfigurationError(message: string): boolean;
export declare const AGENT_RUN_PROVIDER_GUIDANCE: string;
