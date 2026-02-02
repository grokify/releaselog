/**
 * ReleaseLog Viewer Types
 *
 * TypeScript type definitions for the standalone viewer component.
 */
/**
 * Normalized release object used internally by the viewer.
 * Supports both camelCase (spec) and snake_case (legacy) field access.
 */
export interface NormalizedRelease {
    id?: number;
    repoPath: string;
    repoOwner: string;
    repoName: string;
    type: 'release' | 'tag';
    tagName: string;
    name: string;
    body?: string;
    publishedAt?: string;
    createdAt?: string;
    draft?: boolean;
    prerelease?: boolean;
    urls?: {
        githubRelease?: string;
        releaseNotes?: string;
        changelog?: string;
        diff?: string;
    };
    author?: {
        login: string;
        avatarUrl?: string;
        profileUrl?: string;
    };
    previousVersion?: string;
    htmlUrl?: string;
    authorLogin?: string;
    categories?: string[];
}
/**
 * Detailed data for a single day (used for tooltips and filtering)
 */
export interface DayData {
    count: number;
    repos: string[];
    releases: NormalizedRelease[];
}
/**
 * Viewer configuration options
 */
export interface ViewerOptions {
    /** URL to load release data from */
    url?: string;
    /** Inline release data object */
    data?: unknown;
    /** Number of releases per page (default: 25) */
    pageSize?: number;
    /** Show release name column (default: false) */
    showReleaseName?: boolean;
    /** Show type column (default: false) */
    showType?: boolean;
    /** Show all releases per day (default: false, shows only latest per repo per day) */
    showAllPerDay?: boolean;
    /** Show URL input bar (default: true) */
    showUrlBar?: boolean;
    /** Show header with metadata (default: true) */
    showHeader?: boolean;
    /** Show heatmap visualization (default: true) */
    showHeatmap?: boolean;
    /** Show heatmap help tooltip (default: true) */
    showHeatmapHelp?: boolean;
    /** Number of months to display in heatmap (default: 12) */
    heatmapRange?: number;
    /** Custom heatmap colors array [level0, level1, level2, level3, level4] */
    heatmapColors?: string[];
    /** Callback when data loads successfully */
    onLoad?: (data: unknown) => void;
    /** Callback when data loading fails */
    onError?: (error: Error) => void;
    /** Callback when a date is filtered via heatmap click */
    onDateFilter?: (date: string | null, data?: DayData) => void;
}
/**
 * Internal viewer state
 */
export interface ViewerState {
    /** All releases (normalized) */
    releases: NormalizedRelease[];
    /** Filtered releases */
    filteredReleases: NormalizedRelease[];
    /** Current page number (1-indexed) */
    currentPage: number;
    /** Page size */
    pageSize: number;
    /** Sort field */
    sortField: keyof NormalizedRelease;
    /** Sort direction */
    sortDir: 'asc' | 'desc';
    /** Search query */
    searchQuery: string;
    /** Selected repositories filter */
    repoFilter: Set<string>;
    /** Repository filter dropdown open state */
    repoFilterOpen: boolean;
    /** Repository search query in dropdown */
    repoSearchQuery: string;
    /** Type filter */
    typeFilter: string;
    /** Date filter (from heatmap click) */
    dateFilter: string | null;
    /** Show release name column */
    showReleaseName: boolean;
    /** Show type column */
    showType: boolean;
    /** Show all releases per day */
    showAllPerDay: boolean;
    /** Spec version from data */
    specVersion: string;
    /** Data sources */
    sources: string;
    /** Generation timestamp */
    generatedAt: string;
    /** Current loaded URL */
    currentUrl: string;
}
/**
 * Heatmap state
 */
export interface HeatmapState {
    /** Cal-heatmap instance */
    calHeatmap: CalHeatmapInstance | null;
    /** Earliest release date */
    releaseMinDate: Date | null;
    /** Latest release date */
    releaseMaxDate: Date | null;
    /** Current view start date */
    currentViewStart: Date | null;
    /** Aggregated counts by date */
    aggregatedData: Record<string, number>;
    /** Detailed data by date */
    detailedData: Record<string, DayData>;
}
/**
 * Cal-heatmap instance interface (simplified)
 */
export interface CalHeatmapInstance {
    paint: (options: CalHeatmapOptions, plugins?: CalHeatmapPlugin[]) => Promise<void>;
    destroy: () => Promise<void>;
    next: (n?: number) => Promise<void>;
    previous: (n?: number) => Promise<void>;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    domainCollection?: CalHeatmapDomainCollection;
}
/**
 * Cal-heatmap domain entry
 */
export interface CalHeatmapDomainEntry {
    t: number;
    x: number;
    y: number;
    v: number | null;
}
/**
 * Cal-heatmap domain collection
 */
export interface CalHeatmapDomainCollection {
    collection: Map<number, CalHeatmapDomainEntry[]>;
    keys: number[];
    min: number;
    max: number;
}
/**
 * Cal-heatmap options
 */
export interface CalHeatmapOptions {
    itemSelector?: string;
    data?: {
        source: unknown;
        x: string | ((d: unknown) => Date);
        y: string | ((d: unknown) => number);
        groupY?: string;
    };
    date?: {
        start?: Date;
        max?: Date;
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
/**
 * Cal-heatmap plugin
 */
export type CalHeatmapPlugin = [unknown, Record<string, unknown>?];
/**
 * Global window extensions for optional dependencies
 * Note: CalHeatmap and Tooltip are also declared in components/heatmap.ts
 * We extend Window with viewer-specific types here
 */
declare global {
    interface Window {
        CalendarLabel?: new () => unknown;
        Popper?: unknown;
        ReleaseLogViewer?: typeof import('./ReleaseLogViewer').ReleaseLogViewer;
    }
}
/**
 * Default heatmap colors (GitHub-style green)
 */
export declare const DEFAULT_HEATMAP_COLORS: string[];
/**
 * Default viewer options
 */
export declare const DEFAULT_VIEWER_OPTIONS: Required<ViewerOptions>;
//# sourceMappingURL=types.d.ts.map