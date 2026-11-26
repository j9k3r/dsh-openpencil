/**
 * Bounded see-then-fix visual review for the OpenPencil pipeline.
 *
 * The App's built-in design agent looks at a rendered screenshot and fixes
 * what it sees. The DSH pipeline ports the cheapest slice of that loop: one
 * `needs_visual_review` stage between a clean quality gate and atomic
 * publication. The finished PNG rides the existing browser presentation
 * channel, while the model receives a deterministic textual layout digest —
 * the DeepSeek adapter rejects image blocks anywhere in a request, so the
 * digest is the model-facing rendering of the same evidence — plus a fixed
 * review checklist. The model either accepts (calls finish again) or sends
 * exactly one bounded I/K/U correction batch before the final finish.
 * @module dsh-openpencil/design-visual-review
 */
/** Upper bound on I/K/U calls inside the single visual correction batch. */
export declare const MAX_VISUAL_REVIEW_CALLS = 16;
/** Upper bound on the visual correction batch source size. */
export declare const MAX_VISUAL_REVIEW_BYTES: number;
/**
 * The fixed review checklist returned with `needs_visual_review`. Items are
 * phrased as checks over the digest/screenshot rather than open-ended taste
 * so the correction batch stays small and targeted.
 */
export declare const VISUAL_REVIEW_CHECKLIST: readonly string[];
/**
 * Deterministic model-facing rendering of the finalized page: one bounded
 * line per top-level region plus card-rail summaries and a footer verdict.
 * Purely structural — derived from the exact document the screenshot shows.
 */
export declare function buildVisualReviewDigest(documentJson: string): string[];
/**
 * Validate the single authorized visual-review correction batch. Returns a
 * human-readable violation, or `undefined` when the script is acceptable.
 * The general batch safety checks (wrapper nesting, `I(null, ...)`, binding
 * member mutation) still run in the batch tool itself.
 */
export declare function visualReviewScriptViolation(script: string): string | undefined;
