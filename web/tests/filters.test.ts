/**
 * Unit tests for ReleaseLog filtering utilities
 */

import { describe, it, expect } from 'vitest';
import type { Release } from '../src/schemas';
import {
  filterReleases,
  sortReleases,
  filterLatestPerDayPerRepo,
  filterLatestPerDayGlobal,
  applyFilters,
  getUniqueRepos,
  paginateReleases,
  getReleaseDateKey,
} from '../src/utils/filters';

// Test data
const createRelease = (overrides: Partial<Release>): Release => ({
  repoPath: 'owner/repo',
  repoOwner: 'owner',
  repoName: 'repo',
  type: 'release',
  tagName: 'v1.0.0',
  name: 'v1.0.0',
  ...overrides,
});

const testReleases: Release[] = [
  createRelease({
    repoPath: 'agentplexus/assistantkit',
    tagName: 'v0.8.0',
    name: 'v0.8.0',
    publishedAt: '2026-01-26T15:00:00Z',
  }),
  createRelease({
    repoPath: 'agentplexus/omnillm',
    tagName: 'v1.0.0',
    name: 'v1.0.0',
    publishedAt: '2026-01-26T10:00:00Z',
  }),
  createRelease({
    repoPath: 'agentplexus/assistantkit',
    tagName: 'v0.7.0',
    name: 'v0.7.0',
    publishedAt: '2026-01-25T12:00:00Z',
  }),
  createRelease({
    repoPath: 'agentplexus/assistantkit',
    tagName: 'v0.6.0',
    name: 'v0.6.0',
    publishedAt: '2026-01-20T09:00:00Z',
  }),
  createRelease({
    repoPath: 'agentplexus/assistantkit',
    tagName: 'v0.5.0',
    name: 'v0.5.0',
    publishedAt: '2026-01-18T08:00:00Z',
  }),
  createRelease({
    repoPath: 'agentplexus/omnillm',
    tagName: 'v0.9.0',
    name: 'v0.9.0',
    publishedAt: '2026-01-18T14:00:00Z',
  }),
];

describe('getReleaseDateKey', () => {
  it('should extract date from publishedAt', () => {
    const release = createRelease({ publishedAt: '2026-01-26T15:00:00Z' });
    expect(getReleaseDateKey(release)).toBe('2026-01-26');
  });

  it('should fall back to createdAt', () => {
    const release = createRelease({ createdAt: '2026-01-25T12:00:00Z' });
    expect(getReleaseDateKey(release)).toBe('2026-01-25');
  });

  it('should return empty string for missing dates', () => {
    const release = createRelease({});
    expect(getReleaseDateKey(release)).toBe('');
  });
});

describe('filterReleases', () => {
  it('should filter by search query (name)', () => {
    const result = filterReleases(testReleases, { searchQuery: 'v0.8' });
    expect(result).toHaveLength(1);
    expect(result[0].tagName).toBe('v0.8.0');
  });

  it('should filter by search query (repoPath)', () => {
    const result = filterReleases(testReleases, { searchQuery: 'omnillm' });
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.repoPath.includes('omnillm'))).toBe(true);
  });

  it('should filter by repo set', () => {
    const repoFilter = new Set(['agentplexus/assistantkit']);
    const result = filterReleases(testReleases, { repoFilter });
    expect(result).toHaveLength(4);
    expect(result.every((r) => r.repoPath === 'agentplexus/assistantkit')).toBe(true);
  });

  it('should return all releases when repoFilter is empty', () => {
    const result = filterReleases(testReleases, { repoFilter: new Set() });
    expect(result).toHaveLength(testReleases.length);
  });

  it('should filter by type', () => {
    const mixedReleases = [
      createRelease({ type: 'release', tagName: 'v1.0.0' }),
      createRelease({ type: 'tag', tagName: 'v1.0.0-beta' }),
      createRelease({ type: 'release', tagName: 'v0.9.0' }),
    ];
    const result = filterReleases(mixedReleases, { typeFilter: 'tag' });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('tag');
  });

  it('should combine multiple filters', () => {
    const repoFilter = new Set(['agentplexus/assistantkit']);
    const result = filterReleases(testReleases, {
      searchQuery: 'v0.7',
      repoFilter,
    });
    expect(result).toHaveLength(1);
    expect(result[0].tagName).toBe('v0.7.0');
  });
});

describe('sortReleases', () => {
  it('should sort by publishedAt descending', () => {
    const result = sortReleases(testReleases, { field: 'publishedAt', direction: 'desc' });
    expect(result[0].tagName).toBe('v0.8.0'); // Jan 26 15:00
    expect(result[1].tagName).toBe('v1.0.0'); // Jan 26 10:00
  });

  it('should sort by publishedAt ascending', () => {
    const result = sortReleases(testReleases, { field: 'publishedAt', direction: 'asc' });
    expect(result[0].tagName).toBe('v0.5.0'); // Jan 18 08:00
  });

  it('should sort by repoPath', () => {
    const result = sortReleases(testReleases, { field: 'repoPath', direction: 'asc' });
    expect(result[0].repoPath).toBe('agentplexus/assistantkit');
  });

  it('should sort by tagName', () => {
    const result = sortReleases(testReleases, { field: 'tagName', direction: 'desc' });
    expect(result[0].tagName).toBe('v1.0.0');
  });
});

describe('filterLatestPerDayPerRepo', () => {
  it('should keep one release per day PER REPO', () => {
    // Sort by date descending first (as the real app would)
    const sorted = sortReleases(testReleases, { field: 'publishedAt', direction: 'desc' });
    const result = filterLatestPerDayPerRepo(sorted);

    // Jan 26 has releases for both assistantkit (v0.8.0) and omnillm (v1.0.0) - both should be kept
    const jan26Releases = result.filter((r) => r.publishedAt?.startsWith('2026-01-26'));
    expect(jan26Releases).toHaveLength(2);

    // assistantkit should have entries for Jan 26, 25, 20, 18
    const assistantkitReleases = result.filter((r) => r.repoPath === 'agentplexus/assistantkit');
    expect(assistantkitReleases).toHaveLength(4);
    expect(assistantkitReleases.map((r) => r.tagName)).toEqual(['v0.8.0', 'v0.7.0', 'v0.6.0', 'v0.5.0']);

    // Jan 18 has releases for both repos - both should be kept
    const jan18Releases = result.filter((r) => r.publishedAt?.startsWith('2026-01-18'));
    expect(jan18Releases).toHaveLength(2);
  });

  it('should keep only the latest when same repo has multiple releases on same day', () => {
    const sameDayReleases: Release[] = [
      createRelease({
        repoPath: 'owner/repo',
        tagName: 'v1.0.2',
        publishedAt: '2026-01-26T18:00:00Z',
      }),
      createRelease({
        repoPath: 'owner/repo',
        tagName: 'v1.0.1',
        publishedAt: '2026-01-26T12:00:00Z',
      }),
      createRelease({
        repoPath: 'owner/repo',
        tagName: 'v1.0.0',
        publishedAt: '2026-01-26T09:00:00Z',
      }),
    ];

    const sorted = sortReleases(sameDayReleases, { field: 'publishedAt', direction: 'desc' });
    const result = filterLatestPerDayPerRepo(sorted);

    expect(result).toHaveLength(1);
    expect(result[0].tagName).toBe('v1.0.2'); // Latest on that day
  });
});

describe('filterLatestPerDayGlobal', () => {
  it('should keep only ONE release per day globally', () => {
    const sorted = sortReleases(testReleases, { field: 'publishedAt', direction: 'desc' });
    const result = filterLatestPerDayGlobal(sorted);

    // Jan 26 should only have one entry (the latest timestamp)
    const jan26Releases = result.filter((r) => r.publishedAt?.startsWith('2026-01-26'));
    expect(jan26Releases).toHaveLength(1);
    expect(jan26Releases[0].tagName).toBe('v0.8.0'); // 15:00 is later than 10:00

    // Should have one entry per unique day
    const uniqueDays = new Set(result.map((r) => r.publishedAt?.split('T')[0]));
    expect(uniqueDays.size).toBe(result.length);
  });
});

describe('applyFilters', () => {
  it('should apply all filters and sorting together', () => {
    const result = applyFilters(
      testReleases,
      {
        repoFilter: new Set(['agentplexus/assistantkit']),
        showAllPerDay: false,
      },
      { field: 'publishedAt', direction: 'desc' }
    );

    // Should have all assistantkit releases (one per day per repo)
    expect(result).toHaveLength(4);
    expect(result[0].tagName).toBe('v0.8.0');
    expect(result[3].tagName).toBe('v0.5.0');
  });

  it('should show all releases when showAllPerDay is true', () => {
    const result = applyFilters(
      testReleases,
      { showAllPerDay: true },
      { field: 'publishedAt', direction: 'desc' }
    );

    expect(result).toHaveLength(testReleases.length);
  });
});

describe('getUniqueRepos', () => {
  it('should return unique sorted repository paths', () => {
    const result = getUniqueRepos(testReleases);
    expect(result).toEqual(['agentplexus/assistantkit', 'agentplexus/omnillm']);
  });
});

describe('paginateReleases', () => {
  it('should paginate correctly', () => {
    const releases = Array.from({ length: 50 }, (_, i) =>
      createRelease({ tagName: `v${i}` })
    );

    const page1 = paginateReleases(releases, 1, 10);
    expect(page1.releases).toHaveLength(10);
    expect(page1.startIndex).toBe(0);
    expect(page1.endIndex).toBe(10);
    expect(page1.totalPages).toBe(5);

    const page3 = paginateReleases(releases, 3, 10);
    expect(page3.releases).toHaveLength(10);
    expect(page3.startIndex).toBe(20);
    expect(page3.endIndex).toBe(30);

    const page5 = paginateReleases(releases, 5, 10);
    expect(page5.releases).toHaveLength(10);
    expect(page5.startIndex).toBe(40);
    expect(page5.endIndex).toBe(50);
  });

  it('should handle partial last page', () => {
    const releases = Array.from({ length: 25 }, (_, i) =>
      createRelease({ tagName: `v${i}` })
    );

    const lastPage = paginateReleases(releases, 3, 10);
    expect(lastPage.releases).toHaveLength(5);
    expect(lastPage.startIndex).toBe(20);
    expect(lastPage.endIndex).toBe(25);
    expect(lastPage.totalPages).toBe(3);
  });
});
