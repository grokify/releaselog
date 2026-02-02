# Quick Start

Get a release log viewer running in minutes.

## Basic Usage

### CDN (Recommended for Quick Start)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Release Log</title>
  <link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog.css">
</head>
<body>
  <div id="releases"></div>

  <script src="https://unpkg.com/@grokify/releaselog/dist/releaselog.umd.js"></script>
  <script>
    const table = new ReleaseLog.ReleaseLog('#releases', {
      ajaxURL: 'releases.json',
      pagination: { enabled: true, size: 25 },
      showFilters: true,
      showStats: true
    });
  </script>
</body>
</html>
```

### npm with Bundler

```javascript
import { ReleaseLog } from '@grokify/releaselog';
import '@grokify/releaselog/css';

const table = new ReleaseLog('#releases', {
  ajaxURL: '/api/releases.json',
  pagination: { enabled: true, size: 25 }
});
```

## Inline Data

You can also provide data directly:

```javascript
const table = new ReleaseLog.ReleaseLog('#releases', {
  data: {
    ir_version: 'v1.0',
    generated_at: new Date().toISOString(),
    releases: [
      {
        id: 1,
        repo_path: 'org/repo',
        repo_owner: 'org',
        repo_name: 'repo',
        type: 'release',
        tag_name: 'v1.0.0',
        name: 'Version 1.0.0',
        published_at: '2025-01-15T10:00:00Z',
        html_url: 'https://github.com/org/repo/releases/tag/v1.0.0'
      }
    ],
    stats: {
      total_releases: 1,
      total_repos: 1
    }
  }
});
```

## With Heatmap

Add a GitHub-style activity heatmap:

```html
<div id="heatmap"></div>
<div id="releases"></div>

<script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>
<script src="https://unpkg.com/cal-heatmap/dist/plugins/Tooltip.min.js"></script>
<script src="https://unpkg.com/@grokify/releaselog/dist/releaselog.umd.js"></script>

<script>
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
</script>
```

## Event Handling

Listen for user interactions:

```javascript
const table = new ReleaseLog.ReleaseLog('#releases', {
  ajaxURL: 'releases.json',
  events: {
    releaseClick: (event, release) => {
      window.open(release.html_url, '_blank');
    },
    filterChange: (filters) => {
      console.log('Filters changed:', filters);
    },
    dataLoaded: (data) => {
      console.log(`Loaded ${data.releases.length} releases`);
    }
  }
});
```

## Custom Columns

Customize which columns to show:

```javascript
const table = new ReleaseLog.ReleaseLog('#releases', {
  ajaxURL: 'releases.json',
  columns: [
    { field: 'published_at', title: 'Date', sortable: true, formatter: 'date' },
    { field: 'repo_path', title: 'Repository', sortable: true },
    { field: 'tag_name', title: 'Version', sortable: true },
    { field: 'name', title: 'Name' },
    { field: 'type', title: 'Type', formatter: 'badge' }
  ]
});
```

## Next Steps

- [JavaScript Library Guide](../guide/javascript-library.md) - Full API documentation
- [JSON Format](../guide/json-format.md) - Data format specification
- [CSS Customization](../reference/css-customization.md) - Styling options
