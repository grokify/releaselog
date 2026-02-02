/**
 * ReleaseLog Filtering Utilities
 */
import type { Release } from '../schemas';
export interface FilterOptions {
    /** Search query (matches name, tagName, repoPath, body) */
    searchQuery?: string;
    /** Set of repository paths to include (empty = all) */
    repoFilter?: Set<string>;
    /** Filter by release type */
    typeFilter?: 'release' | 'tag' | '';
    /** When false, shows only the latest release per day PER REPO */
    showAllPerDay?: boolean;
}
export interface SortOptions {
    /** Field to sort by */
    field: keyof Release | 'publishedAt' | 'createdAt' | 'repoPath' | 'tagName' | 'name' | 'type';
    /** Sort direction */
    direction: 'asc' | 'desc';
}
/**
 * Filter releases based on search query and filters
 */
export declare function filterReleases(releases: Release[], options: FilterOptions): Release[];
/**
 * Sort releases by a field
 */
export declare function sortReleases(releases: Release[], options: SortOptions): Release[];
/**
 * Get the date string (YYYY-MM-DD) from a release
 */
export declare function getReleaseDateKey(release: Release): string;
/**
 * Filter to show only the latest release per day PER REPO
 *
 * This keeps one release per (repo, date) combination, preserving the first
 * occurrence based on the current sort order (which should be by date descending).
 */
export declare function filterLatestPerDayPerRepo(releases: Release[]): Release[];
/**
 * Filter to show only ONE release per day GLOBALLY
 * (across all repos - useful for a timeline view)
 */
export declare function filterLatestPerDayGlobal(releases: Release[]): Release[];
/**
 * Apply all filters and sorting to releases
 */
export declare function applyFilters(releases: Release[], filterOptions: FilterOptions, sortOptions: SortOptions): Release[];
/**
 * Get unique repository paths from releases
 */
export declare function getUniqueRepos(releases: Release[]): string[];
/**
 * Paginate releases
 */
export declare function paginateReleases(releases: Release[], page: number, pageSize: number): {
    releases: Release[];
    startIndex: number;
    endIndex: number;
    totalPages: number;
};
//# sourceMappingURL=filters.d.ts.map