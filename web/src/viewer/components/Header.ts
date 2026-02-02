/**
 * Header Component
 *
 * Renders the header with metadata (sources, generated date, spec version).
 */

import type { ViewerState } from '../types';

/**
 * Render the header HTML
 */
export function renderHeader(state: ViewerState): string {
  let html = '<div class="rlv-header">';
  html += '<h1 class="rlv-title">Release Log</h1>';
  html += '<p class="rlv-subtitle">';

  if (state.releases.length > 0) {
    html += `Sources: <strong>${escapeHtml(state.sources)}</strong> &bull; `;
    html += `Generated: ${formatDate(state.generatedAt)} &bull; `;
    html += `Spec: ${state.specVersion}`;
    if (state.currentUrl) {
      html += ` &bull; <a href="${escapeHtml(state.currentUrl)}" target="_blank">View JSON</a>`;
    }
  } else {
    html += 'Load a release log JSON file to view releases.';
  }

  html += '</p></div>';
  return html;
}

/**
 * Format a date string for display
 */
function formatDate(dateStr: string): string {
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
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
