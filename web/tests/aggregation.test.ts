/**
 * Tests for aggregation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  aggregateReleasesByDate,
  aggregateReleasesDetailed,
  getReleaseDateRange,
  calculateColorScale,
  getAggregationStats,
  toCalHeatmapData,
} from '../src/utils/aggregation';
import type { Release } from '../src/schemas';

// Helper to create test releases
function createRelease(
  repoPath: string,
  tagName: string,
  publishedAt: string
): Release {
  const [repoOwner, repoName] = repoPath.split('/');
  return {
    repoPath,
    repoOwner,
    repoName,
    type: 'release',
    tagName,
    name: tagName,
    publishedAt,
  };
}

describe('aggregateReleasesByDate', () => {
  it('should aggregate releases by date', () => {
    const releases: Release[] = [
      createRelease('org/repo1', 'v1.0.0', '2025-01-15T10:00:00Z'),
      createRelease('org/repo2', 'v2.0.0', '2025-01-15T12:00:00Z'),
      createRelease('org/repo1', 'v1.1.0', '2025-01-16T10:00:00Z'),
    ];

    const counts = aggregateReleasesByDate(releases);

    expect(counts['2025-01-15']).toBe(2);
    expect(counts['2025-01-16']).toBe(1);
  });

  it('should handle empty releases', () => {
    const counts = aggregateReleasesByDate([]);
    expect(Object.keys(counts).length).toBe(0);
  });

  it('should filter by date range', () => {
    const releases: Release[] = [
      createRelease('org/repo1', 'v1.0.0', '2025-01-10T10:00:00Z'),
      createRelease('org/repo1', 'v1.1.0', '2025-01-15T10:00:00Z'),
      createRelease('org/repo1', 'v1.2.0', '2025-01-20T10:00:00Z'),
    ];

    const counts = aggregateReleasesByDate(releases, {
      startDate: new Date('2025-01-12'),
      endDate: new Date('2025-01-18'),
    });

    expect(counts['2025-01-10']).toBeUndefined();
    expect(counts['2025-01-15']).toBe(1);
    expect(counts['2025-01-20']).toBeUndefined();
  });

  it('should filter by repos', () => {
    const releases: Release[] = [
      createRelease('org/repo1', 'v1.0.0', '2025-01-15T10:00:00Z'),
      createRelease('org/repo2', 'v2.0.0', '2025-01-15T12:00:00Z'),
    ];

    const counts = aggregateReleasesByDate(releases, {
      repos: new Set(['org/repo1']),
    });

    expect(counts['2025-01-15']).toBe(1);
  });
});

describe('aggregateReleasesDetailed', () => {
  it('should aggregate with repo details', () => {
    const releases: Release[] = [
      createRelease('org/repo1', 'v1.0.0', '2025-01-15T10:00:00Z'),
      createRelease('org/repo2', 'v2.0.0', '2025-01-15T12:00:00Z'),
      createRelease('org/repo1', 'v1.1.0', '2025-01-15T14:00:00Z'),
    ];

    const detailed = aggregateReleasesDetailed(releases);
    const dayData = detailed.get('2025-01-15');

    expect(dayData).toBeDefined();
    expect(dayData!.count).toBe(3);
    expect(dayData!.repos).toContain('org/repo1');
    expect(dayData!.repos).toContain('org/repo2');
    expect(dayData!.repos.length).toBe(2); // Only unique repos
    expect(dayData!.releases.length).toBe(3);
  });
});

describe('getReleaseDateRange', () => {
  it('should return start and end dates', () => {
    const releases: Release[] = [
      createRelease('org/repo1', 'v1.0.0', '2025-01-15T10:00:00Z'),
      createRelease('org/repo1', 'v1.1.0', '2025-01-10T10:00:00Z'),
      createRelease('org/repo1', 'v1.2.0', '2025-01-20T10:00:00Z'),
    ];

    const range = getReleaseDateRange(releases);

    expect(range.start?.toISOString().split('T')[0]).toBe('2025-01-10');
    expect(range.end?.toISOString().split('T')[0]).toBe('2025-01-20');
  });

  it('should return null for empty releases', () => {
    const range = getReleaseDateRange([]);
    expect(range.start).toBeNull();
    expect(range.end).toBeNull();
  });
});

describe('calculateColorScale', () => {
  it('should calculate quartile-based scale', () => {
    const counts = {
      '2025-01-01': 1,
      '2025-01-02': 2,
      '2025-01-03': 3,
      '2025-01-04': 4,
      '2025-01-05': 5,
      '2025-01-06': 10,
      '2025-01-07': 15,
      '2025-01-08': 20,
    };

    const scale = calculateColorScale(counts);

    expect(scale.length).toBe(4);
    expect(scale[3]).toBe(20); // Max value
  });

  it('should handle empty counts', () => {
    const scale = calculateColorScale({});
    expect(scale).toEqual([1, 2, 3, 4]);
  });
});

describe('getAggregationStats', () => {
  it('should calculate correct stats', () => {
    const counts = {
      '2025-01-01': 3,
      '2025-01-02': 0,
      '2025-01-03': 5,
      '2025-01-04': 2,
    };

    const stats = getAggregationStats(counts);

    expect(stats.totalDays).toBe(4);
    expect(stats.totalReleases).toBe(10);
    expect(stats.maxPerDay).toBe(5);
    expect(stats.activeDays).toBe(3);
    expect(stats.avgPerDay).toBeCloseTo(10 / 3);
  });

  it('should handle empty counts', () => {
    const stats = getAggregationStats({});

    expect(stats.totalDays).toBe(0);
    expect(stats.totalReleases).toBe(0);
    expect(stats.maxPerDay).toBe(0);
    expect(stats.activeDays).toBe(0);
  });
});

describe('toCalHeatmapData', () => {
  it('should convert to cal-heatmap format', () => {
    const counts = {
      '2025-01-15': 3,
      '2025-01-16': 1,
    };

    const data = toCalHeatmapData(counts);

    expect(data.length).toBe(2);
    expect(data).toContainEqual({ date: '2025-01-15', value: 3 });
    expect(data).toContainEqual({ date: '2025-01-16', value: 1 });
  });
});
