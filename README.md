# ReleaseLog

[![Go CI][go-ci-svg]][go-ci-url]
[![Go Lint][go-lint-svg]][go-lint-url]
[![Go SAST][go-sast-svg]][go-sast-url]
[![Go Report Card][goreport-svg]][goreport-url]
[![Docs][docs-godoc-svg]][docs-godoc-url]
[![Docs][docs-mkdoc-svg]][docs-mkdoc-url]
[![Visualization][viz-svg]][viz-url]
[![License][license-svg]][license-url]

 [go-ci-svg]: https://github.com/grokify/releaselog/actions/workflows/go-ci.yaml/badge.svg?branch=main
 [go-ci-url]: https://github.com/grokify/releaselog/actions/workflows/go-ci.yaml
 [go-lint-svg]: https://github.com/grokify/releaselog/actions/workflows/go-lint.yaml/badge.svg?branch=main
 [go-lint-url]: https://github.com/grokify/releaselog/actions/workflows/go-lint.yaml
 [go-sast-svg]: https://github.com/grokify/releaselog/actions/workflows/go-sast-codeql.yaml/badge.svg?branch=main
 [go-sast-url]: https://github.com/grokify/releaselog/actions/workflows/go-sast-codeql.yaml
 [goreport-svg]: https://goreportcard.com/badge/github.com/grokify/releaselog
 [goreport-url]: https://goreportcard.com/report/github.com/grokify/releaselog
 [docs-godoc-svg]: https://pkg.go.dev/badge/github.com/grokify/releaselog
 [docs-godoc-url]: https://pkg.go.dev/github.com/grokify/releaselog
 [docs-mkdoc-svg]: https://img.shields.io/badge/Go-dev%20guide-blue.svg
 [docs-mkdoc-url]: https://grokify.github.io/releaselog
 [viz-svg]: https://img.shields.io/badge/Go-visualizaton-blue.svg
 [viz-url]: https://mango-dune-07a8b7110.1.azurestaticapps.net/?repo=grokify%2Freleaselog
 [loc-svg]: https://tokei.rs/b1/github/grokify/releaselog
 [repo-url]: https://github.com/grokify/releaselog
 [license-svg]: https://img.shields.io/badge/license-MIT-blue.svg
 [license-url]: https://github.com/grokify/releaselog/blob/main/LICENSE

**ReleaseLog** aggregates GitHub releases across multiple organizations and users into a unified release log. Think of it as a changelog for your entire organization - tracking releases across all your projects in one place.

Similar to [Zoom's Developer Changelog](https://developers.zoom.us/changelog/), but as a generic tool you can use for any GitHub organization with customizable output formats.

## Features

- 📥 **Fetch releases** from GitHub organizations, users, or specific repositories
- 📦 **JSON Intermediate Representation** for programmatic access
- 📄 **Multiple output formats**: Markdown, XLSX, JSON
- 🔍 **Filtering**: by date, repository, owner, release type, categories
- 🧩 **Embeddable JavaScript widget** (`@grokify/releaselog`) with Tabulator-like API
- 🎨 **Theming support**: Default, Dark, Minimal themes with CSS variables

## Installation

### Go CLI

```bash
go install github.com/grokify/releaselog/cmd/releaselog@latest
```

### NPM Package

```bash
npm install @grokify/releaselog
```

## Quick Start

### Fetching Releases

```bash
# Set GitHub token for higher rate limits
export GITHUB_TOKEN=your_token_here

# Fetch from an organization
releaselog fetch --org grokify -o releases.json

# Fetch from multiple sources
releaselog fetch --org myorg --user johndoe --repo google/go-github -o releases.json

# Fetch with date filter
releaselog fetch --org myorg --since 2024-01-01 -o releases.json

# Use a config file
releaselog fetch -c config.yaml -o releases.json
```

### Generating Output

```bash
# Generate Markdown
releaselog generate releases.json --format md -o RELEASES.md

# Generate Markdown grouped by repository
releaselog generate releases.json --format md --by-repo -o RELEASES.md

# Generate XLSX spreadsheet
releaselog generate releases.json --format xlsx -o releases.xlsx

# Generate filtered JSON for web
releaselog generate releases.json --format json --since 2024-01-01 -o recent.json

# Filter by owner
releaselog generate releases.json --format md --owner grokify -o grokify-releases.md
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

## JSON Intermediate Representation

The release log is stored in a JSON format that can be used programmatically:

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

## JavaScript Widget

Embed a release log viewer in your website using the `@grokify/releaselog` NPM package. The API is similar to [Tabulator](https://tabulator.info/) for familiarity.

### Basic Usage

```html
<link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog.css">
<script src="https://unpkg.com/@grokify/releaselog/dist/releaselog.umd.js"></script>

<div id="releases"></div>

<script>
const table = new ReleaseLog.ReleaseLog("#releases", {
  ajaxURL: "releases.json",
  pagination: { enabled: true, size: 25 },
  events: {
    releaseClick: (e, release) => window.open(release.html_url)
  }
});
</script>
```

### ES Module Usage

```typescript
import { ReleaseLog } from '@grokify/releaselog';
import '@grokify/releaselog/css';

const table = new ReleaseLog("#releases", {
  ajaxURL: "/api/releases.json",
  columns: [
    { field: "published_at", title: "Date", formatter: "date", sortable: true },
    { field: "repo_path", title: "Repository", formatter: "link" },
    { field: "tag_name", title: "Version", formatter: "badge" },
    { field: "name", title: "Release Name" }
  ],
  pagination: { enabled: true, size: 25 },
  theme: "dark"
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` | `ReleaseLogData` | - | Inline release log data |
| `ajaxURL` | `string` | - | URL to fetch release log JSON |
| `columns` | `ColumnDefinition[]` | Default columns | Custom column definitions |
| `pagination` | `boolean \| PaginationConfig` | `false` | Enable pagination |
| `showFilters` | `boolean` | `true` | Show filter controls |
| `showStats` | `boolean` | `true` | Show statistics summary |
| `initialSort` | `SortConfig[]` | - | Initial sort configuration |
| `initialFilter` | `FilterConfig` | - | Initial filter configuration |
| `theme` | `string` | `"default"` | Theme: default, dark, minimal |
| `events` | `ReleaseLogEvents` | - | Event callbacks |

### Column Formatters

Built-in formatters:

- `date` - Format as localized date
- `link` - Render as clickable link
- `badge` - Render as colored badge
- `avatar` - Render author avatar with link
- `markdown` - Basic markdown rendering

Custom formatter:

```javascript
{
  field: "name",
  title: "Release",
  formatter: (value, release, element) => {
    return `<a href="${release.html_url}">${value}</a>`;
  }
}
```

### Methods

```javascript
// Load data
table.loadData("releases.json");
table.setData(releaseLogData);

// Filtering
table.setFilter({ owner: "grokify", since: "2024-01-01" });
table.addFilter("type", "release");
table.clearFilter();

// Sorting
table.setSort("published_at", "desc");

// Pagination
table.setPage(2);
table.setPageSize(50);

// Other
table.getData();
table.getFilteredData();
table.redraw();
table.destroy();
```

### Theming

Themes use CSS custom properties for easy customization:

```css
.releaselog {
  --rl-bg: #ffffff;
  --rl-text: #24292e;
  --rl-primary: #0366d6;
  --rl-border: #e1e4e8;
  --rl-header-bg: #f6f8fa;
  --rl-badge-release-bg: #28a745;
  --rl-badge-tag-bg: #6f42c1;
}
```

## CLI Reference

### `releaselog fetch`

Fetch releases from GitHub sources.

```
Flags:
      --org strings     GitHub organization(s) to fetch from
      --user strings    GitHub user(s) to fetch from
      --repo strings    Explicit repo(s) in owner/repo format
      --type string     What to fetch: releases, tags, or both (default "releases")
      --since string    Only fetch releases after this date (YYYY-MM-DD)
  -o, --output string   Output JSON file (default "releaselog.json")
      --public          Only fetch from public repositories (default true)
  -c, --config string   Config file (YAML)
  -v, --verbose         Verbose output
```

### `releaselog generate`

Generate output from a release log.

```
Flags:
      --format string      Output format: md, xlsx, json (default "md")
  -o, --output string      Output file (default: stdout for md/json)
      --since string       Filter: only releases after this date
      --until string       Filter: only releases before this date
      --repo string        Filter: only this repo (owner/repo)
      --owner string       Filter: only repos from this owner
      --type string        Filter: release or tag
      --category strings   Filter: releases with these categories
      --by-repo            Group output by repository (Markdown only)
```

## Development

### Building

```bash
# Build Go CLI
go build -o releaselog ./cmd/releaselog

# Build NPM package
cd web
npm install
npm run build
```

### Testing

```bash
# Run Go tests
go test ./...

# Run linter
golangci-lint run
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related Projects

- [structured-changelog](https://github.com/grokify/structured-changelog) - Structured changelog format and tools
- [Tabulator](https://tabulator.info/) - JavaScript table library (API inspiration)
- [go-github](https://github.com/google/go-github) - GitHub API client for Go
