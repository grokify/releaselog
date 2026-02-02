# CSS Customization

ReleaseLog uses CSS custom properties for easy theming.

## CSS Variables

Override these variables to customize the appearance:

```css
.releaselog {
  /* Typography */
  --rl-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --rl-font-size: 14px;
  --rl-line-height: 1.5;

  /* Colors */
  --rl-bg: #ffffff;
  --rl-text: #24292e;
  --rl-text-muted: #6a737d;
  --rl-border: #e1e4e8;
  --rl-border-dark: #d1d5da;

  /* Table */
  --rl-header-bg: #f6f8fa;
  --rl-row-alt-bg: #f6f8fa;
  --rl-row-hover-bg: #f1f3f5;

  /* Accents */
  --rl-primary: #0366d6;
  --rl-primary-hover: #0256b9;
  --rl-success: #28a745;
  --rl-warning: #ffc107;
  --rl-danger: #dc3545;

  /* Badges */
  --rl-badge-release-bg: #28a745;
  --rl-badge-release-text: #ffffff;
  --rl-badge-tag-bg: #6f42c1;
  --rl-badge-tag-text: #ffffff;
  --rl-badge-prerelease-bg: #ffc107;
  --rl-badge-prerelease-text: #212529;

  /* Spacing */
  --rl-spacing-xs: 4px;
  --rl-spacing-sm: 8px;
  --rl-spacing-md: 16px;
  --rl-spacing-lg: 24px;

  /* Border radius */
  --rl-radius: 6px;
  --rl-radius-sm: 4px;

  /* Shadows */
  --rl-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
```

## Dark Theme Example

```css
.releaselog-dark {
  --rl-bg: #0d1117;
  --rl-text: #c9d1d9;
  --rl-text-muted: #8b949e;
  --rl-border: #30363d;
  --rl-border-dark: #484f58;
  --rl-header-bg: #161b22;
  --rl-row-alt-bg: #161b22;
  --rl-row-hover-bg: #21262d;
  --rl-primary: #58a6ff;
  --rl-primary-hover: #79b8ff;
}
```

## Class Reference

### Container

- `.releaselog` - Main container
- `.releaselog-dark` - Dark theme modifier
- `.releaselog-minimal` - Minimal theme modifier

### Stats

- `.releaselog-stats` - Stats container
- `.releaselog-stat` - Individual stat
- `.releaselog-stat-label` - Stat label
- `.releaselog-stat-value` - Stat value

### Filters

- `.releaselog-filters` - Filter container
- `.releaselog-filter-search` - Search input
- `.releaselog-filter-since` - Since date
- `.releaselog-filter-until` - Until date
- `.releaselog-filter-repo` - Repo select
- `.releaselog-filter-type` - Type select
- `.releaselog-filter-clear` - Clear button

### Table

- `.releaselog-table-wrapper` - Table wrapper
- `.releaselog-table` - Table element
- `.releaselog-header-cell` - Header cell
- `.releaselog-sortable` - Sortable header
- `.releaselog-sorted` - Sorted header
- `.releaselog-sorted-asc` / `.releaselog-sorted-desc` - Sort direction
- `.releaselog-sort-icon` - Sort indicator
- `.releaselog-row` - Table row
- `.releaselog-row-alt` - Alternate row
- `.releaselog-row-prerelease` - Pre-release row
- `.releaselog-cell` - Table cell
- `.releaselog-align-center` / `.releaselog-align-right` - Alignment

### Badges

- `.releaselog-badge` - Badge base
- `.releaselog-badge-release` - Release badge
- `.releaselog-badge-tag` - Tag badge
- `.releaselog-badge-true` / `.releaselog-badge-yes` - Boolean true
- `.releaselog-badge-false` / `.releaselog-badge-no` - Boolean false (hidden)

### Pagination

- `.releaselog-pagination` - Pagination container
- `.releaselog-page` - Page button
- `.releaselog-page-active` - Active page
- `.releaselog-page-first` / `.releaselog-page-last` - First/last
- `.releaselog-page-prev` / `.releaselog-page-next` - Prev/next
- `.releaselog-page-info` - Page info text
- `.releaselog-page-size` - Page size select

### States

- `.releaselog-loading` - Loading state
- `.releaselog-placeholder` - Empty state
- `.releaselog-error` - Error state

### Heatmap

- `.rl-heatmap-container` - Heatmap container
- `.rl-heatmap-header` - Header with nav
- `.rl-heatmap-title` - Title text
- `.rl-heatmap-nav` - Nav buttons
- `.rl-heatmap-chart` - Chart container
- `.rl-heatmap-legend` - Legend
- `.rl-heatmap-legend-cell` - Legend cells
- `.rl-heatmap-stats` - Stats row

### Accessibility

- `.rl-skip-link` - Skip navigation link
- `.rl-sr-only` - Screen reader only

## Media Queries

### Responsive

```css
@media (max-width: 768px) {
  .releaselog-filters {
    flex-direction: column;
  }
}
```

### High Contrast

```css
@media (prefers-contrast: more) {
  .releaselog {
    --rl-text: #000000;
    --rl-border: #000000;
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .releaselog * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Print

```css
@media print {
  .releaselog-filters,
  .releaselog-pagination {
    display: none !important;
  }
}
```
