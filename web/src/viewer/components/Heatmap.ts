/**
 * Heatmap Component
 *
 * Renders the heatmap section HTML.
 */

/**
 * Render the heatmap section HTML
 */
export function renderHeatmapSection(instanceId: string, showHelp: boolean): string {
  let html = '<div class="rlv-heatmap-section" style="display: none;">';
  html += '<div class="rlv-heatmap-container">';

  // Header with navigation
  html += '<div class="rlv-heatmap-header">';
  html += '<button class="rlv-heatmap-nav rlv-heatmap-prev" aria-label="Previous period" type="button">&larr;</button>';
  html += '<span class="rlv-heatmap-title">Release Activity</span>';
  html += '<button class="rlv-heatmap-nav rlv-heatmap-next" aria-label="Next period" type="button">&rarr;</button>';
  html += '</div>';

  // Chart container
  html += `<div class="rlv-heatmap-chart" id="${instanceId}-heatmap"></div>`;

  // Footer with legend
  html += '<div class="rlv-heatmap-footer">';
  html += '<div class="rlv-heatmap-legend">';
  html += '<span class="rlv-heatmap-legend-label">Less</span>';
  for (let i = 0; i < 5; i++) {
    html += `<span class="rlv-heatmap-legend-cell" data-level="${i}"></span>`;
  }
  html += '<span class="rlv-heatmap-legend-label">More</span>';
  html += '</div>';

  if (showHelp) {
    html += '<a href="#" class="rlv-heatmap-help-link">Learn how we count releases</a>';
  }
  html += '</div>';

  // Stats
  html += '<div class="rlv-heatmap-stats" aria-live="polite"></div>';

  // Help tooltip
  if (showHelp) {
    html += '<div class="rlv-heatmap-help-tooltip" role="tooltip" aria-hidden="true">';
    html += '<button class="rlv-heatmap-help-close" aria-label="Close" type="button">&times;</button>';
    html += '<h4>How we count release activity</h4>';
    html += '<p>Each cell represents one day. Color intensity shows the <strong>number of releases published</strong> that day across all tracked repositories.</p>';
    html += '<p><strong>Click a cell</strong> to filter the table to releases from that day.</p>';
    html += '<ul>';
    html += '<li><span class="rlv-heatmap-legend-cell" data-level="0"></span> No releases</li>';
    html += '<li><span class="rlv-heatmap-legend-cell" data-level="1"></span> Few releases (bottom 25%)</li>';
    html += '<li><span class="rlv-heatmap-legend-cell" data-level="2"></span> Some releases (25-50%)</li>';
    html += '<li><span class="rlv-heatmap-legend-cell" data-level="3"></span> Many releases (50-75%)</li>';
    html += '<li><span class="rlv-heatmap-legend-cell" data-level="4"></span> Most releases (top 25%)</li>';
    html += '</ul>';
    html += '</div>';
  }

  html += '</div></div>';
  return html;
}
