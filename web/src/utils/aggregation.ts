/**
 * ReleaseLog Aggregation Utilities
 *
 * Functions for aggregating release data by date, repo, etc.
 * Used primarily for heatmap visualization.
 */

import type { Release } from '../schemas';
import { getReleaseDateKey } from './filters';

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
export function aggregateReleasesByDate(
  releases: Release[],
  options: AggregationOptions = {}
): Record<string, number> {
  const { startDate, endDate, repos } = options;
  const counts: Record<string, number> = {};

  for (const release of releases) {
    // Filter by repos if specified
    if (repos && repos.size > 0 && !repos.has(release.repoPath)) {
      continue;
    }

    const dateKey = getReleaseDateKey(release);
    if (!dateKey) continue;

    // Filter by date range if specified
    if (startDate || endDate) {
      const releaseDate = new Date(dateKey);
      if (startDate && releaseDate < startDate) continue;
      if (endDate && releaseDate > endDate) continue;
    }

    counts[dateKey] = (counts[dateKey] || 0) + 1;
  }

  return counts;
}

/**
 * Aggregate releases by date with full metadata.
 * Returns detailed data including which repos had releases.
 *
 * @example
 * const data = aggregateReleasesDetailed(releases);
 * // Map { "2025-01-15" => { date: "2025-01-15", count: 3, repos: ["a/b", "c/d"], releases: [...] } }
 */
export function aggregateReleasesDetailed(
  releases: Release[],
  options: AggregationOptions = {}
): Map<string, DailyReleaseData> {
  const { startDate, endDate, repos } = options;
  const data = new Map<string, DailyReleaseData>();

  for (const release of releases) {
    // Filter by repos if specified
    if (repos && repos.size > 0 && !repos.has(release.repoPath)) {
      continue;
    }

    const dateKey = getReleaseDateKey(release);
    if (!dateKey) continue;

    // Filter by date range if specified
    if (startDate || endDate) {
      const releaseDate = new Date(dateKey);
      if (startDate && releaseDate < startDate) continue;
      if (endDate && releaseDate > endDate) continue;
    }

    if (!data.has(dateKey)) {
      data.set(dateKey, {
        date: dateKey,
        count: 0,
        repos: [],
        releases: [],
      });
    }

    const dayData = data.get(dateKey)!;
    dayData.count++;
    dayData.releases.push(release);

    if (!dayData.repos.includes(release.repoPath)) {
      dayData.repos.push(release.repoPath);
    }
  }

  return data;
}

/**
 * Get the date range for releases (earliest to latest).
 */
export function getReleaseDateRange(releases: Release[]): { start: Date | null; end: Date | null } {
  let start: Date | null = null;
  let end: Date | null = null;

  for (const release of releases) {
    const dateKey = getReleaseDateKey(release);
    if (!dateKey) continue;

    const date = new Date(dateKey);

    if (!start || date < start) start = date;
    if (!end || date > end) end = date;
  }

  return { start, end };
}

/**
 * Get the default date range for heatmap (last 12 months).
 */
export function getDefaultHeatmapRange(): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);

  return { start, end };
}

/**
 * Calculate color scale levels based on data distribution.
 * Uses quartiles to determine thresholds.
 */
export function calculateColorScale(counts: Record<string, number>): number[] {
  const values = Object.values(counts).filter((v) => v > 0).sort((a, b) => a - b);

  if (values.length === 0) {
    return [1, 2, 3, 4];
  }

  // Use quartiles for the scale
  const q1 = values[Math.floor(values.length * 0.25)] || 1;
  const q2 = values[Math.floor(values.length * 0.5)] || q1 + 1;
  const q3 = values[Math.floor(values.length * 0.75)] || q2 + 1;
  const max = values[values.length - 1] || q3 + 1;

  return [q1, q2, q3, max];
}

/**
 * Convert aggregated data to cal-heatmap data source format.
 * Cal-heatmap expects an array of objects with date and value properties.
 */
export function toCalHeatmapData(
  counts: Record<string, number>
): Array<{ date: string; value: number }> {
  return Object.entries(counts).map(([date, value]) => ({
    date,
    value,
  }));
}

/**
 * Generate summary statistics for the aggregated data.
 */
export function getAggregationStats(counts: Record<string, number>): {
  totalDays: number;
  totalReleases: number;
  maxPerDay: number;
  avgPerDay: number;
  activeDays: number;
} {
  const values = Object.values(counts);
  const activeDays = values.filter((v) => v > 0).length;
  const totalReleases = values.reduce((sum, v) => sum + v, 0);

  return {
    totalDays: values.length,
    totalReleases,
    maxPerDay: values.length > 0 ? Math.max(...values) : 0,
    avgPerDay: activeDays > 0 ? totalReleases / activeDays : 0,
    activeDays,
  };
}
