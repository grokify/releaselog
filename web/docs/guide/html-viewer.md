# HTML Viewer

The HTML viewer provides a standalone, self-contained release log viewer that works without any build tools.

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Release Log</title>
  <link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog.css">
</head>
<body>
  <div id="releases"></div>

  <script src="https://unpkg.com/@grokify/releaselog/dist/releaselog.umd.js"></script>
  <script>
    new ReleaseLog.ReleaseLog('#releases', {
      ajaxURL: 'releases.json',
      pagination: { enabled: true, size: 25 }
    });
  </script>
</body>
</html>
```

## Standalone Viewer

For a complete standalone viewer with URL input, use the `standalone.html` example:

1. Download from [examples/standalone.html](https://github.com/grokify/releaselog/blob/main/web/examples/standalone.html)
2. Open in a browser
3. Enter a ReleaseLog JSON URL
4. Click Load

## Features

- **Filterable** - Search by name, tag, repository
- **Sortable** - Click column headers to sort
- **Pagination** - Navigate through large datasets
- **Responsive** - Works on desktop and mobile
- **Accessible** - WCAG 2.2 AA compliant

## Themes

Three built-in themes are available:

### Default Theme
```html
<link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog.css">
```

### Dark Theme
```html
<link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog-dark.css">
```

### Minimal Theme
```html
<link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog-minimal.css">
```

## URL Parameters

The standalone viewer supports URL parameters:

```
standalone.html?url=https://example.com/releases.json
```

This allows bookmarking and sharing specific release log URLs.

## Offline Usage

To use offline:

1. Download the CSS and JS files
2. Update the `src` and `href` attributes to point to local files
3. Ensure your JSON data is available locally or via CORS

```html
<link rel="stylesheet" href="./releaselog.css">
<script src="./releaselog.umd.js"></script>
```
