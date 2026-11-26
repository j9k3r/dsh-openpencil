declare const PORTABLE_FONT_STACK: "Inter, system-ui, sans-serif";
export interface GeneratedDesignQualityRepairTarget {
    nodeId: string;
    operation: 'U';
    rule: 'typography' | 'form-control' | 'icon-size' | 'icon-glyph' | 'contrast' | 'flow-size' | 'touch-target' | 'canvas-contract';
    patch: {
        fontFamily?: typeof PORTABLE_FONT_STACK;
        fontSize?: 16;
        lineHeight?: 1.5;
        width?: number | 'fill_container';
        height?: number | 'fit_content';
        minWidth?: number;
        minHeight?: number;
        secure?: true;
        visible?: false;
        content?: string;
        iconFontName?: string;
        fill?: [{
            type: 'solid';
            color: string;
        }];
    };
}
export interface GeneratedDesignQualityReport {
    diagnostics: string[];
    unrepairableDiagnosticCount: number;
    repairTargets: GeneratedDesignQualityRepairTarget[];
    repairTargetSummary: {
        total: number;
        returned: number;
        omitted: number;
    };
}
export declare function inspectGeneratedDesignQualityReport(documentJson: string): GeneratedDesignQualityReport;
/**
 * Inspect only authored card/category composition that must already be valid
 * after generation. Image sources and final layout are intentionally deferred
 * to the atomic finish path.
 */
export declare function inspectGeneratedDraftStructureReport(documentJson: string, assumeDesktopCommerce?: boolean): GeneratedDesignQualityReport;
export declare function inspectGeneratedDesignQuality(documentJson: string): string[];
/** Reject a generated document without reflecting any document content. */
export declare function assertGeneratedDesignQuality(documentJson: string): void;
export {};
