# CLI Reference

## Commands

### `releaselog fetch`

Fetch releases from GitHub sources.

```
releaselog fetch [flags]
```

#### Flags

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--org` | strings | | GitHub organization(s) to fetch from |
| `--user` | strings | | GitHub user(s) to fetch from |
| `--repo` | strings | | Explicit repo(s) in owner/repo format |
| `--type` | string | `releases` | What to fetch: releases, tags, or both |
| `--since` | string | | Only fetch releases after this date (YYYY-MM-DD) |
| `-o, --output` | string | `releaselog.json` | Output JSON file |
| `--public` | bool | `true` | Only fetch from public repositories |
| `-c, --config` | string | | Config file (YAML) |
| `-v, --verbose` | bool | | Verbose output |

#### Examples

```bash
# Fetch from an organization
releaselog fetch --org grokify -o releases.json

# Fetch from multiple sources
releaselog fetch --org myorg --user johndoe --repo google/go-github -o releases.json

# Fetch with date filter
releaselog fetch --org myorg --since 2024-01-01 -o releases.json

# Use a config file
releaselog fetch -c config.yaml -o releases.json
```

### `releaselog generate`

Generate output from a release log.

```
releaselog generate <input.json> [flags]
```

#### Flags

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--format` | string | `md` | Output format: md, xlsx, json |
| `-o, --output` | string | stdout | Output file |
| `--since` | string | | Filter: only releases after this date |
| `--until` | string | | Filter: only releases before this date |
| `--repo` | string | | Filter: only this repo (owner/repo) |
| `--owner` | string | | Filter: only repos from this owner |
| `--type` | string | | Filter: release or tag |
| `--category` | strings | | Filter: releases with these categories |
| `--by-repo` | bool | | Group output by repository (Markdown only) |

#### Examples

```bash
# Generate Markdown
releaselog generate releases.json --format md -o RELEASES.md

# Generate Markdown grouped by repository
releaselog generate releases.json --format md --by-repo -o RELEASES.md

# Generate XLSX spreadsheet
releaselog generate releases.json --format xlsx -o releases.xlsx

# Generate filtered JSON
releaselog generate releases.json --format json --since 2024-01-01 -o recent.json

# Filter by owner
releaselog generate releases.json --format md --owner grokify -o grokify-releases.md
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub personal access token for API authentication. Increases rate limits from 60 to 5000 requests/hour. |

## Configuration File Format

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
