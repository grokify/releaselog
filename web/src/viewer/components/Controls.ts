/**
 * Controls Component
 *
 * Renders the filter controls, search, and column toggles.
 */

import type { ViewerState } from '../types';
import { renderRepoDropdown } from './RepoDropdown';

/**
 * Render the controls HTML
 */
export function renderControls(state: ViewerState, repos: string[]): string {
  const { filteredReleases, releases, searchQuery, typeFilter, showAllPerDay, showReleaseName, showType } = state;

  let html = '<div class="rlv-controls">';

  // Stats
  html += '<div class="rlv-stats">';
  html += `<span>Showing <strong>${filteredReleases.length}</strong> of <strong>${releases.length}</strong> releases</span>`;
  html += `<span><strong>${repos.length}</strong> repositories</span>`;
  html += '</div>';

  // Filters
  html += '<div class="rlv-filters">';

  // Left side: Repo filter, Search, Type filter
  html += '<div class="rlv-filters-left">';

  // Repo dropdown
  html += renderRepoDropdown(state, repos);

  // Search
  html += `<input type="text" class="rlv-search" placeholder="Search releases..." value="${escapeHtml(searchQuery)}">`;

  // Type filter (only shown when showType is enabled)
  if (showType) {
    html += '<select class="rlv-type-filter">';
    html += '<option value="">All Types</option>';
    html += `<option value="release"${typeFilter === 'release' ? ' selected' : ''}>Releases</option>`;
    html += `<option value="tag"${typeFilter === 'tag' ? ' selected' : ''}>Tags</option>`;
    html += '</select>';
  }

  html += '</div>';

  // Right side: Column toggles
  html += '<div class="rlv-filters-right">';
  html += `<label class="rlv-checkbox-label"><input type="checkbox" data-toggle="allperday"${showAllPerDay ? ' checked' : ''}> All per day</label>`;
  html += `<label class="rlv-checkbox-label"><input type="checkbox" data-toggle="name"${showReleaseName ? ' checked' : ''}> Name</label>`;
  html += `<label class="rlv-checkbox-label"><input type="checkbox" data-toggle="type"${showType ? ' checked' : ''}> Type</label>`;
  html += '</div>';

  html += '</div></div>';

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
