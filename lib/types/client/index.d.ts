/**
 * Browser presentation for OpenPencil render/new/pipeline cards and historical
 * `design_render` conversation cards.
 *
 * PNG remains the replay-safe default. When the host also grants access to
 * the source `.op`, the user can opt into one shared, read-only Web SDK
 * canvas. The SDK and document are fetched only after that explicit action.
 */
import type { ToolCallViewProps } from '@deepseek-ai/dsh-client-ui-tool/client';
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { EditorColorScheme, EditorLocale } from './editor-bridge.js';
import { type CompatibleToolCallViewProps, type CompatibleToolDetailsViewProps } from './details-compat.js';
import type { EditorWorkbenchRequest } from './editor-workbench-host.js';
import type { GalleryFrame, GalleryLocale } from './frame-gallery.js';
export { LEGACY_DESIGN_RENDER_TOOL_NAME, OPENPENCIL_NEW_TOOL_NAME, OPENPENCIL_PIPELINE_BATCH_TOOL_NAME, OPENPENCIL_PIPELINE_BEGIN_TOOL_NAME, OPENPENCIL_PIPELINE_FINISH_TOOL_NAME, OPENPENCIL_PIPELINE_INSPECT_TOOL_NAME, OPENPENCIL_RENDER_TOOL_NAME, } from '../tool-names.js';
export { calculateGalleryFitViewZoom, clampGalleryZoom, frameLabel, frameGalleryCopy, galleryZoomCommandTarget, galleryViewportMaxHeight, galleryZoomPercent, galleryZoomShortcut, GALLERY_COMPACT_MAX_HEIGHT, GALLERY_TOOLBAR_CONTROL_CONTENT_LAYOUT, GALLERY_TOOLBAR_CONTROL_HEIGHT, GALLERY_TOOLBAR_CONTROL_LAYOUT, GALLERY_ZOOM_MAX, GALLERY_ZOOM_MIN, GALLERY_ZOOM_STEP, nextGalleryZoom, normalizeFrameIndex, } from './frame-gallery.js';
export { applyManagedEditorUnmountPolicy, beginEditorInitRetry, closeManagedEditorLaunch, completeManagedEditorBridgeReady, editorPanelCopy, launchManagedEditor, managedEditorAllowsSave, prepareManagedEditor, prepareManagedEditorForMount, } from './editor-panel.js';
export { requestOpenPencilEditor, } from './details-compat.js';
export { clampEditorWorkbenchWidth, confirmEditorModalClose, editorModalCopy, editorWorkbenchEditorKey, editorWorkbenchFocusTargetIndex, editorWorkbenchShouldHandleEscape, editorWorkbenchUsesFullscreen, editorWorkbenchWidthBounds, EDITOR_WORKBENCH_CLOSE_BUTTON_MIN_WIDTH, EDITOR_WORKBENCH_FULLSCREEN_BREAKPOINT, EDITOR_WORKBENCH_LEFT_CLEARANCE, EDITOR_WORKBENCH_MAX_WIDTH, EDITOR_WORKBENCH_MIN_WIDTH, EDITOR_WORKBENCH_RESIZE_STEP, OPENPENCIL_EDITOR_CLOSE_BUTTON_ATTRIBUTE, resizedEditorWorkbenchWidth, } from './editor-modal.js';
export { claimEditorWorkbenchDock, OPENPENCIL_WORKBENCH_DOCK_ATTRIBUTE, } from './editor-dock-layout.js';
export { automaticEditorWorkbenchLayout, closeLiveDraftForPublishedSuccessor, createEditorWorkbenchStore, isPublishedSuccessorOfLiveDraft, mountEditorWorkbenchHost, preserveEditorBeforeWorkbenchDispose, } from './editor-workbench-host.js';
export { editorGrantForBoot, editorSuccessorFromSave, editorSuccessorStorageKey, rememberEditorSuccessor, } from './editor-successor.js';
export { captureManagedEditorRecovery, discardManagedEditorRecovery, editorRecoveryCopy, editorRecoveryItemUrl, editorRecoverySummaryOf, restoreManagedEditorRecovery, } from './editor-recovery.js';
export { claimEditor, confirmEditorClose, editorControlUrl, editorIframeUrlWithLocale, editorIframeUrlWithTheme, editorLocaleFromDsh, editorMessageFrom, editorOrigin, encodeEditorOutbound, parseEditorInbound, } from './editor-bridge.js';
export { clearOpenPencilSelection, getOpenPencilSelectionSnapshot, liveSelectionOf, publishOpenPencilSelection, subscribeOpenPencilSelection, } from './selection-store.js';
export { isTerminalEditorSelectionStatus, startEditorSelectionPolling, } from './selection-polling.js';
export { hasOpenPencilSelection, OPENPENCIL_SELECTION_DOCK_LAYOUT, selectionNodeDetail, selectionNodeLabel, } from './selection-dock.js';
export { documentSha256FromCanonicalResult, PRESENTATION_HYDRATION_ENDPOINT, presentationHydrationRequestOf, requestPresentationGrant, requestPresentationGrantWithRetry, } from './presentation-hydration.js';
/** Presentation metadata key the host half projects into `block.meta`. */
export declare const PRESENTATION_META_KEY = "$dshOpenPencil";
export declare function rememberLiveAutoOpenCall(key: string): void;
/**
 * Legacy synchronous acceptance used by pure callers. The automatic React
 * path below waits for the host's actual answer before accepting the call.
 */
export declare function takeLiveAutoOpenCall(key: string): boolean;
/**
 * Attempt one live auto-open without consuming it until the host accepts.
 * A busy/unmounted host or a rejected promise re-arms the call for a later
 * card projection, while `opening` prevents duplicate concurrent requests.
 */
export declare function attemptLiveAutoOpenCall(key: string, open: () => boolean | Promise<boolean>): Promise<boolean>;
export type PresentationLocale = GalleryLocale;
export declare function designRenderCopy(locale: PresentationLocale): {
    readonly designRender: "OpenPencil render";
    readonly designNew: "OpenPencil design";
    readonly error: "error";
    readonly rendering: "rendering…";
    readonly done: "done";
    readonly renderingDocument: "Rendering the design document…";
    readonly creatingDocument: "Creating the design document…";
    readonly renderFailed: "The render failed.";
    readonly frames: "frames";
    readonly openInteractiveCanvas: "Open interactive canvas";
    readonly editCanvas: "Edit canvas";
    readonly editInSidebar: "Edit in sidebar";
    readonly openRenderedPng: "Open rendered PNG";
    readonly downloadPng: "Download PNG";
    readonly editSource: "Edit source .op";
    readonly downloadSource: "Download source .op";
    readonly inspectToolCall: "Inspect tool call";
    readonly recoveringPreview: "Recovering the OpenPencil preview…";
    readonly pendingPreview: "This pipeline stage is waiting for its final preview.";
    readonly noPreview: "This result does not include a preview artifact.";
    readonly canvas: "OpenPencil canvas";
    readonly zoomOut: "Zoom out";
    readonly zoomIn: "Zoom in";
    readonly fit: "Fit";
    readonly close: "Close";
    readonly readonlyCanvas: "Read-only OpenPencil design canvas";
    readonly loadingCanvas: "Loading interactive canvas…";
    readonly pngRemains: "PNG preview remains available underneath the dialog.";
    readonly canvasUnavailable: "Interactive canvas unavailable";
    readonly openPngFallback: "Open PNG fallback";
    readonly panHint: "Drag to pan · scroll to pan · Ctrl/⌘ + scroll to zoom";
    readonly snapshot: "snapshot";
    readonly editorUnavailable: "Editable OpenPencil canvas is not available for this result.";
} | {
    readonly designRender: "OpenPencil 渲染";
    readonly designNew: "OpenPencil 设计";
    readonly error: "错误";
    readonly rendering: "渲染中…";
    readonly done: "完成";
    readonly renderingDocument: "正在渲染设计文档…";
    readonly creatingDocument: "正在创建设计文档…";
    readonly renderFailed: "渲染失败。";
    readonly frames: "页";
    readonly openInteractiveCanvas: "打开交互画布";
    readonly editCanvas: "编辑画布";
    readonly editInSidebar: "在侧边栏编辑";
    readonly openRenderedPng: "打开渲染 PNG";
    readonly downloadPng: "下载 PNG";
    readonly editSource: "编辑源文件 .op";
    readonly downloadSource: "下载源文件 .op";
    readonly inspectToolCall: "检查工具调用";
    readonly recoveringPreview: "正在恢复 OpenPencil 预览…";
    readonly pendingPreview: "当前流水线阶段正在等待最终预览。";
    readonly noPreview: "此结果未包含可显示的预览产物。";
    readonly canvas: "OpenPencil 画布";
    readonly zoomOut: "缩小";
    readonly zoomIn: "放大";
    readonly fit: "适应窗口";
    readonly close: "关闭";
    readonly readonlyCanvas: "只读 OpenPencil 设计画布";
    readonly loadingCanvas: "正在加载交互画布…";
    readonly pngRemains: "对话框下方仍保留 PNG 预览。";
    readonly canvasUnavailable: "交互画布不可用";
    readonly openPngFallback: "打开 PNG 预览";
    readonly panHint: "拖动平移 · 滚动平移 · Ctrl/⌘ + 滚动缩放";
    readonly snapshot: "快照";
    readonly editorUnavailable: "此渲染结果没有可用的 OpenPencil 编辑画布。";
};
/** Keep canonical create cards visually distinct while reusing one workbench. */
export declare function openPencilPresentationTitle(toolName: string, locale: PresentationLocale): string;
/**
 * Arm live auto-open even when a very fast tool settles before its running
 * card is committed. Replayed calls predate this client-bundle activation.
 */
export declare function shouldArmLiveAutoOpen(error: boolean, blockTime: number, activatedAt?: number): boolean;
export interface ImageGrant extends GalleryFrame {
}
export interface DocumentGrant {
    path?: string;
    url: string;
    downloadUrl?: string;
    bytes?: number;
    sha256?: string;
    mimeType?: string;
}
export interface ViewerGrant {
    sdkUrl: string;
    wasmUrl: string;
    canvasKitBaseUrl: string;
}
export interface EditorGrant {
    enabled: true;
    launchUrl: string;
    refreshUrl?: string;
}
export interface PresentationGrant {
    schemaVersion: 1 | 2;
    image?: ImageGrant;
    frames?: ImageGrant[];
    document?: DocumentGrant;
    viewer?: ViewerGrant;
    editor?: EditorGrant;
    renderer?: string;
    rendererBinary?: string;
    fidelity?: string;
    warnings?: string[];
    autoOpenEditor?: boolean;
    draftId?: string;
    liveDraft?: boolean;
}
/** Parse both the established v1 envelope and the additive v2 shape. */
export declare function presentationGrantOfMeta(metaValue: unknown): PresentationGrant | undefined;
export declare function grantOf(block: ToolCallViewProps['block']): PresentationGrant | undefined;
/** Distinguish an intentional two-phase pipeline wait from a missing artifact. */
export declare function pipelineResultAwaitsPreview(toolName: string, text: string | null): boolean;
/** Hide settled successes that have no preview, editor, or pending hydration. */
export declare function shouldHidePresentationCard(state: {
    settled: boolean;
    error: boolean;
    hasGrant: boolean;
    hydrationPending: boolean;
    awaitingPreview: boolean;
}): boolean;
/** A preview-retry state has its own concise status and never dumps JSON as a fake preview. */
export declare function fallbackPresentationText(text: string | null, awaitingPreview: boolean): string | null;
interface Viewport {
    panX: number;
    panY: number;
    zoom: number;
}
interface OpViewer {
    readonly viewport: Viewport;
    setZoom(zoom: number): void;
    panTo(panX: number, panY: number): void;
    zoomToFit(width: number, height: number): void;
    on(event: 'viewportchange', callback: () => void): () => void;
    destroy(): void;
}
interface OpenPencilSdk {
    createViewer(options: {
        canvas: HTMLCanvasElement;
        doc: string | Uint8Array;
        wasmUrl?: string;
        canvasKitBaseUrl?: string;
    }): Promise<OpViewer>;
}
/** Load the host-served ESM core SDK without coupling the client bundle to React 19. */
export declare function loadOpenPencilSdk(url: string): Promise<OpenPencilSdk>;
/** @internal Claim the page-wide SDK singleton; opening another canvas closes this one. */
export declare function claimCanvas(token: symbol, close: () => void): () => void;
/** Size the canvas backing store to its CSS box before CanvasKit attaches. */
export declare function sizeCanvasForDisplay(canvas: Pick<HTMLCanvasElement, 'clientWidth' | 'clientHeight' | 'width' | 'height'>, devicePixelRatio?: number): {
    cssWidth: number;
    cssHeight: number;
    dpr: number;
};
/** Render one OpenPencil render tool call as a PNG-first card. */
export declare function DesignRenderView({ block, callId, toolName, openDetails, openFile, inspect, locale, sessionId, openEditorWorkbench, autoOpenEditorWorkbench, }: CompatibleToolCallViewProps & {
    locale?: PresentationLocale;
    openEditorWorkbench?: (request: EditorWorkbenchRequest) => boolean | Promise<boolean>;
    autoOpenEditorWorkbench?: (request: EditorWorkbenchRequest) => boolean | Promise<boolean>;
}): import("react").JSX.Element | null;
/** Render the selected editable design inside DSH's resident details column. */
export declare function OpenPencilEditorPanel({ block, colorScheme, locale, sessionId }: CompatibleToolDetailsViewProps & {
    colorScheme: EditorColorScheme;
    locale: EditorLocale;
}): import("react").JSX.Element;
/** Required client services. */
export declare const inject: string[];
/** Register canonical views plus a presentation-only alias for replaying historical cards. */
export declare function apply(ctx: ClientContext): void;
