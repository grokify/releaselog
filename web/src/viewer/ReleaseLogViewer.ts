/**
 * ReleaseLog Viewer
 *
 * A filterable, sortable release log viewer with heatmap.
 *
 * @example
 * ```html
 * <link rel="stylesheet" href="releaselog-viewer.css">
 * <script src="releaselog-viewer.js"></script>
 * <div id="releases"></div>
 * <script>
 *   new ReleaseLogViewer('#releases', {
 *     url: 'releases.json',
 *     showHeatmap: true
 *   });
 * </script>
 * ```
 */

import type {
  ViewerOptions,
  ViewerState,
  HeatmapState,
  NormalizedRelease,
  DayData,
  CalHeatmapInstance,
  CalHeatmapPlugin,
  CalHeatmapDomainEntry,
  DEFAULT_VIEWER_OPTIONS as ViewerDefaults,
} from './types';
import { DEFAULT_HEATMAP_COLORS } from './types';
import { renderUrlBar, renderHeader, renderControls, renderHeatmapSection, renderTableSection } from './components';

/**
 * ReleaseLogViewer - A filterable, sortable release log viewer with heatmap
 */
export class ReleaseLogViewer {
  /** Version string */
  static readonly version = '0.1.0';

  /** Container element */
  private container: HTMLElement;

  /** Configuration options */
  private options: Required<ViewerOptions>;

  /** Viewer state */
  private state: ViewerState;

  /** Heatmap state */
  private heatmap: HeatmapState;

  /** Unique instance ID */
  private id: string;

  /**
   * Create a new ReleaseLogViewer
   * @param container - CSS selector or DOM element
   * @param options - Configuration options
   */
  constructor(container: string | HTMLElement, options: ViewerOptions = {}) {
    // Resolve container
    if (typeof container === 'string') {
      const el = document.querySelector(container);
      if (!el) {
        throw new Error('ReleaseLogViewer: Container not found');
      }
      this.container = el as HTMLElement;
    } else {
      this.container = container;
    }

    // Merge options with defaults
    this.options = {
      url: options.url ?? '',
      data: options.data ?? null,
      pageSize: options.pageSize ?? 25,
      showReleaseName: options.showReleaseName ?? false,
      showType: options.showType ?? false,
      showAllPerDay: options.showAllPerDay ?? false,
      showUrlBar: options.showUrlBar ?? true,
      showHeader: options.showHeader ?? true,
      showHeatmap: options.showHeatmap ?? true,
      showHeatmapHelp: options.showHeatmapHelp ?? true,
      heatmapRange: options.heatmapRange ?? 12,
      heatmapColors: options.heatmapColors ?? DEFAULT_HEATMAP_COLORS,
      onLoad: options.onLoad ?? (() => {}),
      onError: options.onError ?? (() => {}),
      onDateFilter: options.onDateFilter ?? (() => {}),
    };

    // Initialize state
    this.state = {
      releases: [],
      filteredReleases: [],
      currentPage: 1,
      pageSize: this.options.pageSize,
      sortField: 'publishedAt',
      sortDir: 'desc',
      searchQuery: '',
      repoFilter: new Set(),
      repoFilterOpen: false,
      repoSearchQuery: '',
      typeFilter: '',
      dateFilter: null,
      showReleaseName: this.options.showReleaseName,
      showType: this.options.showType,
      showAllPerDay: this.options.showAllPerDay,
      specVersion: '',
      sources: '',
      generatedAt: '',
      currentUrl: '',
    };

    // Initialize heatmap state
    this.heatmap = {
      calHeatmap: null,
      releaseMinDate: null,
      releaseMaxDate: null,
      currentViewStart: null,
      aggregatedData: {},
      detailedData: {},
    };

    // Generate unique ID
    this.id = 'rlv-' + Math.random().toString(36).substring(2, 11);

    // Initialize
    this.init();
  }

  /**
   * Initialize the viewer
   */
  private init(): void {
    this.container.classList.add('rlv-container');
    this.render();
    this.bindGlobalEvents();

    if (this.options.data) {
      this.loadData(this.options.data);
    } else if (this.options.url) {
      this.loadUrl(this.options.url);
    }
  }

  /**
   * Bind global event listeners
   */
  private bindGlobalEvents(): void {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.rlv-repo-filter')) {
        this.closeRepoFilter();
      }
      // Close link dropdowns
      this.container.querySelectorAll('.rlv-links-dropdown.show').forEach((d) => {
        d.classList.remove('show');
        const btn = this.container.querySelector(`[aria-controls="${d.id}"]`);
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dropdowns on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeRepoFilter();
        this.container.querySelectorAll('.rlv-links-dropdown.show').forEach((d) => {
          d.classList.remove('show');
          const btn = this.container.querySelector(`[aria-controls="${d.id}"]`);
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        // Close heatmap help
        const helpTooltip = this.container.querySelector('.rlv-heatmap-help-tooltip');
        if (helpTooltip) {
          helpTooltip.classList.remove('show');
          helpTooltip.setAttribute('aria-hidden', 'true');
        }
      }
    });
  }

  /**
   * Load data from URL
   */
  loadUrl(url: string): void {
    this.showMessage('loading', 'Loading releases...');

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        this.loadData(data, url);
        this.options.onLoad(data);
      })
      .catch((error) => {
        this.showMessage('error', `Error loading data: ${error.message}`);
        this.options.onError(error);
      });
  }

  /**
   * Load data directly
   */
  private loadData(data: unknown, url?: string): void {
    const releaseData = data as {
      releases?: unknown[];
      sources?: string[];
      generatedAt?: string;
      generated_at?: string;
      specVersion?: string;
      ir_version?: string;
    };

    if (!releaseData.releases || !Array.isArray(releaseData.releases)) {
      this.showMessage('error', 'Invalid JSON format: missing releases array');
      return;
    }

    this.state.releases = releaseData.releases.map((r) => this.normalizeRelease(r));
    this.state.sources = releaseData.sources ? releaseData.sources.join(', ') : 'Unknown';
    this.state.generatedAt = releaseData.generatedAt || releaseData.generated_at || '';
    this.state.specVersion = releaseData.specVersion || releaseData.ir_version || 'unknown';
    this.state.currentUrl = url || '';
    this.state.currentPage = 1;
    this.state.repoFilter.clear();
    this.state.dateFilter = null;

    // Pre-compute aggregated data for heatmap
    this.computeAggregatedData();

    this.applyFilters();
    this.render();

    // Initialize heatmap after render
    if (this.options.showHeatmap && this.state.releases.length > 0) {
      this.initHeatmap();
    }
  }

  /**
   * Normalize a release object to consistent format
   */
  private normalizeRelease(r: unknown): NormalizedRelease {
    const release = r as Record<string, unknown>;
    return {
      id: release.id as number | undefined,
      repoPath: (release.repoPath || release.repo_path || '') as string,
      repoOwner: (release.repoOwner || release.repo_owner || '') as string,
      repoName: (release.repoName || release.repo_name || '') as string,
      type: release.type as 'release' | 'tag',
      tagName: (release.tagName || release.tag_name || '') as string,
      name: (release.name || '') as string,
      body: release.body as string | undefined,
      publishedAt: (release.publishedAt || release.published_at) as string | undefined,
      createdAt: (release.createdAt || release.created_at) as string | undefined,
      draft: release.draft as boolean | undefined,
      prerelease: release.prerelease as boolean | undefined,
      urls: release.urls as NormalizedRelease['urls'],
      author: release.author as NormalizedRelease['author'],
      previousVersion: (release.previousVersion || release.previous_version) as string | undefined,
      htmlUrl: ((release.urls as { githubRelease?: string })?.githubRelease || release.html_url) as string | undefined,
      authorLogin: ((release.author as { login?: string })?.login || release.author_login) as string | undefined,
      categories: release.categories as string[] | undefined,
    };
  }

  // ============================================================================
  // Heatmap Methods
  // ============================================================================

  /**
   * Compute aggregated data for heatmap
   */
  private computeAggregatedData(): void {
    this.heatmap.aggregatedData = {};
    this.heatmap.detailedData = {};
    this.heatmap.releaseMinDate = null;
    this.heatmap.releaseMaxDate = null;

    for (const r of this.state.releases) {
      const dateStr = r.publishedAt || r.createdAt;
      if (!dateStr) continue;

      const date = dateStr.split('T')[0];
      const d = new Date(dateStr);

      // Track min/max dates
      if (!this.heatmap.releaseMinDate || d < this.heatmap.releaseMinDate) {
        this.heatmap.releaseMinDate = d;
      }
      if (!this.heatmap.releaseMaxDate || d > this.heatmap.releaseMaxDate) {
        this.heatmap.releaseMaxDate = d;
      }

      // Aggregate counts
      this.heatmap.aggregatedData[date] = (this.heatmap.aggregatedData[date] || 0) + 1;

      // Detailed data for tooltips
      if (!this.heatmap.detailedData[date]) {
        this.heatmap.detailedData[date] = { count: 0, repos: [], releases: [] };
      }
      this.heatmap.detailedData[date].count++;
      this.heatmap.detailedData[date].releases.push(r);
      if (!this.heatmap.detailedData[date].repos.includes(r.repoPath)) {
        this.heatmap.detailedData[date].repos.push(r.repoPath);
      }
    }
  }

  /**
   * Calculate color scale based on data distribution
   */
  private calculateColorScale(): number[] {
    const values = Object.values(this.heatmap.aggregatedData)
      .filter((v) => v > 0)
      .sort((a, b) => a - b);

    if (values.length === 0) return [1, 2, 3, 4];

    const q1 = values[Math.floor(values.length * 0.25)] || 1;
    const q2 = values[Math.floor(values.length * 0.5)] || q1 + 1;
    const q3 = values[Math.floor(values.length * 0.75)] || q2 + 1;
    const max = values[values.length - 1] || q3 + 1;

    return [q1, q2, q3, max];
  }

  /**
   * Initialize the heatmap
   */
  private initHeatmap(): void {
    const CalHeatmap = window.CalHeatmap;
    if (!CalHeatmap) {
      console.warn('ReleaseLogViewer: cal-heatmap not loaded, skipping heatmap');
      const heatmapSection = this.container.querySelector('.rlv-heatmap-section') as HTMLElement;
      if (heatmapSection) heatmapSection.style.display = 'none';
      return;
    }

    if (this.heatmap.calHeatmap) {
      this.heatmap.calHeatmap.destroy();
    }

    const heatmapSection = this.container.querySelector('.rlv-heatmap-section') as HTMLElement;
    if (heatmapSection) heatmapSection.style.display = 'block';

    const colorScale = this.calculateColorScale();
    const data = Object.entries(this.heatmap.aggregatedData).map(([date, value]) => ({
      date: new Date(date + 'T00:00:00'),
      value,
    }));

    // Update stats
    const values = Object.values(this.heatmap.aggregatedData);
    const totalReleases = values.reduce((sum, v) => sum + v, 0);
    const activeDays = values.filter((v) => v > 0).length;
    const maxPerDay = values.length > 0 ? Math.max(...values) : 0;

    const statsEl = this.container.querySelector('.rlv-heatmap-stats');
    if (statsEl) {
      statsEl.innerHTML = `<span>${totalReleases} releases</span><span>${activeDays} active days</span><span>Max: ${maxPerDay}/day</span>`;
    }

    const cal = new CalHeatmap() as CalHeatmapInstance;
    this.heatmap.calHeatmap = cal;

    // Calculate end date - cap at today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let endDate: Date;
    if (this.heatmap.releaseMaxDate) {
      endDate = new Date(this.heatmap.releaseMaxDate);
      endDate.setHours(0, 0, 0, 0);
      if (endDate > today) {
        endDate = today;
      }
    } else {
      endDate = today;
    }

    // Find end of week, capped at today
    const endWeek = new Date(endDate);
    const daysUntilSaturday = 6 - endDate.getDay();
    endWeek.setDate(endDate.getDate() + daysUntilSaturday);
    if (endWeek > today) {
      endWeek.setTime(today.getTime());
    }

    // Go back heatmapRange months
    const startDate = new Date(endWeek);
    startDate.setMonth(startDate.getMonth() - (this.options.heatmapRange - 1));

    // Align to start of week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    this.heatmap.currentViewStart = new Date(startDate);

    // Build plugins
    const plugins: CalHeatmapPlugin[] = [];

    // Calendar label plugin
    const CalendarLabel = window.CalendarLabel;
    if (CalendarLabel) {
      plugins.push([
        CalendarLabel,
        {
          position: 'left',
          key: 'left',
          text: () => ['', 'Mon', '', 'Wed', '', 'Fri', ''],
          textAlign: 'end',
          width: 30,
          padding: [0, 5, 0, 0],
        },
      ]);
    }

    // Tooltip plugin
    const Tooltip = window.Tooltip;
    const Popper = window.Popper;
    if (Tooltip && Popper) {
      plugins.push([
        Tooltip,
        {
          text: (date: Date, value: number, dayjsDate: { format: (fmt: string) => string }) => {
            const dateStr = dayjsDate.format('MMM D, YYYY');
            const dateKey = dayjsDate.format('YYYY-MM-DD');
            const dayData = this.heatmap.detailedData[dateKey];

            if (!dayData || dayData.count === 0) {
              return `No releases on ${dateStr}`;
            }

            const count = dayData.count;
            const repos = dayData.repos.slice(0, 3);
            const moreCount = dayData.repos.length - 3;

            let html = `<strong>${count} release${count !== 1 ? 's' : ''}</strong> on ${dateStr}`;
            if (repos.length > 0) {
              html += '<br/>' + repos.join('<br/>');
              if (moreCount > 0) {
                html += `<br/><em>+${moreCount} more</em>`;
              }
            }
            return html;
          },
        },
      ]);
    }

    const chartSelector = `#${this.id}-heatmap`;
    const chartEl = this.container.querySelector('.rlv-heatmap-chart');
    if (!chartEl) return;

    const heatmapColors = this.options.heatmapColors;

    cal
      .paint(
        {
          itemSelector: chartSelector,
          data: {
            source: data,
            x: 'date',
            y: 'value',
            groupY: 'sum',
          },
          date: { start: startDate, max: today },
          range: this.options.heatmapRange,
          scale: {
            color: {
              type: 'threshold',
              range: heatmapColors,
              domain: colorScale,
            },
          },
          domain: {
            type: 'month',
            gutter: 4,
            label: { text: 'MMM', position: 'bottom' },
          },
          subDomain: {
            type: 'ghDay',
            width: 11,
            height: 11,
            gutter: 2,
            radius: 2,
          },
        },
        plugins
      )
      .then(() => {
        this.bindHeatmapEvents();
        this.updateHeatmapNavButtons();
        this.hideFutureCells();
      })
      .catch((err: Error) => {
        console.error('Heatmap paint error:', err);
      });
  }

  /**
   * Hide future cells in heatmap
   */
  private hideFutureCells(): void {
    if (!this.heatmap.calHeatmap) return;

    const chartEl = this.container.querySelector('.rlv-heatmap-chart');
    if (!chartEl) return;

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const todayTimestamp = today.getTime();

    const dc = this.heatmap.calHeatmap.domainCollection;
    if (!dc) return;

    const futureCells: CalHeatmapDomainEntry[] = [];

    // Iterate through all domains and their subdomains
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

    // Get all rect elements
    const allRects = chartEl.querySelectorAll<SVGRectElement>('rect.ch-subdomain-bg');

    // Build timestamp to index map
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

    // Hide future cells
    futureCells.forEach((cell) => {
      const idx = timestampToIndex[cell.t];
      if (idx !== undefined && allRects[idx]) {
        allRects[idx].style.display = 'none';
      }
    });
  }

  /**
   * Bind heatmap events
   */
  private bindHeatmapEvents(): void {
    // Navigation buttons
    const prevBtn = this.container.querySelector('.rlv-heatmap-prev');
    const nextBtn = this.container.querySelector('.rlv-heatmap-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.heatmap.calHeatmap && this.heatmap.currentViewStart) {
          this.heatmap.calHeatmap.previous(this.options.heatmapRange);
          this.heatmap.currentViewStart.setMonth(
            this.heatmap.currentViewStart.getMonth() - this.options.heatmapRange
          );
          this.updateHeatmapNavButtons();
          setTimeout(() => this.hideFutureCells(), 100);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.heatmap.calHeatmap && this.heatmap.currentViewStart) {
          this.heatmap.calHeatmap.next(this.options.heatmapRange);
          this.heatmap.currentViewStart.setMonth(
            this.heatmap.currentViewStart.getMonth() + this.options.heatmapRange
          );
          this.updateHeatmapNavButtons();
          setTimeout(() => this.hideFutureCells(), 100);
        }
      });
    }

    // Cell click
    if (this.heatmap.calHeatmap) {
      this.heatmap.calHeatmap.on('click', (...args: unknown[]) => {
        const [_event, timestamp, value] = args as [unknown, number, number];
        this.handleHeatmapClick(timestamp, value);
      });
    }

    // Help toggle
    const helpLink = this.container.querySelector('.rlv-heatmap-help-link');
    const helpTooltip = this.container.querySelector('.rlv-heatmap-help-tooltip');
    const helpClose = this.container.querySelector('.rlv-heatmap-help-close');

    if (helpLink && helpTooltip) {
      helpLink.addEventListener('click', (e) => {
        e.preventDefault();
        const isVisible = helpTooltip.classList.contains('show');
        helpTooltip.classList.toggle('show');
        helpTooltip.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
      });

      if (helpClose) {
        helpClose.addEventListener('click', () => {
          helpTooltip.classList.remove('show');
          helpTooltip.setAttribute('aria-hidden', 'true');
          (helpLink as HTMLElement).focus();
        });
      }
    }
  }

  /**
   * Update heatmap navigation button states
   */
  private updateHeatmapNavButtons(): void {
    const prevBtn = this.container.querySelector('.rlv-heatmap-prev') as HTMLButtonElement;
    const nextBtn = this.container.querySelector('.rlv-heatmap-next') as HTMLButtonElement;

    if (!prevBtn || !nextBtn || !this.heatmap.currentViewStart) return;

    // Calculate view end date
    const viewEnd = new Date(this.heatmap.currentViewStart);
    viewEnd.setMonth(viewEnd.getMonth() + this.options.heatmapRange);

    // Disable prev if past earliest data
    let shouldDisablePrev = false;
    if (this.heatmap.releaseMinDate) {
      const minDateWeek = new Date(this.heatmap.releaseMinDate);
      minDateWeek.setDate(minDateWeek.getDate() - minDateWeek.getDay());
      shouldDisablePrev = this.heatmap.currentViewStart <= minDateWeek;
    }
    prevBtn.disabled = shouldDisablePrev;
    prevBtn.setAttribute('aria-disabled', shouldDisablePrev ? 'true' : 'false');

    // Disable next if beyond today
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const shouldDisableNext = viewEnd > today;
    nextBtn.disabled = shouldDisableNext;
    nextBtn.setAttribute('aria-disabled', shouldDisableNext ? 'true' : 'false');
  }

  /**
   * Handle heatmap cell click
   */
  private handleHeatmapClick(timestamp: number, _value: number): void {
    const clickedDate = new Date(timestamp);
    const dateKey = clickedDate.toISOString().split('T')[0];

    // Toggle date filter
    if (this.state.dateFilter === dateKey) {
      this.state.dateFilter = null;
    } else {
      this.state.dateFilter = dateKey;
    }

    this.state.currentPage = 1;
    this.applyFilters();
    this.updateTable();
    this.updateDateFilterIndicator();

    // Scroll to table
    const tableWrapper = this.container.querySelector('.rlv-table-wrapper');
    if (tableWrapper) {
      tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Callback
    this.options.onDateFilter(this.state.dateFilter, this.heatmap.detailedData[dateKey]);
  }

  /**
   * Update date filter indicator
   */
  private updateDateFilterIndicator(): void {
    let indicator = this.container.querySelector('.rlv-date-filter-active');

    if (this.state.dateFilter) {
      if (!indicator) {
        const controls = this.container.querySelector('.rlv-controls');
        if (controls) {
          indicator = document.createElement('div');
          indicator.className = 'rlv-date-filter-active';
          controls.insertBefore(indicator, controls.firstChild);
        }
      }
      if (indicator) {
        const dayData = this.heatmap.detailedData[this.state.dateFilter];
        const count = dayData ? dayData.count : 0;
        indicator.innerHTML =
          `<span>Showing <strong>${count} release${count !== 1 ? 's' : ''}</strong> from <strong>${this.formatDate(this.state.dateFilter)}</strong></span>` +
          '<button class="rlv-date-filter-clear" type="button">Clear &times;</button>';

        const clearBtn = indicator.querySelector('.rlv-date-filter-clear');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            this.state.dateFilter = null;
            this.state.currentPage = 1;
            this.applyFilters();
            this.updateTable();
            this.updateDateFilterIndicator();
          });
        }
      }
    } else if (indicator) {
      indicator.remove();
    }
  }

  // ============================================================================
  // Filter Methods
  // ============================================================================

  /**
   * Close repository filter dropdown
   */
  private closeRepoFilter(): void {
    this.state.repoFilterOpen = false;
    this.state.repoSearchQuery = '';
    const panel = this.container.querySelector('.rlv-repo-filter-panel');
    if (panel) panel.classList.remove('show');
  }

  /**
   * Restore repository filter state after re-render
   */
  private restoreRepoFilterState(): void {
    if (this.state.repoFilterOpen) {
      const panel = this.container.querySelector('.rlv-repo-filter-panel');
      if (panel) {
        panel.classList.add('show');
        const searchInput = panel.querySelector('input') as HTMLInputElement;
        if (searchInput) {
          searchInput.value = this.state.repoSearchQuery;
          if (this.state.repoSearchQuery) {
            const q = this.state.repoSearchQuery.toLowerCase();
            this.container.querySelectorAll('.rlv-repo-filter-item').forEach((item) => {
              const repo = (item as HTMLElement).dataset.repo || '';
              (item as HTMLElement).style.display = !q || repo.includes(q) ? '' : 'none';
            });
          }
        }
      }
    }
  }

  /**
   * Apply filters and sort to releases
   */
  private applyFilters(): void {
    let filtered = this.state.releases.filter((r) => {
      // Date filter from heatmap
      if (this.state.dateFilter) {
        const releaseDate = (r.publishedAt || r.createdAt || '').split('T')[0];
        if (releaseDate !== this.state.dateFilter) return false;
      }

      // Search query
      if (this.state.searchQuery) {
        const q = this.state.searchQuery.toLowerCase();
        const matches =
          (r.name || '').toLowerCase().includes(q) ||
          (r.tagName || '').toLowerCase().includes(q) ||
          (r.repoPath || '').toLowerCase().includes(q) ||
          (r.body || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Repo filter
      if (this.state.repoFilter.size > 0 && !this.state.repoFilter.has(r.repoPath)) {
        return false;
      }

      // Type filter
      if (this.state.typeFilter && r.type !== this.state.typeFilter) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: unknown = a[this.state.sortField];
      let bVal: unknown = b[this.state.sortField];

      if (this.state.sortField === 'publishedAt' || this.state.sortField === 'createdAt') {
        aVal = aVal ? new Date(aVal as string).getTime() : 0;
        bVal = bVal ? new Date(bVal as string).getTime() : 0;
      }

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let cmp = 0;
      if (aVal < bVal) cmp = -1;
      else if (aVal > bVal) cmp = 1;

      return this.state.sortDir === 'asc' ? cmp : -cmp;
    });

    // When showAllPerDay is false, keep only latest per day per repo
    // Skip when date filter is active
    if (!this.state.showAllPerDay && !this.state.dateFilter) {
      const seen: Record<string, Record<string, boolean>> = {};
      filtered = filtered.filter((r) => {
        const date = (r.publishedAt || r.createdAt || '').split('T')[0];
        const repoPath = r.repoPath;

        if (!seen[repoPath]) {
          seen[repoPath] = {};
        }

        if (seen[repoPath][date]) return false;
        seen[repoPath][date] = true;
        return true;
      });
    }

    this.state.filteredReleases = filtered;
  }

  /**
   * Get unique repositories
   */
  private getUniqueRepos(): string[] {
    const repos = new Set<string>();
    this.state.releases.forEach((r) => repos.add(r.repoPath));
    return Array.from(repos).sort();
  }

  /**
   * Show a message in the content area
   */
  private showMessage(type: 'loading' | 'error', message: string): void {
    let content = this.container.querySelector('.rlv-content');
    if (!content) {
      this.render();
      content = this.container.querySelector('.rlv-content');
    }
    if (content) {
      content.innerHTML = `<div class="rlv-message ${type}">${this.escapeHtml(message)}</div>`;
    }
  }

  // ============================================================================
  // Render Methods
  // ============================================================================

  /**
   * Render the full viewer
   */
  private render(): void {
    let html = '';

    // Skip link
    html += `<a href="#${this.id}-table" class="rlv-skip-link">Skip to releases table</a>`;

    // Header
    if (this.options.showHeader) {
      html += renderHeader(this.state);
    }

    // URL bar
    if (this.options.showUrlBar) {
      html += renderUrlBar(this.id, this.state.currentUrl);
    }

    // Heatmap section
    if (this.options.showHeatmap) {
      html += renderHeatmapSection(this.id, this.options.showHeatmapHelp);
    }

    // Content
    html += '<div class="rlv-content">';
    if (this.state.releases.length === 0) {
      html += '<div class="rlv-message">Enter a JSON URL above or pass data/url in options</div>';
    } else {
      html += renderControls(this.state, this.getUniqueRepos());
      html += renderTableSection(this.state, this.id, this.getUniqueRepos());
    }
    html += '</div>';

    // Footer
    html += '<div class="rlv-footer">';
    html += 'Powered by <a href="https://github.com/grokify/releaselog">ReleaseLog</a>';
    html += '</div>';

    this.container.innerHTML = html;

    // Bind URL bar events
    if (this.options.showUrlBar) {
      const urlInput = this.container.querySelector('.rlv-url-input') as HTMLInputElement;
      const urlBtn = this.container.querySelector('.rlv-url-btn');

      if (urlBtn && urlInput) {
        urlBtn.addEventListener('click', () => {
          const url = urlInput.value.trim();
          if (url) this.loadUrl(url);
        });

        urlInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            const url = urlInput.value.trim();
            if (url) this.loadUrl(url);
          }
        });
      }
    }

    // Bind table events
    this.bindTableEvents();
  }

  /**
   * Update just the table section
   */
  private updateTable(): void {
    const content = this.container.querySelector('.rlv-content');
    if (content) {
      let html = '';
      html += renderControls(this.state, this.getUniqueRepos());
      html += renderTableSection(this.state, this.id, this.getUniqueRepos());
      content.innerHTML = html;
      this.bindTableEvents();
      this.restoreRepoFilterState();
    }
  }

  /**
   * Bind table event listeners
   */
  private bindTableEvents(): void {
    // Search
    const search = this.container.querySelector('.rlv-search') as HTMLInputElement;
    if (search) {
      search.addEventListener('input', (e) => {
        this.state.searchQuery = (e.target as HTMLInputElement).value;
        this.state.currentPage = 1;
        this.applyFilters();
        this.updateTable();
      });
    }

    // Sort
    this.container.querySelectorAll<HTMLElement>('th[data-sort]').forEach((th) => {
      const handleSort = () => {
        const field = th.dataset.sort as keyof NormalizedRelease;
        if (this.state.sortField === field) {
          this.state.sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this.state.sortField = field;
          this.state.sortDir = field === 'publishedAt' ? 'desc' : 'asc';
        }
        this.applyFilters();
        this.updateTable();
      };

      th.addEventListener('click', handleSort);
      th.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSort();
        }
      });
    });

    // Repo filter button
    const repoFilterBtn = this.container.querySelector('.rlv-repo-filter-btn');
    if (repoFilterBtn) {
      repoFilterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.state.repoFilterOpen = !this.state.repoFilterOpen;
        const panel = this.container.querySelector('.rlv-repo-filter-panel');
        this.container.querySelectorAll('.rlv-links-dropdown.show').forEach((d) => {
          d.classList.remove('show');
        });
        if (this.state.repoFilterOpen && panel) {
          panel.classList.add('show');
          const input = panel.querySelector('input') as HTMLInputElement;
          if (input) input.focus();
        } else if (panel) {
          panel.classList.remove('show');
        }
      });
    }

    // Repo filter search
    const repoSearch = this.container.querySelector('.rlv-repo-filter-search input') as HTMLInputElement;
    if (repoSearch) {
      repoSearch.addEventListener('input', (e) => {
        this.state.repoSearchQuery = (e.target as HTMLInputElement).value;
        const q = this.state.repoSearchQuery.toLowerCase();
        this.container.querySelectorAll<HTMLElement>('.rlv-repo-filter-item').forEach((item) => {
          const repo = item.dataset.repo || '';
          item.style.display = !q || repo.includes(q) ? '' : 'none';
        });
      });
    }

    // Repo filter actions
    this.container.querySelectorAll<HTMLElement>('.rlv-repo-filter-actions a').forEach((a) => {
      a.addEventListener('click', () => {
        const action = a.dataset.action;
        if (action === 'select-all') {
          this.state.repoFilter.clear();
        } else if (action === 'deselect-all') {
          this.state.repoFilter.clear();
          this.state.repoFilter.add('__none__');
        }
        this.state.currentPage = 1;
        this.applyFilters();
        this.updateTable();
      });
    });

    // Repo filter checkboxes
    this.container.querySelectorAll<HTMLInputElement>('.rlv-repo-filter-item input').forEach((cb) => {
      cb.addEventListener('change', () => {
        const repo = cb.dataset.repoValue || '';
        const repos = this.getUniqueRepos();

        if (this.state.repoFilter.size === 0) {
          if (!cb.checked) {
            repos.forEach((r) => {
              if (r !== repo) this.state.repoFilter.add(r);
            });
          }
        } else {
          if (cb.checked) {
            this.state.repoFilter.add(repo);
            if (this.state.repoFilter.size === repos.length) {
              this.state.repoFilter.clear();
            }
          } else {
            this.state.repoFilter.delete(repo);
          }
        }
        this.state.currentPage = 1;
        this.applyFilters();
        this.updateTable();
      });
    });

    // Type filter
    const typeFilter = this.container.querySelector('.rlv-type-filter') as HTMLSelectElement;
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.state.typeFilter = (e.target as HTMLSelectElement).value;
        this.state.currentPage = 1;
        this.applyFilters();
        this.updateTable();
      });
    }

    // Column toggles
    this.container.querySelectorAll<HTMLInputElement>('[data-toggle]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const toggle = cb.dataset.toggle;
        if (toggle === 'allperday') {
          this.state.showAllPerDay = cb.checked;
          this.state.currentPage = 1;
        } else if (toggle === 'name') {
          this.state.showReleaseName = cb.checked;
        } else if (toggle === 'type') {
          this.state.showType = cb.checked;
          if (!cb.checked) this.state.typeFilter = '';
        }
        this.applyFilters();
        this.updateTable();
      });
    });

    // Pagination buttons
    this.container.querySelectorAll<HTMLButtonElement>('.rlv-pagination-buttons button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page || '1', 10);
        const totalPages = Math.ceil(this.state.filteredReleases.length / this.state.pageSize);
        this.state.currentPage = Math.max(1, Math.min(page, totalPages));
        this.updateTable();
      });
    });

    // Page size
    const pageSizeSelect = this.container.querySelector('.rlv-page-size-select') as HTMLSelectElement;
    if (pageSizeSelect) {
      pageSizeSelect.addEventListener('change', (e) => {
        this.state.pageSize = parseInt((e.target as HTMLSelectElement).value, 10);
        this.state.currentPage = 1;
        this.updateTable();
      });
    }

    // Links dropdowns
    this.container.querySelectorAll<HTMLButtonElement>('.rlv-links-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdownId = btn.dataset.dropdown || '';
        const dropdown = document.getElementById(dropdownId);
        this.container.querySelectorAll('.rlv-links-dropdown.show').forEach((d) => {
          if (d.id !== dropdownId) {
            d.classList.remove('show');
            const otherBtn = this.container.querySelector(`[aria-controls="${d.id}"]`);
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
        if (dropdown) {
          const isOpen = dropdown.classList.toggle('show');
          btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        } else if (e.key === 'Escape') {
          const dropdownId = btn.dataset.dropdown || '';
          const dropdown = document.getElementById(dropdownId);
          if (dropdown) dropdown.classList.remove('show');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Format a date string for display
   */
  private formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(str: string): string {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Set data directly
   */
  setData(data: unknown): void {
    this.loadData(data);
  }

  /**
   * Refresh by reloading from current URL
   */
  refresh(): void {
    if (this.state.currentUrl) {
      this.loadUrl(this.state.currentUrl);
    }
  }

  /**
   * Get filtered releases
   */
  getFilteredReleases(): NormalizedRelease[] {
    return this.state.filteredReleases.slice();
  }

  /**
   * Set date filter
   */
  setDateFilter(date: string | null): void {
    this.state.dateFilter = date;
    this.state.currentPage = 1;
    this.applyFilters();
    this.updateTable();
    this.updateDateFilterIndicator();
  }

  /**
   * Clear date filter
   */
  clearDateFilter(): void {
    this.setDateFilter(null);
  }

  /**
   * Destroy the viewer and clean up
   */
  destroy(): void {
    if (this.heatmap.calHeatmap) {
      this.heatmap.calHeatmap.destroy();
      this.heatmap.calHeatmap = null;
    }
    this.container.innerHTML = '';
    this.container.classList.remove('rlv-container');
  }
}
