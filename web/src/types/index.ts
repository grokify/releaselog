/**
 * Release type - matches the Go ReleaseType
 */
export type ReleaseType = 'release' | 'tag';

/**
 * A single release entry from the JSON IR
 */
export interface Release {
  id: number;
  repo_path: string;
  repo_owner: string;
  repo_name: string;
  type: ReleaseType;
  tag_name: string;
  name: string;
  body?: string;
  published_at?: string;
  created_at?: string;
  draft?: boolean;
  prerelease?: boolean;
  html_url?: string;
  tarball_url?: string;
  zipball_url?: string;
  author_login?: string;
  author_avatar_url?: string;
  assets?: Asset[];
  categories?: string[];
}

/**
 * Release asset
 */
export interface Asset {
  id: number;
  name: string;
  label?: string;
  content_type?: string;
  size?: number;
  download_count?: number;
  download_url?: string;
}

/**
 * Summary statistics
 */
export interface Stats {
  total_releases: number;
  total_repos: number;
  releases_by_month?: Record<string, number>;
  releases_by_repo?: Record<string, number>;
}

/**
 * The root release log structure from JSON IR
 */
export interface ReleaseLogData {
  ir_version: string;
  generated_at: string;
  sources?: string[];
  releases: Release[];
  stats?: Stats;
}

/**
 * Filter configuration
 */
export interface FilterConfig {
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

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig {
  field: keyof Release | string;
  direction: SortDirection;
}

/**
 * Column formatter function
 */
export type ColumnFormatter<T = unknown> = (
  value: T,
  release: Release,
  element: HTMLElement
) => string | HTMLElement;

/**
 * Column definition - similar to Tabulator
 */
export interface ColumnDefinition {
  /** The field name in the Release object */
  field: keyof Release | string;
  /** Display title for the column header */
  title: string;
  /** Column width (CSS value) */
  width?: string;
  /** Minimum width */
  minWidth?: string;
  /** Maximum width */
  maxWidth?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column is visible */
  visible?: boolean;
  /** CSS class for the column */
  cssClass?: string;
  /** Custom formatter function */
  formatter?: ColumnFormatter | 'link' | 'date' | 'badge' | 'avatar' | 'markdown';
  /** Formatter params */
  formatterParams?: Record<string, unknown>;
  /** Header filter type */
  headerFilter?: boolean | 'input' | 'select';
  /** Header filter params */
  headerFilterParams?: Record<string, unknown>;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Enable pagination */
  enabled: boolean;
  /** Page size */
  size: number;
  /** Show page size selector */
  sizeSelector?: boolean | number[];
  /** Pagination button count */
  buttonCount?: number;
}

/**
 * Layout mode
 */
export type LayoutMode = 'fitColumns' | 'fitData' | 'fitDataFill' | 'fitDataStretch';

/**
 * Event callback types
 */
export interface ReleaseLogEvents {
  /** Called when data is loaded */
  dataLoaded?: (data: ReleaseLogData) => void;
  /** Called when data loading fails */
  dataLoadError?: (error: Error) => void;
  /** Called when a release row is clicked */
  releaseClick?: (event: MouseEvent, release: Release) => void;
  /** Called when a release row is double-clicked */
  releaseDblClick?: (event: MouseEvent, release: Release) => void;
  /** Called when filters change */
  filterChange?: (filters: FilterConfig) => void;
  /** Called when sort changes */
  sortChange?: (sort: SortConfig) => void;
  /** Called when page changes */
  pageChange?: (page: number, pageSize: number) => void;
  /** Called after table is rendered */
  tableBuilt?: () => void;
}

/**
 * Main configuration options - Tabulator-like API
 */
export interface ReleaseLogOptions {
  // Data
  /** Release log data object */
  data?: ReleaseLogData;
  /** URL to fetch release log JSON from */
  ajaxURL?: string;
  /** AJAX request config */
  ajaxConfig?: RequestInit;

  // Layout
  /** Layout mode */
  layout?: LayoutMode;
  /** Responsive layout - hide columns on small screens */
  responsiveLayout?: boolean | 'hide' | 'collapse';
  /** Minimum table height */
  minHeight?: string;
  /** Maximum table height */
  maxHeight?: string;
  /** Placeholder text when no data */
  placeholder?: string;

  // Columns
  /** Column definitions - if not provided, uses defaults */
  columns?: ColumnDefinition[];
  /** Auto-generate columns from data */
  autoColumns?: boolean;

  // Sorting
  /** Initial sort configuration */
  initialSort?: SortConfig[];
  /** Enable header click sorting */
  headerSort?: boolean;

  // Filtering
  /** Initial filter configuration */
  initialFilter?: FilterConfig;
  /** Show filter controls */
  showFilters?: boolean;
  /** Filter control position */
  filterPosition?: 'top' | 'bottom';

  // Pagination
  /** Pagination configuration */
  pagination?: boolean | PaginationConfig;

  // Display options
  /** Show statistics summary */
  showStats?: boolean;
  /** Show table header */
  showHeader?: boolean;
  /** Row height */
  rowHeight?: string;
  /** Alternate row colors */
  alternateRowColors?: boolean;

  // Theming
  /** Theme name or custom CSS class */
  theme?: 'default' | 'dark' | 'minimal' | string;

  // Localization
  /** Locale for date formatting */
  locale?: string;
  /** Custom text labels */
  labels?: Partial<Labels>;

  // Events
  /** Event callbacks */
  events?: ReleaseLogEvents;

  // Advanced
  /** Custom CSS class for the container */
  cssClass?: string;
  /** Enable keyboard navigation */
  keybindings?: boolean;
  /** Render mode */
  renderMode?: 'virtual' | 'basic';
}

/**
 * Customizable text labels
 */
export interface Labels {
  // Filter labels
  filterPlaceholder: string;
  filterSince: string;
  filterUntil: string;
  filterRepo: string;
  filterType: string;
  filterAll: string;
  filterReleases: string;
  filterTags: string;
  filterClear: string;

  // Pagination labels
  pageFirst: string;
  pagePrev: string;
  pageNext: string;
  pageLast: string;
  pageSize: string;
  pageOf: string;

  // Stats labels
  statsTotal: string;
  statsRepos: string;

  // Misc
  loading: string;
  noData: string;
  error: string;
}

/**
 * Default labels
 */
export const DEFAULT_LABELS: Labels = {
  filterPlaceholder: 'Search releases...',
  filterSince: 'Since',
  filterUntil: 'Until',
  filterRepo: 'Repository',
  filterType: 'Type',
  filterAll: 'All',
  filterReleases: 'Releases',
  filterTags: 'Tags',
  filterClear: 'Clear filters',

  pageFirst: '<<',
  pagePrev: '<',
  pageNext: '>',
  pageLast: '>>',
  pageSize: 'Page size',
  pageOf: 'of',

  statsTotal: 'Total releases',
  statsRepos: 'Repositories',

  loading: 'Loading...',
  noData: 'No releases found',
  error: 'Error loading data',
};

/**
 * Default column definitions
 */
export const DEFAULT_COLUMNS: ColumnDefinition[] = [
  {
    field: 'published_at',
    title: 'Date',
    width: '120px',
    sortable: true,
    formatter: 'date',
  },
  {
    field: 'repo_path',
    title: 'Repository',
    width: '200px',
    sortable: true,
    formatter: 'link',
    formatterParams: { urlPrefix: 'https://github.com/' },
  },
  {
    field: 'tag_name',
    title: 'Version',
    width: '120px',
    sortable: true,
    formatter: 'link',
    formatterParams: { urlField: 'html_url' },
  },
  {
    field: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    field: 'type',
    title: 'Type',
    width: '80px',
    sortable: true,
    formatter: 'badge',
  },
  {
    field: 'prerelease',
    title: 'Pre',
    width: '50px',
    visible: false,
    formatter: 'badge',
  },
  {
    field: 'author_login',
    title: 'Author',
    width: '120px',
    formatter: 'avatar',
    visible: false,
  },
];
