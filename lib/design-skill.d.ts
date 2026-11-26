/** Bundled DSH playbook for creating deliberate OpenPencil designs. */
import type { Context } from '@deepseek-ai/cordis';
export declare const OPENPENCIL_DESIGN_SKILL_NAME = "openpencil-design";
export declare const OPENPENCIL_DESIGN_SKILL_DESCRIPTION: string;
export declare const OPENPENCIL_DESIGN_SKILL_WHEN_TO_USE: string;
export declare const OPENPENCIL_DESIGN_SKILL_CONTENT: string;
export declare const OPENPENCIL_DESIGN_GUIDANCE_SECTION: {
    readonly name: "openpencil:design-skill-guidance";
    readonly order: 130;
    readonly text: () => string;
};
/** Register the playbook only when the profile provides DSH's skill service. */
export declare function registerOpenPencilDesignSkill(ctx: Context): () => void;
/** Add a short reminder; the detailed contract remains in the on-demand skill. */
export declare function registerOpenPencilDesignGuidance(ctx: Context): () => void;
