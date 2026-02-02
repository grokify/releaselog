# JavaScript API

## ReleaseLogViewer

The main class for embedding a release log viewer.

### Constructor

```javascript
new ReleaseLogViewer(selector, options)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `selector` | string \| HTMLElement | CSS selector or DOM element |
| `options` | ViewerOptions | Configuration options |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | string | | URL to fetch release log JSON |
| `data` | object | | Inline release log data |
| `pageSize` | number | `25` | Number of releases per page |
| `showUrlBar` | boolean | `false` | Show URL input bar |
| `showHeader` | boolean | `true` | Show metadata header |
| `showHeatmap` | boolean | `true` | Show activity heatmap |
| `showHeatmapHelp` | boolean | `true` | Show heatmap help text |
| `showReleaseName` | boolean | `true` | Show release name column |
| `showType` | boolean | `true` | Show release/tag type column |
| `showAllPerDay` | boolean | `false` | Show all releases on date filter |
| `heatmapRange` | number | `12` | Heatmap range in months |
| `heatmapColors` | string[] | GitHub colors | Heatmap color scale |
| `onLoad` | function | | Callback when data loads |
| `onError` | function | | Callback on error |
| `onDateFilter` | function | | Callback when date filter changes |

### Methods

#### loadUrl(url)

Load release data from a URL.

```javascript
viewer.loadUrl('https://example.com/releases.json');
```

#### setData(data)

Set release data directly.

```javascript
viewer.setData({
  ir_version: "1.0",
  releases: [...]
});
```

#### refresh()

Re-render the viewer with current data.

```javascript
viewer.refresh();
```

#### destroy()

Remove the viewer and clean up resources.

```javascript
viewer.destroy();
```

### Example

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog-viewer.css">
  <link rel="stylesheet" href="https://unpkg.com/cal-heatmap/dist/cal-heatmap.css">
</head>
<body>
  <div id="releases"></div>

  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>
  <script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>
  <script src="https://unpkg.com/cal-heatmap/dist/plugins/Tooltip.min.js"></script>
  <script src="https://unpkg.com/cal-heatmap/dist/plugins/CalendarLabel.min.js"></script>
  <script src="https://unpkg.com/@grokify/releaselog/dist/releaselog-viewer.min.js"></script>

  <script>
    var viewer = new ReleaseLogViewer('#releases', {
      showHeatmap: true,
      showHeader: true,
      pageSize: 25,
      heatmapColors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
      onLoad: function(data) {
        console.log('Loaded', data.releases.length, 'releases');
      },
      onError: function(error) {
        console.error('Failed to load:', error);
      }
    });

    viewer.loadUrl('releases.json');
  </script>
</body>
</html>
```

## Theming

The viewer uses CSS custom properties for theming.

### CSS Variables

```css
.rlv-viewer {
  --rlv-bg: #ffffff;
  --rlv-text: #1f2328;
  --rlv-text-muted: #59636e;
  --rlv-border: #d1d9e0;
  --rlv-header-bg: #f6f8fa;
  --rlv-hover-bg: #f6f8fa;
  --rlv-link: #0969da;
  --rlv-badge-release-bg: #ddf4ff;
  --rlv-badge-release-text: #0969da;
  --rlv-badge-tag-bg: #dafbe1;
  --rlv-badge-tag-text: #1a7f37;
}
```

### Dark Theme Example

```css
.rlv-viewer {
  --rlv-bg: #0d1117;
  --rlv-text: #e6edf3;
  --rlv-text-muted: #8d96a0;
  --rlv-border: #30363d;
  --rlv-header-bg: #161b22;
  --rlv-hover-bg: #1c2128;
  --rlv-link: #58a6ff;
}
```

## JSON Format

The release log uses a JSON intermediate representation:

```json
{
  "ir_version": "1.0",
  "generated_at": "2024-01-15T12:00:00Z",
  "sources": ["org:grokify"],
  "releases": [
    {
      "id": 123456,
      "repo_path": "grokify/mogo",
      "repo_owner": "grokify",
      "repo_name": "mogo",
      "type": "release",
      "tag_name": "v0.72.0",
      "name": "Version 0.72.0",
      "body": "Release notes here...",
      "published_at": "2024-01-15T10:00:00Z",
      "html_url": "https://github.com/grokify/mogo/releases/tag/v0.72.0",
      "author_login": "grokify",
      "prerelease": false
    }
  ],
  "stats": {
    "total_releases": 150,
    "total_repos": 25
  }
}
```

### Release Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | GitHub release ID |
| `repo_path` | string | Repository path (owner/repo) |
| `repo_owner` | string | Repository owner |
| `repo_name` | string | Repository name |
| `type` | string | "release" or "tag" |
| `tag_name` | string | Git tag name |
| `name` | string | Release title |
| `body` | string | Release notes (markdown) |
| `published_at` | string | ISO 8601 timestamp |
| `html_url` | string | GitHub release URL |
| `author_login` | string | Author's GitHub username |
| `prerelease` | boolean | Is this a pre-release |
| `draft` | boolean | Is this a draft |
| `categories` | string[] | Optional category tags |
