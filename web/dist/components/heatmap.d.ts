/**
 * ReleaseLog Heatmap Component
 *
 * A wrapper around cal-heatmap for displaying release activity.
 * Cal-heatmap must be loaded separately (it's an optional peer dependency).
 */
import type { Release } from '../schemas';
import { getAggregationStats, type DailyReleaseData } from '../utils/aggregation';
interface CalHeatmapDomainEntry {
    t: number;
    x: number;
    y: number;
    v: number | null;
}
interface CalHeatmapDomainCollection {
    collection: Map<number, CalHeatmapDomainEntry[]>;
    keys: number[];
    min: number;
    max: number;
}
interface CalHeatmapInstance {
    paint: (options: CalHeatmapOptions, plugins?: CalHeatmapPlugin[]) => Promise<void>;
    destroy: () => Promise<void>;
    next: (n?: number) => Promise<void>;
    previous: (n?: number) => Promise<void>;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    domainCollection?: CalHeatmapDomainCollection;
}
interface CalHeatmapOptions {
    itemSelector?: HTMLElement;
    data?: {
        source: unknown;
        x: string | ((d: unknown) => Date);
        y: string | ((d: unknown) => number);
    };
    date?: {
        start?: Date;
        locale?: string;
        timezone?: string;
    };
    range?: number;
    scale?: {
        color?: {
            type?: string;
            scheme?: string;
            domain?: number[];
            range?: string[];
        };
    };
    domain?: {
        type?: string;
        gutter?: number;
        label?: {
            text?: string;
            position?: string;
        };
    };
    subDomain?: {
        type?: string;
        width?: number;
        height?: number;
        gutter?: number;
        radius?: number;
    };
    [key: string]: unknown;
}
type CalHeatmapPlugin = [unknown, Record<string, unknown>?];
interface TooltipPluginConstructor {
    new (): unknown;
}
declare global {
    interface Window {
        CalHeatmap?: new () => CalHeatmapInstance;
        Tooltip?: TooltipPluginConstructor;
    }
}
/**
 * Heatmap configuration options
 */
export interface HeatmapOptions {
    /** Start date for the heatmap (defaults to 1 year ago) */
    startDate?: Date;
    /** End date for the heatmap (defaults to today) */
    endDate?: Date;
    /** Filter to specific repositories */
    repos?: Set<string>;
    /** Number of months to display (default: 12) */
    range?: number;
    /** Color scheme: 'green' (default), 'blue', 'purple', 'orange' */
    colorScheme?: 'green' | 'blue' | 'purple' | 'orange';
    /** Custom color range (5 colors from empty to max) */
    colorRange?: string[];
    /** Cell size in pixels (default: 11) */
    cellSize?: number;
    /** Gap between cells (default: 2) */
    cellGutter?: number;
    /** Cell border radius (default: 2) */
    cellRadius?: number;
    /** Show month labels (default: true) */
    showMonthLabels?: boolean;
    /** Show day labels (default: true) */
    showDayLabels?: boolean;
    /** Show legend (default: true) */
    showLegend?: boolean;
    /** Enable tooltips (default: true, requires Tooltip plugin) */
    showTooltips?: boolean;
    /** Custom tooltip formatter */
    tooltipFormatter?: (date: Date, value: number, dayjsDate: unknown) => string;
    /** Called when data is loaded */
    onDataLoad?: (stats: ReturnType<typeof getAggregationStats>) => void;
    /** Called when a cell is clicked */
    onCellClick?: (date: Date, count: number, releases: Release[]) => void;
}
/**
 * Default tooltip formatter
 */
export declare function defaultTooltipFormatter(_date: Date, value: number, dayjsDate: {
    format: (fmt: string) => string;
}): string;
/**
 * Create a detailed tooltip formatter that shows repo names
 */
export declare function createDetailedTooltipFormatter(detailedData: Map<string, DailyReleaseData>): (date: Date, value: number, dayjsDate: {
    format: (fmt: string) => string;
}) => string;
/**
 * Create a release activity heatmap.
 *
 * Requires cal-heatmap to be loaded:
 * - NPM: `npm install cal-heatmap`
 * - CDN: `<script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>`
 *
 * For tooltips, also load the Tooltip plugin:
 * - CDN: `<script src="https://unpkg.com/cal-heatmap/dist/plugins/Tooltip.min.js"></script>`
 *
 * @example
 * ```javascript
 * import { createReleaseHeatmap } from '@grokify/releaselog';
 *
 * const heatmap = createReleaseHeatmap(
 *   document.getElementById('heatmap'),
 *   releases,
 *   { colorScheme: 'green', range: 12 }
 * );
 * ```
 */
export declare function createReleaseHeatmap(container: HTMLElement | string, releases: Release[], options?: HeatmapOptions): CalHeatmapInstance | null;
/**
 * Create heatmap with navigation controls.
 * Returns the container element with the heatmap and navigation buttons.
 */
export declare function createNavigableHeatmap(container: HTMLElement | string, releases: Release[], options?: HeatmapOptions): {
    element: HTMLElement;
    heatmap: CalHeatmapInstance | null;
};
/**
 * Hide future date cells from a cal-heatmap instance.
 * Cal-heatmap renders full months, so this hides cells beyond today.
 */
export declare function hideFutureCells(heatmap: CalHeatmapInstance, container: HTMLElement): void;
/**
 * Check if cal-heatmap is available.
 */
export declare function isCalHeatmapAvailable(): boolean;
/**
 * Check if the Tooltip plugin is available.
 */
export declare function isTooltipPluginAvailable(): boolean;
/**
 * Destroy a heatmap instance and clean up.
 */
export declare function destroyHeatmap(heatmap: CalHeatmapInstance | null): Promise<void>;
export {};
//# sourceMappingURL=heatmap.d.ts.map