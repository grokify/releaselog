import { Release, ReleaseLogData, ReleaseLogOptions, FilterConfig, SortDirection } from './types';
import { createReleaseHeatmap, createNavigableHeatmap, type HeatmapOptions } from './components/heatmap';
/**
 * ReleaseLog - A customizable release log viewer
 *
 * Similar API to Tabulator for familiarity:
 * ```typescript
 * const table = new ReleaseLog("#container", {
 *   ajaxURL: "releases.json",
 *   columns: [...],
 *   pagination: { enabled: true, size: 25 },
 *   events: {
 *     releaseClick: (e, release) => console.log(release)
 *   }
 * });
 * ```
 */
export declare class ReleaseLog {
    private container;
    private options;
    private data;
    private filteredData;
    private currentPage;
    private currentSort;
    private currentFilter;
    private labels;
    constructor(selector: string | HTMLElement, options?: ReleaseLogOptions);
    private mergeOptions;
    private init;
    /**
     * Load data from URL
     */
    loadData(url: string): Promise<void>;
    /**
     * Set data directly
     * Validates data with Zod schema if available, supports both camelCase and snake_case
     */
    setData(data: ReleaseLogData): void;
    /**
     * Get current data
     */
    getData(): ReleaseLogData | null;
    /**
     * Get filtered data
     */
    getFilteredData(): Release[];
    /**
     * Set filter
     */
    setFilter(filter: FilterConfig): void;
    /**
     * Add filter
     */
    addFilter(field: keyof FilterConfig, value: unknown): void;
    /**
     * Clear filters
     */
    clearFilter(): void;
    /**
     * Set sort
     */
    setSort(field: string, direction?: SortDirection): void;
    /**
     * Set page
     */
    setPage(page: number): void;
    /**
     * Get current page
     */
    getPage(): number;
    /**
     * Set page size
     */
    setPageSize(size: number): void;
    /**
     * Redraw the table
     */
    redraw(): void;
    /**
     * Destroy the table
     */
    destroy(): void;
    private applyFiltersAndSort;
    private getFieldValue;
    private render;
    private renderStats;
    private renderFilters;
    private renderTable;
    private renderHeaderCell;
    private renderRow;
    private renderCell;
    private formatValue;
    private renderPagination;
    private renderLoading;
    private renderPlaceholder;
    private renderError;
    private attachEventListeners;
    /**
     * Create a release activity heatmap in the specified container.
     * Requires cal-heatmap to be loaded.
     * @param container - Selector or element for the heatmap
     * @param options - Heatmap configuration options
     */
    createHeatmap(container: HTMLElement | string, options?: HeatmapOptions): ReturnType<typeof createReleaseHeatmap>;
    /**
     * Create a navigable heatmap with navigation controls.
     * @param container - Selector or element for the heatmap
     * @param options - Heatmap configuration options
     */
    createNavigableHeatmap(container: HTMLElement | string, options?: HeatmapOptions): ReturnType<typeof createNavigableHeatmap>;
    private getUniqueRepos;
    private formatDate;
    private formatDateInput;
    private escapeHtml;
    private renderBasicMarkdown;
}
//# sourceMappingURL=ReleaseLog.d.ts.map