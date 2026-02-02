# @grokify/releaselog

[![npm version](https://img.shields.io/npm/v/@grokify/releaselog.svg)](https://www.npmjs.com/package/@grokify/releaselog)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Embeddable release log viewer for websites. Display GitHub releases with an interactive heatmap, filtering, sorting, and pagination.

## Features

- 📊 **GitHub-style heatmap** - Visualize release activity over time
- 🔍 **Powerful filtering** - Filter by repository, date, type, and search text
- 📦 **Multiple sources** - Aggregate releases from orgs, users, or repos
- 🎨 **Themeable** - CSS custom properties for easy customization
- ⚡ **Lightweight** - 32KB minified, no framework dependencies

## Installation

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog-viewer.css">
<script src="https://unpkg.com/@grokify/releaselog/dist/releaselog-viewer.min.js"></script>
```

### npm

```bash
npm install @grokify/releaselog
```

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Viewer CSS -->
  <link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog-viewer.css">
  <!-- Cal-heatmap CSS (for heatmap) -->
  <link rel="stylesheet" href="https://unpkg.com/cal-heatmap/dist/cal-heatmap.css">
</head>
<body>
  <div id="releases"></div>

  <!-- Cal-heatmap dependencies (for heatmap) -->
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>

  <!-- Viewer -->
  <script src="https://unpkg.com/@grokify/releaselog/dist/releaselog-viewer.min.js"></script>
  <script>
    new ReleaseLogViewer('#releases', {
      url: 'releases.json',
      showHeatmap: true
    });
  </script>
</body>
</html>
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | string | | URL to fetch release log JSON |
| `data` | object | | Inline release log data |
| `pageSize` | number | `25` | Releases per page |
| `showUrlBar` | boolean | `false` | Show URL input bar |
| `showHeader` | boolean | `true` | Show metadata header |
| `showHeatmap` | boolean | `true` | Show activity heatmap |
| `heatmapColors` | string[] | GitHub colors | Heatmap color scale |
| `onLoad` | function | | Callback when data loads |
| `onError` | function | | Callback on error |

## Methods

```javascript
const viewer = new ReleaseLogViewer('#releases', options);

// Load data from URL
viewer.loadUrl('https://example.com/releases.json');

// Set data directly
viewer.setData({ releases: [...] });

// Refresh display
viewer.refresh();

// Clean up
viewer.destroy();
```

## Theming

Override CSS custom properties:

```css
.rlv-viewer {
  --rlv-bg: #0d1117;
  --rlv-text: #e6edf3;
  --rlv-border: #30363d;
  --rlv-header-bg: #161b22;
  --rlv-link: #58a6ff;
}
```

## JSON Format

The viewer expects JSON in this format:

```json
{
  "ir_version": "1.0",
  "releases": [
    {
      "repo_path": "owner/repo",
      "tag_name": "v1.0.0",
      "name": "Release Name",
      "published_at": "2024-01-15T10:00:00Z",
      "html_url": "https://github.com/owner/repo/releases/tag/v1.0.0",
      "type": "release"
    }
  ]
}
```

Generate this JSON using the [Go CLI](https://github.com/grokify/releaselog):

```bash
go install github.com/grokify/releaselog/cmd/releaselog@latest
releaselog fetch --org myorg -o releases.json
```

## Links

- [Live Demo](https://grokify.github.io/releaselog/examples/standalone.html)
- [Documentation](https://grokify.github.io/releaselog/)
- [GitHub Repository](https://github.com/grokify/releaselog)

## License

MIT
