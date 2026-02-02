import {
  Release,
  ReleaseLogData,
  ReleaseLogOptions,
  ColumnDefinition,
  FilterConfig,
  SortConfig,
  SortDirection,
  PaginationConfig,
  Labels,
  DEFAULT_LABELS,
  DEFAULT_COLUMNS,
} from './types';
import { safeParseReleaseLog, type Release as SchemaRelease } from './schemas';
import {
  createReleaseHeatmap,
  createNavigableHeatmap,
  type HeatmapOptions,
} from './components/heatmap';

/**
 * ReleaseLog - A customizable release log viewer
 *
 * Similar API to Tabulator for familiarity:
 * ```typescript
 * const table = new ReleaseLog("#container", {
 *   ajaxURL: "releases.json",
 *   columns: [...],
 *   pagination: { enabled: true, size: 25 },
 *   events: {
 *     releaseClick: (e, release) => console.log(release)
 *   }
 * });
 * ```
 */
export class ReleaseLog {
  private container: HTMLElement;
  private options: Required<ReleaseLogOptions>;
  private data: ReleaseLogData | null = null;
  private filteredData: Release[] = [];
  private currentPage = 1;
  private currentSort: SortConfig | null = null;
  private currentFilter: FilterConfig = {};
  private labels: Labels;

  constructor(selector: string | HTMLElement, options: ReleaseLogOptions = {}) {
    // Get container element
    if (typeof selector === 'string') {
      const el = document.querySelector(selector);
      if (!el) throw new Error(`ReleaseLog: Element not found: ${selector}`);
      this.container = el as HTMLElement;
    } else {
      this.container = selector;
    }

    // Initialize labels first (needed by mergeOptions)
    this.labels = { ...DEFAULT_LABELS, ...options.labels };

    // Merge options with defaults
    this.options = this.mergeOptions(options);

    // Apply initial filter and sort
    if (options.initialFilter) {
      this.currentFilter = options.initialFilter;
    }
    if (options.initialSort && options.initialSort.length > 0) {
      this.currentSort = options.initialSort[0];
    }

    // Initialize
    this.init();
  }

  private mergeOptions(options: ReleaseLogOptions): Required<ReleaseLogOptions> {
    const paginationDefault: PaginationConfig = {
      enabled: false,
      size: 25,
      sizeSelector: [10, 25, 50, 100],
      buttonCount: 5,
    };

    return {
      data: options.data ?? undefined,
      ajaxURL: options.ajaxURL ?? '',
      ajaxConfig: options.ajaxConfig ?? {},
      layout: options.layout ?? 'fitColumns',
      responsiveLayout: options.responsiveLayout ?? true,
      minHeight: options.minHeight ?? '',
      maxHeight: options.maxHeight ?? '',
      placeholder: options.placeholder ?? this.labels.noData,
      columns: options.columns ?? DEFAULT_COLUMNS,
      autoColumns: options.autoColumns ?? false,
      initialSort: options.initialSort ?? [],
      headerSort: options.headerSort ?? true,
      initialFilter: options.initialFilter ?? {},
      showFilters: options.showFilters ?? true,
      filterPosition: options.filterPosition ?? 'top',
      pagination: typeof options.pagination === 'boolean'
        ? { ...paginationDefault, enabled: options.pagination }
        : { ...paginationDefault, ...options.pagination },
      showStats: options.showStats ?? true,
      showHeader: options.showHeader ?? true,
      rowHeight: options.rowHeight ?? '',
      alternateRowColors: options.alternateRowColors ?? true,
      theme: options.theme ?? 'default',
      locale: options.locale ?? 'en-US',
      labels: options.labels ?? {},
      events: options.events ?? {},
      cssClass: options.cssClass ?? '',
      keybindings: options.keybindings ?? true,
      renderMode: options.renderMode ?? 'basic',
    } as Required<ReleaseLogOptions>;
  }

  private async init(): Promise<void> {
    // Add theme class
    this.container.classList.add('releaselog');
    if (this.options.theme !== 'default') {
      this.container.classList.add(`releaselog-${this.options.theme}`);
    }
    if (this.options.cssClass) {
      this.container.classList.add(this.options.cssClass);
    }

    // Show loading state
    this.renderLoading();

    // Load data
    if (this.options.data) {
      this.setData(this.options.data);
    } else if (this.options.ajaxURL) {
      await this.loadData(this.options.ajaxURL);
    } else {
      this.renderPlaceholder();
    }
  }

  /**
   * Load data from URL
   */
  async loadData(url: string): Promise<void> {
    try {
      this.renderLoading();
      const response = await fetch(url, this.options.ajaxConfig);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      this.setData(data);
    } catch (error) {
      this.renderError(error as Error);
      this.options.events?.dataLoadError?.(error as Error);
    }
  }

  /**
   * Set data directly
   * Validates data with Zod schema if available, supports both camelCase and snake_case
   */
  setData(data: ReleaseLogData): void {
    // Try to validate with Zod schema (supports legacy snake_case)
    const result = safeParseReleaseLog(data);
    if (result.success) {
      // Convert Zod release type to legacy Release type for internal use
      const parsedData = result.data;
      this.data = {
        ir_version: parsedData.specVersion,
        generated_at: parsedData.generatedAt,
        sources: parsedData.sources,
        releases: parsedData.releases.map((r: SchemaRelease) => ({
          id: r.id ?? 0,
          repo_path: r.repoPath,
          repo_owner: r.repoOwner,
          repo_name: r.repoName,
          type: r.type,
          tag_name: r.tagName,
          name: r.name,
          body: r.body,
          published_at: r.publishedAt,
          created_at: r.createdAt,
          draft: r.draft,
          prerelease: r.prerelease,
          html_url: r.urls?.githubRelease,
          author_login: r.author?.login,
          author_avatar_url: r.author?.avatarUrl,
          categories: r.categories,
        })),
        stats: parsedData.stats ? {
          total_releases: parsedData.stats.totalReleases,
          total_repos: parsedData.stats.totalRepos,
          releases_by_month: parsedData.stats.releasesByMonth,
          releases_by_repo: parsedData.stats.releasesByRepo,
        } : undefined,
      };
    } else {
      // Fall back to direct assignment if validation fails
      // (supports legacy data that doesn't fully match schema)
      this.data = data;
    }
    this.applyFiltersAndSort();
    this.render();
    this.options.events?.dataLoaded?.(this.data);
    this.options.events?.tableBuilt?.();
  }

  /**
   * Get current data
   */
  getData(): ReleaseLogData | null {
    return this.data;
  }

  /**
   * Get filtered data
   */
  getFilteredData(): Release[] {
    return this.filteredData;
  }

  /**
   * Set filter
   */
  setFilter(filter: FilterConfig): void {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.applyFiltersAndSort();
    this.render();
    this.options.events?.filterChange?.(filter);
  }

  /**
   * Add filter
   */
  addFilter(field: keyof FilterConfig, value: unknown): void {
    (this.currentFilter as Record<string, unknown>)[field] = value;
    this.currentPage = 1;
    this.applyFiltersAndSort();
    this.render();
    this.options.events?.filterChange?.(this.currentFilter);
  }

  /**
   * Clear filters
   */
  clearFilter(): void {
    this.currentFilter = {};
    this.currentPage = 1;
    this.applyFiltersAndSort();
    this.render();
    this.options.events?.filterChange?.(this.currentFilter);
  }

  /**
   * Set sort
   */
  setSort(field: string, direction: SortDirection = 'desc'): void {
    this.currentSort = { field, direction };
    this.applyFiltersAndSort();
    this.render();
    this.options.events?.sortChange?.(this.currentSort);
  }

  /**
   * Set page
   */
  setPage(page: number): void {
    const pagination = this.options.pagination as PaginationConfig;
    const maxPage = Math.ceil(this.filteredData.length / pagination.size);
    this.currentPage = Math.max(1, Math.min(page, maxPage));
    this.render();
    this.options.events?.pageChange?.(this.currentPage, pagination.size);
  }

  /**
   * Get current page
   */
  getPage(): number {
    return this.currentPage;
  }

  /**
   * Set page size
   */
  setPageSize(size: number): void {
    const pagination = this.options.pagination as PaginationConfig;
    pagination.size = size;
    this.currentPage = 1;
    this.render();
  }

  /**
   * Redraw the table
   */
  redraw(): void {
    this.render();
  }

  /**
   * Destroy the table
   */
  destroy(): void {
    this.container.innerHTML = '';
    this.container.classList.remove('releaselog');
    this.data = null;
    this.filteredData = [];
  }

  private applyFiltersAndSort(): void {
    if (!this.data) {
      this.filteredData = [];
      return;
    }

    let releases = [...this.data.releases];

    // Apply filters
    const filter = this.currentFilter;

    if (filter.since) {
      const since = typeof filter.since === 'string' ? new Date(filter.since) : filter.since;
      releases = releases.filter(r => {
        const date = r.published_at || r.created_at;
        return date && new Date(date) >= since;
      });
    }

    if (filter.until) {
      const until = typeof filter.until === 'string' ? new Date(filter.until) : filter.until;
      releases = releases.filter(r => {
        const date = r.published_at || r.created_at;
        return date && new Date(date) <= until;
      });
    }

    if (filter.repo) {
      releases = releases.filter(r => r.repo_path === filter.repo);
    }

    if (filter.repos && filter.repos.length > 0) {
      releases = releases.filter(r => filter.repos!.includes(r.repo_path));
    }

    if (filter.owner) {
      releases = releases.filter(r => r.repo_owner === filter.owner);
    }

    if (filter.type) {
      releases = releases.filter(r => r.type === filter.type);
    }

    if (filter.categories && filter.categories.length > 0) {
      releases = releases.filter(r =>
        r.categories?.some(c => filter.categories!.includes(c))
      );
    }

    if (filter.excludePrereleases) {
      releases = releases.filter(r => !r.prerelease);
    }

    if (filter.excludeDrafts) {
      releases = releases.filter(r => !r.draft);
    }

    if (filter.search) {
      const search = filter.search.toLowerCase();
      releases = releases.filter(r =>
        r.name.toLowerCase().includes(search) ||
        r.tag_name.toLowerCase().includes(search) ||
        r.repo_path.toLowerCase().includes(search) ||
        r.body?.toLowerCase().includes(search)
      );
    }

    // Apply sort
    if (this.currentSort) {
      const { field, direction } = this.currentSort;
      releases.sort((a, b) => {
        const aVal = this.getFieldValue(a, field);
        const bVal = this.getFieldValue(b, field);

        let cmp = 0;
        if (aVal === null || aVal === undefined) cmp = 1;
        else if (bVal === null || bVal === undefined) cmp = -1;
        else if (aVal < bVal) cmp = -1;
        else if (aVal > bVal) cmp = 1;

        return direction === 'asc' ? cmp : -cmp;
      });
    }

    this.filteredData = releases;
  }

  private getFieldValue(release: Release, field: string): unknown {
    if (field === 'published_at' || field === 'created_at') {
      const val = release[field as keyof Release];
      return val ? new Date(val as string).getTime() : 0;
    }
    return release[field as keyof Release];
  }

  private render(): void {
    if (!this.data) return;

    const html: string[] = [];

    // Skip link for keyboard users
    html.push(`
      <a href="#releaselog-table" class="rl-skip-link">Skip to release table</a>
    `);

    // Screen reader live region for announcements
    html.push(`
      <div class="rl-sr-only" role="status" aria-live="polite" id="releaselog-status">
        Showing ${this.filteredData.length} releases
      </div>
    `);

    // Stats
    if (this.options.showStats && this.data.stats) {
      html.push(this.renderStats());
    }

    // Filters
    if (this.options.showFilters && this.options.filterPosition === 'top') {
      html.push(this.renderFilters());
    }

    // Table
    html.push(this.renderTable());

    // Filters (bottom)
    if (this.options.showFilters && this.options.filterPosition === 'bottom') {
      html.push(this.renderFilters());
    }

    // Pagination
    const pagination = this.options.pagination as PaginationConfig;
    if (pagination.enabled) {
      html.push(this.renderPagination());
    }

    this.container.innerHTML = html.join('');
    this.attachEventListeners();
  }

  private renderStats(): string {
    const stats = this.data!.stats!;
    return `
      <div class="releaselog-stats">
        <span class="releaselog-stat">
          <span class="releaselog-stat-label">${this.labels.statsTotal}:</span>
          <span class="releaselog-stat-value">${this.filteredData.length}</span>
        </span>
        <span class="releaselog-stat">
          <span class="releaselog-stat-label">${this.labels.statsRepos}:</span>
          <span class="releaselog-stat-value">${stats.total_repos}</span>
        </span>
      </div>
    `;
  }

  private renderFilters(): string {
    const repos = this.getUniqueRepos();

    return `
      <div class="releaselog-filters">
        <input type="text"
               class="releaselog-filter-search"
               placeholder="${this.labels.filterPlaceholder}"
               value="${this.currentFilter.search || ''}">

        <input type="date"
               class="releaselog-filter-since"
               placeholder="${this.labels.filterSince}"
               value="${this.formatDateInput(this.currentFilter.since)}">

        <input type="date"
               class="releaselog-filter-until"
               placeholder="${this.labels.filterUntil}"
               value="${this.formatDateInput(this.currentFilter.until)}">

        <select class="releaselog-filter-repo">
          <option value="">${this.labels.filterAll} ${this.labels.filterRepo}</option>
          ${repos.map(r => `<option value="${r}" ${this.currentFilter.repo === r ? 'selected' : ''}>${r}</option>`).join('')}
        </select>

        <select class="releaselog-filter-type">
          <option value="">${this.labels.filterAll}</option>
          <option value="release" ${this.currentFilter.type === 'release' ? 'selected' : ''}>${this.labels.filterReleases}</option>
          <option value="tag" ${this.currentFilter.type === 'tag' ? 'selected' : ''}>${this.labels.filterTags}</option>
        </select>

        <button class="releaselog-filter-clear">${this.labels.filterClear}</button>
      </div>
    `;
  }

  private renderTable(): string {
    const columns = this.options.columns.filter(c => c.visible !== false);
    const pagination = this.options.pagination as PaginationConfig;

    // Get page data
    let pageData = this.filteredData;
    if (pagination.enabled) {
      const start = (this.currentPage - 1) * pagination.size;
      pageData = this.filteredData.slice(start, start + pagination.size);
    }

    if (pageData.length === 0) {
      return `<div class="releaselog-placeholder">${this.options.placeholder}</div>`;
    }

    const headerHtml = this.options.showHeader ? `
      <thead>
        <tr>
          ${columns.map(col => this.renderHeaderCell(col)).join('')}
        </tr>
      </thead>
    ` : '';

    const bodyHtml = `
      <tbody>
        ${pageData.map((release, idx) => this.renderRow(release, columns, idx)).join('')}
      </tbody>
    `;

    const style = this.options.maxHeight ? `style="max-height: ${this.options.maxHeight}; overflow-y: auto;"` : '';

    return `
      <div class="releaselog-table-wrapper" id="releaselog-table" ${style}>
        <table class="releaselog-table" role="grid" aria-label="Release log" aria-describedby="releaselog-caption">
          <caption id="releaselog-caption" class="rl-sr-only">
            Release log showing ${pageData.length} of ${this.filteredData.length} releases
          </caption>
          ${headerHtml}
          ${bodyHtml}
        </table>
      </div>
    `;
  }

  private renderHeaderCell(col: ColumnDefinition): string {
    const sortable = col.sortable && this.options.headerSort;
    const isSorted = this.currentSort?.field === col.field;
    const sortDir = isSorted ? this.currentSort!.direction : '';
    const sortClass = sortable ? 'releaselog-sortable' : '';
    const sortedClass = isSorted ? `releaselog-sorted releaselog-sorted-${sortDir}` : '';
    const style = col.width ? `style="width: ${col.width}"` : '';

    // ARIA attributes for accessibility
    const ariaSort = isSorted ? `aria-sort="${sortDir === 'asc' ? 'ascending' : 'descending'}"` : '';
    const tabIndex = sortable ? 'tabindex="0"' : '';
    const role = sortable ? 'columnheader button' : 'columnheader';
    const ariaLabel = sortable
      ? `aria-label="${col.title}, sortable column${isSorted ? `, sorted ${sortDir === 'asc' ? 'ascending' : 'descending'}` : ''}, press Enter to sort"`
      : `aria-label="${col.title}"`;

    return `
      <th class="releaselog-header-cell ${sortClass} ${sortedClass} ${col.cssClass || ''}"
          data-field="${col.field}" ${style}
          role="${role}" ${ariaSort} ${tabIndex} ${ariaLabel}>
        ${col.title}
        ${sortable ? '<span class="releaselog-sort-icon" aria-hidden="true"></span>' : ''}
      </th>
    `;
  }

  private renderRow(release: Release, columns: ColumnDefinition[], idx: number): string {
    const altClass = this.options.alternateRowColors && idx % 2 === 1 ? 'releaselog-row-alt' : '';
    const preClass = release.prerelease ? 'releaselog-row-prerelease' : '';
    const style = this.options.rowHeight ? `style="height: ${this.options.rowHeight}"` : '';

    return `
      <tr class="releaselog-row ${altClass} ${preClass}" data-id="${release.id}" ${style}>
        ${columns.map(col => this.renderCell(release, col)).join('')}
      </tr>
    `;
  }

  private renderCell(release: Release, col: ColumnDefinition): string {
    const value = this.getFieldValue(release, col.field);
    const formatted = this.formatValue(value, release, col);
    const alignClass = col.align ? `releaselog-align-${col.align}` : '';

    return `
      <td class="releaselog-cell ${alignClass} ${col.cssClass || ''}">${formatted}</td>
    `;
  }

  private formatValue(value: unknown, release: Release, col: ColumnDefinition): string {
    if (value === null || value === undefined) return '';

    const formatter = col.formatter;
    const params = col.formatterParams || {};

    if (typeof formatter === 'function') {
      const el = document.createElement('span');
      const result = formatter(value, release, el);
      return typeof result === 'string' ? result : el.outerHTML;
    }

    switch (formatter) {
      case 'date':
        return this.formatDate(value as string);

      case 'link':
        if (params.urlField) {
          const url = release[params.urlField as keyof Release] as string;
          return `<a href="${url}" target="_blank" rel="noopener">${this.escapeHtml(String(value))}</a>`;
        }
        if (params.urlPrefix) {
          return `<a href="${params.urlPrefix}${value}" target="_blank" rel="noopener">${this.escapeHtml(String(value))}</a>`;
        }
        return this.escapeHtml(String(value));

      case 'badge':
        const badgeClass = `releaselog-badge releaselog-badge-${String(value).toLowerCase()}`;
        return `<span class="${badgeClass}">${this.escapeHtml(String(value))}</span>`;

      case 'avatar':
        const avatarUrl = release.author_avatar_url;
        if (avatarUrl) {
          return `
            <span class="releaselog-author">
              <img src="${avatarUrl}" alt="${value}" class="releaselog-avatar">
              <a href="https://github.com/${value}" target="_blank" rel="noopener">${this.escapeHtml(String(value))}</a>
            </span>
          `;
        }
        return this.escapeHtml(String(value));

      case 'markdown':
        // Basic markdown rendering (just for simple formatting)
        return this.renderBasicMarkdown(String(value));

      default:
        return this.escapeHtml(String(value));
    }
  }

  private renderPagination(): string {
    const pagination = this.options.pagination as PaginationConfig;
    const totalPages = Math.ceil(this.filteredData.length / pagination.size);
    const current = this.currentPage;

    if (totalPages <= 1) return '';

    // Calculate page range
    const half = Math.floor((pagination.buttonCount || 5) / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(totalPages, start + (pagination.buttonCount || 5) - 1);
    if (end - start < (pagination.buttonCount || 5) - 1) {
      start = Math.max(1, end - (pagination.buttonCount || 5) + 1);
    }

    const pages: string[] = [];
    for (let i = start; i <= end; i++) {
      const activeClass = i === current ? 'releaselog-page-active' : '';
      pages.push(`<button class="releaselog-page ${activeClass}" data-page="${i}">${i}</button>`);
    }

    const sizeSelector = pagination.sizeSelector ? `
      <select class="releaselog-page-size">
        ${(Array.isArray(pagination.sizeSelector) ? pagination.sizeSelector : [10, 25, 50, 100])
          .map(s => `<option value="${s}" ${s === pagination.size ? 'selected' : ''}>${s}</option>`)
          .join('')}
      </select>
    ` : '';

    return `
      <div class="releaselog-pagination">
        <button class="releaselog-page releaselog-page-first" data-page="1" ${current === 1 ? 'disabled' : ''}>${this.labels.pageFirst}</button>
        <button class="releaselog-page releaselog-page-prev" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>${this.labels.pagePrev}</button>
        ${pages.join('')}
        <button class="releaselog-page releaselog-page-next" data-page="${current + 1}" ${current === totalPages ? 'disabled' : ''}>${this.labels.pageNext}</button>
        <button class="releaselog-page releaselog-page-last" data-page="${totalPages}" ${current === totalPages ? 'disabled' : ''}>${this.labels.pageLast}</button>
        <span class="releaselog-page-info">${current} ${this.labels.pageOf} ${totalPages}</span>
        ${sizeSelector}
      </div>
    `;
  }

  private renderLoading(): void {
    this.container.innerHTML = `<div class="releaselog-loading">${this.labels.loading}</div>`;
  }

  private renderPlaceholder(): void {
    this.container.innerHTML = `<div class="releaselog-placeholder">${this.options.placeholder}</div>`;
  }

  private renderError(error: Error): void {
    this.container.innerHTML = `
      <div class="releaselog-error">
        ${this.labels.error}: ${this.escapeHtml(error.message)}
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Row clicks
    this.container.querySelectorAll('.releaselog-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const id = Number((row as HTMLElement).dataset.id);
        const release = this.filteredData.find(r => r.id === id);
        if (release) {
          this.options.events?.releaseClick?.(e as MouseEvent, release);
        }
      });
      row.addEventListener('dblclick', (e) => {
        const id = Number((row as HTMLElement).dataset.id);
        const release = this.filteredData.find(r => r.id === id);
        if (release) {
          this.options.events?.releaseDblClick?.(e as MouseEvent, release);
        }
      });
    });

    // Header sort clicks and keyboard navigation
    this.container.querySelectorAll('.releaselog-sortable').forEach(header => {
      const handleSort = () => {
        const field = (header as HTMLElement).dataset.field!;
        const newDir: SortDirection = this.currentSort?.field === field && this.currentSort.direction === 'desc' ? 'asc' : 'desc';
        this.setSort(field, newDir);
      };

      header.addEventListener('click', handleSort);

      // Keyboard navigation for accessibility
      header.addEventListener('keydown', (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          keyEvent.preventDefault();
          handleSort();
        }
      });
    });

    // Filter inputs
    const searchInput = this.container.querySelector('.releaselog-filter-search');
    searchInput?.addEventListener('input', (e) => {
      this.addFilter('search', (e.target as HTMLInputElement).value);
    });

    const sinceInput = this.container.querySelector('.releaselog-filter-since');
    sinceInput?.addEventListener('change', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.addFilter('since', val || undefined);
    });

    const untilInput = this.container.querySelector('.releaselog-filter-until');
    untilInput?.addEventListener('change', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.addFilter('until', val || undefined);
    });

    const repoSelect = this.container.querySelector('.releaselog-filter-repo');
    repoSelect?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value;
      this.addFilter('repo', val || undefined);
    });

    const typeSelect = this.container.querySelector('.releaselog-filter-type');
    typeSelect?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value;
      this.addFilter('type', val || undefined);
    });

    const clearBtn = this.container.querySelector('.releaselog-filter-clear');
    clearBtn?.addEventListener('click', () => {
      this.clearFilter();
    });

    // Pagination
    this.container.querySelectorAll('.releaselog-page[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = Number((btn as HTMLElement).dataset.page);
        this.setPage(page);
      });
    });

    const pageSizeSelect = this.container.querySelector('.releaselog-page-size');
    pageSizeSelect?.addEventListener('change', (e) => {
      this.setPageSize(Number((e.target as HTMLSelectElement).value));
    });
  }

  // Heatmap methods

  /**
   * Create a release activity heatmap in the specified container.
   * Requires cal-heatmap to be loaded.
   * @param container - Selector or element for the heatmap
   * @param options - Heatmap configuration options
   */
  createHeatmap(container: HTMLElement | string, options: HeatmapOptions = {}): ReturnType<typeof createReleaseHeatmap> {
    if (!this.data) {
      console.warn('No data loaded. Load data before creating heatmap.');
      return null;
    }

    // Convert legacy Release type to schema Release type for heatmap
    const schemaReleases = this.data.releases.map(r => ({
      id: r.id,
      repoPath: r.repo_path,
      repoOwner: r.repo_owner,
      repoName: r.repo_name,
      type: r.type,
      tagName: r.tag_name,
      name: r.name,
      body: r.body,
      publishedAt: r.published_at,
      createdAt: r.created_at,
      draft: r.draft,
      prerelease: r.prerelease,
    })) as SchemaRelease[];

    return createReleaseHeatmap(container, schemaReleases, options);
  }

  /**
   * Create a navigable heatmap with navigation controls.
   * @param container - Selector or element for the heatmap
   * @param options - Heatmap configuration options
   */
  createNavigableHeatmap(container: HTMLElement | string, options: HeatmapOptions = {}): ReturnType<typeof createNavigableHeatmap> {
    if (!this.data) {
      throw new Error('No data loaded. Load data before creating heatmap.');
    }

    // Convert legacy Release type to schema Release type for heatmap
    const schemaReleases = this.data.releases.map(r => ({
      id: r.id,
      repoPath: r.repo_path,
      repoOwner: r.repo_owner,
      repoName: r.repo_name,
      type: r.type,
      tagName: r.tag_name,
      name: r.name,
      body: r.body,
      publishedAt: r.published_at,
      createdAt: r.created_at,
      draft: r.draft,
      prerelease: r.prerelease,
    })) as SchemaRelease[];

    return createNavigableHeatmap(container, schemaReleases, options);
  }

  // Utility methods

  private getUniqueRepos(): string[] {
    if (!this.data) return [];
    const repos = new Set<string>();
    this.data.releases.forEach(r => repos.add(r.repo_path));
    return Array.from(repos).sort();
  }

  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(this.options.locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  private formatDateInput(date: Date | string | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  private renderBasicMarkdown(text: string): string {
    // Very basic markdown rendering
    return this.escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
}
