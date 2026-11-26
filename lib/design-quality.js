const MAX_ISSUES = 20;
const MAX_ISSUE_LENGTH = 200;
const MAX_ASSERT_MESSAGE_LENGTH = 1_600;
const MAX_VISITED_NODES = 10_000;
const MAX_RULE_ISSUES = 4;
// A production desktop page commonly carries 100-250 text nodes. Returning
// their fixed-shape id/patch records once is far cheaper than forcing the
// model through several finish/repair cycles; retain a hard upper bound for
// adversarial documents.
const MAX_REPAIR_TARGETS = 512;
const MAX_ANCESTOR_SCAN = 128;
const MIN_TOUCH_TARGET = 44;
const MOBILE_BOTTOM_SAFE_AREA = 34;
const GEOMETRY_EPSILON = 0.5;
const MAX_SEMANTIC_INPUT = 512;
const MAX_COMPACT_ROOT_WIDTH = 600;
const MAX_NEAR_ZERO_GUTTER = 4;
const MIN_CONTENT_RAIL_GUTTER = 8;
const MAX_COMPACT_ROOT_CHILD_WIDTH = 160;
const MAX_COMPACT_ROOT_CHILD_HEIGHT = 96;
const MIN_REPEATED_CARD_RAIL_EMPTY_SPACE = 64;
const MIN_REPEATED_CARD_RAIL_HEIGHT_RATIO = 1.5;
const MIN_PRODUCT_MEDIA_ICON_SHELL_SIZE = 160;
const MAX_PRODUCT_MEDIA_ICON_SIZE = 64;
const MAX_PRODUCT_MEDIA_ICON_RATIO = 0.4;
const MIN_COMPOSED_MEDIA_PAINTED_AREA = 10_000;
const PORTABLE_FONT_STACK = 'Inter, system-ui, sans-serif';
import { readFileSync } from 'node:fs';
const FORM_SEMANTIC_RE = /(?:^|\s)(?:auth|authentication|form|login|log in|register|registration|sign in|signin|sign up|signup)(?:\s|$)|认证|註冊|注册|登錄|登录|表单|表單|身份验证/u;
const COMPACT_CONTROL_RE = /(?:^|\s)(?:find|lookup|otp|one time code|passcode|pin|query|search|searchbox|security code|verification code)(?:\s|$)|一次性|动态码|動態碼|查找|检索|檢索|搜索|短信码|短信碼|验证码|驗證碼/u;
const PASSWORD_RE = /(?:^|\s)(?:password|passphrase|current password|new password)(?:\s|$)|密码|密碼|パスワード|비밀번호|mot de passe|contraseña|senha|passwort|парол|kata sandi|รหัสผ่าน|mật khẩu|पासवर्ड/u;
const ICON_SEMANTIC_RE = /(?:^|\s)(?:glyph|icon|pictogram|symbol)(?:\s|$)|图标|圖示|图示/u;
const EMOJI_RE = /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Regional_Indicator}|\uFE0F|\u20E3)/u;
const KEYCAP_RE = /[#*0-9]\uFE0F?\u20E3/gu;
const EMOJI_PART_RE = /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Regional_Indicator}|\p{Emoji_Modifier}|\uFE0E|\uFE0F|\u200D)/gu;
const CJK_RE = /(?:\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul})/u;
const WECHAT_RE = /(?:^|\s)wechat(?:\s|$)|微信|微訊/u;
const APPLE_RE = /(?:^|\s)apple(?:\s|$)|苹果登录|蘋果登錄/u;
const HITBOX_ROLES = new Set(['button', 'icon button', 'nav link']);
const CHECKBOX_ROW_ROLES = new Set([
    'checkbox row',
    'control row',
    'interactive row',
    'menuitem',
    'option',
    'row',
    'switch',
]);
const BOTTOM_SAFE_AREA_ROLES = new Set([
    'bottom nav',
    'bottom navigation',
    'navigation bar',
    'tab bar',
    'tablist',
]);
const STRUCTURAL_CONTAINER_RE = /(?:^|\s)(?:header|footer|nav|navigation|tool bar|toolbar)(?:\s|$)|页眉|頁眉|页脚|頁腳|导航|導航|工具栏|工具列/u;
const HERO_CONTAINER_RE = /(?:^|\s)hero(?:\s|$)|主视觉|主視覺/u;
const HERO_SECTION_RE = /(?:^|\s)(?:hero|section)(?:\s|$)|主视觉|主視覺|区块|區塊/u;
const MEDIA_WRAPPER_RE = /(?:^|\s)(?:art|hero image|image|media|photo|product image|visual)(?:\s|$)|图片|圖片|图像|圖像|照片|媒体|媒體|视觉|視覺/u;
const CATEGORY_CONTEXT_RE = /(?:^|\s)(?:(?:browse|shop) by categor(?:y|ies)|categor(?:y|ies)(?: cards?| grid| items?| list| rail| row| section)?)(?:\s|$)|分类|分類|品类|品類/u;
const CATEGORY_CARD_RE = /(?:^|\s)categor(?:y|ies)(?: card| item| tile)?(?:\s|$)|分类卡片|分類卡片|品类卡片|品類卡片/u;
const CATEGORY_VISUAL_RE = /(?:^|\s)(?:art|badge|image|media|photo|thumbnail|tile|visual)(?:\s|$)|图片|圖片|图像|圖像|照片|媒体|媒體|缩略图|縮圖|视觉|視覺/u;
const PRODUCT_RAIL_RE = /(?:^|\s)(?:catalog|merchandise|product|products)\s+(?:carousel|grid|list|rail|row|shelf)(?:\s|$)|商品(?:栏|欄|列表|货架|貨架)|产品(?:栏|欄|列表|貨架|货架)|產品(?:欄|列表|貨架)/u;
const PRODUCT_SECTION_RE = /(?:^|\s)(?:best\s?sellers?|featured products?|product collection|products section|shop products?)(?:\s|$)|畅销商品|暢銷商品|精选商品|精選商品|商品专区|商品專區/u;
const PRODUCT_ACTION_TEXT_RE = /^(?:add to (?:bag|cart)|buy now|favorite|quick view|save|shop now|view|wishlist)$/u;
const EMPTY_ACTION_CONTAINER_RE = /(?:^|\s)(?:button|call to action|cta|search|searchbox)(?:\s|$)|按钮|按鈕|搜索|搜尋/u;
const DESKTOP_COMMERCE_HEADER_RE = /(?:^|\s)(?:header|navbar)(?:\s|$)|页眉|頁眉/u;
const NAV_LINKS_CONTAINER_RE = /(?:^|\s)(?:nav|navigation) links?(?:\s|$)|导航链接|導航連結/u;
const HEADER_ACTIONS_RE = /(?:^|\s)(?:header actions?|utility controls?|utilities)(?:\s|$)|页眉操作|頁眉操作/u;
const PRIMARY_CTA_RE = /(?:^|\s)(?:cta|primary action|shop now)(?:\s|$)|立即选购|立即選購/u;
const PRICE_TEXT_RE = /(?:[$€£¥₹₽₩]\s*\d|\d[\d,.]*\s*(?:cny|eur|gbp|jpy|rmb|usd))/iu;
const WINDOWS_1252_CODEPOINT_TO_BYTE = new Map([
    [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
    [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
    [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
    [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
    [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
    [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
    [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);
const WINDOWS_1252_BYTE_TO_CODEPOINT = new Map([...WINDOWS_1252_CODEPOINT_TO_BYTE].map(([codePoint, byte]) => [byte, codePoint]));
const MOBILE_CHROME_RE = /(?:^|\s)(?:bottom nav|bottom navigation|bottom tab bar|home indicator|safe area|status bar|system bar|tab bar)(?:\s|$)/u;
const SCROLL_CONTAINER_RE = /(?:^|\s)(?:carousel|listbox|scroll area|scroll view|scroller)(?:\s|$)|列表框|滾動區|滚动区|輪播|轮播/u;
const ROOT_OVERLAY_ROLE_RE = /(?:^|\s)(?:fab|floating action|floating action button|overlay)(?:\s|$)/u;
const H_CONSTRAINTS = new Set(['center', 'left', 'left right', 'right', 'scale']);
const V_CONSTRAINTS = new Set(['bottom', 'center', 'scale', 'top', 'top bottom']);
const ROOT_CONTROL_TYPES = new Set([
    'button',
    'checkbox',
    'frame',
    'select',
    'slider',
    'switch',
    'text_area',
    'text_input',
]);
const STRUCTURAL_CONTAINER_TYPES = new Set(['component', 'frame', 'group', 'instance']);
const COMPOSED_SHAPE_LAYER_TYPES = new Set([
    'ellipse', 'line', 'path', 'polygon', 'rectangle', 'shape', 'star', 'vector',
]);
const REPEATED_CARD_ROLES = new Set(['card', 'product card']);
const GENERIC_SANS_FAMILIES = new Set([
    '-apple-system',
    'blinkmacsystemfont',
    'sans-serif',
    'system-ui',
    'ui-sans-serif',
]);
const GENERIC_SERIF_FAMILIES = new Set(['serif', 'ui-serif']);
const GENERIC_MONO_FAMILIES = new Set(['monospace', 'ui-monospace', 'sfmono-regular']);
const APPROVED_WECHAT_ICONS = new Set([
    'simple-icons:wechat',
]);
const APPROVED_APPLE_ICONS = new Set([
    'simple-icons:apple',
]);
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function finiteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
function normalizedSemanticPart(value) {
    if (typeof value !== 'string')
        return '';
    return value.slice(0, MAX_SEMANTIC_INPUT)
        .normalize('NFKC')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .toLocaleLowerCase('en-US')
        .replace(/[_./:-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function nestedSemantics(node) {
    return isObject(node.semantics) ? node.semantics : undefined;
}
function semanticValues(node) {
    const semantics = nestedSemantics(node);
    return [
        node.name,
        node.role,
        node.semanticRole,
        node.purpose,
        semantics?.role,
        semantics?.label,
        semantics?.hint,
    ];
}
function semanticText(node) {
    return semanticValues(node)
        .map(normalizedSemanticPart)
        .filter(Boolean)
        .join(' ');
}
function compactControlText(node) {
    return [
        ...semanticValues(node),
        node.label,
        node.placeholder,
        node.autocomplete,
        node.inputMode,
    ]
        .map(normalizedSemanticPart)
        .filter(Boolean)
        .join(' ');
}
function authoredRole(node) {
    const semantics = nestedSemantics(node);
    return normalizedSemanticPart(node.role || node.semanticRole || semantics?.role);
}
function isFormSemantic(node) {
    return FORM_SEMANTIC_RE.test(semanticText(node));
}
function isCompactControlSemantic(node) {
    return COMPACT_CONTROL_RE.test(compactControlText(node));
}
function isPasswordSemantic(node) {
    return PASSWORD_RE.test(compactControlText(node));
}
function isIconSemantic(node) {
    return ICON_SEMANTIC_RE.test(semanticText(node));
}
function isIconField(key) {
    const normalized = key.replace(/[^a-z]/gi, '').toLocaleLowerCase('en-US');
    return normalized === 'icon'
        || normalized.endsWith('icon')
        || /^(?:iconcontent|iconglyph|iconname|iconsource|icontext|iconvalue)$/.test(normalized);
}
function containsEmoji(value, depth = 0, seen = new Set()) {
    if (typeof value === 'string')
        return EMOJI_RE.test(value);
    if (depth >= 6 || (typeof value !== 'object' || value === null))
        return false;
    if (seen.has(value))
        return false;
    seen.add(value);
    if (Array.isArray(value))
        return value.some(item => containsEmoji(item, depth + 1, seen));
    return Object.values(value).some(item => containsEmoji(item, depth + 1, seen));
}
function textContent(node) {
    if (typeof node.content === 'string')
        return node.content;
    if (!Array.isArray(node.content))
        return undefined;
    const parts = [];
    for (const segment of node.content) {
        if (!isObject(segment) || typeof segment.text !== 'string')
            return undefined;
        parts.push(segment.text);
    }
    return parts.join('');
}
function windows1252Bytes(value) {
    const bytes = [];
    for (const character of value) {
        const codePoint = character.codePointAt(0);
        if (codePoint === undefined)
            return undefined;
        const specialByte = WINDOWS_1252_CODEPOINT_TO_BYTE.get(codePoint);
        if (specialByte !== undefined)
            bytes.push(specialByte);
        else if (codePoint <= 0xff)
            bytes.push(codePoint);
        else
            return undefined;
    }
    return Uint8Array.from(bytes);
}
function windows1252String(bytes) {
    return [...bytes]
        .map(byte => String.fromCodePoint(WINDOWS_1252_BYTE_TO_CODEPOINT.get(byte) ?? byte))
        .join('');
}
function reversibleUtf8MojibakeRepair(value) {
    const bytes = windows1252Bytes(value);
    if (bytes === undefined || ![...bytes].some(byte => byte >= 0xc2 && byte <= 0xf4))
        return undefined;
    let repaired;
    try {
        repaired = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    }
    catch {
        return undefined;
    }
    if (repaired === value
        || [...repaired].length >= [...value].length
        || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\ufffd]/u.test(repaired))
        return undefined;
    const roundTrip = windows1252String(new TextEncoder().encode(repaired));
    return roundTrip === value ? repaired : undefined;
}
function isEmojiOnly(value) {
    if (typeof value !== 'string' || !EMOJI_RE.test(value))
        return false;
    return value
        .replace(KEYCAP_RE, '')
        .replace(EMOJI_PART_RE, '')
        .trim() === '';
}
function nodeType(node) {
    if (typeof node.type !== 'string')
        return 'node';
    const normalized = node.type.toLocaleLowerCase('en-US');
    return /^[a-z0-9_-]{1,32}$/.test(normalized) ? normalized : 'node';
}
function boundedIssue(value) {
    if (value.length <= MAX_ISSUE_LENGTH)
        return value;
    return `${value.slice(0, MAX_ISSUE_LENGTH - 1)}…`;
}
class IssueCollector {
    issues = [];
    unrepairableDiagnosticCount = 0;
    #ruleCounts = new Map();
    add(rule, path, type, hint, ruleLimit = MAX_RULE_ISSUES, repairable = false) {
        if (this.issues.length >= MAX_ISSUES)
            return;
        const count = this.#ruleCounts.get(rule) ?? 0;
        if (count >= ruleLimit)
            return;
        this.#ruleCounts.set(rule, count + 1);
        this.issues.push(boundedIssue(`${path}: ${type} ${hint}`));
        if (!repairable)
            this.unrepairableDiagnosticCount += 1;
    }
}
class RepairTargetCollector {
    #targets = new Map();
    #seenIds = new Set();
    addTypography(node, patch) {
        this.#add(node, 'typography', patch);
    }
    addFormControl(node, patch) {
        this.#add(node, 'form-control', patch);
    }
    addIconSize(node, patch) {
        this.#add(node, 'icon-size', patch);
    }
    addIconGlyph(node, patch) {
        this.#add(node, 'icon-glyph', patch);
    }
    addContrast(node, patch) {
        this.#add(node, 'contrast', patch);
    }
    addFlowSize(node, patch) {
        this.#add(node, 'flow-size', patch);
    }
    addTouchTarget(node, patch) {
        this.#add(node, 'touch-target', patch);
    }
    addCanvasContract(node, patch) {
        this.#add(node, 'canvas-contract', patch);
    }
    #add(node, rule, patch) {
        if (Object.keys(patch).length === 0)
            return;
        const nodeId = typeof node.id === 'string' ? node.id : '';
        if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(nodeId))
            return;
        const existing = this.#targets.get(nodeId);
        if (existing !== undefined) {
            existing.patch = { ...existing.patch, ...patch };
            return;
        }
        if (this.#seenIds.has(nodeId))
            return;
        this.#seenIds.add(nodeId);
        if (this.#targets.size >= MAX_REPAIR_TARGETS)
            return;
        this.#targets.set(nodeId, {
            nodeId,
            operation: 'U',
            rule,
            patch: { ...patch },
        });
    }
    report() {
        const repairTargets = [...this.#targets.values()];
        return {
            repairTargets,
            repairTargetSummary: {
                total: this.#seenIds.size,
                returned: repairTargets.length,
                omitted: this.#seenIds.size - repairTargets.length,
            },
        };
    }
}
function addChildRoots(roots, children, pathPrefix) {
    if (!Array.isArray(children))
        return;
    for (let index = children.length - 1; index >= 0; index -= 1) {
        const child = children[index];
        if (!isObject(child))
            continue;
        const path = pathPrefix ? `${pathPrefix}.${index}` : `${index}`;
        roots.push({
            node: child,
            path,
            rootPath: path,
            inCompactContext: false,
            inFormContext: false,
            inStatusBar: false,
        });
    }
}
function documentRoots(value) {
    if (typeof value.type === 'string') {
        return [{
                node: value,
                path: 'root',
                rootPath: 'root',
                inCompactContext: false,
                inFormContext: false,
                inStatusBar: false,
            }];
    }
    const roots = [];
    addChildRoots(roots, value.children, '');
    if (Array.isArray(value.pages)) {
        for (let pageIndex = value.pages.length - 1; pageIndex >= 0; pageIndex -= 1) {
            const page = value.pages[pageIndex];
            if (isObject(page))
                addChildRoots(roots, page.children, `pages.${pageIndex}`);
        }
    }
    if (!Array.isArray(value.children) && !Array.isArray(value.pages))
        return undefined;
    return roots;
}
function paddingTuple(node) {
    if (node.padding === undefined)
        return [0, 0, 0, 0];
    const one = finiteNumber(node.padding);
    if (one !== undefined)
        return one >= 0 ? [one, one, one, one] : undefined;
    if (!Array.isArray(node.padding) || node.padding.length < 1 || node.padding.length > 4)
        return undefined;
    const values = node.padding.map(finiteNumber);
    if (values.some(value => value === undefined || value < 0))
        return undefined;
    const safe = values;
    if (safe.length === 1)
        return [safe[0], safe[0], safe[0], safe[0]];
    if (safe.length === 2)
        return [safe[0], safe[1], safe[0], safe[1]];
    if (safe.length === 3)
        return [safe[0], safe[1], safe[2], safe[1]];
    return [safe[0], safe[1], safe[2], safe[3]];
}
function isStructuralContainer(node) {
    return STRUCTURAL_CONTAINER_TYPES.has(nodeType(node))
        && STRUCTURAL_CONTAINER_RE.test(semanticText(node));
}
function isExplicitMobileChrome(node) {
    return MOBILE_CHROME_RE.test(semanticText(node));
}
function isExplicitRootOverlay(node) {
    if (ROOT_OVERLAY_ROLE_RE.test(authoredRole(node)))
        return true;
    const constraints = isObject(node.constraints) ? node.constraints : undefined;
    return constraints !== undefined
        && H_CONSTRAINTS.has(normalizedSemanticPart(constraints.h))
        && V_CONSTRAINTS.has(normalizedSemanticPart(constraints.v))
        && (finiteNumber(node.x) !== undefined || finiteNumber(node.y) !== undefined);
}
function skipsMainAxisOverflow(node, axis) {
    const mainAxis = node.layout === 'horizontal'
        ? 'width'
        : node.layout === 'vertical' ? 'height' : undefined;
    return axis === mainAxis
        && (node.clipContent === true || SCROLL_CONTAINER_RE.test(semanticText(node)));
}
function hasHorizontalContentGutter(node) {
    const padding = paddingTuple(node);
    return padding !== undefined
        && padding[1] >= MIN_CONTENT_RAIL_GUTTER
        && padding[3] >= MIN_CONTENT_RAIL_GUTTER;
}
function isVisiblePaint(value) {
    const paints = Array.isArray(value) ? value : value === undefined ? [] : [value];
    return paints.some((paint) => {
        if (!isObject(paint))
            return true;
        if (paint.visible === false)
            return false;
        const opacity = paint.opacity === undefined ? 1 : finiteNumber(paint.opacity);
        return opacity === undefined || opacity > 0;
    });
}
function isCollapsedNode(node) {
    return node.visible === false && finiteNumber(node.width) === 0 && finiteNumber(node.height) === 0;
}
function isAuthoredVisible(node) {
    const opacity = node.opacity === undefined ? 1 : finiteNumber(node.opacity);
    return node.visible !== false && (opacity === undefined || opacity > 0);
}
function visibleLeafNodes(node, depth = 0) {
    if (!isAuthoredVisible(node))
        return [];
    if (depth > MAX_ANCESTOR_SCAN)
        return [node];
    const children = Array.isArray(node.children) ? node.children.filter(isObject) : [];
    const descendantLeaves = children.flatMap(child => visibleLeafNodes(child, depth + 1));
    if (descendantLeaves.length > 0)
        return descendantLeaves;
    const type = nodeType(node);
    if (type === 'text')
        return (textContent(node)?.trim().length ?? 0) > 0 ? [node] : [];
    if (isVisiblePaint(node.fill) || isVisiblePaint(node.stroke))
        return [node];
    if (STRUCTURAL_CONTAINER_TYPES.has(type) || type === 'node')
        return [];
    return [node];
}
function hasVisibleActionContent(node, depth = 0) {
    if (!isAuthoredVisible(node))
        return false;
    if (depth > MAX_ANCESTOR_SCAN)
        return true;
    if ((textContent(node)?.trim().length ?? 0) > 0)
        return true;
    const type = nodeType(node);
    if (type === 'image')
        return !hasUnresolvedSearchedImageSource(node);
    if (!STRUCTURAL_CONTAINER_TYPES.has(type))
        return type !== 'node' && type !== 'text';
    if (!Array.isArray(node.children))
        return false;
    return node.children.some(child => isObject(child) && hasVisibleActionContent(child, depth + 1));
}
function hasVisibleOwnRendering(record) {
    const { node, type } = record;
    if (type === 'text')
        return (textContent(node)?.trim().length ?? 0) > 0;
    if (isVisiblePaint(node.fill) || isVisiblePaint(node.stroke))
        return true;
    if (type === 'frame' || type === 'group' || type === 'component' || type === 'instance')
        return false;
    return type !== 'node';
}
function visibleDescendantMap(records) {
    const children = new Map();
    const effectivelyVisible = new Map();
    for (const record of records) {
        if (record.parent !== undefined) {
            const siblings = children.get(record.parent) ?? [];
            siblings.push(record);
            children.set(record.parent, siblings);
        }
        const opacity = record.node.opacity === undefined ? 1 : finiteNumber(record.node.opacity);
        effectivelyVisible.set(record, (record.parent === undefined || effectivelyVisible.get(record.parent) === true)
            && record.node.visible !== false
            && (opacity === undefined || opacity > 0));
    }
    const visibleSubtree = new Map();
    for (let index = records.length - 1; index >= 0; index -= 1) {
        const record = records[index];
        const visible = effectivelyVisible.get(record) === true
            && (hasVisibleOwnRendering(record)
                || (children.get(record) ?? []).some(child => visibleSubtree.get(child) === true));
        visibleSubtree.set(record, visible);
    }
    const result = new Map();
    for (const record of records) {
        result.set(record, (children.get(record) ?? []).some(child => visibleSubtree.get(child) === true));
    }
    return result;
}
function isCompactRootDirectContent(record, rootWidth) {
    const { node, type } = record;
    if (isExplicitMobileChrome(node) || isExplicitRootOverlay(node))
        return false;
    if (type === 'text' || type === 'icon_font' || isIconSemantic(node))
        return true;
    if (type === 'path' && typeof node.iconId === 'string')
        return true;
    if (!ROOT_CONTROL_TYPES.has(type))
        return false;
    if (isStructuralContainer(node) && hasHorizontalContentGutter(node))
        return false;
    const width = finiteNumber(node.width);
    const height = finiteNumber(node.height);
    return width !== undefined
        && height !== undefined
        && width <= Math.min(MAX_COMPACT_ROOT_CHILD_WIDTH, rootWidth / 2)
        && height <= MAX_COMPACT_ROOT_CHILD_HEIGHT;
}
function textMetrics(node, availableWidth) {
    const fontSize = finiteNumber(node.fontSize) ?? 16;
    const lineHeight = finiteNumber(node.lineHeight) ?? 1.2;
    const content = textContent(node) ?? '';
    let emWidth = 0;
    for (const character of content) {
        if (/\s/u.test(character))
            emWidth += 0.33;
        else if (CJK_RE.test(character) || EMOJI_RE.test(character))
            emWidth += 1;
        else if (/[A-Z]/u.test(character))
            emWidth += 0.65;
        else if (/[a-z0-9]/u.test(character))
            emWidth += 0.56;
        else
            emWidth += 0.45;
    }
    const width = emWidth * fontSize;
    const authoredWidth = finiteNumber(node.width);
    const wrappingWidth = authoredWidth ?? (node.width === 'fill_container' ? availableWidth : undefined);
    const lines = wrappingWidth !== undefined && wrappingWidth > 0
        ? Math.max(1, Math.ceil(width / wrappingWidth))
        : 1;
    return { width, height: fontSize * lineHeight * lines };
}
function resolvedOuterWidth(node, availableWidth) {
    const width = finiteNumber(node.width);
    if (width !== undefined)
        return Math.max(0, width);
    if (node.width === 'fill_container')
        return availableWidth;
    return undefined;
}
function dimensionContribution(node, axis, availableWidth, depth) {
    const authored = node[axis];
    const numeric = finiteNumber(authored);
    if (numeric !== undefined)
        return Math.max(0, numeric);
    if (authored === 'fill_container')
        return 0;
    if (authored !== undefined && authored !== 'fit_content')
        return undefined;
    return intrinsicDimension(node, axis, availableWidth, depth + 1);
}
function intrinsicDimension(node, axis, availableWidth, depth) {
    if (depth > MAX_ANCESTOR_SCAN)
        return undefined;
    if (nodeType(node) === 'text')
        return textMetrics(node, availableWidth)[axis];
    const children = Array.isArray(node.children) ? node.children.filter(isObject) : [];
    if (children.length === 0)
        return 0;
    const padding = paddingTuple(node);
    if (padding === undefined)
        return undefined;
    const gap = node.gap === undefined ? 0 : finiteNumber(node.gap);
    if (gap === undefined || gap < 0)
        return undefined;
    const [top, right, bottom, left] = padding;
    const outerWidth = resolvedOuterWidth(node, availableWidth);
    const contentWidth = outerWidth === undefined ? undefined : Math.max(0, outerWidth - left - right);
    const layout = node.layout === 'vertical' || node.layout === 'horizontal' ? node.layout : 'none';
    if (layout === 'vertical') {
        if (axis === 'height') {
            let total = top + bottom + gap * Math.max(0, children.length - 1);
            for (const child of children) {
                const contribution = dimensionContribution(child, 'height', contentWidth, depth);
                if (contribution === undefined)
                    return undefined;
                total += contribution;
            }
            return total;
        }
        let maximum = 0;
        for (const child of children) {
            const contribution = dimensionContribution(child, 'width', contentWidth, depth);
            if (contribution === undefined)
                return undefined;
            maximum = Math.max(maximum, contribution);
        }
        return left + right + maximum;
    }
    if (layout === 'horizontal') {
        if (axis === 'width') {
            let total = left + right + gap * Math.max(0, children.length - 1);
            for (const child of children) {
                const contribution = dimensionContribution(child, 'width', contentWidth, depth);
                if (contribution === undefined)
                    return undefined;
                total += contribution;
            }
            return total;
        }
        let maximum = 0;
        for (const child of children) {
            const contribution = dimensionContribution(child, 'height', contentWidth, depth);
            if (contribution === undefined)
                return undefined;
            maximum = Math.max(maximum, contribution);
        }
        return top + bottom + maximum;
    }
    let maximum = 0;
    for (const child of children) {
        const contribution = dimensionContribution(child, axis, contentWidth, depth);
        if (contribution === undefined)
            return undefined;
        const offset = finiteNumber(child[axis === 'width' ? 'x' : 'y']) ?? 0;
        maximum = Math.max(maximum, Math.max(0, offset) + contribution);
    }
    return (axis === 'width' ? left + right : top + bottom) + maximum;
}
function rootFlowMinimum(node, axis) {
    if ((axis === 'height' && node.layout !== 'vertical')
        || (axis === 'width' && node.layout !== 'horizontal'))
        return undefined;
    return intrinsicDimension(node, axis, finiteNumber(node.width), 0);
}
function hasReservedMobileBottomSafeArea(node) {
    const padding = paddingTuple(node);
    if (padding !== undefined && padding[2] >= MOBILE_BOTTOM_SAFE_AREA)
        return true;
    const directChildren = Array.isArray(node.children) ? node.children.filter(isObject) : [];
    const lastFlowChild = directChildren.at(-1);
    if (lastFlowChild !== undefined && BOTTOM_SAFE_AREA_ROLES.has(authoredRole(lastFlowChild))) {
        const childPadding = paddingTuple(lastFlowChild);
        if (childPadding !== undefined && childPadding[2] >= MOBILE_BOTTOM_SAFE_AREA)
            return true;
    }
    if (node.layout !== 'vertical'
        || (node.justifyContent !== undefined && node.justifyContent !== 'start')
        || directChildren.some(child => child.height === 'fill_container'))
        return false;
    const height = finiteNumber(node.height);
    const minimum = rootFlowMinimum(node, 'height');
    if (height === undefined || minimum === undefined)
        return false;
    const authoredBottomPadding = padding?.[2] ?? 0;
    return height - minimum + authoredBottomPadding >= MOBILE_BOTTOM_SAFE_AREA;
}
function parseHexColor(value) {
    if (typeof value !== 'string')
        return undefined;
    const hex = value.trim();
    let expanded;
    if (/^#[0-9a-f]{3}$/i.test(hex)) {
        expanded = `${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}ff`;
    }
    else if (/^#[0-9a-f]{6}$/i.test(hex)) {
        expanded = `${hex.slice(1)}ff`;
    }
    else if (/^#[0-9a-f]{8}$/i.test(hex)) {
        expanded = hex.slice(1);
    }
    else
        return undefined;
    return {
        r: Number.parseInt(expanded.slice(0, 2), 16) / 255,
        g: Number.parseInt(expanded.slice(2, 4), 16) / 255,
        b: Number.parseInt(expanded.slice(4, 6), 16) / 255,
        a: Number.parseInt(expanded.slice(6, 8), 16) / 255,
    };
}
function nodeFill(node) {
    if (node.fill === undefined || (Array.isArray(node.fill) && node.fill.length === 0))
        return { kind: 'absent' };
    const fills = Array.isArray(node.fill) ? node.fill : [node.fill];
    const visible = fills.filter(fill => !isObject(fill) || fill.visible !== false);
    if (visible.length !== 1 || !isObject(visible[0]))
        return { kind: 'uncertain' };
    const paint = visible[0];
    if (paint.type !== 'solid' || typeof paint.color !== 'string')
        return { kind: 'uncertain' };
    const color = parseHexColor(paint.color);
    if (color === undefined)
        return { kind: 'uncertain' };
    const paintOpacity = paint.opacity === undefined ? 1 : finiteNumber(paint.opacity);
    const nodeOpacity = node.opacity === undefined ? 1 : finiteNumber(node.opacity);
    if (paintOpacity === undefined
        || nodeOpacity === undefined
        || paintOpacity < 0
        || paintOpacity > 1
        || nodeOpacity < 0
        || nodeOpacity > 1) {
        return { kind: 'uncertain' };
    }
    return { kind: 'solid', color: { ...color, a: Math.min(1, color.a * paintOpacity * nodeOpacity) } };
}
function composite(foreground, background) {
    const alpha = foreground.a + background.a * (1 - foreground.a);
    if (alpha <= 0)
        return { r: 0, g: 0, b: 0, a: 0 };
    return {
        r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / alpha,
        g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / alpha,
        b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / alpha,
        a: alpha,
    };
}
/** The nearest ancestor whose own opaque solid fill paints the backdrop. */
function ancestorBackgroundOwner(record) {
    let current = record.parent;
    let scanned = 0;
    while (current !== undefined && scanned < MAX_ANCESTOR_SCAN) {
        const fill = nodeFill(current.node);
        if (fill.kind === 'uncertain')
            return undefined;
        if (fill.kind === 'solid' && fill.color.a >= 1 - Number.EPSILON)
            return current;
        current = current.parent;
        scanned += 1;
    }
    return undefined;
}
function ancestorBackground(record) {
    const ancestors = [];
    let current = record.parent;
    while (current !== undefined && ancestors.length < MAX_ANCESTOR_SCAN) {
        ancestors.push(current);
        current = current.parent;
    }
    if (current !== undefined)
        return undefined;
    let background;
    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
        const fill = nodeFill(ancestors[index].node);
        if (fill.kind === 'absent')
            continue;
        if (fill.kind === 'uncertain') {
            background = undefined;
            continue;
        }
        if (fill.color.a >= 1 - Number.EPSILON)
            background = { ...fill.color, a: 1 };
        else if (background !== undefined)
            background = composite(fill.color, background);
        else
            background = undefined;
    }
    return background?.a === 1 ? background : undefined;
}
function linearChannel(value) {
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}
function luminance(color) {
    return 0.2126 * linearChannel(color.r)
        + 0.7152 * linearChannel(color.g)
        + 0.0722 * linearChannel(color.b);
}
function contrastRatio(first, second) {
    const lighter = Math.max(luminance(first), luminance(second));
    const darker = Math.min(luminance(first), luminance(second));
    return (lighter + 0.05) / (darker + 0.05);
}
function numericFontWeight(value) {
    const numeric = finiteNumber(value);
    if (numeric !== undefined)
        return numeric;
    const normalized = normalizedSemanticPart(value);
    if (normalized === 'bold')
        return 700;
    if (normalized === 'semibold' || normalized === 'semi bold')
        return 600;
    return 400;
}
function isLargeText(node) {
    const size = finiteNumber(node.fontSize);
    return size !== undefined && (size >= 24 || (size >= 18.66 && numericFontWeight(node.fontWeight) >= 700));
}
function normalizedFontFamilyTokens(value) {
    return value.split(',')
        .map(token => token.trim().replace(/^['"]|['"]$/g, '').toLocaleLowerCase('en-US'))
        .filter(Boolean);
}
function canonicalFontFamily(value) {
    const tokens = normalizedFontFamilyTokens(value);
    if (tokens.length === 0)
        return undefined;
    const primary = tokens[0];
    if (GENERIC_MONO_FAMILIES.has(primary))
        return 'generic-monospace';
    if (GENERIC_SERIF_FAMILIES.has(primary))
        return 'generic-serif';
    if (GENERIC_SANS_FAMILIES.has(primary))
        return 'generic-sans';
    return primary;
}
function hasPortableSansFallback(value) {
    return normalizedFontFamilyTokens(value).some(token => GENERIC_SANS_FAMILIES.has(token));
}
function dimensionHasMinimum(node, axis) {
    const value = finiteNumber(node[axis]);
    if (value !== undefined)
        return value >= MIN_TOUCH_TARGET;
    if (node[axis] === 'fill_container')
        return true;
    const minimum = finiteNumber(node[axis === 'width' ? 'minWidth' : 'minHeight']);
    return minimum !== undefined && minimum >= MIN_TOUCH_TARGET;
}
function containsNodeType(node, wanted, visited = 0) {
    if (visited > 100)
        return false;
    if (nodeType(node) === wanted)
        return true;
    if (!Array.isArray(node.children))
        return false;
    return node.children.some(child => isObject(child) && containsNodeType(child, wanted, visited + 1));
}
function providerText(node, depth = 0) {
    if (depth > 8)
        return '';
    const parts = [...semanticValues(node)];
    const content = textContent(node);
    if (content !== undefined)
        parts.push(content);
    if (Array.isArray(node.children)) {
        for (const child of node.children)
            if (isObject(child))
                parts.push(providerText(child, depth + 1));
    }
    return parts.map(normalizedSemanticPart).filter(Boolean).join(' ');
}
function providerIcons(node, depth = 0) {
    if (depth > 8)
        return [];
    const icons = [];
    if (nodeType(node) === 'icon_font' && typeof node.iconFontName === 'string') {
        const family = typeof node.iconFontFamily === 'string' && node.iconFontFamily.trim().length > 0
            ? node.iconFontFamily.toLocaleLowerCase('en-US').trim()
            : 'lucide';
        icons.push(`${family}:${node.iconFontName.toLocaleLowerCase('en-US').trim()}`);
    }
    if (nodeType(node) === 'path' && typeof node.iconId === 'string' && node.iconId.trim().length > 0) {
        icons.push(node.iconId.toLocaleLowerCase('en-US').trim());
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children)
            if (isObject(child))
                icons.push(...providerIcons(child, depth + 1));
    }
    return icons;
}
function buildRecords(roots, collector) {
    const pending = [...roots];
    const records = [];
    const rootRecords = [];
    let visited = 0;
    while (pending.length > 0) {
        const current = pending.pop();
        if (current === undefined)
            break;
        visited += 1;
        if (visited > MAX_VISITED_NODES) {
            collector.add('node-limit', current.path, 'node', 'exceeds the quality inspection node limit.', 1);
            break;
        }
        const type = nodeType(current.node);
        const compact = current.inCompactContext || isCompactControlSemantic(current.node);
        const inFormContext = current.inFormContext || isFormSemantic(current.node);
        const inStatusBar = current.inStatusBar || authoredRole(current.node) === 'status bar';
        const record = {
            ...current,
            type,
            inCompactContext: compact,
            inFormContext,
            inStatusBar,
        };
        records.push(record);
        if (record.parent === undefined)
            rootRecords.push(record);
        const children = current.node.children;
        if (!Array.isArray(children))
            continue;
        for (let index = children.length - 1; index >= 0; index -= 1) {
            const child = children[index];
            if (!isObject(child))
                continue;
            pending.push({
                node: child,
                path: `${current.path}.${index}`,
                parent: record,
                rootPath: current.rootPath,
                inCompactContext: compact,
                inFormContext,
                inStatusBar,
            });
        }
    }
    return { records, roots: rootRecords };
}
function inspectRootGeometry(roots, records, collector) {
    const recordsByRoot = new Map();
    for (const record of records) {
        const siblings = recordsByRoot.get(record.rootPath) ?? [];
        siblings.push(record);
        recordsByRoot.set(record.rootPath, siblings);
    }
    for (const root of roots) {
        const { node, path, type } = root;
        const hasStatusBar = (recordsByRoot.get(root.rootPath) ?? []).some(record => record.inStatusBar);
        const width = finiteNumber(node.width);
        const height = finiteNumber(node.height);
        if (hasStatusBar && width !== undefined && width <= 600 && height !== undefined && height >= 480) {
            if (!hasReservedMobileBottomSafeArea(node)) {
                collector.add('mobile-safe-area', path, type, 'mobile root with a status bar must reserve at least 34px of bottom safe-area padding.', 2);
            }
        }
        const rootPadding = paddingTuple(node);
        if (node.layout === 'vertical'
            && width !== undefined
            && width <= MAX_COMPACT_ROOT_WIDTH
            && rootPadding !== undefined
            && rootPadding[1] <= MAX_NEAR_ZERO_GUTTER
            && rootPadding[3] <= MAX_NEAR_ZERO_GUTTER) {
            for (const record of recordsByRoot.get(root.rootPath) ?? []) {
                if (record.parent !== root || !isCompactRootDirectContent(record, width))
                    continue;
                collector.add('mobile-content-rail', record.path, record.type, 'mobile vertical root must wrap direct text, icons, and compact controls in a horizontally guttered content rail or semantic container.');
            }
        }
    }
}
function inspectContainerGeometry(records, collector, repairTargets) {
    for (const record of records) {
        const { node, path, type } = record;
        if (isCollapsedNode(node))
            continue;
        if (node.layout !== 'horizontal' && node.layout !== 'vertical')
            continue;
        const patch = {};
        for (const axis of ['width', 'height']) {
            if (skipsMainAxisOverflow(node, axis))
                continue;
            const authored = finiteNumber(node[axis]);
            if (authored === undefined)
                continue;
            const minimum = intrinsicDimension(node, axis, finiteNumber(node.width), 0);
            if (minimum === undefined || minimum <= authored + GEOMETRY_EPSILON)
                continue;
            collector.add(`container-flow-${node.layout}-${axis}`, path, type, `fixed ${node.layout} container ${axis} cannot contain its padding, gap, and resolvable child flow.`, MAX_RULE_ISSUES, true);
            patch[axis] = Math.ceil(minimum);
        }
        repairTargets.addFlowSize(node, patch);
    }
}
function repeatedCardChildren(node) {
    if (node.layout !== 'horizontal' || !Array.isArray(node.children) || node.children.length < 2) {
        return undefined;
    }
    if (isStructuralContainer(node)
        || HITBOX_ROLES.has(authoredRole(node))
        || HERO_CONTAINER_RE.test(semanticText(node)))
        return undefined;
    if (!node.children.every(isObject))
        return undefined;
    const children = node.children;
    return children.every(child => REPEATED_CARD_ROLES.has(authoredRole(child)))
        ? children
        : undefined;
}
function inspectRepeatedCardRails(records, collector, repairTargets) {
    for (const record of records) {
        const { node, path, type } = record;
        const cards = repeatedCardChildren(node);
        if (cards === undefined)
            continue;
        const padding = paddingTuple(node);
        const authoredHeight = finiteNumber(node.height);
        const cardHeights = cards.map(card => finiteNumber(card.height));
        if (padding !== undefined
            && authoredHeight !== undefined
            && cardHeights.every((height) => height !== undefined && height > 0)) {
            const minimumCardHeight = Math.min(...cardHeights);
            const maximumCardHeight = Math.max(...cardHeights);
            const exactContentHeight = padding[0] + maximumCardHeight + padding[2];
            if (maximumCardHeight - minimumCardHeight <= GEOMETRY_EPSILON
                && authoredHeight - exactContentHeight >= MIN_REPEATED_CARD_RAIL_EMPTY_SPACE
                && authoredHeight >= exactContentHeight * MIN_REPEATED_CARD_RAIL_HEIGHT_RATIO) {
                collector.add('repeated-card-rail-height', path, type, 'fixed horizontal repeated-card rail height leaves excessive empty space below equal-height cards.', MAX_RULE_ISSUES, true);
                repairTargets.addFlowSize(node, { height: exactContentHeight });
            }
        }
        const cardWidths = cards.map(card => card.width);
        if (!cardWidths.every(width => width === 'fill_container' || (finiteNumber(width) ?? 0) > 0))
            continue;
        const fixedWidths = cardWidths
            .map(finiteNumber)
            .filter((width) => width !== undefined);
        const fillingCards = cards.filter(card => card.width === 'fill_container');
        let effectiveFixedWidths = fixedWidths.length === cards.length ? fixedWidths : undefined;
        if (fixedWidths.length > 0 && fillingCards.length > 0) {
            const fixedWidth = fixedWidths[0];
            if (fixedWidths.every(width => Math.abs(width - fixedWidth) <= GEOMETRY_EPSILON)) {
                collector.add('repeated-card-rail-width', path, type, 'horizontal repeated-card rail must not mix one consistent fixed card width with fill-container card widths.', MAX_RULE_ISSUES, true);
                for (const card of fillingCards)
                    repairTargets.addFlowSize(card, { width: fixedWidth });
                effectiveFixedWidths = cards.map(() => fixedWidth);
            }
            else {
                continue;
            }
        }
        let root = record;
        while (root.parent !== undefined)
            root = root.parent;
        const rootWidth = finiteNumber(root.node.width);
        const explicitScroller = node.clipContent === true || SCROLL_CONTAINER_RE.test(semanticText(node));
        if (rootWidth === undefined || rootWidth > MAX_COMPACT_ROOT_WIDTH || explicitScroller)
            continue;
        if (fixedWidths.length === 0 && fillingCards.length > 2) {
            collector.add('mobile-repeated-card-rail-overflow', path, type, 'compact horizontal product rail may use at most two fill-container cards unless it is an explicit clipped scroller.');
            continue;
        }
        if (effectiveFixedWidths === undefined)
            continue;
        const railPadding = paddingTuple(node) ?? [0, 0, 0, 0];
        const gap = Math.max(0, finiteNumber(node.gap) ?? 0);
        const authoredContentWidth = railPadding[1] + railPadding[3]
            + effectiveFixedWidths.reduce((sum, width) => sum + width, 0)
            + gap * Math.max(0, cards.length - 1);
        if (authoredContentWidth > rootWidth + GEOMETRY_EPSILON) {
            collector.add('mobile-repeated-card-rail-overflow', path, type, 'compact horizontal product rail with numeric card widths must fit the viewport or declare explicit clipped scroller intent.');
        }
    }
}
function hasUnresolvedSearchedImageSource(node) {
    if (nodeType(node) !== 'image'
        || typeof node.imageSearchQuery !== 'string'
        || node.imageSearchQuery.trim().length === 0)
        return false;
    if (node.src === undefined || node.src === null)
        return true;
    if (typeof node.src !== 'string')
        return false;
    const source = node.src.trim();
    return source.length === 0 || /^placeholder:\/\//iu.test(source);
}
function isSemanticMediaWrapper(node) {
    if (!STRUCTURAL_CONTAINER_TYPES.has(nodeType(node))
        || REPEATED_CARD_ROLES.has(authoredRole(node))
        || !MEDIA_WRAPPER_RE.test(semanticText(node)))
        return false;
    const height = finiteNumber(node.height);
    const width = finiteNumber(node.width);
    return height !== undefined
        && height > 0
        && ((width !== undefined && width > 0) || node.width === 'fill_container');
}
function soleUnresolvedImageMediaWrapper(record) {
    const wrapper = record.parent;
    if (wrapper === undefined || !isSemanticMediaWrapper(wrapper.node))
        return undefined;
    const children = Array.isArray(wrapper.node.children) ? wrapper.node.children.filter(isObject) : [];
    const leaves = children.flatMap(child => child === record.node ? [child] : visibleLeafNodes(child));
    return leaves.length === 1 && leaves[0] === record.node ? wrapper : undefined;
}
function inspectUnresolvedImages(records, collector, repairTargets) {
    for (const record of records) {
        if (!hasUnresolvedSearchedImageSource(record.node))
            continue;
        const imageCollapsed = isCollapsedNode(record.node);
        if (!imageCollapsed) {
            collector.add('unresolved-searched-image', record.path, record.type, 'image with an unresolved search source must be hidden and collapsed until a real source is available.', MAX_RULE_ISSUES, true);
            repairTargets.addCanvasContract(record.node, { visible: false, width: 0, height: 0 });
        }
        const card = record.parent;
        if (card !== undefined
            && REPEATED_CARD_ROLES.has(authoredRole(card.node))
            && finiteNumber(card.node.height) !== undefined) {
            if (imageCollapsed) {
                collector.add('collapsed-image-card-space', card.path, card.type, 'fixed product card containing a collapsed unresolved image must shrink to its remaining content.', MAX_RULE_ISSUES, true);
            }
            repairTargets.addFlowSize(card.node, { height: 'fit_content' });
            const rail = card.parent;
            if (rail !== undefined
                && finiteNumber(rail.node.height) !== undefined
                && (repeatedCardChildren(rail.node)?.includes(card.node) ?? false)) {
                repairTargets.addFlowSize(rail.node, { height: 'fit_content' });
            }
        }
        const mediaWrapper = soleUnresolvedImageMediaWrapper(record);
        if (mediaWrapper === undefined || isCollapsedNode(mediaWrapper.node))
            continue;
        collector.add('unresolved-media-wrapper', mediaWrapper.path, mediaWrapper.type, 'fixed media wrapper whose sole visible asset is an unresolved image must be hidden and collapsed.', MAX_RULE_ISSUES, true);
        repairTargets.addCanvasContract(mediaWrapper.node, { visible: false, width: 0, height: 0 });
        const section = mediaWrapper.parent;
        if (section !== undefined
            && (section.node.layout === 'horizontal' || section.node.layout === 'vertical')
            && finiteNumber(section.node.height) !== undefined
            && HERO_SECTION_RE.test(semanticText(section.node))) {
            repairTargets.addFlowSize(section.node, { height: 'fit_content' });
        }
    }
}
function inspectCommerceVisualSurvival(records, collector, repairTargets) {
    const directChildren = new Map();
    for (const record of records) {
        if (record.parent === undefined)
            continue;
        const children = directChildren.get(record.parent) ?? [];
        children.push(record);
        directChildren.set(record.parent, children);
    }
    for (const rail of records) {
        if (rail.node.layout !== 'horizontal'
            || !STRUCTURAL_CONTAINER_TYPES.has(rail.type))
            continue;
        const productCards = (directChildren.get(rail) ?? []).filter(record => (STRUCTURAL_CONTAINER_TYPES.has(record.type)
            && hasMeaningfulProductNameAndPrice(record.node)));
        if (!PRODUCT_RAIL_RE.test(semanticText(rail.node)) && productCards.length < 2)
            continue;
        const productCardSet = new Set(productCards);
        const searchedImages = records.filter((record) => {
            let ancestor = record.parent;
            let directCard;
            while (ancestor !== undefined && ancestor !== rail) {
                directCard = ancestor;
                ancestor = ancestor.parent;
            }
            return ancestor === rail
                && (PRODUCT_RAIL_RE.test(semanticText(rail.node)) || (directCard !== undefined && productCardSet.has(directCard)))
                && nodeType(record.node) === 'image'
                // An image already collapsed by the previous repair pass is settled:
                // counting it again would re-raise the same diagnostic after the
                // draft's single repair attempt and terminally block publication.
                && record.node.visible !== false
                && typeof record.node.imageSearchQuery === 'string'
                && record.node.imageSearchQuery.trim().length > 0;
        });
        if (searchedImages.length < 2)
            continue;
        const resolvedCount = searchedImages.filter(record => !hasUnresolvedSearchedImageSource(record.node)).length;
        if (resolvedCount < searchedImages.length) {
            if (repairTargets !== undefined) {
                // Stock providers are flaky; losing one image must not scrap the
                // whole publication. Collapse EVERY searched image in the rail so
                // the cards fall back to symmetric name+price tiles instead of an
                // asymmetric mix of photos and gray placeholders.
                for (const image of searchedImages) {
                    repairTargets.addCanvasContract(image.node, { visible: false, width: 0, height: 0 });
                }
            }
            collector.add('commerce-product-visual-survival', rail.path, rail.type, 'commerce product rail lost one or more requested product images during enrichment; collapse every searched rail image with its exact repair targets so the cards stay symmetric.', MAX_RULE_ISSUES, repairTargets !== undefined);
        }
    }
}
function commerceImageRegion(record) {
    let ancestor = record.parent;
    while (ancestor !== undefined) {
        const semantic = semanticText(ancestor.node);
        if (HERO_CONTAINER_RE.test(semantic))
            return 'hero';
        if (PRODUCT_RAIL_RE.test(semantic))
            return 'product';
        ancestor = ancestor.parent;
    }
    return undefined;
}
function inspectDistinctCommerceImages(records, collector) {
    const scoped = records
        .filter(record => record.type === 'image' && isAuthoredVisible(record.node))
        .map(record => ({ record, region: commerceImageRegion(record) }))
        .filter((entry) => entry.region !== undefined);
    if (!scoped.some(entry => entry.region === 'hero')
        || !scoped.some(entry => entry.region === 'product'))
        return;
    const seenQueries = new Set();
    const seenSources = new Set();
    for (const { record } of scoped) {
        const query = normalizedSemanticPart(record.node.imageSearchQuery);
        const source = typeof record.node.src === 'string' ? record.node.src.trim() : '';
        const duplicateQuery = query.length > 0 && seenQueries.has(query);
        const duplicateSource = source.length > 0
            && !/^placeholder:\/\//iu.test(source)
            && seenSources.has(source);
        if (duplicateQuery || duplicateSource) {
            collector.add('duplicate-commerce-image', record.path, record.type, 'commerce Hero and product cards must use distinct image queries and distinct resolved assets.');
        }
        if (query.length > 0)
            seenQueries.add(query);
        if (source.length > 0 && !/^placeholder:\/\//iu.test(source))
            seenSources.add(source);
    }
}
function visibleTextValues(node, excluded, depth = 0) {
    if (node === excluded || !isAuthoredVisible(node) || depth > MAX_ANCESTOR_SCAN)
        return [];
    const values = [];
    if (nodeType(node) === 'text') {
        const content = textContent(node)?.trim();
        if (content)
            values.push(content);
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            if (isObject(child))
                values.push(...visibleTextValues(child, excluded, depth + 1));
        }
    }
    return values;
}
function repeatedCardIconMedia(card) {
    if (!STRUCTURAL_CONTAINER_TYPES.has(nodeType(card)) || !Array.isArray(card.children))
        return undefined;
    const mediaWrappers = card.children.filter(child => isObject(child) && isSemanticMediaWrapper(child));
    if (mediaWrappers.length !== 1 || !isObject(mediaWrappers[0]))
        return undefined;
    const wrapper = mediaWrappers[0];
    const leaves = Array.isArray(wrapper.children)
        ? wrapper.children.filter(isObject).flatMap(child => visibleLeafNodes(child))
        : [];
    if (leaves.length !== 1 || nodeType(leaves[0]) !== 'icon_font')
        return undefined;
    const icon = leaves[0];
    if (typeof icon.iconFontName !== 'string' || icon.iconFontName.trim().length === 0)
        return undefined;
    const family = typeof icon.iconFontFamily === 'string' && icon.iconFontFamily.trim().length > 0
        ? icon.iconFontFamily.trim().toLocaleLowerCase('en-US')
        : 'lucide';
    const iconKey = `${family}:${icon.iconFontName.trim().toLocaleLowerCase('en-US')}`;
    const textValues = visibleTextValues(card, wrapper);
    const semanticCard = REPEATED_CARD_ROLES.has(authoredRole(card));
    const structuralProductCard = card.layout === 'vertical'
        && textValues.some(value => PRICE_TEXT_RE.test(value));
    if (!semanticCard && !structuralProductCard)
        return undefined;
    const labelKey = normalizedSemanticPart(card.name) || normalizedSemanticPart(textValues[0]);
    if (!labelKey)
        return undefined;
    return { wrapper, iconKey, labelKey };
}
function inspectDuplicateRepeatedCardIcons(records, collector, repairTargets) {
    for (const { node, path, type } of records) {
        if (node.layout !== 'horizontal'
            || isStructuralContainer(node)
            || HITBOX_ROLES.has(authoredRole(node))
            || HERO_CONTAINER_RE.test(semanticText(node))
            || !Array.isArray(node.children)
            || node.children.length < 2
            || !node.children.every(isObject))
            continue;
        const cardMedia = node.children.map(repeatedCardIconMedia);
        if (cardMedia.some(value => value === undefined))
            continue;
        const safeCardMedia = cardMedia;
        if (new Set(safeCardMedia.map(value => value.iconKey)).size === safeCardMedia.length
            || new Set(safeCardMedia.map(value => value.labelKey)).size !== safeCardMedia.length)
            continue;
        const cards = node.children;
        if (safeCardMedia.every((media, index) => (isLargeProductIconOnlyMedia(media.wrapper, cards[index], node))))
            continue;
        collector.add('duplicate-product-card-icon-art', path, type, 'repeated product cards reuse an icon glyph as fixed media art; collapse every peer media wrapper to keep the rail consistent.', MAX_RULE_ISSUES, true);
        for (const { wrapper } of safeCardMedia) {
            repairTargets.addCanvasContract(wrapper, { visible: false, width: 0, height: 0 });
        }
    }
}
function visibleCategoryIconKeys(node, depth = 0) {
    if (!isAuthoredVisible(node) || depth > MAX_ANCESTOR_SCAN)
        return [];
    const keys = [];
    if (nodeType(node) === 'icon_font'
        && typeof node.iconFontName === 'string'
        && node.iconFontName.trim().length > 0) {
        const family = typeof node.iconFontFamily === 'string' && node.iconFontFamily.trim().length > 0
            ? node.iconFontFamily.trim().toLocaleLowerCase('en-US')
            : 'lucide';
        keys.push(`${family}:${node.iconFontName.trim().toLocaleLowerCase('en-US')}`);
    }
    if (nodeType(node) === 'path' && typeof node.iconId === 'string' && node.iconId.trim().length > 0) {
        keys.push(node.iconId.trim().toLocaleLowerCase('en-US'));
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            if (isObject(child))
                keys.push(...visibleCategoryIconKeys(child, depth + 1));
        }
    }
    return [...new Set(keys)];
}
function hasVisibleCategoryVisual(node, depth = 0) {
    if (!isAuthoredVisible(node) || depth > MAX_ANCESTOR_SCAN)
        return false;
    const type = nodeType(node);
    if (type === 'text')
        return false;
    if (type === 'image') {
        const source = typeof node.src === 'string' ? node.src.trim() : '';
        return source.length > 0 && !/^placeholder:\/\//iu.test(source);
    }
    if (type === 'icon_font') {
        return typeof node.iconFontName === 'string' && node.iconFontName.trim().length > 0;
    }
    if (type === 'path') {
        return (typeof node.iconId === 'string' && node.iconId.trim().length > 0)
            || (typeof node.pathData === 'string' && node.pathData.trim().length > 0)
            || isVisiblePaint(node.fill)
            || isVisiblePaint(node.stroke);
    }
    if (hasVisibleImagePaint(node.fill))
        return true;
    if (['ellipse', 'line', 'polygon', 'rectangle', 'shape', 'star', 'vector'].includes(type)) {
        return isVisiblePaint(node.fill) || isVisiblePaint(node.stroke);
    }
    if (!Array.isArray(node.children))
        return false;
    return node.children.some(child => isObject(child) && hasVisibleCategoryVisual(child, depth + 1));
}
function categoryCardIntegrity(card) {
    const label = visibleTextValues(card)
        .map(normalizedSemanticPart)
        .find(value => value.length > 0);
    const directChildren = Array.isArray(card.children) ? card.children.filter(isObject) : [];
    const wrappedVisual = directChildren.find((child) => {
        if (!isAuthoredVisible(child) || !hasVisibleCategoryVisual(child))
            return false;
        const type = nodeType(child);
        if (type === 'image')
            return true;
        if (!STRUCTURAL_CONTAINER_TYPES.has(type))
            return false;
        const semantic = semanticText(child);
        const height = finiteNumber(child.height);
        const width = finiteNumber(child.width);
        return CATEGORY_VISUAL_RE.test(semantic)
            || ((height ?? 0) >= MIN_TOUCH_TARGET
                && ((width ?? 0) >= MIN_TOUCH_TARGET || child.width === 'fill_container'));
    });
    const directLabel = directChildren.some(child => (nodeType(child) === 'text'
        && isAuthoredVisible(child)
        && (textContent(child)?.trim().length ?? 0) > 0));
    const directVisualLeaves = directChildren.filter((child) => {
        const type = nodeType(child);
        return (type === 'image'
            || type === 'icon_font'
            || type === 'path'
            || ['ellipse', 'line', 'polygon', 'rectangle', 'shape', 'star', 'vector'].includes(type))
            && hasVisibleCategoryVisual(child);
    });
    const cardWidth = finiteNumber(card.width);
    const cardHeight = finiteNumber(card.height);
    const cardIsVisualTile = directLabel
        && directVisualLeaves.length > 0
        && (cardWidth ?? 0) >= MIN_TOUCH_TARGET
        && (cardHeight ?? 0) >= MIN_TOUCH_TARGET
        && !hasPlaceholderImagePaint(card.fill)
        && !hasPlaceholderImagePaint(card.stroke)
        && (hasVisibleNonImagePaint(card.fill)
            || hasVisibleNonImagePaint(card.stroke)
            || hasVisibleImagePaint(card.fill));
    const visual = wrappedVisual ?? (cardIsVisualTile ? card : undefined);
    const iconKeys = wrappedVisual !== undefined
        ? visibleCategoryIconKeys(wrappedVisual)
        : cardIsVisualTile
            ? directVisualLeaves.flatMap(child => visibleCategoryIconKeys(child))
            : [];
    return {
        labelKey: label,
        visual,
        iconKey: new Set(iconKeys).size === 1 ? iconKeys[0] : undefined,
    };
}
function hasInvisibleAncestor(record) {
    let ancestor = record.parent;
    while (ancestor !== undefined) {
        if (!isAuthoredVisible(ancestor.node))
            return true;
        ancestor = ancestor.parent;
    }
    return false;
}
function isCategoryRail(record, cards) {
    if (record.node.layout !== 'horizontal'
        || !STRUCTURAL_CONTAINER_TYPES.has(record.type)
        || isStructuralContainer(record.node)
        || HITBOX_ROLES.has(authoredRole(record.node))
        || HERO_CONTAINER_RE.test(semanticText(record.node))
        || PRODUCT_RAIL_RE.test(semanticText(record.node))
        || cards.length < 2
        || cards.some(card => (!STRUCTURAL_CONTAINER_TYPES.has(card.type)
            || HITBOX_ROLES.has(authoredRole(card.node))
            || REPEATED_CARD_ROLES.has(authoredRole(card.node))
            || (CATEGORY_CONTEXT_RE.test(semanticText(card.node))
                && Array.isArray(card.node.children)
                && card.node.children.filter(child => (isObject(child) && STRUCTURAL_CONTAINER_TYPES.has(nodeType(child)))).length >= 2))))
        return false;
    return CATEGORY_CONTEXT_RE.test(semanticText(record.node))
        || (record.parent !== undefined && CATEGORY_CONTEXT_RE.test(semanticText(record.parent.node)))
        || cards.every(card => CATEGORY_CARD_RE.test(semanticText(card.node)));
}
function inspectCategoryCardIntegrity(records, collector, repairTargets) {
    const directChildren = new Map();
    for (const record of records) {
        if (record.parent === undefined)
            continue;
        const children = directChildren.get(record.parent) ?? [];
        children.push(record);
        directChildren.set(record.parent, children);
    }
    for (const rail of records) {
        if (!isAuthoredVisible(rail.node) || hasInvisibleAncestor(rail))
            continue;
        const cards = (directChildren.get(rail) ?? []).filter(card => isAuthoredVisible(card.node));
        if (!isCategoryRail(rail, cards))
            continue;
        const padding = paddingTuple(rail.node);
        const authoredHeight = finiteNumber(rail.node.height);
        const cardHeights = cards.map(card => finiteNumber(card.node.height));
        if (padding !== undefined
            && authoredHeight !== undefined
            && cardHeights.every((height) => height !== undefined && height > 0)) {
            const exactContentHeight = padding[0] + Math.max(...cardHeights) + padding[2];
            if (authoredHeight - exactContentHeight >= MIN_REPEATED_CARD_RAIL_EMPTY_SPACE
                && authoredHeight >= exactContentHeight * MIN_REPEATED_CARD_RAIL_HEIGHT_RATIO) {
                collector.add('category-card-rail-height', rail.path, rail.type, 'fixed horizontal category rail height leaves excessive empty space around its visible cards.', MAX_RULE_ISSUES, true);
                repairTargets.addFlowSize(rail.node, { height: 'fit_content' });
            }
        }
        const integrity = cards.map(card => ({ card, ...categoryCardIntegrity(card.node) }));
        for (const card of integrity) {
            if (card.visual === undefined) {
                collector.add('category-card-visual', card.card.path, card.card.type, 'category card must include a visible visual tile with rendered image, shape, or icon content; no safe automatic visual can be inferred.');
            }
            if (card.labelKey === undefined) {
                collector.add('category-card-label', card.card.path, card.card.type, 'category card must include a visible non-empty text label; no safe automatic label can be inferred.');
            }
        }
        const iconCards = integrity.filter((card) => (card.labelKey !== undefined && card.iconKey !== undefined));
        const labelsByIcon = new Map();
        for (const card of iconCards) {
            const labels = labelsByIcon.get(card.iconKey) ?? new Set();
            labels.add(card.labelKey);
            labelsByIcon.set(card.iconKey, labels);
        }
        if ([...labelsByIcon.values()].some(labels => labels.size >= 2)) {
            collector.add('duplicate-category-card-icon', rail.path, rail.type, 'distinct category labels reuse the same sole icon glyph; no safe replacement glyph can be inferred, so publication must stop.');
        }
    }
}
function hasVisibleImagePaint(value) {
    const paints = Array.isArray(value) ? value : value === undefined ? [] : [value];
    return paints.some((paint) => {
        if (!isObject(paint) || paint.visible === false || paint.type !== 'image')
            return false;
        const opacity = paint.opacity === undefined ? 1 : finiteNumber(paint.opacity);
        if (opacity !== undefined && opacity <= 0)
            return false;
        const source = typeof paint.url === 'string'
            ? paint.url
            : typeof paint.src === 'string' ? paint.src : '';
        return source.trim().length > 0 && !/^placeholder:\/\//iu.test(source.trim());
    });
}
function hasPlaceholderImagePaint(value) {
    const paints = Array.isArray(value) ? value : value === undefined ? [] : [value];
    return paints.some((paint) => {
        if (!isObject(paint) || paint.type !== 'image')
            return false;
        const source = typeof paint.url === 'string'
            ? paint.url
            : typeof paint.src === 'string' ? paint.src : '';
        return /^placeholder:\/\//iu.test(source.trim());
    });
}
function hasVisibleNonImagePaint(value) {
    const paints = Array.isArray(value) ? value : value === undefined ? [] : [value];
    return paints.some((paint) => {
        if (!isObject(paint))
            return true;
        if (paint.visible === false || paint.type === 'image')
            return false;
        const opacity = paint.opacity === undefined ? 1 : finiteNumber(paint.opacity);
        return opacity === undefined || opacity > 0;
    });
}
function paintedStructuralLayerArea(node) {
    const type = nodeType(node);
    if (!isAuthoredVisible(node)
        || (!STRUCTURAL_CONTAINER_TYPES.has(type) && !COMPOSED_SHAPE_LAYER_TYPES.has(type)))
        return undefined;
    if (hasPlaceholderImagePaint(node.fill)
        || hasPlaceholderImagePaint(node.stroke)
        || (!hasVisibleNonImagePaint(node.fill) && !hasVisibleNonImagePaint(node.stroke)))
        return undefined;
    const width = finiteNumber(node.width);
    const height = finiteNumber(node.height);
    return width !== undefined && width > 0 && height !== undefined && height > 0
        ? width * height
        : undefined;
}
function hasSubstantivePaintedStructuralComposition(node) {
    const areas = [];
    const collect = (candidate, depth) => {
        if (depth > MAX_ANCESTOR_SCAN || !Array.isArray(candidate.children))
            return;
        for (const child of candidate.children) {
            if (!isObject(child))
                continue;
            const area = paintedStructuralLayerArea(child);
            if (area !== undefined)
                areas.push(area);
            collect(child, depth + 1);
        }
    };
    collect(node, 0);
    if (areas.length < 2)
        return false;
    return areas.length >= 3
        || areas.reduce((total, area) => total + area, 0) >= MIN_COMPOSED_MEDIA_PAINTED_AREA;
}
function hasPolishedPositionedHeroComposition(node) {
    if (node.layout !== 'none' || !Array.isArray(node.children))
        return false;
    const width = finiteNumber(node.width);
    const height = finiteNumber(node.height);
    if (width === undefined || height === undefined || width <= 0 || height <= 0)
        return false;
    const layers = node.children.filter((child) => (isObject(child) && paintedStructuralLayerArea(child) !== undefined));
    if (layers.length < 4)
        return false;
    const hasCurvedOrDrawnLayer = layers.some((layer) => {
        const type = nodeType(layer);
        return type === 'ellipse' || type === 'path';
    });
    if (!hasCurvedOrDrawnLayer)
        return false;
    return layers.every((layer) => {
        const x = finiteNumber(layer.x);
        const y = finiteNumber(layer.y);
        const layerWidth = finiteNumber(layer.width);
        const layerHeight = finiteNumber(layer.height);
        return x !== undefined
            && y !== undefined
            && layerWidth !== undefined
            && layerHeight !== undefined
            && x >= 0
            && y >= 0
            && layerWidth > 0
            && layerHeight > 0
            && x + layerWidth <= width + GEOMETRY_EPSILON
            && y + layerHeight <= height + GEOMETRY_EPSILON;
    });
}
function hasSubstantiveHeroVisual(node, depth = 0) {
    if (!isAuthoredVisible(node) || depth > MAX_ANCESTOR_SCAN)
        return false;
    const type = nodeType(node);
    if (type === 'image') {
        const source = typeof node.src === 'string' ? node.src.trim() : '';
        const query = typeof node.imageSearchQuery === 'string' ? node.imageSearchQuery.trim() : '';
        return source.length > 0 || query.length > 0;
    }
    if (isSemanticMediaWrapper(node) && hasPolishedPositionedHeroComposition(node))
        return true;
    if (!Array.isArray(node.children))
        return false;
    return node.children.some(child => isObject(child) && hasSubstantiveHeroVisual(child, depth + 1));
}
function primaryDesktopHeroRecords(records) {
    return records.filter((hero) => {
        if (!HERO_CONTAINER_RE.test(semanticText(hero.node))
            || !STRUCTURAL_CONTAINER_TYPES.has(hero.type))
            return false;
        let ancestor = hero.parent;
        while (ancestor !== undefined) {
            if (HERO_CONTAINER_RE.test(semanticText(ancestor.node)))
                return false;
            ancestor = ancestor.parent;
        }
        const root = records.find(record => record.parent === undefined && record.rootPath === hero.rootPath);
        const rootWidth = root === undefined ? undefined : finiteNumber(root.node.width);
        return rootWidth !== undefined && rootWidth >= 900;
    });
}
function directNestedDesktopHeroSplit(hero, records) {
    const directVisibleChildren = records.filter(record => (record.parent === hero
        && isAuthoredVisible(record.node)));
    if (directVisibleChildren.length !== 1)
        return undefined;
    const [candidate] = directVisibleChildren;
    return STRUCTURAL_CONTAINER_TYPES.has(candidate.type)
        && candidate.node.layout === 'horizontal'
        ? candidate
        : undefined;
}
function desktopHeroSplitRecord(hero, records) {
    return directNestedDesktopHeroSplit(hero, records)
        ?? (hero.node.layout === 'horizontal' ? hero : undefined);
}
function desktopHeroEffectiveWidth(hero, rootWidth) {
    return finiteNumber(hero.node.width)
        ?? (hero.node.width === 'fill_container' ? rootWidth : undefined);
}
function desktopHeroSplitEffectiveWidth(hero, split, rootWidth) {
    if (split === hero)
        return desktopHeroEffectiveWidth(hero, rootWidth);
    const heroWidth = desktopHeroEffectiveWidth(hero, rootWidth);
    const heroPadding = paddingTuple(hero.node) ?? [0, 0, 0, 0];
    const heroInnerWidth = heroWidth === undefined
        ? undefined
        : Math.max(0, heroWidth - heroPadding[1] - heroPadding[3]);
    return finiteNumber(split.node.width)
        ?? (split.node.width === 'fill_container' ? heroInnerWidth : undefined);
}
function inspectPrimaryDesktopHeroGeometry(records, collector) {
    for (const hero of primaryDesktopHeroRecords(records)) {
        const root = records.find(record => record.parent === undefined && record.rootPath === hero.rootPath);
        const rootWidth = root === undefined ? undefined : finiteNumber(root.node.width);
        const split = desktopHeroSplitRecord(hero, records);
        const heroEffectiveWidth = desktopHeroEffectiveWidth(hero, rootWidth);
        const splitEffectiveWidth = split === undefined
            ? undefined
            : desktopHeroSplitEffectiveWidth(hero, split, rootWidth);
        const geometryRecords = split === undefined || split === hero
            ? [{ record: hero, effectiveWidth: heroEffectiveWidth }]
            : [
                { record: hero, effectiveWidth: heroEffectiveWidth },
                { record: split, effectiveWidth: splitEffectiveWidth },
            ];
        for (const { record, effectiveWidth } of geometryRecords) {
            for (const axis of ['width', 'height']) {
                if (skipsMainAxisOverflow(record.node, axis))
                    continue;
                const available = finiteNumber(record.node[axis])
                    ?? (axis === 'width' && record.node.width === 'fill_container' ? effectiveWidth : undefined);
                if (available === undefined)
                    continue;
                const minimum = intrinsicDimension(record.node, axis, effectiveWidth, 0);
                if (minimum === undefined || minimum <= available + GEOMETRY_EPSILON)
                    continue;
                collector.add(`desktop-hero-flow-${axis}`, record.path, record.type, axis === 'width'
                    ? 'desktop commerce Hero columns overflow: copy width + right visual width + gap + horizontal padding must fit the available Hero width.'
                    : 'desktop commerce Hero visual overflows its fixed height: every visual layer plus vertical padding must fit inside the Hero height.', MAX_RULE_ISSUES);
            }
        }
        if (split === undefined || !Array.isArray(split.node.children))
            continue;
        const padding = paddingTuple(split.node) ?? [0, 0, 0, 0];
        const innerWidth = splitEffectiveWidth === undefined
            ? undefined
            : splitEffectiveWidth - padding[1] - padding[3];
        const visual = split.node.children.find((child) => (isObject(child) && hasSubstantiveHeroVisual(child)));
        const visualWidth = visual === undefined ? undefined : finiteNumber(visual.width);
        if (innerWidth === undefined || innerWidth <= 0 || visualWidth === undefined)
            continue;
        const visualRatio = visualWidth / innerWidth;
        if (visualRatio >= 0.36 && visualRatio <= 0.55)
            continue;
        collector.add('desktop-hero-visual-ratio', split.path, split.type, 'desktop commerce Hero visual must occupy about 40-50% of the inner width; a tiny side ornament or dominant visual makes the first viewport visibly unbalanced.', MAX_RULE_ISSUES);
    }
}
function inspectDesktopCommerceHeroComposition(records, collector, assumeCommerce = false) {
    const directChildren = new Map();
    for (const record of records) {
        if (record.parent === undefined)
            continue;
        const children = directChildren.get(record.parent) ?? [];
        children.push(record);
        directChildren.set(record.parent, children);
    }
    const commerceRoots = new Set(assumeCommerce
        ? records.filter(record => record.parent === undefined).map(record => record.rootPath)
        : []);
    for (const record of records) {
        if (record.node.layout !== 'horizontal' || !STRUCTURAL_CONTAINER_TYPES.has(record.type))
            continue;
        const productCards = (directChildren.get(record) ?? []).filter(child => (STRUCTURAL_CONTAINER_TYPES.has(child.type)
            && hasMeaningfulProductNameAndPrice(child.node)));
        if (PRODUCT_RAIL_RE.test(semanticText(record.node)) || productCards.length >= 2) {
            commerceRoots.add(record.rootPath);
        }
    }
    for (const hero of primaryDesktopHeroRecords(records)) {
        if (!commerceRoots.has(hero.rootPath))
            continue;
        const split = desktopHeroSplitRecord(hero, records);
        const heroChildren = (split === undefined ? [] : directChildren.get(split) ?? []).filter(child => (isAuthoredVisible(child.node)));
        if (split !== undefined
            && heroChildren.length >= 2
            && heroChildren.some(child => STRUCTURAL_CONTAINER_TYPES.has(child.type))
            && heroChildren.some(child => hasSubstantiveHeroVisual(child.node)))
            continue;
        collector.add('desktop-commerce-hero-composition', hero.path, hero.type, 'desktop commerce hero must use a horizontal copy/visual split with a substantive image or a positioned 4+ layer composition containing an ellipse/path; plain stacked rectangles or a full-width text stack leave a visibly empty, generic field.', MAX_RULE_ISSUES);
    }
}
function hasMeaningfulMediaContent(node, depth = 0) {
    if (!isAuthoredVisible(node))
        return false;
    if (depth > MAX_ANCESTOR_SCAN)
        return true;
    const type = nodeType(node);
    if (type === 'text')
        return (textContent(node)?.trim().length ?? 0) > 0;
    if (type === 'image') {
        const source = typeof node.src === 'string' ? node.src.trim() : '';
        return source.length > 0 && !/^placeholder:\/\//iu.test(source);
    }
    if (type === 'icon_font') {
        return typeof node.iconFontName === 'string' && node.iconFontName.trim().length > 0;
    }
    if (hasVisibleImagePaint(node.fill))
        return true;
    if (['ellipse', 'line', 'path', 'polygon', 'rectangle', 'shape', 'star', 'vector'].includes(type)) {
        return isVisiblePaint(node.fill)
            || isVisiblePaint(node.stroke)
            || (typeof node.pathData === 'string' && node.pathData.trim().length > 0)
            || (typeof node.iconId === 'string' && node.iconId.trim().length > 0);
    }
    if (depth === 0
        && isSemanticMediaWrapper(node)
        && hasSubstantivePaintedStructuralComposition(node))
        return true;
    if (!STRUCTURAL_CONTAINER_TYPES.has(type) && type !== 'node')
        return true;
    if (!Array.isArray(node.children))
        return false;
    return node.children.some(child => isObject(child) && hasMeaningfulMediaContent(child, depth + 1));
}
function containsUnresolvedSearchedImage(node, depth = 0) {
    if (depth > MAX_ANCESTOR_SCAN)
        return false;
    if (hasUnresolvedSearchedImageSource(node))
        return true;
    if (!Array.isArray(node.children))
        return false;
    return node.children.some(child => (isObject(child) && containsUnresolvedSearchedImage(child, depth + 1)));
}
function hasCollapsedAncestor(record) {
    let ancestor = record.parent;
    while (ancestor !== undefined) {
        if (isCollapsedNode(ancestor.node))
            return true;
        ancestor = ancestor.parent;
    }
    return false;
}
function emptyFixedMediaWrappers(records) {
    const candidates = new Set(records.filter(record => (!isCollapsedNode(record.node)
        && !hasCollapsedAncestor(record)
        && isSemanticMediaWrapper(record.node)
        && !containsUnresolvedSearchedImage(record.node)
        && !hasMeaningfulMediaContent(record.node))));
    return new Set([...candidates].filter((record) => {
        let ancestor = record.parent;
        while (ancestor !== undefined) {
            if (candidates.has(ancestor))
                return false;
            ancestor = ancestor.parent;
        }
        return true;
    }));
}
function hasMeaningfulProductNameAndPrice(card) {
    const textValues = visibleTextValues(card);
    const hasPrice = textValues.some(value => PRICE_TEXT_RE.test(value));
    const hasName = textValues.some((value) => {
        if (PRICE_TEXT_RE.test(value))
            return false;
        const normalized = normalizedSemanticPart(value);
        return normalized.length >= 2 && !PRODUCT_ACTION_TEXT_RE.test(normalized);
    });
    return hasName && hasPrice;
}
function largeMediaWidth(node, card) {
    const width = finiteNumber(node.width);
    if (width !== undefined)
        return width;
    const minWidth = finiteNumber(node.minWidth);
    if (node.width !== 'fill_container')
        return minWidth;
    const cardWidth = finiteNumber(card.width) ?? finiteNumber(card.minWidth);
    if (cardWidth !== undefined)
        return Math.max(cardWidth, minWidth ?? 0);
    // A fill-width media frame inside a fill-width card in an explicit
    // horizontal product rail has no numeric width in the authored tree. Use
    // only the minimum threshold as a conservative lower bound for the ratio
    // check; every other context remains unresolved and is left untouched.
    return card.width === 'fill_container'
        ? Math.max(MIN_PRODUCT_MEDIA_ICON_SHELL_SIZE, minWidth ?? 0)
        : minWidth;
}
function isLargeProductIconOnlyMedia(media, card, rail) {
    if (rail.layout !== 'horizontal'
        || !PRODUCT_RAIL_RE.test(semanticText(rail))
        || !STRUCTURAL_CONTAINER_TYPES.has(nodeType(card))
        || !hasMeaningfulProductNameAndPrice(card)
        || !isSemanticMediaWrapper(media)
        || isCollapsedNode(media)
        || containsUnresolvedSearchedImage(media))
        return false;
    const mediaHeight = finiteNumber(media.height);
    const mediaWidth = largeMediaWidth(media, card);
    if (mediaHeight === undefined
        || mediaWidth === undefined
        || mediaHeight < MIN_PRODUCT_MEDIA_ICON_SHELL_SIZE
        || mediaWidth < MIN_PRODUCT_MEDIA_ICON_SHELL_SIZE)
        return false;
    const leaves = visibleLeafNodes(media);
    if (leaves.length !== 1 || nodeType(leaves[0]) !== 'icon_font')
        return false;
    const iconWidth = finiteNumber(leaves[0].width);
    const iconHeight = finiteNumber(leaves[0].height);
    return iconWidth !== undefined
        && iconHeight !== undefined
        && iconWidth > 0
        && iconHeight > 0
        && iconWidth <= MAX_PRODUCT_MEDIA_ICON_SIZE
        && iconHeight <= MAX_PRODUCT_MEDIA_ICON_SIZE
        && iconWidth <= mediaWidth * MAX_PRODUCT_MEDIA_ICON_RATIO
        && iconHeight <= mediaHeight * MAX_PRODUCT_MEDIA_ICON_RATIO;
}
function inspectLargeProductIconOnlyMedia(records, collector, repairTargets) {
    const directChildren = new Map();
    for (const record of records) {
        if (record.parent === undefined)
            continue;
        const children = directChildren.get(record.parent) ?? [];
        children.push(record);
        directChildren.set(record.parent, children);
    }
    for (const rail of records) {
        if (isCollapsedNode(rail.node)
            || hasCollapsedAncestor(rail)
            || rail.node.layout !== 'horizontal'
            || !STRUCTURAL_CONTAINER_TYPES.has(rail.type)
            || !PRODUCT_RAIL_RE.test(semanticText(rail.node)))
            continue;
        const cards = (directChildren.get(rail) ?? []).filter(record => (!isCollapsedNode(record.node) && STRUCTURAL_CONTAINER_TYPES.has(record.type)));
        for (const card of cards) {
            const mediaChildren = (directChildren.get(card) ?? []).filter(record => (isLargeProductIconOnlyMedia(record.node, card.node, rail.node)));
            for (const media of mediaChildren) {
                collector.add('product-media-icon-shell', media.path, media.type, 'large fixed product media wrapper whose sole meaningful visual is a small icon glyph must be hidden to avoid a wireframe placeholder.', MAX_RULE_ISSUES, true);
                repairTargets.addCanvasContract(media.node, { visible: false, width: 0, height: 0 });
            }
        }
    }
}
function isHeadingOnlySectionSibling(node, depth = 0) {
    if (!isAuthoredVisible(node))
        return true;
    if (depth > MAX_ANCESTOR_SCAN)
        return false;
    const type = nodeType(node);
    if (type === 'text') {
        const content = textContent(node)?.trim() ?? '';
        return content.length > 0 && !PRICE_TEXT_RE.test(content);
    }
    if (!STRUCTURAL_CONTAINER_TYPES.has(type) || !Array.isArray(node.children))
        return false;
    const children = node.children.filter(isObject);
    return children.length > 0
        && children.every(child => isHeadingOnlySectionSibling(child, depth + 1));
}
function hasSemanticMediaDescendant(node, depth = 0) {
    if (depth > MAX_ANCESTOR_SCAN || !Array.isArray(node.children))
        return false;
    return node.children.some(child => (isObject(child)
        && (isSemanticMediaWrapper(child) || hasSemanticMediaDescendant(child, depth + 1))));
}
function collapsibleProductSection(rail) {
    const section = rail.parent;
    if (section === undefined
        || section.parent === undefined
        || isCollapsedNode(section.node)
        || !STRUCTURAL_CONTAINER_TYPES.has(section.type)
        || !PRODUCT_SECTION_RE.test(semanticText(section.node))
        || !Array.isArray(section.node.children))
        return undefined;
    const siblings = section.node.children.filter(isObject).filter(child => child !== rail.node);
    return siblings.every(isHeadingOnlySectionSibling) ? section : undefined;
}
function inspectEmptyMediaAndProductComposition(records, collector, repairTargets) {
    const emptyMedia = emptyFixedMediaWrappers(records);
    for (const record of emptyMedia) {
        collector.add('empty-fixed-media-wrapper', record.path, record.type, 'fixed media, art, photo, or image wrapper has no visible image, icon, shape, text, or control content and must be hidden.', MAX_RULE_ISSUES, true);
        repairTargets.addCanvasContract(record.node, { visible: false, width: 0, height: 0 });
    }
    const directChildren = new Map();
    for (const record of records) {
        if (record.parent === undefined)
            continue;
        const children = directChildren.get(record.parent) ?? [];
        children.push(record);
        directChildren.set(record.parent, children);
    }
    for (const rail of records) {
        if (isCollapsedNode(rail.node)
            || rail.node.layout !== 'horizontal'
            || !STRUCTURAL_CONTAINER_TYPES.has(rail.type)
            || !PRODUCT_RAIL_RE.test(semanticText(rail.node)))
            continue;
        const cards = (directChildren.get(rail) ?? []).filter(record => (!isCollapsedNode(record.node)
            && STRUCTURAL_CONTAINER_TYPES.has(record.type)
            && !HITBOX_ROLES.has(authoredRole(record.node))));
        if (!cards.some(record => hasSemanticMediaDescendant(record.node)))
            continue;
        const validCards = cards.filter(record => hasMeaningfulProductNameAndPrice(record.node));
        for (const card of cards) {
            if (validCards.includes(card))
                continue;
            collector.add('incomplete-product-card', card.path, card.type, 'product card has no meaningful visible product name and price and must be hidden.', MAX_RULE_ISSUES, true);
            repairTargets.addCanvasContract(card.node, { visible: false, width: 0, height: 0 });
        }
        if (validCards.length > 0)
            continue;
        collector.add('empty-product-rail', rail.path, rail.type, 'product rail has no valid visible product card and must be hidden with its heading-only section.', MAX_RULE_ISSUES, true);
        repairTargets.addCanvasContract(rail.node, { visible: false, width: 0, height: 0 });
        const section = collapsibleProductSection(rail);
        if (section !== undefined) {
            repairTargets.addCanvasContract(section.node, { visible: false, width: 0, height: 0 });
        }
    }
}
function emptySemanticActionContainers(records) {
    return new Set(records.filter(record => (STRUCTURAL_CONTAINER_TYPES.has(record.type)
        && !isStructuralContainer(record.node)
        && EMPTY_ACTION_CONTAINER_RE.test(semanticText(record.node))
        && !hasVisibleActionContent(record.node))));
}
function inspectEmptySemanticActions(records, collector, repairTargets) {
    for (const record of records) {
        if (isCollapsedNode(record.node))
            continue;
        collector.add('empty-semantic-action', record.path, record.type, 'semantic search, button, or call-to-action container has no visible text, icon, image, or control descendant and must be hidden.', MAX_RULE_ISSUES, true);
        repairTargets.addCanvasContract(record.node, { visible: false, width: 0, height: 0 });
    }
}
function inspectStructuralContainers(records, collector, repairTargets) {
    const hasVisibleDescendant = visibleDescendantMap(records);
    for (const record of records) {
        if (!isStructuralContainer(record.node) || hasVisibleDescendant.get(record) === true)
            continue;
        if (repairTargets !== undefined) {
            // An empty semantic band (a Header shell whose children landed as root
            // siblings) collapses safely: the visible content already lives
            // elsewhere, so hiding the shell rescues publication instead of
            // terminally failing the whole draft.
            repairTargets.addCanvasContract(record.node, { visible: false, width: 0, height: 0 });
        }
        collector.add('empty-structural-container', record.path, record.type, 'semantic header, navigation, footer, or toolbar container has no visible descendant; collapse the empty shell with its exact repair target.', MAX_RULE_ISSUES, repairTargets !== undefined);
    }
}
function inspectSemantics(records, collector, repairTargets, emptyActions) {
    for (const record of records) {
        if (emptyActions.has(record))
            continue;
        const { node, path, type } = record;
        if (type === 'text_input' && isPasswordSemantic(node) && node.secure !== true) {
            collector.add('password-secure', path, type, 'password text input must explicitly set secure to true.', MAX_RULE_ISSUES, true);
            repairTargets.addFormControl(node, { secure: true });
        }
        const role = authoredRole(node);
        if (HITBOX_ROLES.has(role)
            && (!dimensionHasMinimum(node, 'width') || !dimensionHasMinimum(node, 'height'))) {
            const patch = {};
            const missingAxes = [];
            if (!dimensionHasMinimum(node, 'width')) {
                if (finiteNumber(node.width) !== undefined)
                    patch.width = MIN_TOUCH_TARGET;
                else
                    patch.minWidth = MIN_TOUCH_TARGET;
                missingAxes.push('width');
            }
            if (!dimensionHasMinimum(node, 'height')) {
                if (finiteNumber(node.height) !== undefined)
                    patch.height = MIN_TOUCH_TARGET;
                else
                    patch.minHeight = MIN_TOUCH_TARGET;
                missingAxes.push('height');
            }
            const nodeId = typeof node.id === 'string' ? node.id : undefined;
            collector.add('touch-target', path, type, `${nodeId === undefined ? '' : `node ${nodeId} `}authored interactive role is missing a 44px minimum on ${missingAxes.join(' and ')}. Set minWidth/minHeight (keep fit_content sizing) rather than a fixed 44px width/height: a fixed 44 cannot hold horizontal padding plus a text child and will fail the container-flow check terminally.`, MAX_RULE_ISSUES, true);
            repairTargets.addTouchTarget(node, patch);
        }
        if (node.layout === 'horizontal'
            && CHECKBOX_ROW_ROLES.has(role)
            && containsNodeType(node, 'checkbox')
            && (!dimensionHasMinimum(node, 'width') || !dimensionHasMinimum(node, 'height'))) {
            collector.add('checkbox-wrapper', path, type, 'checkbox interaction row must provide a 44px wrapper hit box.', MAX_RULE_ISSUES, true);
            repairTargets.addTouchTarget(node, {
                ...(!dimensionHasMinimum(node, 'width')
                    ? finiteNumber(node.width) === undefined ? { minWidth: MIN_TOUCH_TARGET } : { width: MIN_TOUCH_TARGET }
                    : {}),
                ...(!dimensionHasMinimum(node, 'height')
                    ? finiteNumber(node.height) === undefined ? { minHeight: MIN_TOUCH_TARGET } : { height: MIN_TOUCH_TARGET }
                    : {}),
            });
        }
        if (!HITBOX_ROLES.has(role))
            continue;
        const semantic = providerText(node);
        const icons = providerIcons(node);
        if (WECHAT_RE.test(semantic) && !icons.some(icon => APPROVED_WECHAT_ICONS.has(icon))) {
            collector.add('wechat-icon', path, type, 'provider control must use the approved WeChat brand icon mapping.');
        }
        if (APPLE_RE.test(semantic) && !icons.some(icon => APPROVED_APPLE_ICONS.has(icon))) {
            collector.add('apple-icon', path, type, 'provider control must use the approved Apple brand icon mapping.');
        }
    }
}
function inspectDesktopCommerceHeaderInteractions(records, collector, repairTargets) {
    const visibleDirectChildren = (parent) => records.filter(record => (record.parent === parent && !isCollapsedNode(record.node)));
    for (const header of records) {
        if (!STRUCTURAL_CONTAINER_TYPES.has(header.type)
            || !DESKTOP_COMMERCE_HEADER_RE.test(semanticText(header.node)))
            continue;
        const children = visibleDirectChildren(header);
        const nav = children.find(record => NAV_LINKS_CONTAINER_RE.test(semanticText(record.node)));
        if (nav !== undefined) {
            if (authoredRole(nav.node) !== 'nav links') {
                collector.add('desktop-commerce-nav-container', nav.path, nav.type, 'desktop commerce navigation links must use one explicit role:"nav-links" collection so native role inference cannot treat the collection as one link.', 1);
            }
            const items = visibleDirectChildren(nav);
            if (items.some(item => item.type === 'text')) {
                collector.add('desktop-commerce-nav-items', nav.path, nav.type, 'desktop commerce navigation labels must live inside explicit role:"nav-link" frames with a 44px hit box, not as bare text children.', 1);
            }
            if (items.some(item => (STRUCTURAL_CONTAINER_TYPES.has(item.type) && authoredRole(item.node) !== 'nav link'))) {
                collector.add('desktop-commerce-nav-item-roles', nav.path, nav.type, 'every desktop commerce navigation item frame must explicitly use role:"nav-link".', 1);
            }
        }
        const actions = children.find(record => HEADER_ACTIONS_RE.test(semanticText(record.node)));
        if (actions !== undefined) {
            if (authoredRole(actions.node) !== 'toolbar') {
                collector.add('desktop-commerce-header-toolbar', actions.path, actions.type, 'desktop commerce header actions must explicitly use role:"toolbar".', 1);
            }
            const actionItems = visibleDirectChildren(actions);
            if (actionItems.some(item => item.type === 'icon_font')) {
                collector.add('desktop-commerce-bare-header-icons', actions.path, actions.type, 'desktop commerce header icons must live inside explicit 44x44 role:"icon-button" frames, not directly in the actions row.', 1);
            }
            if (actionItems.some(item => (STRUCTURAL_CONTAINER_TYPES.has(item.type) && authoredRole(item.node) !== 'icon button'))) {
                collector.add('desktop-commerce-header-action-roles', actions.path, actions.type, 'every desktop commerce header action frame must explicitly use role:"icon-button".', 1);
            }
        }
    }
    for (const cta of records) {
        if (!STRUCTURAL_CONTAINER_TYPES.has(cta.type)
            || !PRIMARY_CTA_RE.test(semanticText(cta.node)))
            continue;
        if (authoredRole(cta.node) !== 'button') {
            collector.add('desktop-commerce-primary-cta-role', cta.path, cta.type, 'the desktop commerce primary CTA must explicitly use role:"button".', 1);
        }
        if (!containsNodeType(cta.node, 'text')) {
            collector.add('desktop-commerce-primary-cta-label', cta.path, cta.type, 'the desktop commerce primary CTA must contain its visible text label as a descendant of the CTA binding.', 1);
        }
    }
    // Explicit nav-link, icon-button, and button roles are validated against
    // the same 44px rules used at finish, while the authored first batch is
    // still eligible for one atomic rollback and correction.
    inspectSemantics(records, collector, repairTargets, new Set());
}
function inspectNativeControls(records, collector, repairTargets) {
    for (const record of records) {
        const { node, path, type } = record;
        const isFormControl = type === 'text_input' || type === 'text_area' || type === 'select';
        if (record.inFormContext && isFormControl && !record.inCompactContext) {
            const horizontalActionRow = record.parent?.node.layout === 'horizontal';
            const patch = {};
            if (!horizontalActionRow && node.width !== 'fill_container') {
                collector.add('form-control-width', path, type, 'in a form must set width to "fill_container".', MAX_RULE_ISSUES, true);
                patch.width = 'fill_container';
            }
            if (type === 'text_area') {
                const height = finiteNumber(node.height);
                if (height === undefined || height < 88 || height > 240) {
                    collector.add('form-text-area-height', path, type, 'in a form must set an explicit multiline height from 88px through 240px.', MAX_RULE_ISSUES, true);
                    patch.height = 120;
                }
            }
            else {
                const height = finiteNumber(node.height);
                if (height === undefined || height < 44 || height > 52) {
                    collector.add('form-control-height', path, type, 'in a form must set an explicit height from 44px through 52px.', MAX_RULE_ISSUES, true);
                    patch.height = 44;
                }
            }
            repairTargets.addFormControl(node, patch);
        }
        const hasEmojiIconField = Object.entries(node).some(([key, value]) => (key !== 'children' && isIconField(key) && containsEmoji(value)));
        if (hasEmojiIconField) {
            collector.add('emoji-icon-field', path, type, 'icon interface field uses emoji; use icon_font or a component icon.');
        }
        const content = textContent(node);
        if (type === 'text' && isIconSemantic(node) && isEmojiOnly(content)) {
            collector.add('emoji-text-icon', path, type, 'text node used as an icon contains only emoji; use icon_font or a component icon.');
        }
    }
}
function inspectIconSizing(records, collector, repairTargets) {
    let missingSizeCount = 0;
    for (const record of records) {
        if (record.type !== 'icon_font')
            continue;
        const width = finiteNumber(record.node.width);
        const height = finiteNumber(record.node.height);
        const validWidth = width !== undefined && width > 0;
        const validHeight = height !== undefined && height > 0;
        if (validWidth && validHeight)
            continue;
        const knownAxis = validWidth ? width : validHeight ? height : 24;
        const fallback = Math.min(96, Math.max(12, knownAxis));
        repairTargets.addIconSize(record.node, {
            ...(validWidth ? {} : { width: fallback }),
            ...(validHeight ? {} : { height: fallback }),
        });
        missingSizeCount += 1;
    }
    if (missingSizeCount > 0) {
        collector.add('icon-size', 'iconography', 'icon_font', `${missingSizeCount} icon node${missingSizeCount === 1 ? '' : 's'} must set positive numeric width and height so the glyph renders; apply every safe icon-size repair target in one batch.`, 1, true);
    }
}
/**
 * Icon glyph names the editor canvas can actually resolve. Bundled from
 * OpenPencil's iconify catalogs by `scripts/build-icon-catalog.mjs`; an
 * off-catalog `iconFontName` renders as an invisible blank on the canvas
 * and in the published PNG, so it must be repaired before publication.
 */
let iconGlyphCatalog;
function loadIconGlyphCatalog() {
    if (iconGlyphCatalog !== undefined)
        return iconGlyphCatalog;
    const raw = JSON.parse(readFileSync(new URL('./assets/openpencil-design/icon-catalog.json', import.meta.url), 'utf8'));
    if (!isObject(raw))
        throw new Error('OpenPencil icon catalog asset is malformed');
    const catalog = new Map();
    for (const [collection, names] of Object.entries(raw)) {
        if (!Array.isArray(names))
            throw new Error('OpenPencil icon catalog asset is malformed');
        catalog.set(collection, new Set(names.filter((name) => typeof name === 'string')));
    }
    const lucide = catalog.get('lucide');
    if (lucide === undefined || lucide.size < 1000) {
        throw new Error('OpenPencil icon catalog asset is missing the lucide collection');
    }
    iconGlyphCatalog = catalog;
    return catalog;
}
/** Deterministic aliases for the glyph names generation plausibly invents. */
const ICON_GLYPH_ALIASES = new Map([
    ['cart', 'shopping-cart'],
    ['bag', 'shopping-bag'],
    ['basket', 'shopping-basket'],
    ['magnifier', 'search'],
    ['magnifying-glass', 'search'],
    ['chair', 'armchair'],
    ['couch', 'sofa'],
    ['loveseat', 'sofa'],
    ['bedroom', 'bed'],
    ['table', 'table-2'],
    ['desk', 'table-2'],
    ['favorite', 'heart'],
    ['favourite', 'heart'],
    ['like', 'heart'],
    ['profile', 'user'],
    ['account', 'user'],
    ['person', 'user'],
    ['hamburger', 'menu'],
    ['close', 'x'],
    ['cancel', 'x'],
    ['tick', 'check'],
    ['checkmark', 'check'],
    ['trash', 'trash-2'],
    ['bin', 'trash-2'],
    ['envelope', 'mail'],
    ['telephone', 'phone'],
    ['call', 'phone'],
    ['location', 'map-pin'],
    ['pin', 'map-pin'],
    ['photo', 'image'],
    ['picture', 'image'],
    ['gear', 'settings'],
    ['cog', 'settings'],
    ['bulb', 'lightbulb'],
    ['plant', 'flower'],
    ['decor', 'sparkles'],
    ['decoration', 'sparkles'],
    ['lighting', 'lamp'],
    ['money', 'banknote'],
    ['cash', 'banknote'],
    ['discount', 'percent'],
    ['graph', 'chart-line'],
    ['analytics', 'chart-line'],
    ['stats', 'chart-bar'],
    ['statistics', 'chart-bar'],
    ['dashboard', 'layout-dashboard'],
]);
function inferIconGlyph(name, lucide) {
    const candidates = [name];
    const dashed = name.replace(/_/g, '-');
    if (dashed !== name)
        candidates.push(dashed);
    for (const candidate of [...candidates]) {
        if (candidate.endsWith('-icon'))
            candidates.push(candidate.slice(0, -5));
        if (candidate.startsWith('icon-'))
            candidates.push(candidate.slice(5));
    }
    for (const candidate of [...candidates]) {
        if (candidate.endsWith('s') && candidate.length > 3)
            candidates.push(candidate.slice(0, -1));
    }
    // Lucide renamed its chart family from `<kind>-chart` to `chart-<kind>`
    // (bar-chart -> chart-bar); try the flipped two-part order and the
    // numeric-suffix-stripped base (`bar-chart-2` -> `chart-bar`).
    for (const candidate of [...candidates]) {
        const parts = candidate.split('-').filter(part => part.length > 0);
        const unnumbered = parts.filter(part => !/^\d+$/.test(part));
        if (unnumbered.length === 2) {
            candidates.push(`${unnumbered[1]}-${unnumbered[0]}`);
            if (unnumbered.length !== parts.length)
                candidates.push(unnumbered.join('-'));
        }
    }
    for (const candidate of candidates) {
        if (lucide.has(candidate))
            return candidate;
        const alias = ICON_GLYPH_ALIASES.get(candidate);
        if (alias !== undefined && lucide.has(alias))
            return alias;
    }
    return undefined;
}
function inspectIconGlyphCatalog(records, collector, repairTargets) {
    const catalog = loadIconGlyphCatalog();
    const lucide = catalog.get('lucide');
    let repairedCount = 0;
    for (const record of records) {
        if (record.type !== 'icon_font')
            continue;
        if (typeof record.node.iconFontName !== 'string')
            continue;
        const name = record.node.iconFontName.trim().toLocaleLowerCase('en-US');
        if (name.length === 0)
            continue;
        const family = typeof record.node.iconFontFamily === 'string' && record.node.iconFontFamily.trim().length > 0
            ? record.node.iconFontFamily.trim().toLocaleLowerCase('en-US')
            : 'lucide';
        const names = catalog.get(family);
        if (names !== undefined && names.has(name))
            continue;
        const fallback = inferIconGlyph(name, lucide);
        if (fallback !== undefined) {
            repairTargets.addIconGlyph(record.node, { iconFontName: fallback });
            repairedCount += 1;
            continue;
        }
        collector.add('icon-glyph', record.path, 'icon_font', `iconFontName ${JSON.stringify(record.node.iconFontName)} is not in the ${family} icon catalog and would render as an invisible blank; no safe replacement glyph can be inferred, so publication must stop.`);
    }
    if (repairedCount > 0) {
        collector.add('icon-glyph', 'iconography', 'icon_font', `${repairedCount} icon node${repairedCount === 1 ? ' uses' : 's use'} an off-catalog iconFontName that renders as an invisible blank; apply every exact icon-glyph repair target in one batch.`, 1, true);
    }
}
function inspectTextEncoding(records, collector, repairTargets) {
    let repairCount = 0;
    for (const record of records) {
        if (record.type !== 'text' || typeof record.node.content !== 'string')
            continue;
        const content = reversibleUtf8MojibakeRepair(record.node.content);
        if (content === undefined)
            continue;
        repairTargets.addCanvasContract(record.node, { content });
        repairCount += 1;
    }
    if (repairCount > 0) {
        collector.add('reversible-text-encoding', 'text-encoding', 'text', `${repairCount} text node${repairCount === 1 ? ' contains' : 's contain'} reversible UTF-8-as-Windows-1252 mojibake and must apply the exact decoded content repair.`, 1, true);
    }
}
function inspectTypography(roots, records, collector, repairTargets) {
    const rootFamilies = new Map();
    let missingTypographyCount = 0;
    let unportableInterCount = 0;
    let lowCjkLineHeightCount = 0;
    for (const record of records) {
        if (record.type !== 'text' || record.inStatusBar)
            continue;
        const { node } = record;
        const authoredFontFamily = typeof node.fontFamily === 'string' && node.fontFamily.trim()
            ? node.fontFamily
            : undefined;
        const family = authoredFontFamily === undefined
            ? undefined
            : canonicalFontFamily(authoredFontFamily);
        const fontSize = finiteNumber(node.fontSize);
        const lineHeight = finiteNumber(node.lineHeight);
        const hasFontSize = fontSize !== undefined && fontSize > 0;
        const hasLineHeight = lineHeight !== undefined && lineHeight > 0;
        const patch = {};
        if (family === undefined)
            patch.fontFamily = PORTABLE_FONT_STACK;
        if (family === 'inter' && authoredFontFamily !== undefined && !hasPortableSansFallback(authoredFontFamily)) {
            patch.fontFamily = PORTABLE_FONT_STACK;
            unportableInterCount += 1;
        }
        if (!hasFontSize)
            patch.fontSize = 16;
        if (!hasLineHeight)
            patch.lineHeight = 1.5;
        if (family === undefined || !hasFontSize || !hasLineHeight) {
            missingTypographyCount += 1;
        }
        if (family !== undefined) {
            const families = rootFamilies.get(record.rootPath) ?? new Set();
            families.add(family);
            rootFamilies.set(record.rootPath, families);
        }
        const content = textContent(node);
        if (content !== undefined && CJK_RE.test(content) && lineHeight !== undefined && lineHeight < 1.3) {
            lowCjkLineHeightCount += 1;
            patch.lineHeight = 1.5;
        }
        repairTargets.addTypography(node, patch);
    }
    if (missingTypographyCount > 0) {
        collector.add('explicit-typography', 'typography', 'text', `${missingTypographyCount} authored text node${missingTypographyCount === 1 ? '' : 's'} must explicitly set fontFamily, fontSize, and lineHeight; apply every safe typography repair target in one batch.`, 1, true);
    }
    if (unportableInterCount > 0) {
        collector.add('portable-web-font', 'typography', 'text', `${unportableInterCount} generated text node${unportableInterCount === 1 ? '' : 's'} use Inter without a portable generic fallback; replace it with the approved Inter, system-ui, sans-serif stack.`, 1, true);
    }
    if (lowCjkLineHeightCount > 0) {
        collector.add('cjk-line-height', 'typography', 'text', `${lowCjkLineHeightCount} CJK text node${lowCjkLineHeightCount === 1 ? '' : 's'} must use a lineHeight of at least 1.3; apply every safe typography repair target in one batch.`, 1, true);
    }
    for (const root of roots) {
        if ((rootFamilies.get(root.rootPath)?.size ?? 0) > 2) {
            collector.add('root-font-families', root.path, root.type, 'root must use no more than two normalized font families.', 2);
        }
    }
}
/**
 * Scale a bright backdrop toward black until pure white text passes the
 * required ratio, preserving its hue. Returns the hex, or undefined for
 * inputs that never converge (already near-black).
 */
function darkenUntilWhitePasses(background, required) {
    const white = { r: 1, g: 1, b: 1, a: 1 };
    let factor = 1;
    for (let step = 0; step < 24; step += 1) {
        const candidate = { r: background.r * factor, g: background.g * factor, b: background.b * factor, a: 1 };
        if (contrastRatio(white, candidate) >= required) {
            const to255 = (value) => Math.max(0, Math.min(255, Math.round(value * 255)));
            const hex = (value) => to255(value).toString(16).padStart(2, '0').toUpperCase();
            return `#${hex(candidate.r)}${hex(candidate.g)}${hex(candidate.b)}`;
        }
        factor *= 0.92;
    }
    return undefined;
}
/** Deterministic AA rescue colors: near-black ink and pure white. */
const CONTRAST_REPAIR_CANDIDATES = [
    { hex: '#1C1917', color: parseHexColor('#1C1917') },
    { hex: '#FFFFFF', color: parseHexColor('#FFFFFF') },
];
function inspectContrast(records, collector, repairTargets) {
    for (const record of records) {
        if (record.type !== 'text')
            continue;
        if (Array.isArray(record.node.content))
            continue;
        const background = ancestorBackground(record);
        if (background === undefined)
            continue;
        const foregroundFill = nodeFill(record.node);
        if (foregroundFill.kind !== 'solid')
            continue;
        const foreground = foregroundFill.color.a >= 1 - Number.EPSILON
            ? { ...foregroundFill.color, a: 1 }
            : composite(foregroundFill.color, background);
        const required = isLargeText(record.node) ? 3 : 4.5;
        if (contrastRatio(foreground, background) + Number.EPSILON < required) {
            // A failing solid-on-solid pair rescues deterministically. White-ish
            // text on a bright saturated backdrop (the model-invented accent
            // behind a CTA label) darkens the BACKGROUND owner instead of the
            // text: native finalization repaints accent-button labels white, so a
            // text recolor there is silently reverted on the next finish. Other
            // pairs recolor the text to ink/white, whichever passes.
            let repaired = false;
            if (repairTargets !== undefined) {
                const owner = ancestorBackgroundOwner(record);
                // Darkening is reserved for a saturated compact control surface (a
                // CTA/badge the model painted too bright). A neutral or page-scale
                // backdrop must never be repainted — white-on-white falls through
                // to the text recolor instead.
                const saturation = Math.max(background.r, background.g, background.b)
                    - Math.min(background.r, background.g, background.b);
                const ownerWidth = owner === undefined ? undefined : finiteNumber(owner.node.width);
                const ownerHeight = owner === undefined ? undefined : finiteNumber(owner.node.height);
                const compactSurface = owner !== undefined && (HITBOX_ROLES.has(normalizedSemanticPart(owner.node.role))
                    || (ownerWidth !== undefined && ownerHeight !== undefined
                        && ownerWidth <= 480 && ownerHeight <= 160));
                if (luminance(foreground) > 0.5 && saturation > 0.15 && compactSurface && owner !== undefined) {
                    const darkened = darkenUntilWhitePasses(background, required);
                    if (darkened !== undefined) {
                        repairTargets.addCanvasContract(owner.node, { fill: [{ type: 'solid', color: darkened }] });
                        repaired = true;
                    }
                }
                if (!repaired) {
                    let rescue;
                    let bestRatio = 0;
                    for (const candidate of CONTRAST_REPAIR_CANDIDATES) {
                        const ratio = contrastRatio(candidate.color, background);
                        if (ratio >= required && ratio > bestRatio) {
                            rescue = candidate.hex;
                            bestRatio = ratio;
                        }
                    }
                    if (rescue !== undefined) {
                        repairTargets.addContrast(record.node, { fill: [{ type: 'solid', color: rescue }] });
                        repaired = true;
                    }
                }
            }
            collector.add('text-contrast', record.path, record.type, repaired
                ? 'text does not meet WCAG AA contrast; apply its exact recolor repair target.'
                : 'text does not meet WCAG AA contrast for its authored size and weight.', 4, repaired);
        }
    }
}
/**
 * Inspect a generated OpenPencil document for high-confidence release-blocking
 * quality regressions. Diagnostics contain structural paths, sanitized node
 * types, and fixed guidance only; authored names, copy, values, and colors are
 * never reflected.
 */
function inspectGeneratedDesignQualityReportInternal(documentJson, draftStructureOnly, assumeDesktopCommerce = false) {
    let parsed;
    try {
        parsed = JSON.parse(documentJson);
    }
    catch {
        return {
            diagnostics: ['OpenPencil generated document is not valid JSON.'],
            unrepairableDiagnosticCount: 1,
            repairTargets: [],
            repairTargetSummary: { total: 0, returned: 0, omitted: 0 },
        };
    }
    if (!isObject(parsed)) {
        return {
            diagnostics: ['OpenPencil generated document must be a JSON object.'],
            unrepairableDiagnosticCount: 1,
            repairTargets: [],
            repairTargetSummary: { total: 0, returned: 0, omitted: 0 },
        };
    }
    const pending = documentRoots(parsed);
    if (pending === undefined) {
        return {
            diagnostics: ['OpenPencil generated document has no valid node tree.'],
            unrepairableDiagnosticCount: 1,
            repairTargets: [],
            repairTargetSummary: { total: 0, returned: 0, omitted: 0 },
        };
    }
    const collector = new IssueCollector();
    const repairTargets = new RepairTargetCollector();
    const tree = buildRecords(pending, collector);
    if (draftStructureOnly) {
        // Run immediately after the second generation batch, before native
        // finalization and image enrichment. These checks depend only on authored
        // composition, so an invalid batch can be rolled back without treating
        // expected unresolved image sources as defects.
        inspectCategoryCardIntegrity(tree.records, collector, repairTargets);
        inspectRepeatedCardRails(tree.records, collector, repairTargets);
        inspectDistinctCommerceImages(tree.records, collector);
        inspectLargeProductIconOnlyMedia(tree.records, collector, repairTargets);
        inspectDuplicateRepeatedCardIcons(tree.records, collector, repairTargets);
        inspectIconGlyphCatalog(tree.records, collector, repairTargets);
        inspectStructuralContainers(tree.records, collector);
        inspectEmptyMediaAndProductComposition(tree.records, collector, repairTargets);
        inspectDesktopCommerceHeroComposition(tree.records, collector, assumeDesktopCommerce);
        inspectPrimaryDesktopHeroGeometry(tree.records, collector);
        if (assumeDesktopCommerce) {
            // The first commerce viewport is already fully authored. Run the cheap
            // local geometry/contrast checks here so deterministic Header or CTA
            // defects roll back into the existing single correction path instead of
            // becoming a terminal finish result after batch two. This adds no native
            // quality, lint, layout, or render round trip on the healthy path.
            inspectContainerGeometry(tree.records, collector, repairTargets);
            inspectContrast(tree.records, collector);
            inspectDesktopCommerceHeaderInteractions(tree.records, collector, repairTargets);
        }
    }
    else {
        const emptyActions = emptySemanticActionContainers(tree.records);
        inspectRootGeometry(tree.roots, tree.records, collector);
        inspectContainerGeometry(tree.records, collector, repairTargets);
        inspectRepeatedCardRails(tree.records, collector, repairTargets);
        inspectUnresolvedImages(tree.records, collector, repairTargets);
        inspectCommerceVisualSurvival(tree.records, collector, repairTargets);
        inspectDistinctCommerceImages(tree.records, collector);
        inspectCategoryCardIntegrity(tree.records, collector, repairTargets);
        inspectLargeProductIconOnlyMedia(tree.records, collector, repairTargets);
        inspectDuplicateRepeatedCardIcons(tree.records, collector, repairTargets);
        inspectEmptyMediaAndProductComposition(tree.records, collector, repairTargets);
        inspectDesktopCommerceHeroComposition(tree.records, collector);
        inspectStructuralContainers(tree.records, collector, repairTargets);
        inspectEmptySemanticActions(emptyActions, collector, repairTargets);
        inspectSemantics(tree.records, collector, repairTargets, emptyActions);
        inspectNativeControls(tree.records, collector, repairTargets);
        inspectTextEncoding(tree.records, collector, repairTargets);
        inspectTypography(tree.roots, tree.records, collector, repairTargets);
        inspectIconSizing(tree.records, collector, repairTargets);
        inspectIconGlyphCatalog(tree.records, collector, repairTargets);
        inspectContrast(tree.records, collector, repairTargets);
    }
    return {
        diagnostics: collector.issues,
        unrepairableDiagnosticCount: collector.unrepairableDiagnosticCount,
        ...repairTargets.report(),
    };
}
export function inspectGeneratedDesignQualityReport(documentJson) {
    return inspectGeneratedDesignQualityReportInternal(documentJson, false);
}
/**
 * Inspect only authored card/category composition that must already be valid
 * after generation. Image sources and final layout are intentionally deferred
 * to the atomic finish path.
 */
export function inspectGeneratedDraftStructureReport(documentJson, assumeDesktopCommerce = false) {
    return inspectGeneratedDesignQualityReportInternal(documentJson, true, assumeDesktopCommerce);
}
export function inspectGeneratedDesignQuality(documentJson) {
    return inspectGeneratedDesignQualityReport(documentJson).diagnostics;
}
/** Reject a generated document without reflecting any document content. */
export function assertGeneratedDesignQuality(documentJson) {
    const issues = inspectGeneratedDesignQuality(documentJson);
    if (issues.length === 0)
        return;
    const prefix = `OpenPencil generated design failed quality checks (${issues.length} issue${issues.length === 1 ? '' : 's'}): `;
    const detailBudget = Math.max(0, MAX_ASSERT_MESSAGE_LENGTH - prefix.length);
    const details = issues.join(' ').slice(0, detailBudget);
    throw new Error(`${prefix}${details}`);
}
