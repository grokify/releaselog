/**
 * URL Bar Component
 *
 * Renders the URL input and load button for the viewer.
 */

/**
 * Render the URL bar HTML
 */
export function renderUrlBar(instanceId: string, currentUrl: string): string {
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
