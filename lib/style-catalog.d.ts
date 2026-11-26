/**
 * Catalog adapter for the opt-in style picker (spec 1599ef92 §3A).
 *
 * One reader over the installed style-guide catalog: the catalog `name` is the
 * canonical guide ID, platform semantics map the pipeline's web/mobile canvas
 * onto the catalog's `webapp`/`mobile` values, malformed entries are
 * quarantined with visible diagnostics instead of being reinterpreted, and a
 * content-addressed revision hash freezes the snapshot each selection session
 * validates against. Browse and search are deterministic and local; no second
 * hand-maintained list of guide names exists here.
 *
 * @module dsh-openpencil/style-catalog
 */
import { type ContinuationPalette, type SelectedStyleGuide } from './design-knowledge.js';
/** Bumped whenever the adapter's validation or mapping semantics change. */
export declare const STYLE_CATALOG_ADAPTER_VERSION = "style-catalog-v1";
/** Host-supported generated-text font stack (buildContract.node.text). */
export declare const SUPPORTED_FONT_STACK = "Inter, system-ui, sans-serif";
/** Catalog platform values a selection handoff can target in v1. */
type HandoffPlatform = 'webapp' | 'mobile';
/** One valid catalog guide, keyed by its canonical catalog `name`. */
export interface StyleCatalogGuide {
    id: string;
    platform: HandoffPlatform | 'slides' | 'card';
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
/** A quarantined catalog entry with its visible local diagnostic. */
export interface StyleCatalogQuarantine {
    name?: string;
    reason: string;
}
/** Immutable snapshot of the installed catalog for one selection session. */
export interface StyleCatalogSnapshot {
    adapterVersion: string;
    revision: string;
    guides: StyleCatalogGuide[];
    quarantined: StyleCatalogQuarantine[];
}
/**
 * Load and validate a style-guide catalog asset. Pure: identical input always
 * yields the identical snapshot (including the revision hash), and malformed
 * entries are quarantined with visible diagnostics instead of crashing.
 */
export declare function loadStyleCatalog(asset: unknown): StyleCatalogSnapshot;
/** Snapshot of the installed catalog asset shipped with the plugin build. */
export declare function loadInstalledStyleCatalog(): StyleCatalogSnapshot;
/** Hard platform filter using the pipeline's canonical mapping (web→webapp). */
export declare function eligibleStyleGuides(snapshot: StyleCatalogSnapshot, platform: 'web' | 'mobile'): StyleCatalogGuide[];
/** Deterministic local search over ids, tags and summaries. */
export declare function searchStyleGuides(guides: StyleCatalogGuide[], query: string): StyleCatalogGuide[];
/**
 * Verified theme metadata. Only catalog tags count; a guide without a theme
 * tag has no theme metadata and none may be guessed from its name.
 */
export declare function styleGuideTheme(guide: StyleCatalogGuide): 'dark' | 'light' | undefined;
/** Whether the guide's platform can receive a confirmed selection handle. */
export declare function guideSupportsHandoff(guide: StyleCatalogGuide): boolean;
/** Font disclosure: requested families mapped onto the supported contract. */
export interface SupportedFontDisclosure {
    supported: string;
    mapping: {
        role: string;
        requested: string;
        supported: string;
        substitution: 'material' | 'none';
    }[];
    note: string;
}
export declare function supportedFontMappingOf(guide: StyleCatalogGuide): SupportedFontDisclosure;
/** The immutable `selectedStyle` section carried by the begin contract (§4). */
export interface SelectedStyleSection {
    guideId: string;
    catalogRevision: string;
    palette: ContinuationPalette;
    typography: {
        fontFamily: string;
        scale: SelectedStyleGuide['typeScale'];
    };
    fonts: SupportedFontDisclosure;
    guidance: {
        direction: string;
        surfaces: string;
    };
}
/**
 * Project a catalog guide onto the generation-facing selected-style section:
 * effective palette roles (not just the page color), typography scale mapped
 * onto the supported font contract, and the catalog's layout/aesthetic
 * guidance. Pure: the same guide and snapshot always project identically.
 */
export declare function selectedStyleOf(guide: StyleCatalogGuide, snapshot: StyleCatalogSnapshot, fallbackPalette: ContinuationPalette): SelectedStyleSection;
/**
 * The same guide as the knowledge module's `SelectedStyleGuide` so the begin
 * path reuses its continuation-style and seed-color plumbing unchanged.
 */
export declare function asSelectedStyleGuide(guide: StyleCatalogGuide, fallbackPalette: ContinuationPalette): SelectedStyleGuide;
export {};
