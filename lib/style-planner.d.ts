/**
 * Opt-in advisory style planner for the DSH OpenPencil pipeline
 * (spec 1599ef92 §3B–§3D, §5, §6).
 *
 * The planner sits strictly before generation: it browses the installed
 * catalog through the single catalog adapter, treats hard platform/theme
 * constraints as filters (never preferences), optionally asks one bounded
 * advisory provider for a distribution over the exact eligible set plus an
 * internal abstain sentinel, and turns a designer's explicit confirmation
 * into a 15-minute, session-bound selection handle. It never creates a
 * canvas, never writes files, and never logs raw brief text: briefs are
 * correlated through a keyed fingerprint owned by the selection store.
 *
 * @module dsh-openpencil/style-planner
 */
import { type StyleCatalogSnapshot } from './style-catalog.js';
/** Internal abstain option riding every provider distribution. */
export declare const ABSTAIN_SENTINEL = "__abstain__";
/** §5 bounds. */
export declare const MAX_BRIEF_BYTES = 16000;
export declare const MAX_ELIGIBLE_GUIDES = 254;
export declare const MAX_OUTBOUND_BYTES: number;
export declare const MAX_RESPONSE_BYTES: number;
export declare const PROVIDER_DEADLINE_MS = 5000;
export declare const HANDLE_TTL_MS: number;
/** Outbound selection input: brief text plus catalog descriptors, nothing else. */
export interface StyleRecommendationInput {
    brief: string;
    platform: 'web' | 'mobile';
    catalogRevision: string;
    options: string[];
}
/**
 * Bounded advisory provider. Off by default; fixtures inject a fake. One
 * `recommend` call per explicit recommendation action — the planner never
 * retries or falls back.
 */
export interface StyleRecommendationProvider {
    readonly name: string;
    recommend(input: StyleRecommendationInput): Promise<unknown>;
}
export type DistributionVerdict = {
    valid: true;
    choice: string;
    probabilities: Record<string, number>;
    confidence: number;
} | {
    valid: false;
    reason: string;
};
/**
 * Validate a one-call choice distribution over the exact option set (eligible
 * IDs plus the abstain sentinel): finite probabilities in [0,1], complete
 * coverage, sum within 1e-6 of one, and a choice that is a maximum-probability
 * option within that tolerance. Contradictions are rejected; scores are never
 * manufactured.
 */
export declare function validateStyleDistribution(raw: unknown, optionIds: string[]): DistributionVerdict;
export type StyleEvaluationEvent = {
    kind: 'plan-request';
} | {
    kind: 'provider-submitted';
} | {
    kind: 'provider-response';
    valid: boolean;
} | {
    kind: 'provider-failure';
    reason: string;
} | {
    kind: 'abstain';
} | {
    kind: 'recommendation-displayed';
    top: string[];
} | {
    kind: 'override';
    from: string;
    to: string;
} | {
    kind: 'catalog-alternative-selected';
    guideId: string;
} | {
    kind: 'manual-selected';
    guideId: string;
};
export interface StyleEvaluationReport {
    denominators: {
        requests: number;
        submissions: number;
        validResponses: number;
        failures: number;
        abstentions: number;
        overrides: number;
        catalogAlternatives: number;
        manualSelections: number;
    };
    rates: {
        override: number | null;
        abstain: number | null;
        validResponseCoverage: number | null;
    };
    provenance: {
        recommendations: 'model';
        catalogAlternatives: 'catalog-alternative';
    };
    claims: string[];
    text: string;
}
/**
 * Deterministic selection-accounting report over planner events: correct
 * denominators, explicit provenance (catalog alternatives are never scored as
 * model top-k predictions), honest small-sample labeling, and no
 * rendered-quality claims — selection quality only.
 */
export declare function evaluationReport(events: StyleEvaluationEvent[]): StyleEvaluationReport;
export interface StyleHandleRecord {
    handle: string;
    sessionKey: string;
    guideId: string;
    briefFingerprint: string;
    platform: 'web' | 'mobile';
    constraintRevision: number;
    catalogRevision: string;
    confirmedAt: number;
    expiresAt: number;
    consumed: boolean;
    userIntent?: string;
    confirmedUserFingerprint?: string;
}
export interface StyleHandleValidationContext {
    sessionKey: string;
    guideId?: string;
    briefFingerprint?: string;
    platform?: 'web' | 'mobile';
    constraintRevision?: number;
    catalogRevision?: string;
    now: number;
}
export type StyleHandleVerdict = {
    ok: true;
    record: StyleHandleRecord;
} | {
    ok: false;
    reason: 'unknown' | 'consumed' | 'expired' | 'session' | 'guide' | 'brief' | 'platform' | 'constraints' | 'catalog';
};
/** One selection session's planner state. Ephemeral; never persisted. */
export interface PlannerSessionState {
    sessionKey: string;
    brief: string;
    userIntent?: string;
    platform: 'web' | 'mobile';
    theme?: 'dark' | 'light';
    commerce: boolean;
    revision: number;
    requestId: string;
    briefFingerprint: string;
    constraintRevision: number;
    catalogRevision: string;
    lastRecommendation?: {
        valid: boolean;
        top: string[];
        abstain: boolean;
    };
    lastConfirmed?: {
        handle: string;
        guideId: string;
        catalogRevision: string;
    };
}
/** Ephemeral, session-scoped selection state. Nothing here persists. */
export interface StyleSelectionStore {
    /** Keyed brief fingerprint; the shared secret never leaves the store. */
    briefFingerprintOf(brief: string): string;
    confirm(input: {
        sessionKey: string;
        guideId: string;
        briefFingerprint: string;
        platform: 'web' | 'mobile';
        constraintRevision: number;
        catalogRevision: string;
        ttlMs: number;
        userIntent?: string;
        confirmedUserFingerprint?: string;
    }): string;
    validate(handle: string, context: StyleHandleValidationContext): StyleHandleVerdict;
    consume(handle: string): void;
    session(sessionKey: string): PlannerSessionState | undefined;
    recordSession(state: PlannerSessionState): void;
    liveConfirmedFor(sessionKey: string, briefFingerprint: string, now: number): StyleHandleRecord | undefined;
    events: StyleEvaluationEvent[];
}
export declare function createStyleSelectionStore(options: {
    now: () => number;
}): StyleSelectionStore;
export interface StylePlannerServices {
    store: StyleSelectionStore;
    resolveCatalog(): StyleCatalogSnapshot;
    provider?: StyleRecommendationProvider;
    now(): number;
    beginStyleInputSupported(): boolean;
}
/**
 * The two opt-in planner tools: `openpencil_style_plan` (browse, constrain,
 * optionally one bounded advisory recommendation) and
 * `openpencil_style_confirm` (explicit designer confirmation issuing the
 * 15-minute session-bound handle the begin boundary validates).
 */
export declare function createStylePlannerTools(services: StylePlannerServices): import("@deepseek-ai/dsh-tools").ToolDefinition[];
/** Default catalog resolution: the installed snapshot shipped with the build. */
export declare function defaultCatalogResolver(catalog?: StyleCatalogSnapshot | (() => StyleCatalogSnapshot)): () => StyleCatalogSnapshot;
