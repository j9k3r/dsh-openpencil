---
name: openpencil-design
description: Strict OpenPencil two-batch generation transaction with deterministic validation and atomic publication.
---

# OpenPencil Design in DSH

## Strict Default Transaction

For an ordinary new design, perform exactly this state machine:

`openpencil_pipeline_begin` -> first `openpencil_pipeline_batch` -> second `openpencil_pipeline_batch` -> `openpencil_pipeline_finish`

Only when the user explicitly asks for the high-fidelity App-identical engine, begin takes engine:"app-agent" and the transaction becomes begin -> one `openpencil_pipeline_agent_run` -> finish (no generation batches; the daemon runs the App builtin design-agent loop).

1. Call `openpencil_pipeline_begin({brief})` exactly once and immediately. It creates the only root and opens the private live canvas. Omit `path` unless the user explicitly named a file: the plugin chooses a concrete collision-resistant `.op` filename; preserve an explicitly named path exactly. Explicit mobile wording overrides web/desktop. Once begin returns, its path, `rootNodeId`, platform, canvas, palette, and `buildContract` are locked for this transaction. Never reinterpret the request into another platform, switch paths, or rebuild another draft.
2. On a successful begin, issue the bounded first direct I/K QuickJS batch immediately. On a successful first batch, issue the second and final direct I/K batch immediately. On a successful second batch, call finish immediately. Advance without narration: do not put reasoning, progress, comparison, critique, inspection, or another tool call between successful pipeline calls.
3. A thrown error or any result with `canContinue:false` ends the transaction. Report the error once. Do not retry, inspect, context-read, abort, rename, start over, or create a replacement draft.

Inside `run_code`, use this exact multiline wrapper:

```js
const draftId = "<exact begin.draftId>";
const script = String.raw`...`;
const r = await tools.openpencil_pipeline_batch({ draftId, script });
return r;
```

Quote the exact begin.draftId into the standalone `draftId` string first, then declare `script`. The fixed tool argument object contains only `draftId` and `script`; never append `canvasWidth`, another field, or return inside it. After the call, return only `r`, never `console.log`, print, or stringify the tool result. Each QuickJS batch has a fresh scope, so local bindings do not cross batches. `I`/`K` return opaque node-id strings, not nodes: use bindings only as `I`/`K` parents; never assign `binding.x/y` or any member. In batch 2, do not recreate Page, App Content, Header, or Hero; attach new bound section rails directly to begin's `rootNodeId`. If batch 1 created a shared content wrapper, reuse it only by the exact nodeId returned by batch 1, never by rebuilding the same name.

`rootNodeId` is the page: attach top-level regions directly; never create Page/root. Only returned frame/group bindings parent children; round icon art uses a frame plus `cornerRadius`, never ellipse.

Assign every semantic container—Header, Nav, Search, Hero, Card, Section, Toolbar, Button, or CTA—from `I`/`K`, then add its visible children through that binding. Never leave it empty or place its intended children as siblings. Use literal hex colors in nodes; no aliases. Finish each product card's media (or omit), name, and price before the next card. Desktop commerce Header: role navbar; Nav role nav-links; each 44px role nav-link is a frame containing text, never a text node; Header actions role toolbar with 44x44 role icon-button frames. On mobile, only full-width chrome/full-bleed sections attach directly to root; put bare text/icons/small controls and every section title inside a bound 24px-gutter rail.

Every Button/CTA is role button and at least 44px; insert its visible child through its binding, never as a sibling. Minimum icon: `{type:'icon_font',name:'Search icon',iconFontName:'search',width:20,height:20}`. `name` is the layer label; `iconFontName` is the glyph from begin's `buildContract.node.icon`; otherwise compose shapes.

Begin selects the concrete style guide without another context call. Default: one image outside commerce. Commerce uses OpenPencil's bundled ecommerce-modern-light direction: white base, warm-tinted sections, 1120px centered content, 56px Hero display, and orange limited to CTA/active/price. Visible copy follows the user's language; a Chinese request means Chinese copy except an optional short ASCII brand. CTA is role button 160x48 using #C2410C/#FFF. Desktop commerce uses exactly three equal-width product cards from one coherent collection, gap 24, no unused tail; a mobile product rail uses at most 2 fill_container cards or equal numeric-width cards in an explicit clipped scroller. Generic home uses the validated gray armchair / Artemide Tolomeo lamp / potted plant queries, each within four words; that trio is only for generic home — any other vertical queries the exact product each card names.

Batch 2 ends with the required Footer as the last root region: role footer, fill_container/fit_content, vertical gap 24, padding [48,160] desktop / [40,24] mobile, fill #1C1917, holding brand text #FFFFFF, a role nav-links row of >=3 minWidth-44 height-44 role nav-link frames (14px #D6D3D1), and a 13px #A8A29E copyright line — never call finish before the Footer exists.

Desktop Hero: optional warm wrapper; the full-width Hero holds copy 512 + gap 64 + image 448 inside horizontal padding 160; headline/subtitle use `width:"fill_container"`. Generic commerce uses the direct leaf `I(hero,{type:"image",name:"Hero product image",width:448,height:360,imageSearchQuery:"gray loveseat isolated photo"})`; never wrap it, use `image:{...}`, mix shapes, or reuse that query in a product card. Use a 4–6 layer `layout:"none"` ellipse/path composition only when the user explicitly requests illustration/no photos. `x/y` remain forbidden in horizontal/vertical flow. Never use plain stacked rounded rectangles or a lone small icon in large fixed media. Each Hero/Product/Art/Media frame has one primary visual: a `type:"image"` leaf with a concrete English `imageSearchQuery`, or substantial composed shapes, never both. The host enriches committed commerce images before each live preview and retains one canonical post-final fallback.

## Begin Contract Is Authoritative

Treat begin's `buildContract` as the complete source of node, style, script, and layout rules. Ordinary generation never calls context, inspect, render, read-image, or abort tools.

Every generated text node explicitly uses `fontFamily: "Inter, system-ui, sans-serif"`, with `fontSize: 16` and `lineHeight: 1.5` as the ordinary defaults. Desktop keeps its bundled Inter; the web host deliberately does not bundle Inter and therefore uses the generic fallback without a missing-font prompt. Never use bare `Inter`. A CJK `lineHeight < 1.3` is raised to `1.5`. Override size and line height only for headings or special typography.

When no logo asset is supplied, use a text-only brand. Do not invent a letter badge or give a text node a background, fixed height, or effects.

## Publication Gate

Call finish exactly once after the second generation batch. A result with `published:true` is terminal success: return it and stop. A finish result with `canContinue:true` continues by doing exactly what its `next` field says: `stage:"needs_preview"` and `stage:"needs_refinalization"` each mean calling finish exactly once more with nothing in between. `stage:"needs_visual_review"` is the single see-then-fix round after a clean gate: review the returned layout digest and checklist against the final preview, then either call finish once more unchanged to accept and publish, or send exactly ONE bounded correction batch (I/K/U only, at most 16 calls and 6 KiB, never rebuilding Header or Hero) followed by finish — the gates re-validate the corrected page. A repair round additionally requires all of the following at once:

- `stage:"needs_correction"`
- `canContinue:true`
- a complete, non-empty `repairTargets` array with `checks.dsh.repairTargetSummary.omitted === 0`
- every target has `operation:"U"`, an exact non-empty `nodeId`, and a non-empty `patch`

Apply every returned target together in exactly one additional bounded script using only `U(target.nodeId, target.patch)`, then call finish exactly once more. Do not narrate between the repair batch and finish. The host bounds repair rounds at two: repair again only when the new finish result itself presents another complete repairTargets array. If any condition is absent, if that batch throws or returns `canContinue:false`, or if the final finish is not `published:true`, stop and report the returned state once. Never guess a patch or node id; never retry, inspect, context-read, render, read an image, abort, or rebuild.

The successful finish already owns deterministic finalization, native and DSH quality gates, exact PNG generation, atomic `createIfAbsent` publication, and live-editor presentation. Do not add a visual self-review loop.
