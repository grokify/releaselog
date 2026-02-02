# Heatmap Visualization

ReleaseLog includes a GitHub-style activity heatmap powered by cal-heatmap.

## Prerequisites

The heatmap feature requires cal-heatmap to be loaded:

```html
<!-- Cal-heatmap CSS -->
<link rel="stylesheet" href="https://unpkg.com/cal-heatmap/dist/cal-heatmap.css">

<!-- Cal-heatmap JS -->
<script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>

<!-- Optional: Tooltip plugin for hover tooltips -->
<script src="https://unpkg.com/cal-heatmap/dist/plugins/Tooltip.min.js"></script>
```

## Basic Usage

### Via ReleaseLog Class

```javascript
const table = new ReleaseLog.ReleaseLog('#releases', {
  ajaxURL: 'releases.json',
  events: {
    tableBuilt: () => {
      table.createNavigableHeatmap('#heatmap', {
        colorScheme: 'green',
        range: 12
      });
    }
  }
});
```

### Standalone Function

```javascript
import { createReleaseHeatmap, createNavigableHeatmap } from '@grokify/releaselog';

// Basic heatmap
const heatmap = createReleaseHeatmap('#heatmap', releases, {
  colorScheme: 'green',
  range: 12
});

// Heatmap with navigation controls
const { element, heatmap } = createNavigableHeatmap('#heatmap', releases, {
  colorScheme: 'blue',
  onCellClick: (date, count, releases) => {
    console.log(`${count} releases on ${date}`);
  }
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `startDate` | `Date` | 1 year ago | Start date for the heatmap |
| `endDate` | `Date` | today | End date for the heatmap |
| `repos` | `Set<string>` | all | Filter to specific repositories |
| `range` | `number` | 12 | Number of months to display |
| `colorScheme` | `string` | 'green' | Color scheme: 'green', 'blue', 'purple', 'orange' |
| `colorRange` | `string[]` | - | Custom 5-color array |
| `cellSize` | `number` | 11 | Cell size in pixels |
| `cellGutter` | `number` | 2 | Gap between cells |
| `cellRadius` | `number` | 2 | Cell border radius |
| `showMonthLabels` | `boolean` | true | Show month labels |
| `showDayLabels` | `boolean` | true | Show day labels |
| `showLegend` | `boolean` | true | Show color legend |
| `showTooltips` | `boolean` | true | Enable hover tooltips |

## Callbacks

### onDataLoad

Called when heatmap data is calculated:

```javascript
createNavigableHeatmap('#heatmap', releases, {
  onDataLoad: (stats) => {
    console.log(`Total: ${stats.totalReleases}`);
    console.log(`Active days: ${stats.activeDays}`);
    console.log(`Max per day: ${stats.maxPerDay}`);
  }
});
```

### onCellClick

Called when a day cell is clicked:

```javascript
createNavigableHeatmap('#heatmap', releases, {
  onCellClick: (date, count, releases) => {
    // Show releases for that day
    showReleasesModal(releases);
  }
});
```

## Custom Tooltips

```javascript
createReleaseHeatmap('#heatmap', releases, {
  tooltipFormatter: (date, value, dayjsDate) => {
    const dateStr = dayjsDate.format('MMM D, YYYY');
    return `<strong>${value}</strong> releases on ${dateStr}`;
  }
});
```

## Color Schemes

Built-in color schemes (GitHub-inspired):

- **green** (default): `#ebedf0` → `#216e39`
- **blue**: `#ebedf0` → `#08519c`
- **purple**: `#ebedf0` → `#980043`
- **orange**: `#ebedf0` → `#a63603`

Custom colors:

```javascript
createReleaseHeatmap('#heatmap', releases, {
  colorRange: ['#f0f0f0', '#c6dbef', '#9ecae1', '#6baed6', '#2171b5']
});
```

## Aggregation Utilities

Use aggregation utilities for custom visualizations:

```javascript
import {
  aggregateReleasesByDate,
  aggregateReleasesDetailed,
  getReleaseDateRange,
  getAggregationStats
} from '@grokify/releaselog';

// Simple count by date
const counts = aggregateReleasesByDate(releases, {
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31')
});
// { "2025-01-15": 3, "2025-01-16": 1, ... }

// Detailed data including repo info
const detailed = aggregateReleasesDetailed(releases);
const jan15 = detailed.get('2025-01-15');
// { date: "2025-01-15", count: 3, repos: ["a/b", "c/d"], releases: [...] }

// Get stats
const stats = getAggregationStats(counts);
// { totalDays, totalReleases, maxPerDay, avgPerDay, activeDays }
```

## Styling

Heatmap styles use the `.rl-heatmap-*` class prefix:

```css
.rl-heatmap-container {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.rl-heatmap-title {
  font-size: 16px;
  font-weight: 600;
}

.rl-heatmap-legend-cell[data-level="4"] {
  background: #216e39;
}
```

## Accessibility

The heatmap includes:

- ARIA labels on navigation buttons
- Live region for stats announcements
- Keyboard-navigable controls
- Focus indicators
