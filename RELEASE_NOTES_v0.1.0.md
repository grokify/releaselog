# Release Notes - v0.1.0

**Release Date:** 2024-01-31

This is the initial release of ReleaseLog, a tool for aggregating GitHub releases across multiple organizations and users into a unified release log.

## Highlights

- **Go CLI** for fetching releases and generating output
- **JSON Intermediate Representation** for programmatic access
- **Multiple output formats**: Markdown, XLSX, JSON
- **NPM package** (`@grokify/releaselog`) with embeddable JavaScript widget

## Features

### Go CLI

#### Fetch Command

Fetch releases from GitHub organizations, users, or specific repositories:

```bash
releaselog fetch --org grokify -o releases.json
releaselog fetch --user johndoe --since 2024-01-01 -o releases.json
releaselog fetch --repo google/go-github --repo spf13/cobra -o releases.json
releaselog fetch -c config.yaml -o releases.json
```

Options:

- `--org` - GitHub organization(s) to fetch from
- `--user` - GitHub user(s) to fetch from
- `--repo` - Explicit repositories (owner/repo format)
- `--type` - Fetch releases, tags, or both (default: releases)
- `--since` - Only fetch releases after this date
- `--public` - Only fetch from public repositories (default: true)
- `-c, --config` - YAML configuration file
- `-o, --output` - Output JSON file

#### Generate Command

Generate Markdown, XLSX, or filtered JSON from a release log:

```bash
releaselog generate releases.json --format md -o RELEASES.md
releaselog generate releases.json --format xlsx -o releases.xlsx
releaselog generate releases.json --format json --since 2024-01-01 -o recent.json
```

Options:

- `--format` - Output format: md, xlsx, json (default: md)
- `--by-repo` - Group Markdown output by repository
- `--since` / `--until` - Date range filter
- `--repo` - Filter by specific repository
- `--owner` - Filter by repository owner
- `--type` - Filter by release or tag
- `--category` - Filter by categories

### JSON Intermediate Representation

Release logs are stored in a structured JSON format:

```json
{
  "ir_version": "1.0",
  "generated_at": "2024-01-15T12:00:00Z",
  "sources": ["org:grokify"],
  "releases": [...],
  "stats": {
    "total_releases": 150,
    "total_repos": 25
  }
}
```

Each release includes:

- Repository path, owner, and name
- Tag name and release name
- Release body/notes
- Published and created timestamps
- Pre-release and draft flags
- Author information
- Release assets
- Custom categories

### Configuration File

YAML configuration for complex source definitions:

```yaml
sources:
  - type: org
    name: grokify
    visibility: public
    exclude: ["*.github.io"]
  - type: user
    name: johndoe
  - type: repos
    repos:
      - google/go-github

fetch_type: releases
include_prereleases: false
since: "2024-01-01"
```

### NPM Package

Embeddable JavaScript widget with Tabulator-like API:

```javascript
const table = new ReleaseLog.ReleaseLog("#releases", {
  ajaxURL: "releases.json",
  columns: [
    { field: "published_at", title: "Date", formatter: "date" },
    { field: "repo_path", title: "Repository", formatter: "link" },
    { field: "tag_name", title: "Version", formatter: "badge" }
  ],
  pagination: { enabled: true, size: 25 },
  theme: "dark",
  events: {
    releaseClick: (e, release) => window.open(release.html_url)
  }
});
```

Features:

- Load data from URL or inline
- Customizable columns with built-in formatters
- Sorting (click headers or programmatic)
- Filtering (search, date range, repo, type)
- Pagination with configurable page size
- Three themes: Default, Dark, Minimal
- CSS custom properties for theming
- Event callbacks for interactivity

Built-in column formatters:

- `date` - Localized date formatting
- `link` - Clickable links
- `badge` - Colored badges for type/status
- `avatar` - Author avatar with GitHub link
- `markdown` - Basic markdown rendering

## Package Contents

### Go Packages

| Package | Description |
|---------|-------------|
| `cmd/releaselog` | CLI application |
| `releaselog` | Core types (Release, ReleaseLog, Config, Filter) |
| `fetch` | GitHub API fetching |
| `output/markdown` | Markdown generation |
| `output/xlsx` | XLSX generation |
| `output/json` | Filtered JSON generation |

### NPM Package

| File | Description |
|------|-------------|
| `dist/releaselog.esm.js` | ES Module (14.9kb) |
| `dist/releaselog.umd.js` | UMD/Browser (15.4kb) |
| `dist/releaselog.css` | Default theme |
| `dist/releaselog-dark.css` | Dark theme |
| `dist/releaselog-minimal.css` | Minimal theme |
| `dist/*.d.ts` | TypeScript declarations |

## Dependencies

### Go

- `github.com/google/go-github/v82` - GitHub API client
- `github.com/spf13/cobra` - CLI framework
- `github.com/xuri/excelize/v2` - XLSX generation
- `golang.org/x/oauth2` - GitHub authentication
- `gopkg.in/yaml.v3` - YAML configuration

### NPM (devDependencies)

- `esbuild` - Bundler
- `typescript` - Type checking

## Requirements

- Go 1.23+ (for CLI)
- Node.js 18+ (for NPM package development)
- GitHub token (optional, for higher rate limits)

## Known Limitations

- Tags fetched via the GitHub API do not include commit timestamps (only releases have publish dates)
- Rate limiting applies to unauthenticated requests (60/hour vs 5000/hour with token)
- Large organizations may require pagination handling for thousands of repos

## Future Plans

- JSON Schema generation for validation
- React component wrapper
- More output formats (RSS, Atom)
- Webhook support for real-time updates
- GitHub Actions integration

## Acknowledgments

- Inspired by [Zoom Developer Changelog](https://developers.zoom.us/changelog/)
- API design influenced by [Tabulator](https://tabulator.info/)
