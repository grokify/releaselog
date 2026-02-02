# ReleaseLog Specification v0.1.0

**Status:** Draft
**Version:** 0.1.0
**Date:** 2024-01-31

## Overview

ReleaseLog is a specification for aggregating software releases across multiple repositories into a unified, machine-readable format. It enables organizations to maintain a single view of all releases across their projects, similar to [Zoom's Developer Changelog](https://developers.zoom.us/changelog/).

## Design Principles

1. **GitHub Releases as Source of Truth** - Release existence and core metadata come from GitHub
2. **Enrichment via Per-Repo Metadata** - Repositories can provide additional context via `releaselog.json`
3. **URLs Only in Output** - All references are URLs, not file paths (file paths are build-time implementation details)
4. **Go-Friendly JSON Schema** - Uses camelCase, avoids ambiguous unions, compatible with [schemago](https://github.com/grokify/schemago)
5. **Agent-Parseable** - Structured for programmatic consumption by AI agents and automation tools

## Schema Types

### 1. Aggregated ReleaseLog (Org-Level)

The primary output format containing releases from multiple repositories.

**File:** `releaselog.json`

```json
{
  "specVersion": "0.1.0",
  "generatedAt": "2024-01-31T12:00:00Z",
  "sources": ["org:agentplexus", "user:grokify"],
  "releases": [...],
  "stats": {
    "totalReleases": 150,
    "totalRepos": 25
  }
}
```

### 2. Per-Repo ReleaseLog (Enrichment)

Optional file in each repository to provide additional metadata not available in GitHub Releases.

**File:** `releaselog.json` (in repo root)

```json
{
  "specVersion": "0.1.0",
  "repo": "agentplexus/agent-sdk",
  "defaults": {
    "releaseNotesPattern": "RELEASE_NOTES_{version}.md",
    "documentationBase": "https://docs.agentplexus.dev"
  },
  "releases": [...]
}
```

## Field Definitions

### ReleaseLog (Root Object)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `specVersion` | string | Yes | Specification version (e.g., "0.1.0") |
| `generatedAt` | string (ISO 8601) | Yes | Timestamp when the log was generated |
| `sources` | string[] | No | Source identifiers (e.g., "org:name", "user:name", "repo:owner/name") |
| `releases` | Release[] | Yes | Array of release objects |
| `stats` | Stats | No | Summary statistics |

### Release Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | No | GitHub release ID |
| `repoPath` | string | Yes | Repository path (e.g., "agentplexus/agent-sdk") |
| `repoOwner` | string | Yes | Repository owner |
| `repoName` | string | Yes | Repository name |
| `tagName` | string | Yes | Git tag (e.g., "v1.0.0") |
| `name` | string | Yes | Release name/title |
| `body` | string | No | Release description (from GitHub) |
| `type` | string | Yes | Either "release" or "tag" |
| `publishedAt` | string (ISO 8601) | No | Publication timestamp |
| `createdAt` | string (ISO 8601) | No | Creation timestamp |
| `prerelease` | boolean | No | Whether this is a pre-release |
| `draft` | boolean | No | Whether this is a draft |
| `urls` | ReleaseUrls | No | Related URLs |
| `downloads` | Download[] | No | Download links |
| `author` | Author | No | Release author information |
| `categories` | string[] | No | Categorization tags |
| `highlights` | string[] | No | Key features/changes (short list) |
| `breakingChanges` | boolean | No | Whether this release has breaking changes |
| `previousVersion` | string | No | Previous version tag (for diff URL construction) |

### ReleaseUrls Object

All URLs related to a release.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `githubRelease` | string (URL) | No | GitHub release page |
| `releaseNotes` | string (URL) | No | Detailed release notes (Markdown, web page, etc.) |
| `changelog` | string (URL) | No | Link to CHANGELOG.md (with anchor if available) |
| `changelogJson` | string (URL) | No | Link to CHANGELOG.json |
| `diff` | string (URL) | No | Git diff comparison URL |
| `documentation` | string (URL) | No | Version-specific documentation |
| `migrationGuide` | string (URL) | No | Upgrade/migration instructions |
| `tarball` | string (URL) | No | Source tarball URL |
| `zipball` | string (URL) | No | Source zipball URL |

### Download Object

Binary or package downloads.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name (e.g., "Linux (amd64)") |
| `url` | string (URL) | Yes | Download URL |
| `type` | string | No | Download type: "binary", "package", "container", "installer" |
| `platform` | string | No | Target platform (e.g., "linux/amd64", "darwin/arm64") |
| `size` | integer | No | File size in bytes |
| `checksum` | string | No | Checksum (e.g., "sha256:abc123...") |

### Author Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `login` | string | Yes | GitHub username |
| `avatarUrl` | string (URL) | No | Avatar image URL |
| `profileUrl` | string (URL) | No | GitHub profile URL |

### Stats Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `totalReleases` | integer | Yes | Total number of releases |
| `totalRepos` | integer | Yes | Total number of repositories |
| `releasesByRepo` | object | No | Map of repo path to release count |
| `releasesByMonth` | object | No | Map of YYYY-MM to release count |

### Per-Repo Defaults Object

Default values for release metadata within a repository.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `releaseNotesPattern` | string | No | Pattern for release notes files (e.g., "RELEASE_NOTES_{version}.md") |
| `documentationBase` | string (URL) | No | Base URL for documentation |
| `changelogUrl` | string (URL) | No | URL to CHANGELOG.md |
| `changelogJsonUrl` | string (URL) | No | URL to CHANGELOG.json |

## URL Construction

### Release Notes URL

If not explicitly provided, can be constructed from:

1. **Pattern in defaults:** `releaseNotesPattern` with `{version}` placeholder
2. **GitHub blob URL:** `https://github.com/{owner}/{repo}/blob/main/RELEASE_NOTES_{version}.md`
3. **Parsed from GitHub release body:** Look for patterns like:
   - `**Release Notes**: [link](URL)`
   - `**Release Notes**: [\`{version}\`](PATH)`
   - `See [release notes](URL)`

### Diff URL

Constructed from `previousVersion`:
```
https://github.com/{owner}/{repo}/compare/{previousVersion}...{tagName}
```

### Changelog Anchor

For CHANGELOG.md links, append version anchor:
```
https://github.com/{owner}/{repo}/blob/main/CHANGELOG.md#v100
```

## Source Identifiers

Format: `{type}:{name}`

| Type | Example | Description |
|------|---------|-------------|
| `org` | `org:agentplexus` | GitHub organization |
| `user` | `user:grokify` | GitHub user |
| `repo` | `repo:grokify/mogo` | Specific repository |

## Categories

Recommended category values:

| Category | Description |
|----------|-------------|
| `major` | Major version release |
| `minor` | Minor version release |
| `patch` | Patch/bugfix release |
| `security` | Security-related release |
| `breaking-change` | Contains breaking changes |
| `feature` | New feature release |
| `bugfix` | Bug fix release |
| `docs` | Documentation-only release |
| `deprecation` | Deprecates functionality |

## Example: Complete Release Object

```json
{
  "id": 123456789,
  "repoPath": "agentplexus/agent-sdk",
  "repoOwner": "agentplexus",
  "repoName": "agent-sdk",
  "tagName": "v1.0.0",
  "name": "Agent SDK 1.0.0 - Stable Release",
  "body": "## What's New\n\n- Production-ready API\n- Full documentation\n\n**Release Notes**: [`v1.0.0`](RELEASE_NOTES_v1.0.0.md)",
  "type": "release",
  "publishedAt": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T09:30:00Z",
  "prerelease": false,
  "draft": false,
  "urls": {
    "githubRelease": "https://github.com/agentplexus/agent-sdk/releases/tag/v1.0.0",
    "releaseNotes": "https://github.com/agentplexus/agent-sdk/blob/main/RELEASE_NOTES_v1.0.0.md",
    "changelog": "https://github.com/agentplexus/agent-sdk/blob/main/CHANGELOG.md#v100",
    "changelogJson": "https://github.com/agentplexus/agent-sdk/blob/main/CHANGELOG.json",
    "diff": "https://github.com/agentplexus/agent-sdk/compare/v0.9.0...v1.0.0",
    "documentation": "https://docs.agentplexus.dev/sdk/v1.0.0"
  },
  "downloads": [
    {
      "name": "Linux (amd64)",
      "url": "https://github.com/agentplexus/agent-sdk/releases/download/v1.0.0/agent-sdk-linux-amd64",
      "type": "binary",
      "platform": "linux/amd64"
    },
    {
      "name": "Docker Image",
      "url": "ghcr.io/agentplexus/agent-sdk:v1.0.0",
      "type": "container"
    }
  ],
  "author": {
    "login": "grokify",
    "avatarUrl": "https://avatars.githubusercontent.com/u/209872?v=4",
    "profileUrl": "https://github.com/grokify"
  },
  "categories": ["major", "feature"],
  "highlights": [
    "Production-ready API",
    "Comprehensive documentation",
    "Full test coverage"
  ],
  "breakingChanges": false,
  "previousVersion": "v0.9.0"
}
```

## Example: Per-Repo releaselog.json

```json
{
  "specVersion": "0.1.0",
  "repo": "agentplexus/agent-sdk",
  "defaults": {
    "releaseNotesPattern": "RELEASE_NOTES_{version}.md",
    "documentationBase": "https://docs.agentplexus.dev/sdk",
    "changelogUrl": "https://github.com/agentplexus/agent-sdk/blob/main/CHANGELOG.md",
    "changelogJsonUrl": "https://github.com/agentplexus/agent-sdk/blob/main/CHANGELOG.json"
  },
  "releases": [
    {
      "tagName": "v1.0.0",
      "urls": {
        "migrationGuide": "https://docs.agentplexus.dev/sdk/migration/v1"
      },
      "downloads": [
        {
          "name": "Homebrew",
          "url": "brew install agentplexus/tap/agent-sdk",
          "type": "package"
        }
      ],
      "categories": ["major"],
      "highlights": ["Production-ready API", "Full documentation"],
      "breakingChanges": false
    }
  ]
}
```

## Build Process

### Aggregation Workflow

1. **Discover repositories** from GitHub API
2. **Fetch GitHub Releases** for each repository
3. **Check for local clones** at configured paths (e.g., `~/go/src/github.com/{org}/*`)
4. **Read per-repo `releaselog.json`** if present (local file or API)
5. **Parse release notes URL** from GitHub release body if not in enrichment
6. **Merge enrichment** with GitHub data (enrichment takes precedence)
7. **Construct URLs** from patterns and defaults
8. **Output aggregated `releaselog.json`**

### Local File Optimization

When repos are cloned locally, read files directly instead of API calls:

```
~/go/src/github.com/agentplexus/agent-sdk/
├── releaselog.json          # Per-repo enrichment
├── CHANGELOG.json           # Structured changelog
├── CHANGELOG.md             # Human changelog
├── RELEASE_NOTES_v1.0.0.md  # Version-specific notes
└── RELEASE_NOTES_v0.9.0.md
```

## Compatibility

### JSON Schema

The specification includes a JSON Schema file compatible with:

- Go code generation via `github.com/invopop/jsonschema`
- Validation via [schemago](https://github.com/grokify/schemago)
- Standard JSON Schema validators

### Go-Friendly Design

This specification follows "Go-Friendly JSON Schema" principles:

- **camelCase field names** for idiomatic Go struct tags
- **No ambiguous unions** (anyOf/oneOf with discriminator)
- **Explicit types** (no implicit type coercion)
- **Clear nullability** (optional fields omitted, not null)

## Versioning

This specification follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes to the schema
- **MINOR**: New optional fields or features
- **PATCH**: Clarifications and documentation fixes

## References

- [GitHub Releases API](https://docs.github.com/en/rest/releases)
- [Structured Changelog](https://github.com/grokify/structured-changelog)
- [schemago](https://github.com/grokify/schemago) - JSON Schema linting for Go
- [Zoom Developer Changelog](https://developers.zoom.us/changelog/) - Inspiration

## License

This specification is released under the MIT License.
