/** Canonical model-facing OpenPencil tool names. */
export declare const OPENPENCIL_RENDER_TOOL_NAME: "openpencil_render";
export declare const OPENPENCIL_SELECTION_TOOL_NAME: "openpencil_selection";
export declare const OPENPENCIL_NEW_TOOL_NAME: "openpencil_new";
export declare const OPENPENCIL_CREATE_TOOL_NAME: "openpencil_create";
export declare const OPENPENCIL_EDIT_TOOL_NAME: "openpencil_edit";
export declare const OPENPENCIL_PIPELINE_BEGIN_TOOL_NAME: "openpencil_pipeline_begin";
export declare const OPENPENCIL_PIPELINE_CONTEXT_TOOL_NAME: "openpencil_pipeline_context";
export declare const OPENPENCIL_PIPELINE_BATCH_TOOL_NAME: "openpencil_pipeline_batch";
export declare const OPENPENCIL_PIPELINE_AGENT_RUN_TOOL_NAME: "openpencil_pipeline_agent_run";
export declare const OPENPENCIL_PIPELINE_INSPECT_TOOL_NAME: "openpencil_pipeline_inspect";
export declare const OPENPENCIL_PIPELINE_FINISH_TOOL_NAME: "openpencil_pipeline_finish";
export declare const OPENPENCIL_PIPELINE_ABORT_TOOL_NAME: "openpencil_pipeline_abort";
export declare const OPENPENCIL_STYLE_PLAN_TOOL_NAME: "openpencil_style_plan";
export declare const OPENPENCIL_STYLE_CONFIRM_TOOL_NAME: "openpencil_style_confirm";
/** The ordered model-facing workflow for a private, unpublished design draft. */
export declare const OPENPENCIL_PIPELINE_TOOL_NAMES: readonly ["openpencil_pipeline_begin", "openpencil_pipeline_context", "openpencil_pipeline_batch", "openpencil_pipeline_agent_run", "openpencil_pipeline_inspect", "openpencil_pipeline_finish", "openpencil_pipeline_abort"];
/**
 * Historical render name retained only by the browser presentation layer so
 * existing conversation cards and details panels remain replayable. The host
 * deliberately does not register this alias as a model-facing tool.
 */
export declare const LEGACY_DESIGN_RENDER_TOOL_NAME: "design_render";
export declare const OPENPENCIL_TOOL_NAMES: readonly ["openpencil_render", "openpencil_selection", "openpencil_new", "openpencil_create", "openpencil_edit", "openpencil_pipeline_begin", "openpencil_pipeline_context", "openpencil_pipeline_batch", "openpencil_pipeline_agent_run", "openpencil_pipeline_inspect", "openpencil_pipeline_finish", "openpencil_pipeline_abort", "openpencil_style_plan", "openpencil_style_confirm"];
