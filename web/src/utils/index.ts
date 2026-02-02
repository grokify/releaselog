/**
 * ReleaseLog Utility Exports
 */

export {
  filterReleases,
  sortReleases,
  getReleaseDateKey,
  filterLatestPerDayPerRepo,
  filterLatestPerDayGlobal,
  applyFilters,
  getUniqueRepos,
  paginateReleases,
  type FilterOptions,
  type SortOptions,
} from './filters';

export {
  aggregateReleasesByDate,
  aggregateReleasesDetailed,
  getReleaseDateRange,
  getDefaultHeatmapRange,
  calculateColorScale,
  toCalHeatmapData,
  getAggregationStats,
  type DailyReleaseData,
  type AggregationOptions,
} from './aggregation';
