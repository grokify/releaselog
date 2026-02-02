/**
 * ReleaseLog Heatmap Component
 *
 * A wrapper around cal-heatmap for displaying release activity.
 * Cal-heatmap must be loaded separately (it's an optional peer dependency).
 */

import type { Release } from '../schemas';
import {
  aggregateReleasesByDate,
  aggregateReleasesDetailed,
  getDefaultHeatmapRange,
  calculateColorScale,
  getAggregationStats,
  type AggregationOptions,
  type DailyReleaseData,
} from '../utils/aggregation';

// Cal-heatmap types (simplified, since it's an optional dependency)
interface CalHeatmapDomainEntry {
  t: number; // timestamp
  x: number; // week column
  y: number; // day of week
  v: number | null; // value
}

interface CalHeatmapDomainCollection {
  collection: Map<number, CalHeatmapDomainEntry[]>;
  keys: number[];
  min: number;
  max: number;
}

interface CalHeatmapInstance {
  paint: (options: CalHeatmapOptions, plugins?: CalHeatmapPlugin[]) => Promise<void>;
  destroy: () => Promise<void>;
  next: (n?: number) => Promise<void>;
  previous: (n?: number) => Promise<void>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  domainCollection?: CalHeatmapDomainCollection;
}

interface CalHeatmapOptions {
  itemSelector?: HTMLElement;
  data?: {
    source: unknown;
    x: string | ((d: unknown) => Date);
    y: string | ((d: unknown) => number);
  };
  date?: {
    start?: Date;
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
    label?: { text?: string; position?: string };
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

type CalHeatmapPlugin = [unknown, Record<string, unknown>?];

// Tooltip plugin type
interface TooltipPluginConstructor {
  new (): unknown;
}

declare global {
  interface Window {
    CalHeatmap?: new () => CalHeatmapInstance;
    Tooltip?: TooltipPluginConstructor;
  }
}

/**
 * Heatmap configuration options
 */
export interface HeatmapOptions {
  /** Start date for the heatmap (defaults to 1 year ago) */
  startDate?: Date;
  /** End date for the heatmap (defaults to today) */
  endDate?: Date;
  /** Filter to specific repositories */
  repos?: Set<string>;
  /** Number of months to display (default: 12) */
  range?: number;
  /** Color scheme: 'green' (default), 'blue', 'purple', 'orange' */
  colorScheme?: 'green' | 'blue' | 'purple' | 'orange';
  /** Custom color range (5 colors from empty to max) */
  colorRange?: string[];
  /** Cell size in pixels (default: 11) */
  cellSize?: number;
  /** Gap between cells (default: 2) */
  cellGutter?: number;
  /** Cell border radius (default: 2) */
  cellRadius?: number;
  /** Show month labels (default: true) */
  showMonthLabels?: boolean;
  /** Show day labels (default: true) */
  showDayLabels?: boolean;
  /** Show legend (default: true) */
  showLegend?: boolean;
  /** Enable tooltips (default: true, requires Tooltip plugin) */
  showTooltips?: boolean;
  /** Custom tooltip formatter */
  tooltipFormatter?: (date: Date, value: number, dayjsDate: unknown) => string;
  /** Called when data is loaded */
  onDataLoad?: (stats: ReturnType<typeof getAggregationStats>) => void;
  /** Called when a cell is clicked */
  onCellClick?: (date: Date, count: number, releases: Release[]) => void;
}

/**
 * Default color schemes (GitHub-inspired)
 */
const COLOR_SCHEMES: Record<string, string[]> = {
  green: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  blue: ['#ebedf0', '#9ecae1', '#6baed6', '#3182bd', '#08519c'],
  purple: ['#ebedf0', '#d4b9da', '#c994c7', '#df65b0', '#980043'],
  orange: ['#ebedf0', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'],
};

/**
 * Default tooltip formatter
 */
export function defaultTooltipFormatter(
  _date: Date,
  value: number,
  dayjsDate: { format: (fmt: string) => string }
): string {
  const count = value || 0;
  const dateStr = dayjsDate.format('MMM D, YYYY');
  if (count === 0) {
    return `No releases on ${dateStr}`;
  }
  return `${count} release${count !== 1 ? 's' : ''} on ${dateStr}`;
}

/**
 * Create a detailed tooltip formatter that shows repo names
 */
export function createDetailedTooltipFormatter(
  detailedData: Map<string, DailyReleaseData>
): (date: Date, value: number, dayjsDate: { format: (fmt: string) => string }) => string {
  return (_date: Date, _value: number, dayjsDate: { format: (fmt: string) => string }) => {
    const dateStr = dayjsDate.format('MMM D, YYYY');
    const dateKey = dayjsDate.format('YYYY-MM-DD');
    const dayData = detailedData.get(dateKey);

    if (!dayData || dayData.count === 0) {
      return `No releases on ${dateStr}`;
    }

    const count = dayData.count;
    const repos = dayData.repos.slice(0, 3); // Show first 3 repos
    const moreCount = dayData.repos.length - 3;

    let html = `<strong>${count} release${count !== 1 ? 's' : ''}</strong> on ${dateStr}`;
    if (repos.length > 0) {
      html += '<br/>' + repos.join('<br/>');
      if (moreCount > 0) {
        html += `<br/><em>+${moreCount} more</em>`;
      }
    }
    return html;
  };
}

/**
 * Create a release activity heatmap.
 *
 * Requires cal-heatmap to be loaded:
 * - NPM: `npm install cal-heatmap`
 * - CDN: `<script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>`
 *
 * For tooltips, also load the Tooltip plugin:
 * - CDN: `<script src="https://unpkg.com/cal-heatmap/dist/plugins/Tooltip.min.js"></script>`
 *
 * @example
 * ```javascript
 * import { createReleaseHeatmap } from '@grokify/releaselog';
 *
 * const heatmap = createReleaseHeatmap(
 *   document.getElementById('heatmap'),
 *   releases,
 *   { colorScheme: 'green', range: 12 }
 * );
 * ```
 */
export function createReleaseHeatmap(
  container: HTMLElement | string,
  releases: Release[],
  options: HeatmapOptions = {}
): CalHeatmapInstance | null {
  // Check if cal-heatmap is available
  const CalHeatmap = window.CalHeatmap;
  if (!CalHeatmap) {
    console.warn(
      'cal-heatmap not loaded. Include it via:\n' +
        '  NPM: npm install cal-heatmap\n' +
        '  CDN: <script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>'
    );
    return null;
  }

  // Resolve container
  const el = typeof container === 'string' ? document.querySelector<HTMLElement>(container) : container;
  if (!el) {
    console.error('Heatmap container not found:', container);
    return null;
  }

  // Set up date range
  const defaultRange = getDefaultHeatmapRange();
  const startDate = options.startDate || defaultRange.start;
  const endDate = options.endDate || defaultRange.end;

  // Aggregate release data
  const aggregationOptions: AggregationOptions = {
    startDate,
    endDate,
    repos: options.repos,
  };
  const counts = aggregateReleasesByDate(releases, aggregationOptions);
  const detailedData = aggregateReleasesDetailed(releases, aggregationOptions);

  // Calculate color scale based on data
  const colorScale = calculateColorScale(counts);
  const colorRange = options.colorRange || COLOR_SCHEMES[options.colorScheme || 'green'];

  // Get stats and notify
  const stats = getAggregationStats(counts);
  if (options.onDataLoad) {
    options.onDataLoad(stats);
  }

  // Convert data for cal-heatmap
  const data = Object.entries(counts).map(([date, value]) => ({
    date,
    value,
  }));

  // Create cal-heatmap instance
  const cal = new CalHeatmap();

  const calOptions: CalHeatmapOptions = {
    itemSelector: el,
    data: {
      source: data,
      x: (d: unknown) => new Date((d as { date: string }).date),
      y: (d: unknown) => (d as { value: number }).value,
    },
    date: {
      start: startDate,
    },
    range: options.range || 12,
    scale: {
      color: {
        type: 'threshold',
        range: colorRange,
        domain: colorScale,
      },
    },
    domain: {
      type: 'month',
      gutter: 4,
      label: options.showMonthLabels !== false ? { text: 'MMM', position: 'bottom' } : undefined,
    },
    subDomain: {
      type: 'ghDay', // GitHub-style day layout
      width: options.cellSize || 11,
      height: options.cellSize || 11,
      gutter: options.cellGutter || 2,
      radius: options.cellRadius || 2,
    },
  };

  // Build plugins array
  const plugins: CalHeatmapPlugin[] = [];

  // Add Tooltip plugin if available and enabled
  const TooltipPlugin = window.Tooltip;
  if (TooltipPlugin && options.showTooltips !== false) {
    const tooltipFormatter = options.tooltipFormatter || createDetailedTooltipFormatter(detailedData);
    plugins.push([
      TooltipPlugin,
      {
        text: (date: Date, value: number, dayjsDate: unknown) => {
          return tooltipFormatter(date, value, dayjsDate as { format: (fmt: string) => string });
        },
      },
    ]);
  }

  // Paint the heatmap
  cal.paint(calOptions, plugins).then(() => {
    // Hide future date cells after painting
    hideFutureCells(cal, el);
  });

  // Add click handler if provided
  if (options.onCellClick) {
    cal.on('click', (...args: unknown[]) => {
      const [_event, timestamp, value] = args as [unknown, number, number];
      const date = new Date(timestamp);
      const dateKey = date.toISOString().split('T')[0];
      const dayData = detailedData.get(dateKey);
      const dayReleases = dayData?.releases || [];
      options.onCellClick!(date, value || 0, dayReleases);
    });
  }

  return cal;
}

/**
 * Create heatmap with navigation controls.
 * Returns the container element with the heatmap and navigation buttons.
 */
export function createNavigableHeatmap(
  container: HTMLElement | string,
  releases: Release[],
  options: HeatmapOptions = {}
): { element: HTMLElement; heatmap: CalHeatmapInstance | null } {
  // Resolve container
  const el = typeof container === 'string' ? document.querySelector<HTMLElement>(container) : container;
  if (!el) {
    throw new Error('Heatmap container not found: ' + container);
  }

  // Create wrapper structure
  el.innerHTML = `
    <div class="rl-heatmap-container">
      <div class="rl-heatmap-header">
        <button class="rl-heatmap-nav rl-heatmap-prev" aria-label="Previous year" type="button">&larr;</button>
        <span class="rl-heatmap-title">Release Activity</span>
        <button class="rl-heatmap-nav rl-heatmap-next" aria-label="Next year" type="button">&rarr;</button>
      </div>
      <div class="rl-heatmap-chart" id="rl-heatmap-chart"></div>
      <div class="rl-heatmap-legend">
        <span class="rl-heatmap-legend-label">Less</span>
        <span class="rl-heatmap-legend-cell" data-level="0"></span>
        <span class="rl-heatmap-legend-cell" data-level="1"></span>
        <span class="rl-heatmap-legend-cell" data-level="2"></span>
        <span class="rl-heatmap-legend-cell" data-level="3"></span>
        <span class="rl-heatmap-legend-cell" data-level="4"></span>
        <span class="rl-heatmap-legend-label">More</span>
      </div>
      <div class="rl-heatmap-stats" aria-live="polite"></div>
    </div>
  `;

  const chartContainer = el.querySelector<HTMLElement>('#rl-heatmap-chart')!;
  const statsContainer = el.querySelector<HTMLElement>('.rl-heatmap-stats')!;
  const prevBtn = el.querySelector<HTMLButtonElement>('.rl-heatmap-prev')!;
  const nextBtn = el.querySelector<HTMLButtonElement>('.rl-heatmap-next')!;

  // Apply legend colors
  const colorRange = options.colorRange || COLOR_SCHEMES[options.colorScheme || 'green'];
  el.querySelectorAll('.rl-heatmap-legend-cell').forEach((cell, i) => {
    (cell as HTMLElement).style.backgroundColor = colorRange[i];
  });

  // Create heatmap with stats callback
  const heatmap = createReleaseHeatmap(chartContainer, releases, {
    ...options,
    onDataLoad: (stats) => {
      statsContainer.innerHTML = `
        <span>${stats.totalReleases} releases</span>
        <span>${stats.activeDays} active days</span>
        <span>Max: ${stats.maxPerDay}/day</span>
      `;
      if (options.onDataLoad) {
        options.onDataLoad(stats);
      }
    },
  });

  // Add navigation handlers
  if (heatmap) {
    prevBtn.addEventListener('click', () => {
      heatmap.previous(12).then(() => {
        setTimeout(() => hideFutureCells(heatmap, chartContainer), 100);
      });
    });
    nextBtn.addEventListener('click', () => {
      heatmap.next(12).then(() => {
        setTimeout(() => hideFutureCells(heatmap, chartContainer), 100);
      });
    });
  }

  return { element: el, heatmap };
}

/**
 * Hide future date cells from a cal-heatmap instance.
 * Cal-heatmap renders full months, so this hides cells beyond today.
 */
export function hideFutureCells(
  heatmap: CalHeatmapInstance,
  container: HTMLElement
): void {
  if (!heatmap.domainCollection) return;

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const todayTimestamp = today.getTime();

  const dc = heatmap.domainCollection;
  const futureCells: CalHeatmapDomainEntry[] = [];

  // Iterate through all domains (months) and their subdomains (days)
  dc.keys.forEach((domainKey) => {
    const subdomains = dc.collection.get(domainKey);
    if (subdomains) {
      subdomains.forEach((cell) => {
        if (cell.t > todayTimestamp) {
          futureCells.push(cell);
        }
      });
    }
  });

  // Get all rect elements that are subdomain cells
  const allRects = container.querySelectorAll<SVGRectElement>('rect.ch-subdomain-bg');

  // The cells are rendered in order matching the domainCollection structure
  // Build a map of all timestamps to their index
  let cellIndex = 0;
  const timestampToIndex: Record<number, number> = {};
  dc.keys.forEach((domainKey) => {
    const subdomains = dc.collection.get(domainKey);
    if (subdomains) {
      subdomains.forEach((cell) => {
        timestampToIndex[cell.t] = cellIndex;
        cellIndex++;
      });
    }
  });

  // Hide future cells by index
  futureCells.forEach((cell) => {
    const idx = timestampToIndex[cell.t];
    if (idx !== undefined && allRects[idx]) {
      allRects[idx].style.display = 'none';
    }
  });
}

/**
 * Check if cal-heatmap is available.
 */
export function isCalHeatmapAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.CalHeatmap === 'function';
}

/**
 * Check if the Tooltip plugin is available.
 */
export function isTooltipPluginAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.Tooltip === 'function';
}

/**
 * Destroy a heatmap instance and clean up.
 */
export async function destroyHeatmap(heatmap: CalHeatmapInstance | null): Promise<void> {
  if (heatmap) {
    await heatmap.destroy();
  }
}
