/**
 * ReleaseLog Viewer
 *
 * A filterable, sortable release log viewer with heatmap.
 *
 * @example
 * ```html
 * <link rel="stylesheet" href="releaselog-viewer.css">
 * <script src="releaselog-viewer.js"></script>
 * <div id="releases"></div>
 * <script>
 *   new ReleaseLogViewer('#releases', {
 *     url: 'releases.json',
 *     showHeatmap: true
 *   });
 * </script>
 * ```
 */
import type { ViewerOptions, NormalizedRelease } from './types';
/**
 * ReleaseLogViewer - A filterable, sortable release log viewer with heatmap
 */
export declare class ReleaseLogViewer {
    /** Version string */
    static readonly version = "0.1.0";
    /** Container element */
    private container;
    /** Configuration options */
    private options;
    /** Viewer state */
    private state;
    /** Heatmap state */
    private heatmap;
    /** Unique instance ID */
    private id;
    /**
     * Create a new ReleaseLogViewer
     * @param container - CSS selector or DOM element
     * @param options - Configuration options
     */
    constructor(container: string | HTMLElement, options?: ViewerOptions);
    /**
     * Initialize the viewer
     */
    private init;
    /**
     * Bind global event listeners
     */
    private bindGlobalEvents;
    /**
     * Load data from URL
     */
    loadUrl(url: string): void;
    /**
     * Load data directly
     */
    private loadData;
    /**
     * Normalize a release object to consistent format
     */
    private normalizeRelease;
    /**
     * Compute aggregated data for heatmap
     */
    private computeAggregatedData;
    /**
     * Calculate color scale based on data distribution
     */
    private calculateColorScale;
    /**
     * Initialize the heatmap
     */
    private initHeatmap;
    /**
     * Hide future cells in heatmap
     */
    private hideFutureCells;
    /**
     * Bind heatmap events
     */
    private bindHeatmapEvents;
    /**
     * Update heatmap navigation button states
     */
    private updateHeatmapNavButtons;
    /**
     * Handle heatmap cell click
     */
    private handleHeatmapClick;
    /**
     * Update date filter indicator
     */
    private updateDateFilterIndicator;
    /**
     * Close repository filter dropdown
     */
    private closeRepoFilter;
    /**
     * Restore repository filter state after re-render
     */
    private restoreRepoFilterState;
    /**
     * Apply filters and sort to releases
     */
    private applyFilters;
    /**
     * Get unique repositories
     */
    private getUniqueRepos;
    /**
     * Show a message in the content area
     */
    private showMessage;
    /**
     * Render the full viewer
     */
    private render;
    /**
     * Update just the table section
     */
    private updateTable;
    /**
     * Bind table event listeners
     */
    private bindTableEvents;
    /**
     * Format a date string for display
     */
    private formatDate;
    /**
     * Escape HTML special characters
     */
    private escapeHtml;
    /**
     * Set data directly
     */
    setData(data: unknown): void;
    /**
     * Refresh by reloading from current URL
     */
    refresh(): void;
    /**
     * Get filtered releases
     */
    getFilteredReleases(): NormalizedRelease[];
    /**
     * Set date filter
     */
    setDateFilter(date: string | null): void;
    /**
     * Clear date filter
     */
    clearDateFilter(): void;
    /**
     * Destroy the viewer and clean up
     */
    destroy(): void;
}
//# sourceMappingURL=ReleaseLogViewer.d.ts.map