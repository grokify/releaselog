/**
 * Repository Dropdown Component
 *
 * Renders the multi-select repository filter dropdown.
 */

import { icons } from '../icons';
import type { ViewerState } from '../types';

/**
 * Render the repository dropdown HTML
 */
export function renderRepoDropdown(state: ViewerState, repos: string[]): string {
  const { repoFilter } = state;

  let html = '<div class="rlv-repo-filter">';

  // Dropdown button
  html += '<button class="rlv-repo-filter-btn" type="button">';
  html += `<span>${repoFilter.size === 0 ? 'All Repositories' : `${repoFilter.size} of ${repos.length} repos`}</span>`;
  if (repoFilter.size > 0 && repoFilter.size < repos.length) {
    html += `<span class="rlv-count">${repoFilter.size}</span>`;
  }
  html += icons.chevron;
  html += '</button>';

  // Dropdown panel
  html += '<div class="rlv-repo-filter-panel">';
  html += '<div class="rlv-repo-filter-search"><input type="text" placeholder="Filter repositories..."></div>';
  html += '<div class="rlv-repo-filter-actions"><a data-action="select-all">Select All</a><a data-action="deselect-all">Deselect All</a></div>';
  html += '<div class="rlv-repo-filter-list">';

  for (const repo of repos) {
    const checked = repoFilter.size === 0 || repoFilter.has(repo);
    html += `<label class="rlv-repo-filter-item" data-repo="${escapeHtml(repo.toLowerCase())}">`;
    html += `<input type="checkbox" data-repo-value="${escapeHtml(repo)}"${checked ? ' checked' : ''}>`;
    html += `<span>${escapeHtml(repo)}</span></label>`;
  }

  html += '</div></div></div>';
  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
