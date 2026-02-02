# Getting Started

ReleaseLog provides multiple ways to aggregate and display GitHub releases:

- **Go CLI** - Fetch releases and generate output files
- **JavaScript Viewer** - Embed an interactive viewer in your website
- **JSON Format** - Intermediate representation for programmatic access

## Installation

### Go CLI

```bash
go install github.com/grokify/releaselog/cmd/releaselog@latest
```

### NPM Package

```bash
npm install @grokify/releaselog
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog-viewer.css">
<script src="https://unpkg.com/@grokify/releaselog/dist/releaselog-viewer.min.js"></script>
```

## Quick Start

### Fetching Releases (CLI)

```bash
# Set GitHub token for higher rate limits
export GITHUB_TOKEN=your_token_here

# Fetch from an organization
releaselog fetch --org grokify -o releases.json

# Fetch from multiple sources
releaselog fetch --org myorg --user johndoe --repo google/go-github -o releases.json

# Fetch with date filter
releaselog fetch --org myorg --since 2024-01-01 -o releases.json
```

### Generating Output (CLI)

```bash
# Generate Markdown
releaselog generate releases.json --format md -o RELEASES.md

# Generate XLSX spreadsheet
releaselog generate releases.json --format xlsx -o releases.xlsx

# Filter by owner
releaselog generate releases.json --format md --owner grokify -o grokify-releases.md
```

### Embedding the Viewer (JavaScript)

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
  <script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>
  <script src="https://unpkg.com/@grokify/releaselog/dist/releaselog-viewer.min.js"></script>
  <script>
    new ReleaseLogViewer('#releases', {
      url: 'releases.json',
      showHeatmap: true,
      showHeader: true
    });
  </script>
</body>
</html>
```

## Configuration File

Create a `config.yaml` to define your sources:

```yaml
sources:
  # Fetch from a GitHub organization
  - type: org
    name: grokify
    visibility: public
    exclude:
      - "*.github.io"
      - "deprecated-*"

  # Fetch from a GitHub user
  - type: user
    name: johndoe
    visibility: public

  # Fetch from explicit repositories
  - type: repos
    repos:
      - google/go-github
      - spf13/cobra

# What to fetch: releases, tags, or both
fetch_type: releases

# Include pre-releases and drafts
include_prereleases: false
include_drafts: false

# Only fetch releases after this date
since: "2024-01-01"
```

Then run:

```bash
releaselog fetch -c config.yaml -o releases.json
```

## Next Steps

- [CLI Reference](cli-reference.md) - Full CLI documentation
- [JavaScript API](javascript-api.md) - Viewer configuration options
- [Live Demo](examples/standalone.html) - Try the viewer with your own data
