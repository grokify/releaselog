"use strict";
var __ReleaseLogViewerModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/viewer/index.ts
  var index_exports = {};
  __export(index_exports, {
    DEFAULT_HEATMAP_COLORS: () => DEFAULT_HEATMAP_COLORS,
    ReleaseLogViewer: () => ReleaseLogViewer,
    default: () => index_default
  });

  // src/viewer/types.ts
  var DEFAULT_HEATMAP_COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

  // src/viewer/components/UrlBar.ts
  function renderUrlBar(instanceId, currentUrl) {
    return `
    <div class="rlv-url-bar" role="search" aria-label="Load release data">
      <label for="${instanceId}-url" class="rlv-sr-only">JSON URL</label>
      <input type="text"
             id="${instanceId}-url"
             class="rlv-url-input"
             placeholder="Enter JSON URL (e.g., releases.json)"
             value="${escapeHtml(currentUrl)}">
      <button class="rlv-url-btn" type="button">Load</button>
    </div>
  `;
  }
  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // src/viewer/components/Header.ts
  function renderHeader(state) {
    let html = '<div class="rlv-header">';
    html += '<h1 class="rlv-title">Release Log</h1>';
    html += '<p class="rlv-subtitle">';
    if (state.releases.length > 0) {
      html += `Sources: <strong>${escapeHtml2(state.sources)}</strong> &bull; `;
      html += `Generated: ${formatDate(state.generatedAt)} &bull; `;
      html += `Spec: ${state.specVersion}`;
      if (state.currentUrl) {
        html += ` &bull; <a href="${escapeHtml2(state.currentUrl)}" target="_blank">View JSON</a>`;
      }
    } else {
      html += "Load a release log JSON file to view releases.";
    }
    html += "</p></div>";
    return html;
  }
  function formatDate(dateStr) {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  }
  function escapeHtml2(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // src/viewer/icons.ts
  var icons = {
    /** Repository icon */
    repo: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>',
    /** Release/tag icon */
    release: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.237.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"/></svg>',
    /** Release notes/book icon */
    notes: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm8.755 3a2.25 2.25 0 012.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-1.992.572l.004-7.322zm-1.504 7.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574z"/></svg>',
    /** Changelog/document icon */
    changelog: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M2.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V4.664a.25.25 0 00-.073-.177l-2.914-2.914a.25.25 0 00-.177-.073H2.75zM1 1.75C1 .784 1.784 0 2.75 0h7.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V1.75zm5.75 3.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm-2.5.75a.5.5 0 11-1 0 .5.5 0 011 0zM4 9a.5.5 0 11-1 0 .5.5 0 011 0zm-.5 2.5a.5.5 0 100-1 .5.5 0 000 1zm2.25-3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"/></svg>',
    /** Git diff icon */
    diff: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8.75 1.75a.75.75 0 00-1.5 0V5H4a.75.75 0 000 1.5h3.25v3.25a.75.75 0 001.5 0V6.5H12A.75.75 0 0012 5H8.75V1.75zM4 13a.75.75 0 000 1.5h8a.75.75 0 100-1.5H4z"/></svg>',
    /** Chevron/dropdown icon */
    chevron: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/></svg>'
  };

  // src/viewer/components/RepoDropdown.ts
  function renderRepoDropdown(state, repos) {
    const { repoFilter } = state;
    let html = '<div class="rlv-repo-filter">';
    html += '<button class="rlv-repo-filter-btn" type="button">';
    html += `<span>${repoFilter.size === 0 ? "All Repositories" : `${repoFilter.size} of ${repos.length} repos`}</span>`;
    if (repoFilter.size > 0 && repoFilter.size < repos.length) {
      html += `<span class="rlv-count">${repoFilter.size}</span>`;
    }
    html += icons.chevron;
    html += "</button>";
    html += '<div class="rlv-repo-filter-panel">';
    html += '<div class="rlv-repo-filter-search"><input type="text" placeholder="Filter repositories..."></div>';
    html += '<div class="rlv-repo-filter-actions"><a data-action="select-all">Select All</a><a data-action="deselect-all">Deselect All</a></div>';
    html += '<div class="rlv-repo-filter-list">';
    for (const repo of repos) {
      const checked = repoFilter.size === 0 || repoFilter.has(repo);
      html += `<label class="rlv-repo-filter-item" data-repo="${escapeHtml3(repo.toLowerCase())}">`;
      html += `<input type="checkbox" data-repo-value="${escapeHtml3(repo)}"${checked ? " checked" : ""}>`;
      html += `<span>${escapeHtml3(repo)}</span></label>`;
    }
    html += "</div></div></div>";
    return html;
  }
  function escapeHtml3(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // src/viewer/components/Controls.ts
  function renderControls(state, repos) {
    const { filteredReleases, releases, searchQuery, typeFilter, showAllPerDay, showReleaseName, showType } = state;
    let html = '<div class="rlv-controls">';
    html += '<div class="rlv-stats">';
    html += `<span>Showing <strong>${filteredReleases.length}</strong> of <strong>${releases.length}</strong> releases</span>`;
    html += `<span><strong>${repos.length}</strong> repositories</span>`;
    html += "</div>";
    html += '<div class="rlv-filters">';
    html += '<div class="rlv-filters-left">';
    html += renderRepoDropdown(state, repos);
    html += `<input type="text" class="rlv-search" placeholder="Search releases..." value="${escapeHtml4(searchQuery)}">`;
    if (showType) {
      html += '<select class="rlv-type-filter">';
      html += '<option value="">All Types</option>';
      html += `<option value="release"${typeFilter === "release" ? " selected" : ""}>Releases</option>`;
      html += `<option value="tag"${typeFilter === "tag" ? " selected" : ""}>Tags</option>`;
      html += "</select>";
    }
    html += "</div>";
    html += '<div class="rlv-filters-right">';
    html += `<label class="rlv-checkbox-label"><input type="checkbox" data-toggle="allperday"${showAllPerDay ? " checked" : ""}> All per day</label>`;
    html += `<label class="rlv-checkbox-label"><input type="checkbox" data-toggle="name"${showReleaseName ? " checked" : ""}> Name</label>`;
    html += `<label class="rlv-checkbox-label"><input type="checkbox" data-toggle="type"${showType ? " checked" : ""}> Type</label>`;
    html += "</div>";
    html += "</div></div>";
    return html;
  }
  function escapeHtml4(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // src/viewer/components/Heatmap.ts
  function renderHeatmapSection(instanceId, showHelp) {
    let html = '<div class="rlv-heatmap-section" style="display: none;">';
    html += '<div class="rlv-heatmap-container">';
    html += '<div class="rlv-heatmap-header">';
    html += '<button class="rlv-heatmap-nav rlv-heatmap-prev" aria-label="Previous period" type="button">&larr;</button>';
    html += '<span class="rlv-heatmap-title">Release Activity</span>';
    html += '<button class="rlv-heatmap-nav rlv-heatmap-next" aria-label="Next period" type="button">&rarr;</button>';
    html += "</div>";
    html += `<div class="rlv-heatmap-chart" id="${instanceId}-heatmap"></div>`;
    html += '<div class="rlv-heatmap-footer">';
    html += '<div class="rlv-heatmap-legend">';
    html += '<span class="rlv-heatmap-legend-label">Less</span>';
    for (let i = 0; i < 5; i++) {
      html += `<span class="rlv-heatmap-legend-cell" data-level="${i}"></span>`;
    }
    html += '<span class="rlv-heatmap-legend-label">More</span>';
    html += "</div>";
    if (showHelp) {
      html += '<a href="#" class="rlv-heatmap-help-link">Learn how we count releases</a>';
    }
    html += "</div>";
    html += '<div class="rlv-heatmap-stats" aria-live="polite"></div>';
    if (showHelp) {
      html += '<div class="rlv-heatmap-help-tooltip" role="tooltip" aria-hidden="true">';
      html += '<button class="rlv-heatmap-help-close" aria-label="Close" type="button">&times;</button>';
      html += "<h4>How we count release activity</h4>";
      html += "<p>Each cell represents one day. Color intensity shows the <strong>number of releases published</strong> that day across all tracked repositories.</p>";
      html += "<p><strong>Click a cell</strong> to filter the table to releases from that day.</p>";
      html += "<ul>";
      html += '<li><span class="rlv-heatmap-legend-cell" data-level="0"></span> No releases</li>';
      html += '<li><span class="rlv-heatmap-legend-cell" data-level="1"></span> Few releases (bottom 25%)</li>';
      html += '<li><span class="rlv-heatmap-legend-cell" data-level="2"></span> Some releases (25-50%)</li>';
      html += '<li><span class="rlv-heatmap-legend-cell" data-level="3"></span> Many releases (50-75%)</li>';
      html += '<li><span class="rlv-heatmap-legend-cell" data-level="4"></span> Most releases (top 25%)</li>';
      html += "</ul>";
      html += "</div>";
    }
    html += "</div></div>";
    return html;
  }

  // src/viewer/components/Table.ts
  function renderTableSection(state, instanceId, repos) {
    const { filteredReleases, pageSize, currentPage, sortField, sortDir, showReleaseName, showType } = state;
    const totalPages = Math.ceil(filteredReleases.length / pageSize);
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, filteredReleases.length);
    const pageReleases = filteredReleases.slice(startIdx, endIdx);
    const colCount = 4 + (showReleaseName ? 1 : 0) + (showType ? 1 : 0);
    let html = "";
    html += `<div class="rlv-table-wrapper" id="${instanceId}-table">`;
    html += '<table class="rlv-table" role="grid"><thead><tr>';
    html += renderHeaderCell("publishedAt", "Date", sortField, sortDir);
    html += renderHeaderCell("repoPath", "Repository", sortField, sortDir);
    html += renderHeaderCell("tagName", "Version", sortField, sortDir);
    if (showReleaseName) {
      html += renderHeaderCell("name", "Name", sortField, sortDir);
    }
    if (showType) {
      html += renderHeaderCell("type", "Type", sortField, sortDir);
    }
    html += '<th class="rlv-no-sort" role="columnheader">Links</th>';
    html += "</tr></thead><tbody>";
    if (pageReleases.length === 0) {
      html += `<tr><td colspan="${colCount}" class="rlv-empty">No releases match your filters</td></tr>`;
    } else {
      for (let idx = 0; idx < pageReleases.length; idx++) {
        const r = pageReleases[idx];
        const dropdownId = `${instanceId}-links-${startIdx + idx}`;
        html += renderRow(r, showReleaseName, showType, dropdownId);
      }
    }
    html += "</tbody></table>";
    html += renderPagination(filteredReleases.length, totalPages, currentPage, startIdx, endIdx, pageSize);
    html += "</div>";
    return html;
  }
  function renderHeaderCell(field, title, sortField, sortDir) {
    const isSorted = sortField === field;
    const sortClass = isSorted ? `sorted-${sortDir}` : "";
    const ariaSort = isSorted ? sortDir === "asc" ? "ascending" : "descending" : "none";
    return `<th data-sort="${field}" class="${sortClass}" tabindex="0" role="columnheader" aria-sort="${ariaSort}">${title}</th>`;
  }
  function renderRow(r, showReleaseName, showType, dropdownId) {
    const date = r.publishedAt || r.createdAt;
    const name = r.name || r.tagName;
    const truncatedName = name && name.length > 60 ? name.substring(0, 60) + "..." : name;
    const releaseUrl = r.htmlUrl || r.urls?.githubRelease || "#";
    let html = "<tr>";
    html += `<td class="rlv-date">${formatDate2(date)}</td>`;
    html += `<td class="rlv-repo"><a href="https://github.com/${escapeHtml5(r.repoPath)}" target="_blank">${escapeHtml5(r.repoPath)}</a></td>`;
    html += `<td><a href="${escapeHtml5(releaseUrl)}" target="_blank"><span class="rlv-version${r.prerelease ? " prerelease" : ""}">${escapeHtml5(r.tagName)}</span></a></td>`;
    if (showReleaseName) {
      html += `<td class="rlv-release-name" title="${escapeHtml5(name)}"><a href="${escapeHtml5(releaseUrl)}" target="_blank">${escapeHtml5(truncatedName)}</a></td>`;
    }
    if (showType) {
      html += `<td><span class="rlv-type-badge ${r.type}">${r.type}</span></td>`;
    }
    html += `<td class="rlv-links-cell">${renderLinksDropdown(r, dropdownId)}</td>`;
    html += "</tr>";
    return html;
  }
  function renderLinksDropdown(r, dropdownId) {
    const repoUrl = `https://github.com/${r.repoPath}`;
    const releaseUrl = r.htmlUrl || r.urls?.githubRelease;
    const releaseNotesUrl = r.urls?.releaseNotes;
    const changelogUrl = r.urls?.changelog;
    const diffUrl = r.urls?.diff || (r.previousVersion ? `https://github.com/${r.repoPath}/compare/${r.previousVersion}...${r.tagName}` : null);
    let html = `<button class="rlv-links-btn" data-dropdown="${dropdownId}" aria-expanded="false" aria-haspopup="menu" aria-controls="${dropdownId}" type="button">`;
    html += `<span>Links</span> <span aria-hidden="true">${icons.chevron}</span></button>`;
    html += `<div class="rlv-links-dropdown" id="${dropdownId}" role="menu" aria-label="Release links for ${escapeHtml5(r.tagName)}">`;
    html += `<a href="${escapeHtml5(repoUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.repo}</span><span>Repository</span></a>`;
    if (releaseUrl) {
      html += `<a href="${escapeHtml5(releaseUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.release}</span><span>GitHub Release</span></a>`;
    }
    html += '<div class="rlv-divider" role="separator"></div>';
    if (releaseNotesUrl) {
      html += `<a href="${escapeHtml5(releaseNotesUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.notes}</span><span>Release Notes</span></a>`;
    } else {
      html += `<span class="rlv-disabled" role="menuitem" aria-disabled="true"><span aria-hidden="true">${icons.notes}</span><span>Release Notes</span></span>`;
    }
    if (changelogUrl) {
      html += `<a href="${escapeHtml5(changelogUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.changelog}</span><span>Changelog</span></a>`;
    } else {
      html += `<span class="rlv-disabled" role="menuitem" aria-disabled="true"><span aria-hidden="true">${icons.changelog}</span><span>Changelog</span></span>`;
    }
    if (diffUrl) {
      html += `<a href="${escapeHtml5(diffUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.diff}</span><span>Git Diff</span></a>`;
    } else {
      html += `<span class="rlv-disabled" role="menuitem" aria-disabled="true"><span aria-hidden="true">${icons.diff}</span><span>Git Diff</span></span>`;
    }
    html += "</div>";
    return html;
  }
  function renderPagination(total, totalPages, currentPage, startIdx, endIdx, pageSize) {
    let html = '<div class="rlv-pagination">';
    html += `<div class="rlv-pagination-info">Showing ${startIdx + 1}-${endIdx} of ${total}</div>`;
    if (totalPages > 1) {
      html += '<div class="rlv-pagination-buttons">';
      html += `<button data-page="1"${currentPage === 1 ? " disabled" : ""} type="button">&laquo;</button>`;
      html += `<button data-page="${currentPage - 1}"${currentPage === 1 ? " disabled" : ""} type="button">&lsaquo;</button>`;
      const maxButtons = 7;
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      const endPage = Math.min(totalPages, startPage + maxButtons - 1);
      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        html += `<button data-page="${i}"${i === currentPage ? ' class="active"' : ""} type="button">${i}</button>`;
      }
      html += `<button data-page="${currentPage + 1}"${currentPage === totalPages ? " disabled" : ""} type="button">&rsaquo;</button>`;
      html += `<button data-page="${totalPages}"${currentPage === totalPages ? " disabled" : ""} type="button">&raquo;</button>`;
      html += "</div>";
    }
    html += '<div class="rlv-page-size"><select class="rlv-page-size-select">';
    for (const size of [10, 25, 50, 100]) {
      html += `<option value="${size}"${pageSize === size ? " selected" : ""}>${size} per page</option>`;
    }
    html += "</select></div></div>";
    return html;
  }
  function formatDate2(dateStr) {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  }
  function escapeHtml5(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // src/viewer/ReleaseLogViewer.ts
  var ReleaseLogViewer = class {
    static {
      /** Version string */
      this.version = "0.1.0";
    }
    /**
     * Create a new ReleaseLogViewer
     * @param container - CSS selector or DOM element
     * @param options - Configuration options
     */
    constructor(container, options = {}) {
      if (typeof container === "string") {
        const el = document.querySelector(container);
        if (!el) {
          throw new Error("ReleaseLogViewer: Container not found");
        }
        this.container = el;
      } else {
        this.container = container;
      }
      this.options = {
        url: options.url ?? "",
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
        onLoad: options.onLoad ?? (() => {
        }),
        onError: options.onError ?? (() => {
        }),
        onDateFilter: options.onDateFilter ?? (() => {
        })
      };
      this.state = {
        releases: [],
        filteredReleases: [],
        currentPage: 1,
        pageSize: this.options.pageSize,
        sortField: "publishedAt",
        sortDir: "desc",
        searchQuery: "",
        repoFilter: /* @__PURE__ */ new Set(),
        repoFilterOpen: false,
        repoSearchQuery: "",
        typeFilter: "",
        dateFilter: null,
        showReleaseName: this.options.showReleaseName,
        showType: this.options.showType,
        showAllPerDay: this.options.showAllPerDay,
        specVersion: "",
        sources: "",
        generatedAt: "",
        currentUrl: ""
      };
      this.heatmap = {
        calHeatmap: null,
        releaseMinDate: null,
        releaseMaxDate: null,
        currentViewStart: null,
        aggregatedData: {},
        detailedData: {}
      };
      this.id = "rlv-" + Math.random().toString(36).substring(2, 11);
      this.init();
    }
    /**
     * Initialize the viewer
     */
    init() {
      this.container.classList.add("rlv-container");
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
    bindGlobalEvents() {
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.closest(".rlv-repo-filter")) {
          this.closeRepoFilter();
        }
        this.container.querySelectorAll(".rlv-links-dropdown.show").forEach((d) => {
          d.classList.remove("show");
          const btn = this.container.querySelector(`[aria-controls="${d.id}"]`);
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeRepoFilter();
          this.container.querySelectorAll(".rlv-links-dropdown.show").forEach((d) => {
            d.classList.remove("show");
            const btn = this.container.querySelector(`[aria-controls="${d.id}"]`);
            if (btn) btn.setAttribute("aria-expanded", "false");
          });
          const helpTooltip = this.container.querySelector(".rlv-heatmap-help-tooltip");
          if (helpTooltip) {
            helpTooltip.classList.remove("show");
            helpTooltip.setAttribute("aria-hidden", "true");
          }
        }
      });
    }
    /**
     * Load data from URL
     */
    loadUrl(url) {
      this.showMessage("loading", "Loading releases...");
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      }).then((data) => {
        this.loadData(data, url);
        this.options.onLoad(data);
      }).catch((error) => {
        this.showMessage("error", `Error loading data: ${error.message}`);
        this.options.onError(error);
      });
    }
    /**
     * Load data directly
     */
    loadData(data, url) {
      const releaseData = data;
      if (!releaseData.releases || !Array.isArray(releaseData.releases)) {
        this.showMessage("error", "Invalid JSON format: missing releases array");
        return;
      }
      this.state.releases = releaseData.releases.map((r) => this.normalizeRelease(r));
      this.state.sources = releaseData.sources ? releaseData.sources.join(", ") : "Unknown";
      this.state.generatedAt = releaseData.generatedAt || releaseData.generated_at || "";
      this.state.specVersion = releaseData.specVersion || releaseData.ir_version || "unknown";
      this.state.currentUrl = url || "";
      this.state.currentPage = 1;
      this.state.repoFilter.clear();
      this.state.dateFilter = null;
      this.computeAggregatedData();
      this.applyFilters();
      this.render();
      if (this.options.showHeatmap && this.state.releases.length > 0) {
        this.initHeatmap();
      }
    }
    /**
     * Normalize a release object to consistent format
     */
    normalizeRelease(r) {
      const release = r;
      return {
        id: release.id,
        repoPath: release.repoPath || release.repo_path || "",
        repoOwner: release.repoOwner || release.repo_owner || "",
        repoName: release.repoName || release.repo_name || "",
        type: release.type,
        tagName: release.tagName || release.tag_name || "",
        name: release.name || "",
        body: release.body,
        publishedAt: release.publishedAt || release.published_at,
        createdAt: release.createdAt || release.created_at,
        draft: release.draft,
        prerelease: release.prerelease,
        urls: release.urls,
        author: release.author,
        previousVersion: release.previousVersion || release.previous_version,
        htmlUrl: release.urls?.githubRelease || release.html_url,
        authorLogin: release.author?.login || release.author_login,
        categories: release.categories
      };
    }
    // ============================================================================
    // Heatmap Methods
    // ============================================================================
    /**
     * Compute aggregated data for heatmap
     */
    computeAggregatedData() {
      this.heatmap.aggregatedData = {};
      this.heatmap.detailedData = {};
      this.heatmap.releaseMinDate = null;
      this.heatmap.releaseMaxDate = null;
      for (const r of this.state.releases) {
        const dateStr = r.publishedAt || r.createdAt;
        if (!dateStr) continue;
        const date = dateStr.split("T")[0];
        const d = new Date(dateStr);
        if (!this.heatmap.releaseMinDate || d < this.heatmap.releaseMinDate) {
          this.heatmap.releaseMinDate = d;
        }
        if (!this.heatmap.releaseMaxDate || d > this.heatmap.releaseMaxDate) {
          this.heatmap.releaseMaxDate = d;
        }
        this.heatmap.aggregatedData[date] = (this.heatmap.aggregatedData[date] || 0) + 1;
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
    calculateColorScale() {
      const values = Object.values(this.heatmap.aggregatedData).filter((v) => v > 0).sort((a, b) => a - b);
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
    initHeatmap() {
      const CalHeatmap = window.CalHeatmap;
      if (!CalHeatmap) {
        console.warn("ReleaseLogViewer: cal-heatmap not loaded, skipping heatmap");
        const heatmapSection2 = this.container.querySelector(".rlv-heatmap-section");
        if (heatmapSection2) heatmapSection2.style.display = "none";
        return;
      }
      if (this.heatmap.calHeatmap) {
        this.heatmap.calHeatmap.destroy();
      }
      const heatmapSection = this.container.querySelector(".rlv-heatmap-section");
      if (heatmapSection) heatmapSection.style.display = "block";
      const colorScale = this.calculateColorScale();
      const data = Object.entries(this.heatmap.aggregatedData).map(([date, value]) => ({
        date: /* @__PURE__ */ new Date(date + "T00:00:00"),
        value
      }));
      const values = Object.values(this.heatmap.aggregatedData);
      const totalReleases = values.reduce((sum, v) => sum + v, 0);
      const activeDays = values.filter((v) => v > 0).length;
      const maxPerDay = values.length > 0 ? Math.max(...values) : 0;
      const statsEl = this.container.querySelector(".rlv-heatmap-stats");
      if (statsEl) {
        statsEl.innerHTML = `<span>${totalReleases} releases</span><span>${activeDays} active days</span><span>Max: ${maxPerDay}/day</span>`;
      }
      const cal = new CalHeatmap();
      this.heatmap.calHeatmap = cal;
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      let endDate;
      if (this.heatmap.releaseMaxDate) {
        endDate = new Date(this.heatmap.releaseMaxDate);
        endDate.setHours(0, 0, 0, 0);
        if (endDate > today) {
          endDate = today;
        }
      } else {
        endDate = today;
      }
      const endWeek = new Date(endDate);
      const daysUntilSaturday = 6 - endDate.getDay();
      endWeek.setDate(endDate.getDate() + daysUntilSaturday);
      if (endWeek > today) {
        endWeek.setTime(today.getTime());
      }
      const startDate = new Date(endWeek);
      startDate.setMonth(startDate.getMonth() - (this.options.heatmapRange - 1));
      startDate.setDate(startDate.getDate() - startDate.getDay());
      this.heatmap.currentViewStart = new Date(startDate);
      const plugins = [];
      const CalendarLabel = window.CalendarLabel;
      if (CalendarLabel) {
        plugins.push([
          CalendarLabel,
          {
            position: "left",
            key: "left",
            text: () => ["", "Mon", "", "Wed", "", "Fri", ""],
            textAlign: "end",
            width: 30,
            padding: [0, 5, 0, 0]
          }
        ]);
      }
      const Tooltip = window.Tooltip;
      const Popper = window.Popper;
      if (Tooltip && Popper) {
        plugins.push([
          Tooltip,
          {
            text: (date, value, dayjsDate) => {
              const dateStr = dayjsDate.format("MMM D, YYYY");
              const dateKey = dayjsDate.format("YYYY-MM-DD");
              const dayData = this.heatmap.detailedData[dateKey];
              if (!dayData || dayData.count === 0) {
                return `No releases on ${dateStr}`;
              }
              const count = dayData.count;
              const repos = dayData.repos.slice(0, 3);
              const moreCount = dayData.repos.length - 3;
              let html = `<strong>${count} release${count !== 1 ? "s" : ""}</strong> on ${dateStr}`;
              if (repos.length > 0) {
                html += "<br/>" + repos.join("<br/>");
                if (moreCount > 0) {
                  html += `<br/><em>+${moreCount} more</em>`;
                }
              }
              return html;
            }
          }
        ]);
      }
      const chartSelector = `#${this.id}-heatmap`;
      const chartEl = this.container.querySelector(".rlv-heatmap-chart");
      if (!chartEl) return;
      const heatmapColors = this.options.heatmapColors;
      cal.paint(
        {
          itemSelector: chartSelector,
          data: {
            source: data,
            x: "date",
            y: "value",
            groupY: "sum"
          },
          date: { start: startDate, max: today },
          range: this.options.heatmapRange,
          scale: {
            color: {
              type: "threshold",
              range: heatmapColors,
              domain: colorScale
            }
          },
          domain: {
            type: "month",
            gutter: 4,
            label: { text: "MMM", position: "bottom" }
          },
          subDomain: {
            type: "ghDay",
            width: 11,
            height: 11,
            gutter: 2,
            radius: 2
          }
        },
        plugins
      ).then(() => {
        this.bindHeatmapEvents();
        this.updateHeatmapNavButtons();
        this.hideFutureCells();
      }).catch((err) => {
        console.error("Heatmap paint error:", err);
      });
    }
    /**
     * Hide future cells in heatmap
     */
    hideFutureCells() {
      if (!this.heatmap.calHeatmap) return;
      const chartEl = this.container.querySelector(".rlv-heatmap-chart");
      if (!chartEl) return;
      const today = /* @__PURE__ */ new Date();
      today.setHours(23, 59, 59, 999);
      const todayTimestamp = today.getTime();
      const dc = this.heatmap.calHeatmap.domainCollection;
      if (!dc) return;
      const futureCells = [];
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
      const allRects = chartEl.querySelectorAll("rect.ch-subdomain-bg");
      let cellIndex = 0;
      const timestampToIndex = {};
      dc.keys.forEach((domainKey) => {
        const subdomains = dc.collection.get(domainKey);
        if (subdomains) {
          subdomains.forEach((cell) => {
            timestampToIndex[cell.t] = cellIndex;
            cellIndex++;
          });
        }
      });
      futureCells.forEach((cell) => {
        const idx = timestampToIndex[cell.t];
        if (idx !== void 0 && allRects[idx]) {
          allRects[idx].style.display = "none";
        }
      });
    }
    /**
     * Bind heatmap events
     */
    bindHeatmapEvents() {
      const prevBtn = this.container.querySelector(".rlv-heatmap-prev");
      const nextBtn = this.container.querySelector(".rlv-heatmap-next");
      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
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
        nextBtn.addEventListener("click", () => {
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
      if (this.heatmap.calHeatmap) {
        this.heatmap.calHeatmap.on("click", (...args) => {
          const [_event, timestamp, value] = args;
          this.handleHeatmapClick(timestamp, value);
        });
      }
      const helpLink = this.container.querySelector(".rlv-heatmap-help-link");
      const helpTooltip = this.container.querySelector(".rlv-heatmap-help-tooltip");
      const helpClose = this.container.querySelector(".rlv-heatmap-help-close");
      if (helpLink && helpTooltip) {
        helpLink.addEventListener("click", (e) => {
          e.preventDefault();
          const isVisible = helpTooltip.classList.contains("show");
          helpTooltip.classList.toggle("show");
          helpTooltip.setAttribute("aria-hidden", isVisible ? "true" : "false");
        });
        if (helpClose) {
          helpClose.addEventListener("click", () => {
            helpTooltip.classList.remove("show");
            helpTooltip.setAttribute("aria-hidden", "true");
            helpLink.focus();
          });
        }
      }
    }
    /**
     * Update heatmap navigation button states
     */
    updateHeatmapNavButtons() {
      const prevBtn = this.container.querySelector(".rlv-heatmap-prev");
      const nextBtn = this.container.querySelector(".rlv-heatmap-next");
      if (!prevBtn || !nextBtn || !this.heatmap.currentViewStart) return;
      const viewEnd = new Date(this.heatmap.currentViewStart);
      viewEnd.setMonth(viewEnd.getMonth() + this.options.heatmapRange);
      let shouldDisablePrev = false;
      if (this.heatmap.releaseMinDate) {
        const minDateWeek = new Date(this.heatmap.releaseMinDate);
        minDateWeek.setDate(minDateWeek.getDate() - minDateWeek.getDay());
        shouldDisablePrev = this.heatmap.currentViewStart <= minDateWeek;
      }
      prevBtn.disabled = shouldDisablePrev;
      prevBtn.setAttribute("aria-disabled", shouldDisablePrev ? "true" : "false");
      const today = /* @__PURE__ */ new Date();
      today.setHours(23, 59, 59, 999);
      const shouldDisableNext = viewEnd > today;
      nextBtn.disabled = shouldDisableNext;
      nextBtn.setAttribute("aria-disabled", shouldDisableNext ? "true" : "false");
    }
    /**
     * Handle heatmap cell click
     */
    handleHeatmapClick(timestamp, _value) {
      const clickedDate = new Date(timestamp);
      const dateKey = clickedDate.toISOString().split("T")[0];
      if (this.state.dateFilter === dateKey) {
        this.state.dateFilter = null;
      } else {
        this.state.dateFilter = dateKey;
      }
      this.state.currentPage = 1;
      this.applyFilters();
      this.updateTable();
      this.updateDateFilterIndicator();
      const tableWrapper = this.container.querySelector(".rlv-table-wrapper");
      if (tableWrapper) {
        tableWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      this.options.onDateFilter(this.state.dateFilter, this.heatmap.detailedData[dateKey]);
    }
    /**
     * Update date filter indicator
     */
    updateDateFilterIndicator() {
      let indicator = this.container.querySelector(".rlv-date-filter-active");
      if (this.state.dateFilter) {
        if (!indicator) {
          const controls = this.container.querySelector(".rlv-controls");
          if (controls) {
            indicator = document.createElement("div");
            indicator.className = "rlv-date-filter-active";
            controls.insertBefore(indicator, controls.firstChild);
          }
        }
        if (indicator) {
          const dayData = this.heatmap.detailedData[this.state.dateFilter];
          const count = dayData ? dayData.count : 0;
          indicator.innerHTML = `<span>Showing <strong>${count} release${count !== 1 ? "s" : ""}</strong> from <strong>${this.formatDate(this.state.dateFilter)}</strong></span><button class="rlv-date-filter-clear" type="button">Clear &times;</button>`;
          const clearBtn = indicator.querySelector(".rlv-date-filter-clear");
          if (clearBtn) {
            clearBtn.addEventListener("click", () => {
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
    closeRepoFilter() {
      this.state.repoFilterOpen = false;
      this.state.repoSearchQuery = "";
      const panel = this.container.querySelector(".rlv-repo-filter-panel");
      if (panel) panel.classList.remove("show");
    }
    /**
     * Restore repository filter state after re-render
     */
    restoreRepoFilterState() {
      if (this.state.repoFilterOpen) {
        const panel = this.container.querySelector(".rlv-repo-filter-panel");
        if (panel) {
          panel.classList.add("show");
          const searchInput = panel.querySelector("input");
          if (searchInput) {
            searchInput.value = this.state.repoSearchQuery;
            if (this.state.repoSearchQuery) {
              const q = this.state.repoSearchQuery.toLowerCase();
              this.container.querySelectorAll(".rlv-repo-filter-item").forEach((item) => {
                const repo = item.dataset.repo || "";
                item.style.display = !q || repo.includes(q) ? "" : "none";
              });
            }
          }
        }
      }
    }
    /**
     * Apply filters and sort to releases
     */
    applyFilters() {
      let filtered = this.state.releases.filter((r) => {
        if (this.state.dateFilter) {
          const releaseDate = (r.publishedAt || r.createdAt || "").split("T")[0];
          if (releaseDate !== this.state.dateFilter) return false;
        }
        if (this.state.searchQuery) {
          const q = this.state.searchQuery.toLowerCase();
          const matches = (r.name || "").toLowerCase().includes(q) || (r.tagName || "").toLowerCase().includes(q) || (r.repoPath || "").toLowerCase().includes(q) || (r.body || "").toLowerCase().includes(q);
          if (!matches) return false;
        }
        if (this.state.repoFilter.size > 0 && !this.state.repoFilter.has(r.repoPath)) {
          return false;
        }
        if (this.state.typeFilter && r.type !== this.state.typeFilter) {
          return false;
        }
        return true;
      });
      filtered.sort((a, b) => {
        let aVal = a[this.state.sortField];
        let bVal = b[this.state.sortField];
        if (this.state.sortField === "publishedAt" || this.state.sortField === "createdAt") {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        }
        if (aVal === null || aVal === void 0) return 1;
        if (bVal === null || bVal === void 0) return -1;
        let cmp = 0;
        if (aVal < bVal) cmp = -1;
        else if (aVal > bVal) cmp = 1;
        return this.state.sortDir === "asc" ? cmp : -cmp;
      });
      if (!this.state.showAllPerDay && !this.state.dateFilter) {
        const seen = {};
        filtered = filtered.filter((r) => {
          const date = (r.publishedAt || r.createdAt || "").split("T")[0];
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
    getUniqueRepos() {
      const repos = /* @__PURE__ */ new Set();
      this.state.releases.forEach((r) => repos.add(r.repoPath));
      return Array.from(repos).sort();
    }
    /**
     * Show a message in the content area
     */
    showMessage(type, message) {
      let content = this.container.querySelector(".rlv-content");
      if (!content) {
        this.render();
        content = this.container.querySelector(".rlv-content");
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
    render() {
      let html = "";
      html += `<a href="#${this.id}-table" class="rlv-skip-link">Skip to releases table</a>`;
      if (this.options.showHeader) {
        html += renderHeader(this.state);
      }
      if (this.options.showUrlBar) {
        html += renderUrlBar(this.id, this.state.currentUrl);
      }
      if (this.options.showHeatmap) {
        html += renderHeatmapSection(this.id, this.options.showHeatmapHelp);
      }
      html += '<div class="rlv-content">';
      if (this.state.releases.length === 0) {
        html += '<div class="rlv-message">Enter a JSON URL above or pass data/url in options</div>';
      } else {
        html += renderControls(this.state, this.getUniqueRepos());
        html += renderTableSection(this.state, this.id, this.getUniqueRepos());
      }
      html += "</div>";
      html += '<div class="rlv-footer">';
      html += 'Powered by <a href="https://github.com/grokify/releaselog">ReleaseLog</a>';
      html += "</div>";
      this.container.innerHTML = html;
      if (this.options.showUrlBar) {
        const urlInput = this.container.querySelector(".rlv-url-input");
        const urlBtn = this.container.querySelector(".rlv-url-btn");
        if (urlBtn && urlInput) {
          urlBtn.addEventListener("click", () => {
            const url = urlInput.value.trim();
            if (url) this.loadUrl(url);
          });
          urlInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
              const url = urlInput.value.trim();
              if (url) this.loadUrl(url);
            }
          });
        }
      }
      this.bindTableEvents();
    }
    /**
     * Update just the table section
     */
    updateTable() {
      const content = this.container.querySelector(".rlv-content");
      if (content) {
        let html = "";
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
    bindTableEvents() {
      const search = this.container.querySelector(".rlv-search");
      if (search) {
        search.addEventListener("input", (e) => {
          this.state.searchQuery = e.target.value;
          this.state.currentPage = 1;
          this.applyFilters();
          this.updateTable();
        });
      }
      this.container.querySelectorAll("th[data-sort]").forEach((th) => {
        const handleSort = () => {
          const field = th.dataset.sort;
          if (this.state.sortField === field) {
            this.state.sortDir = this.state.sortDir === "asc" ? "desc" : "asc";
          } else {
            this.state.sortField = field;
            this.state.sortDir = field === "publishedAt" ? "desc" : "asc";
          }
          this.applyFilters();
          this.updateTable();
        };
        th.addEventListener("click", handleSort);
        th.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSort();
          }
        });
      });
      const repoFilterBtn = this.container.querySelector(".rlv-repo-filter-btn");
      if (repoFilterBtn) {
        repoFilterBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.state.repoFilterOpen = !this.state.repoFilterOpen;
          const panel = this.container.querySelector(".rlv-repo-filter-panel");
          this.container.querySelectorAll(".rlv-links-dropdown.show").forEach((d) => {
            d.classList.remove("show");
          });
          if (this.state.repoFilterOpen && panel) {
            panel.classList.add("show");
            const input = panel.querySelector("input");
            if (input) input.focus();
          } else if (panel) {
            panel.classList.remove("show");
          }
        });
      }
      const repoSearch = this.container.querySelector(".rlv-repo-filter-search input");
      if (repoSearch) {
        repoSearch.addEventListener("input", (e) => {
          this.state.repoSearchQuery = e.target.value;
          const q = this.state.repoSearchQuery.toLowerCase();
          this.container.querySelectorAll(".rlv-repo-filter-item").forEach((item) => {
            const repo = item.dataset.repo || "";
            item.style.display = !q || repo.includes(q) ? "" : "none";
          });
        });
      }
      this.container.querySelectorAll(".rlv-repo-filter-actions a").forEach((a) => {
        a.addEventListener("click", () => {
          const action = a.dataset.action;
          if (action === "select-all") {
            this.state.repoFilter.clear();
          } else if (action === "deselect-all") {
            this.state.repoFilter.clear();
            this.state.repoFilter.add("__none__");
          }
          this.state.currentPage = 1;
          this.applyFilters();
          this.updateTable();
        });
      });
      this.container.querySelectorAll(".rlv-repo-filter-item input").forEach((cb) => {
        cb.addEventListener("change", () => {
          const repo = cb.dataset.repoValue || "";
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
      const typeFilter = this.container.querySelector(".rlv-type-filter");
      if (typeFilter) {
        typeFilter.addEventListener("change", (e) => {
          this.state.typeFilter = e.target.value;
          this.state.currentPage = 1;
          this.applyFilters();
          this.updateTable();
        });
      }
      this.container.querySelectorAll("[data-toggle]").forEach((cb) => {
        cb.addEventListener("change", () => {
          const toggle = cb.dataset.toggle;
          if (toggle === "allperday") {
            this.state.showAllPerDay = cb.checked;
            this.state.currentPage = 1;
          } else if (toggle === "name") {
            this.state.showReleaseName = cb.checked;
          } else if (toggle === "type") {
            this.state.showType = cb.checked;
            if (!cb.checked) this.state.typeFilter = "";
          }
          this.applyFilters();
          this.updateTable();
        });
      });
      this.container.querySelectorAll(".rlv-pagination-buttons button").forEach((btn) => {
        btn.addEventListener("click", () => {
          const page = parseInt(btn.dataset.page || "1", 10);
          const totalPages = Math.ceil(this.state.filteredReleases.length / this.state.pageSize);
          this.state.currentPage = Math.max(1, Math.min(page, totalPages));
          this.updateTable();
        });
      });
      const pageSizeSelect = this.container.querySelector(".rlv-page-size-select");
      if (pageSizeSelect) {
        pageSizeSelect.addEventListener("change", (e) => {
          this.state.pageSize = parseInt(e.target.value, 10);
          this.state.currentPage = 1;
          this.updateTable();
        });
      }
      this.container.querySelectorAll(".rlv-links-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const dropdownId = btn.dataset.dropdown || "";
          const dropdown = document.getElementById(dropdownId);
          this.container.querySelectorAll(".rlv-links-dropdown.show").forEach((d) => {
            if (d.id !== dropdownId) {
              d.classList.remove("show");
              const otherBtn = this.container.querySelector(`[aria-controls="${d.id}"]`);
              if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            }
          });
          if (dropdown) {
            const isOpen = dropdown.classList.toggle("show");
            btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
          }
        });
        btn.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            btn.click();
          } else if (e.key === "Escape") {
            const dropdownId = btn.dataset.dropdown || "";
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) dropdown.classList.remove("show");
            btn.setAttribute("aria-expanded", "false");
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
    formatDate(dateStr) {
      if (!dateStr) return "-";
      try {
        return new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      } catch {
        return dateStr;
      }
    }
    /**
     * Escape HTML special characters
     */
    escapeHtml(str) {
      if (!str) return "";
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }
    // ============================================================================
    // Public API
    // ============================================================================
    /**
     * Set data directly
     */
    setData(data) {
      this.loadData(data);
    }
    /**
     * Refresh by reloading from current URL
     */
    refresh() {
      if (this.state.currentUrl) {
        this.loadUrl(this.state.currentUrl);
      }
    }
    /**
     * Get filtered releases
     */
    getFilteredReleases() {
      return this.state.filteredReleases.slice();
    }
    /**
     * Set date filter
     */
    setDateFilter(date) {
      this.state.dateFilter = date;
      this.state.currentPage = 1;
      this.applyFilters();
      this.updateTable();
      this.updateDateFilterIndicator();
    }
    /**
     * Clear date filter
     */
    clearDateFilter() {
      this.setDateFilter(null);
    }
    /**
     * Destroy the viewer and clean up
     */
    destroy() {
      if (this.heatmap.calHeatmap) {
        this.heatmap.calHeatmap.destroy();
        this.heatmap.calHeatmap = null;
      }
      this.container.innerHTML = "";
      this.container.classList.remove("rlv-container");
    }
  };

  // src/viewer/index.ts
  var index_default = ReleaseLogViewer;
  return __toCommonJS(index_exports);
})();
if(typeof window!=='undefined'){window.ReleaseLogViewer=__ReleaseLogViewerModule.ReleaseLogViewer||__ReleaseLogViewerModule.default;}
//# sourceMappingURL=releaselog-viewer.js.map
