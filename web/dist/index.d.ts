/**
 * @grokify/releaselog
 *
 * A customizable release log viewer for websites.
 * Similar API to Tabulator for familiarity.
 *
 * @example
 * ```typescript
 * import { ReleaseLog } from '@grokify/releaselog';
 *
 * const table = new ReleaseLog("#releases", {
 *   ajaxURL: "releases.json",
 *   pagination: { enabled: true, size: 25 },
 *   events: {
 *     releaseClick: (e, release) => window.open(release.html_url)
 *   }
 * });
 * ```
 *
 * @example UMD/Browser
 * ```html
 * <script src="releaselog.umd.js"></script>
 * <script>
 *   const table = new ReleaseLog.ReleaseLog("#releases", {
 *     ajaxURL: "releases.json"
 *   });
 * </script>
 * ```
 */
export { ReleaseLog } from './ReleaseLog';
export type { Release, ReleaseType, Asset, Stats, ReleaseLogData, FilterConfig, SortConfig, SortDirection, ColumnDefinition, ColumnFormatter, PaginationConfig, LayoutMode, ReleaseLogOptions, ReleaseLogEvents, Labels, } from './types';
export { DEFAULT_LABELS, DEFAULT_COLUMNS } from './types';
export { AuthorSchema, DownloadSchema, ReleaseURLsSchema, ReleaseTypeSchema, ReleaseSchema, StatsSchema, ReleaseLogSchema, ReleaseLegacySchema, ReleaseLogLegacySchema, parseReleaseLog, safeParseReleaseLog, type Author, type Download, type ReleaseURLs, type Release as SchemaRelease, type Stats as SchemaStats, type ReleaseLog as SchemaReleaseLog, } from './schemas';
export { filterReleases, sortReleases, getReleaseDateKey, filterLatestPerDayPerRepo, filterLatestPerDayGlobal, applyFilters, getUniqueRepos, paginateReleases, aggregateReleasesByDate, aggregateReleasesDetailed, getReleaseDateRange, getDefaultHeatmapRange, calculateColorScale, toCalHeatmapData, getAggregationStats, type FilterOptions, type SortOptions, type DailyReleaseData, type AggregationOptions, } from './utils';
export { createReleaseHeatmap, createNavigableHeatmap, defaultTooltipFormatter, createDetailedTooltipFormatter, isCalHeatmapAvailable, isTooltipPluginAvailable, destroyHeatmap, type HeatmapOptions, } from './components';
//# sourceMappingURL=index.d.ts.map