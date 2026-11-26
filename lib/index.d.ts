/**
 * @zseven-w/dsh-openpencil — preview `.op` design documents in DSH.
 *
 * Plugin lifecycle: register the model-facing tool plus signed routes for
 * exact PNGs, immutable document snapshots, and the optional read-only Web
 * SDK canvas. Everything is
 * registered through `ctx.effect` (or a returned disposer) so unloading the
 * plugin removes every contribution.
 *
 * The `openpencil_render` tool never returns an ImageBlock — the DeepSeek
 * adapter rejects image blocks anywhere in a request. The browser-only
 * envelope rides `output.presentationMeta` into `ToolCallBlock.meta`, and
 * the keyed `tool.call.toolview` client component renders a PNG-first card
 * and lazily mounts the OpenPencil canvas on demand.
 * @module @zseven-w/dsh-openpencil
 */
import type { Context } from '@deepseek-ai/cordis';
export { LEGACY_DESIGN_RENDER_TOOL_NAME, OPENPENCIL_CREATE_TOOL_NAME, OPENPENCIL_EDIT_TOOL_NAME, OPENPENCIL_NEW_TOOL_NAME, OPENPENCIL_PIPELINE_ABORT_TOOL_NAME, OPENPENCIL_PIPELINE_BATCH_TOOL_NAME, OPENPENCIL_PIPELINE_BEGIN_TOOL_NAME, OPENPENCIL_PIPELINE_CONTEXT_TOOL_NAME, OPENPENCIL_PIPELINE_FINISH_TOOL_NAME, OPENPENCIL_PIPELINE_INSPECT_TOOL_NAME, OPENPENCIL_PIPELINE_TOOL_NAMES, OPENPENCIL_RENDER_TOOL_NAME, OPENPENCIL_SELECTION_TOOL_NAME, OPENPENCIL_TOOL_NAMES, } from './tool-names.js';
export { OPENPENCIL_DESIGN_GUIDANCE_SECTION, OPENPENCIL_DESIGN_SKILL_CONTENT, OPENPENCIL_DESIGN_SKILL_DESCRIPTION, OPENPENCIL_DESIGN_SKILL_NAME, OPENPENCIL_DESIGN_SKILL_WHEN_TO_USE, registerOpenPencilDesignGuidance, registerOpenPencilDesignSkill, } from './design-skill.js';
export { DesignDraftToolController, createDesignDraftToolController, type DesignDraftToolServices, } from './design-draft-tools.js';
/** Stable plugin name (the loader entry id in cordis.patch.yml). */
export declare const name = "@zseven-w/dsh-openpencil";
/** Services this plugin's root fiber requires. */
export declare const inject: string[];
/** Plugin entry: mount every model-facing contribution. */
export declare function apply(ctx: Context): Promise<() => Promise<void>>;
