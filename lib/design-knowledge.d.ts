/**
 * Deterministic App-knowledge injection for `openpencil_pipeline_begin`.
 *
 * OpenPencil's built-in design agent resolves a full style guide, domain
 * skills, and scene templates before it draws; the DSH pipeline is a blind
 * two-batch transaction. This module closes part of that gap without any
 * extra model or tool round trip: build-time digests of the App's style-guide
 * and domain-skill corpora (`scripts/build-style-guides.mjs`,
 * `scripts/build-domain-skills.mjs`) are matched to the brief with plain
 * keyword rules, and the winners ride the begin result.
 *
 * Everything here is pure and deterministic — same brief, same injection.
 * @module dsh-openpencil/design-knowledge
 */
export interface StyleGuideDigest {
    name: string;
    platform: string;
    tags: string[];
    summary: string;
    aesthetics: string[];
    palette: Record<string, string>;
    fonts: {
        heading?: string;
        body?: string;
        mono?: string;
    };
    type: [string, number, number][];
}
/** The palette key shape `continuationStyle.palette` already exposes. */
export interface ContinuationPalette {
    page: string;
    panel: string;
    surface: string;
    onSurface: string;
    mutedOnSurface: string;
    accent: string;
    accentHighlight: string;
    onAccent: string;
    ink: string;
    muted: string;
    line: string;
    surfaceLine: string;
}
export interface SelectedStyleGuide {
    name: string;
    tags: string[];
    palette: ContinuationPalette;
    /** `[size, weight]` rows for display/heading/body/label when parseable. */
    typeScale: Partial<Record<'display' | 'heading' | 'body' | 'label', [number, number]>>;
    direction: string;
    surfaces: string;
}
/**
 * Map a guide's named palette tokens onto the fixed continuation-palette
 * shape. Unmapped keys inherit the caller's builtin fallback so a sparse
 * guide can never produce an incomplete palette.
 */
export declare function mapGuidePalette(guide: StyleGuideDigest, fallback: ContinuationPalette): ContinuationPalette;
export declare function guideTypeScaleOf(guide: StyleGuideDigest): SelectedStyleGuide['typeScale'];
/**
 * Deterministically match the brief to one App style guide. Returns
 * `undefined` when no category rule fires or when the winner is the builtin
 * commerce guide the pipeline already hardcodes — both keep today's behavior.
 */
export declare function selectStyleGuide(brief: string, platform: 'web' | 'mobile', fallback: ContinuationPalette): SelectedStyleGuide | undefined;
/**
 * Pick 1-2 domain-skill digests for the brief. Mobile always carries the
 * mobile-app architecture; a CJK brief always carries the CJK typography
 * rules; the landing/web entries additionally carry one shipped scene
 * template's section skeleton as a proven layout scaffold.
 */
export declare function selectDomainGuidance(brief: string, platform: 'web' | 'mobile'): Record<string, string> | undefined;
