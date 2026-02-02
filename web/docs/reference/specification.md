# ReleaseLog Specification v0.1.0

This document defines the JSON format for ReleaseLog data.

## Design Principles

1. **GitHub Releases as Source of Truth** - Primary data comes from GitHub
2. **Enrichment via Metadata** - Additional data can be added per-repo
3. **URLs Only in Output** - No file paths, only resolvable URLs
4. **Go-Friendly JSON** - camelCase, no ambiguous unions
5. **Agent-Parseable** - Machine-readable for AI automation

## Root Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `specVersion` | string | Yes | Specification version (e.g., "0.1.0") |
| `generatedAt` | string | Yes | ISO 8601 timestamp |
| `sources` | string[] | No | Data source URLs |
| `releases` | Release[] | Yes | Array of releases |
| `stats` | Stats | No | Aggregate statistics |

### Legacy Support

| Legacy Field | Maps To |
|--------------|---------|
| `ir_version` | `specVersion` |
| `generated_at` | `generatedAt` |

## Release Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | No | GitHub release ID |
| `repoPath` | string | Yes | Repository path (owner/repo) |
| `repoOwner` | string | Yes | Repository owner |
| `repoName` | string | Yes | Repository name |
| `type` | "release" \| "tag" | Yes | Release type |
| `tagName` | string | Yes | Git tag |
| `name` | string | Yes | Release name/title |
| `body` | string | No | Release notes (markdown) |
| `publishedAt` | string | No | ISO 8601 publication timestamp |
| `createdAt` | string | No | ISO 8601 creation timestamp |
| `draft` | boolean | No | Is draft release |
| `prerelease` | boolean | No | Is pre-release |
| `urls` | ReleaseURLs | No | Related URLs |
| `downloads` | Download[] | No | Downloadable assets |
| `author` | Author | No | Release author |
| `categories` | string[] | No | Categories/tags |
| `highlights` | string[] | No | Key highlights |
| `breakingChanges` | boolean | No | Contains breaking changes |
| `previousVersion` | string | No | Previous version for diff |

### Legacy Release Fields

| Legacy Field | Maps To |
|--------------|---------|
| `repo_path` | `repoPath` |
| `repo_owner` | `repoOwner` |
| `repo_name` | `repoName` |
| `tag_name` | `tagName` |
| `published_at` | `publishedAt` |
| `created_at` | `createdAt` |
| `html_url` | `urls.githubRelease` |
| `author_login` | `author.login` |
| `author_avatar_url` | `author.avatarUrl` |

## ReleaseURLs Object

| Field | Type | Description |
|-------|------|-------------|
| `githubRelease` | string | GitHub release page URL |
| `releaseNotes` | string | Dedicated release notes URL |
| `changelog` | string | CHANGELOG.md URL |
| `changelogJson` | string | CHANGELOG.json URL |
| `diff` | string | Git diff URL |
| `documentation` | string | Documentation URL |
| `migrationGuide` | string | Migration guide URL |
| `tarball` | string | Source tarball URL |
| `zipball` | string | Source zipball URL |

## Download Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Filename |
| `url` | string | Yes | Download URL |
| `type` | string | No | "binary", "source", "package", "other" |
| `platform` | string | No | Target platform (e.g., "linux_amd64") |
| `size` | number | No | File size in bytes |
| `checksum` | string | No | Checksum (e.g., "sha256:abc123") |

## Author Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `login` | string | Yes | GitHub username |
| `avatarUrl` | string | No | Avatar image URL |
| `profileUrl` | string | No | GitHub profile URL |

## Stats Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `totalReleases` | number | Yes | Total release count |
| `totalRepos` | number | Yes | Total repository count |
| `releasesByMonth` | Record<string, number> | No | Releases by YYYY-MM |
| `releasesByRepo` | Record<string, number> | No | Releases by repo path |

### Legacy Stats Fields

| Legacy Field | Maps To |
|--------------|---------|
| `total_releases` | `totalReleases` |
| `total_repos` | `totalRepos` |
| `releases_by_month` | `releasesByMonth` |
| `releases_by_repo` | `releasesByRepo` |

## Example

```json
{
  "specVersion": "0.1.0",
  "generatedAt": "2025-01-15T10:00:00Z",
  "sources": [
    "https://github.com/org/repo1",
    "https://github.com/org/repo2"
  ],
  "releases": [
    {
      "id": 12345,
      "repoPath": "org/repo1",
      "repoOwner": "org",
      "repoName": "repo1",
      "type": "release",
      "tagName": "v1.0.0",
      "name": "Version 1.0.0",
      "body": "## Changes\n- Feature A\n- Bug fix B",
      "publishedAt": "2025-01-15T10:00:00Z",
      "draft": false,
      "prerelease": false,
      "urls": {
        "githubRelease": "https://github.com/org/repo1/releases/tag/v1.0.0"
      },
      "author": {
        "login": "username",
        "avatarUrl": "https://avatars.githubusercontent.com/u/12345"
      }
    }
  ],
  "stats": {
    "totalReleases": 1,
    "totalRepos": 1,
    "releasesByMonth": {
      "2025-01": 1
    },
    "releasesByRepo": {
      "org/repo1": 1
    }
  }
}
```
