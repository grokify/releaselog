/**
 * Table Component
 *
 * Renders the releases table with pagination.
 */

import { icons } from '../icons';
import type { ViewerState, NormalizedRelease } from '../types';

/**
 * Render the full table section (controls + table + pagination)
 */
export function renderTableSection(state: ViewerState, instanceId: string, repos: string[]): string {
  const { filteredReleases, pageSize, currentPage, sortField, sortDir, showReleaseName, showType } = state;

  const totalPages = Math.ceil(filteredReleases.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, filteredReleases.length);
  const pageReleases = filteredReleases.slice(startIdx, endIdx);
  const colCount = 4 + (showReleaseName ? 1 : 0) + (showType ? 1 : 0);

  let html = '';

  // Table wrapper
  html += `<div class="rlv-table-wrapper" id="${instanceId}-table">`;

  // Table
  html += '<table class="rlv-table" role="grid"><thead><tr>';
  html += renderHeaderCell('publishedAt', 'Date', sortField, sortDir);
  html += renderHeaderCell('repoPath', 'Repository', sortField, sortDir);
  html += renderHeaderCell('tagName', 'Version', sortField, sortDir);
  if (showReleaseName) {
    html += renderHeaderCell('name', 'Name', sortField, sortDir);
  }
  if (showType) {
    html += renderHeaderCell('type', 'Type', sortField, sortDir);
  }
  html += '<th class="rlv-no-sort" role="columnheader">Links</th>';
  html += '</tr></thead><tbody>';

  if (pageReleases.length === 0) {
    html += `<tr><td colspan="${colCount}" class="rlv-empty">No releases match your filters</td></tr>`;
  } else {
    for (let idx = 0; idx < pageReleases.length; idx++) {
      const r = pageReleases[idx];
      const dropdownId = `${instanceId}-links-${startIdx + idx}`;
      html += renderRow(r, showReleaseName, showType, dropdownId);
    }
  }

  html += '</tbody></table>';

  // Pagination
  html += renderPagination(filteredReleases.length, totalPages, currentPage, startIdx, endIdx, pageSize);

  html += '</div>';

  return html;
}

/**
 * Render a table header cell
 */
function renderHeaderCell(
  field: string,
  title: string,
  sortField: keyof NormalizedRelease,
  sortDir: 'asc' | 'desc'
): string {
  const isSorted = sortField === field;
  const sortClass = isSorted ? `sorted-${sortDir}` : '';
  const ariaSort = isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';

  return `<th data-sort="${field}" class="${sortClass}" tabindex="0" role="columnheader" aria-sort="${ariaSort}">${title}</th>`;
}

/**
 * Render a table row
 */
function renderRow(
  r: NormalizedRelease,
  showReleaseName: boolean,
  showType: boolean,
  dropdownId: string
): string {
  const date = r.publishedAt || r.createdAt;
  const name = r.name || r.tagName;
  const truncatedName = name && name.length > 60 ? name.substring(0, 60) + '...' : name;
  const releaseUrl = r.htmlUrl || (r.urls?.githubRelease) || '#';

  let html = '<tr>';
  html += `<td class="rlv-date">${formatDate(date)}</td>`;
  html += `<td class="rlv-repo"><a href="https://github.com/${escapeHtml(r.repoPath)}" target="_blank">${escapeHtml(r.repoPath)}</a></td>`;
  html += `<td><a href="${escapeHtml(releaseUrl)}" target="_blank"><span class="rlv-version${r.prerelease ? ' prerelease' : ''}">${escapeHtml(r.tagName)}</span></a></td>`;

  if (showReleaseName) {
    html += `<td class="rlv-release-name" title="${escapeHtml(name)}"><a href="${escapeHtml(releaseUrl)}" target="_blank">${escapeHtml(truncatedName)}</a></td>`;
  }

  if (showType) {
    html += `<td><span class="rlv-type-badge ${r.type}">${r.type}</span></td>`;
  }

  html += `<td class="rlv-links-cell">${renderLinksDropdown(r, dropdownId)}</td>`;
  html += '</tr>';

  return html;
}

/**
 * Render the links dropdown
 */
function renderLinksDropdown(r: NormalizedRelease, dropdownId: string): string {
  const repoUrl = `https://github.com/${r.repoPath}`;
  const releaseUrl = r.htmlUrl || r.urls?.githubRelease;
  const releaseNotesUrl = r.urls?.releaseNotes;
  const changelogUrl = r.urls?.changelog;
  const diffUrl = r.urls?.diff || (r.previousVersion ? `https://github.com/${r.repoPath}/compare/${r.previousVersion}...${r.tagName}` : null);

  let html = `<button class="rlv-links-btn" data-dropdown="${dropdownId}" aria-expanded="false" aria-haspopup="menu" aria-controls="${dropdownId}" type="button">`;
  html += `<span>Links</span> <span aria-hidden="true">${icons.chevron}</span></button>`;
  html += `<div class="rlv-links-dropdown" id="${dropdownId}" role="menu" aria-label="Release links for ${escapeHtml(r.tagName)}">`;

  html += `<a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.repo}</span><span>Repository</span></a>`;

  if (releaseUrl) {
    html += `<a href="${escapeHtml(releaseUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.release}</span><span>GitHub Release</span></a>`;
  }

  html += '<div class="rlv-divider" role="separator"></div>';

  if (releaseNotesUrl) {
    html += `<a href="${escapeHtml(releaseNotesUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.notes}</span><span>Release Notes</span></a>`;
  } else {
    html += `<span class="rlv-disabled" role="menuitem" aria-disabled="true"><span aria-hidden="true">${icons.notes}</span><span>Release Notes</span></span>`;
  }

  if (changelogUrl) {
    html += `<a href="${escapeHtml(changelogUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.changelog}</span><span>Changelog</span></a>`;
  } else {
    html += `<span class="rlv-disabled" role="menuitem" aria-disabled="true"><span aria-hidden="true">${icons.changelog}</span><span>Changelog</span></span>`;
  }

  if (diffUrl) {
    html += `<a href="${escapeHtml(diffUrl)}" target="_blank" rel="noopener noreferrer" role="menuitem"><span aria-hidden="true">${icons.diff}</span><span>Git Diff</span></a>`;
  } else {
    html += `<span class="rlv-disabled" role="menuitem" aria-disabled="true"><span aria-hidden="true">${icons.diff}</span><span>Git Diff</span></span>`;
  }

  html += '</div>';
  return html;
}

/**
 * Render pagination controls
 */
function renderPagination(
  total: number,
  totalPages: number,
  currentPage: number,
  startIdx: number,
  endIdx: number,
  pageSize: number
): string {
  let html = '<div class="rlv-pagination">';
  html += `<div class="rlv-pagination-info">Showing ${startIdx + 1}-${endIdx} of ${total}</div>`;

  if (totalPages > 1) {
    html += '<div class="rlv-pagination-buttons">';
    html += `<button data-page="1"${currentPage === 1 ? ' disabled' : ''} type="button">&laquo;</button>`;
    html += `<button data-page="${currentPage - 1}"${currentPage === 1 ? ' disabled' : ''} type="button">&lsaquo;</button>`;

    const maxButtons = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      html += `<button data-page="${i}"${i === currentPage ? ' class="active"' : ''} type="button">${i}</button>`;
    }

    html += `<button data-page="${currentPage + 1}"${currentPage === totalPages ? ' disabled' : ''} type="button">&rsaquo;</button>`;
    html += `<button data-page="${totalPages}"${currentPage === totalPages ? ' disabled' : ''} type="button">&raquo;</button>`;
    html += '</div>';
  }

  html += '<div class="rlv-page-size"><select class="rlv-page-size-select">';
  for (const size of [10, 25, 50, 100]) {
    html += `<option value="${size}"${pageSize === size ? ' selected' : ''}>${size} per page</option>`;
  }
  html += '</select></div></div>';

  return html;
}

/**
 * Format a date string for display
 */
function formatDate(dateStr: string | undefined): string {
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
function escapeHtml(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
