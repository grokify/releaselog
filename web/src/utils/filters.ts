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
export function filterReleases(releases: Release[], options: FilterOptions): Release[] {
  const { searchQuery, repoFilter, typeFilter } = options;

  return releases.filter((r) => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        (r.name || '').toLowerCase().includes(q) ||
        (r.tagName || '').toLowerCase().includes(q) ||
        (r.repoPath || '').toLowerCase().includes(q) ||
        (r.body || '').toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Repo filter (empty set means all repos)
    if (repoFilter && repoFilter.size > 0 && !repoFilter.has(r.repoPath)) {
      return false;
    }

    // Type filter
    if (typeFilter && r.type !== typeFilter) {
      return false;
    }

    return true;
  });
}

/**
 * Sort releases by a field
 */
export function sortReleases(releases: Release[], options: SortOptions): Release[] {
  const { field, direction } = options;

  return [...releases].sort((a, b) => {
    let aVal: string | number | boolean | undefined | null = a[field as keyof Release] as string | number | boolean | undefined | null;
    let bVal: string | number | boolean | undefined | null = b[field as keyof Release] as string | number | boolean | undefined | null;

    // Handle date fields
    if (field === 'publishedAt' || field === 'createdAt') {
      aVal = aVal ? new Date(aVal as string).getTime() : 0;
      bVal = bVal ? new Date(bVal as string).getTime() : 0;
    }

    // Handle nulls
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    // Compare
    let cmp = 0;
    if (aVal < bVal) cmp = -1;
    else if (aVal > bVal) cmp = 1;

    return direction === 'asc' ? cmp : -cmp;
  });
}

/**
 * Get the date string (YYYY-MM-DD) from a release
 */
export function getReleaseDateKey(release: Release): string {
  const dateStr = release.publishedAt || release.createdAt || '';
  return dateStr.split('T')[0] || '';
}

/**
 * Filter to show only the latest release per day PER REPO
 *
 * This keeps one release per (repo, date) combination, preserving the first
 * occurrence based on the current sort order (which should be by date descending).
 */
export function filterLatestPerDayPerRepo(releases: Release[]): Release[] {
  const seen = new Map<string, Set<string>>(); // Map<repoPath, Set<date>>

  return releases.filter((r) => {
    const date = getReleaseDateKey(r);
    const repoPath = r.repoPath;

    if (!seen.has(repoPath)) {
      seen.set(repoPath, new Set());
    }

    const repoDates = seen.get(repoPath)!;
    if (repoDates.has(date)) {
      return false;
    }

    repoDates.add(date);
    return true;
  });
}

/**
 * Filter to show only ONE release per day GLOBALLY
 * (across all repos - useful for a timeline view)
 */
export function filterLatestPerDayGlobal(releases: Release[]): Release[] {
  const seenDates = new Set<string>();

  return releases.filter((r) => {
    const date = getReleaseDateKey(r);
    if (seenDates.has(date)) {
      return false;
    }
    seenDates.add(date);
    return true;
  });
}

/**
 * Apply all filters and sorting to releases
 */
export function applyFilters(
  releases: Release[],
  filterOptions: FilterOptions,
  sortOptions: SortOptions
): Release[] {
  // First, apply basic filters (search, repo, type)
  let result = filterReleases(releases, filterOptions);

  // Sort
  result = sortReleases(result, sortOptions);

  // Apply "one per day per repo" filter if needed
  if (!filterOptions.showAllPerDay) {
    result = filterLatestPerDayPerRepo(result);
  }

  return result;
}

/**
 * Get unique repository paths from releases
 */
export function getUniqueRepos(releases: Release[]): string[] {
  const repos = new Set<string>();
  releases.forEach((r) => repos.add(r.repoPath));
  return Array.from(repos).sort();
}

/**
 * Paginate releases
 */
export function paginateReleases(
  releases: Release[],
  page: number,
  pageSize: number
): { releases: Release[]; startIndex: number; endIndex: number; totalPages: number } {
  const totalPages = Math.ceil(releases.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, releases.length);

  return {
    releases: releases.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    totalPages,
  };
}
