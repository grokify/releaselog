# API Reference

Complete API documentation for ReleaseLog.

## ReleaseLog Class

### Constructor

```typescript
new ReleaseLog(selector: string | HTMLElement, options?: ReleaseLogOptions)
```

### Methods

#### Data Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `loadData` | `url: string` | `Promise<void>` | Load data from URL |
| `setData` | `data: ReleaseLogData` | `void` | Set data directly |
| `getData` | - | `ReleaseLogData \| null` | Get current data |
| `getFilteredData` | - | `Release[]` | Get filtered releases |

#### Filter Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setFilter` | `filter: FilterConfig` | `void` | Replace all filters |
| `addFilter` | `field: string, value: unknown` | `void` | Add single filter |
| `clearFilter` | - | `void` | Clear all filters |

#### Sort Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setSort` | `field: string, direction?: 'asc' \| 'desc'` | `void` | Set sort |

#### Pagination Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setPage` | `page: number` | `void` | Go to page |
| `getPage` | - | `number` | Get current page |
| `setPageSize` | `size: number` | `void` | Set page size |

#### Heatmap Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `createHeatmap` | `container: string \| HTMLElement, options?: HeatmapOptions` | `CalHeatmapInstance \| null` | Create heatmap |
| `createNavigableHeatmap` | `container: string \| HTMLElement, options?: HeatmapOptions` | `{ element, heatmap }` | Create heatmap with controls |

#### Other Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `redraw` | - | `void` | Re-render table |
| `destroy` | - | `void` | Clean up |

## Utility Functions

### Filter Utilities

```typescript
import {
  filterReleases,
  sortReleases,
  filterLatestPerDayPerRepo,
  filterLatestPerDayGlobal,
  applyFilters,
  getUniqueRepos,
  paginateReleases,
  getReleaseDateKey,
} from '@grokify/releaselog';
```

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `filterReleases` | `releases, options` | `Release[]` | Filter by search/repo/type |
| `sortReleases` | `releases, { field, direction }` | `Release[]` | Sort releases |
| `filterLatestPerDayPerRepo` | `releases` | `Release[]` | One per day per repo |
| `filterLatestPerDayGlobal` | `releases` | `Release[]` | One per day globally |
| `applyFilters` | `releases, filterOptions, sortOptions` | `Release[]` | Combined filter+sort |
| `getUniqueRepos` | `releases` | `string[]` | Get repo list |
| `paginateReleases` | `releases, page, pageSize` | `{ releases, startIndex, endIndex, totalPages }` | Paginate |
| `getReleaseDateKey` | `release` | `string` | Extract YYYY-MM-DD |

### Aggregation Utilities

```typescript
import {
  aggregateReleasesByDate,
  aggregateReleasesDetailed,
  getReleaseDateRange,
  getDefaultHeatmapRange,
  calculateColorScale,
  toCalHeatmapData,
  getAggregationStats,
} from '@grokify/releaselog';
```

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `aggregateReleasesByDate` | `releases, options?` | `Record<string, number>` | Count by date |
| `aggregateReleasesDetailed` | `releases, options?` | `Map<string, DailyReleaseData>` | Detailed by date |
| `getReleaseDateRange` | `releases` | `{ start, end }` | Date range |
| `getDefaultHeatmapRange` | - | `{ start, end }` | Last 12 months |
| `calculateColorScale` | `counts` | `number[]` | Quartile thresholds |
| `toCalHeatmapData` | `counts` | `Array<{ date, value }>` | Cal-heatmap format |
| `getAggregationStats` | `counts` | `{ totalDays, totalReleases, maxPerDay, avgPerDay, activeDays }` | Stats |

### Heatmap Functions

```typescript
import {
  createReleaseHeatmap,
  createNavigableHeatmap,
  defaultTooltipFormatter,
  createDetailedTooltipFormatter,
  isCalHeatmapAvailable,
  isTooltipPluginAvailable,
  destroyHeatmap,
} from '@grokify/releaselog';
```

### Schema Functions

```typescript
import {
  parseReleaseLog,
  safeParseReleaseLog,
} from '@grokify/releaselog';
```

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `parseReleaseLog` | `data: unknown` | `ReleaseLog` | Parse and validate (throws) |
| `safeParseReleaseLog` | `data: unknown` | `SafeParseReturnType` | Parse safely |

## Interfaces

### ReleaseLogOptions

```typescript
interface ReleaseLogOptions {
  data?: ReleaseLogData;
  ajaxURL?: string;
  ajaxConfig?: RequestInit;
  layout?: LayoutMode;
  responsiveLayout?: boolean | 'hide' | 'collapse';
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
  columns?: ColumnDefinition[];
  autoColumns?: boolean;
  initialSort?: SortConfig[];
  headerSort?: boolean;
  initialFilter?: FilterConfig;
  showFilters?: boolean;
  filterPosition?: 'top' | 'bottom';
  pagination?: boolean | PaginationConfig;
  showStats?: boolean;
  showHeader?: boolean;
  rowHeight?: string;
  alternateRowColors?: boolean;
  theme?: 'default' | 'dark' | 'minimal' | string;
  locale?: string;
  labels?: Partial<Labels>;
  events?: ReleaseLogEvents;
  cssClass?: string;
  keybindings?: boolean;
  renderMode?: 'virtual' | 'basic';
}
```

### FilterConfig

```typescript
interface FilterConfig {
  since?: Date | string;
  until?: Date | string;
  repo?: string;
  repos?: string[];
  owner?: string;
  type?: ReleaseType;
  categories?: string[];
  excludePrereleases?: boolean;
  excludeDrafts?: boolean;
  search?: string;
}
```

### HeatmapOptions

```typescript
interface HeatmapOptions {
  startDate?: Date;
  endDate?: Date;
  repos?: Set<string>;
  range?: number;
  colorScheme?: 'green' | 'blue' | 'purple' | 'orange';
  colorRange?: string[];
  cellSize?: number;
  cellGutter?: number;
  cellRadius?: number;
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  showLegend?: boolean;
  showTooltips?: boolean;
  tooltipFormatter?: (date: Date, value: number, dayjsDate: unknown) => string;
  onDataLoad?: (stats: AggregationStats) => void;
  onCellClick?: (date: Date, count: number, releases: Release[]) => void;
}
```
