/**
 * ReleaseLog Aggregation Utilities
 *
 * Functions for aggregating release data by date, repo, etc.
 * Used primarily for heatmap visualization.
 */
import type { Release } from '../schemas';
/**
 * Release count data for a single day
 */
export interface DailyReleaseData {
    date: string;
    count: number;
    repos: string[];
    releases: Release[];
}
/**
 * Options for aggregating releases by date
 */
export interface AggregationOptions {
    /** Start date (inclusive) - defaults to 1 year ago */
    startDate?: Date;
    /** End date (inclusive) - defaults to today */
    endDate?: Date;
    /** Filter to specific repositories */
    repos?: Set<string>;
}
/**
 * Aggregate releases by date into a simple count object.
 * Returns data in the format expected by cal-heatmap.
 *
 * @example
 * const data = aggregateReleasesByDate(releases);
 * // { "2025-01-15": 3, "2025-01-16": 1, ... }
 */
export declare function aggregateReleasesByDate(releases: Release[], options?: AggregationOptions): Record<string, number>;
/**
 * Aggregate releases by date with full metadata.
 * Returns detailed data including which repos had releases.
 *
 * @example
 * const data = aggregateReleasesDetailed(releases);
 * // Map { "2025-01-15" => { date: "2025-01-15", count: 3, repos: ["a/b", "c/d"], releases: [...] } }
 */
export declare function aggregateReleasesDetailed(releases: Release[], options?: AggregationOptions): Map<string, DailyReleaseData>;
/**
 * Get the date range for releases (earliest to latest).
 */
export declare function getReleaseDateRange(releases: Release[]): {
    start: Date | null;
    end: Date | null;
};
/**
 * Get the default date range for heatmap (last 12 months).
 */
export declare function getDefaultHeatmapRange(): {
    start: Date;
    end: Date;
};
/**
 * Calculate color scale levels based on data distribution.
 * Uses quartiles to determine thresholds.
 */
export declare function calculateColorScale(counts: Record<string, number>): number[];
/**
 * Convert aggregated data to cal-heatmap data source format.
 * Cal-heatmap expects an array of objects with date and value properties.
 */
export declare function toCalHeatmapData(counts: Record<string, number>): Array<{
    date: string;
    value: number;
}>;
/**
 * Generate summary statistics for the aggregated data.
 */
export declare function getAggregationStats(counts: Record<string, number>): {
    totalDays: number;
    totalReleases: number;
    maxPerDay: number;
    avgPerDay: number;
    activeDays: number;
};
//# sourceMappingURL=aggregation.d.ts.map