# JSON Format

ReleaseLog uses a standardized JSON format for release data.

## Root Structure

```json
{
  "specVersion": "0.1.0",
  "generatedAt": "2025-01-15T10:00:00Z",
  "sources": ["https://github.com/org/repo"],
  "releases": [...],
  "stats": {...}
}
```

### Legacy Format

For backward compatibility, snake_case field names are also supported:

```json
{
  "ir_version": "v1.0",
  "generated_at": "2025-01-15T10:00:00Z",
  "releases": [...]
}
```

## Release Object

```json
{
  "id": 12345,
  "repoPath": "org/repo",
  "repoOwner": "org",
  "repoName": "repo",
  "type": "release",
  "tagName": "v1.0.0",
  "name": "Version 1.0.0",
  "body": "## Changes\n- Feature A\n- Bug fix B",
  "publishedAt": "2025-01-15T10:00:00Z",
  "createdAt": "2025-01-15T09:00:00Z",
  "draft": false,
  "prerelease": false,
  "urls": {
    "githubRelease": "https://github.com/org/repo/releases/tag/v1.0.0",
    "changelog": "https://github.com/org/repo/blob/main/CHANGELOG.md",
    "documentation": "https://docs.example.com/v1.0.0"
  },
  "downloads": [
    {
      "name": "app-linux-amd64.tar.gz",
      "url": "https://github.com/org/repo/releases/download/v1.0.0/app-linux-amd64.tar.gz",
      "type": "binary",
      "platform": "linux_amd64",
      "size": 12345678
    }
  ],
  "author": {
    "login": "username",
    "avatarUrl": "https://avatars.githubusercontent.com/u/12345",
    "profileUrl": "https://github.com/username"
  },
  "categories": ["feature", "security"]
}
```

### Legacy Release Format

```json
{
  "id": 12345,
  "repo_path": "org/repo",
  "repo_owner": "org",
  "repo_name": "repo",
  "type": "release",
  "tag_name": "v1.0.0",
  "name": "Version 1.0.0",
  "published_at": "2025-01-15T10:00:00Z",
  "html_url": "https://github.com/org/repo/releases/tag/v1.0.0",
  "author_login": "username",
  "author_avatar_url": "https://avatars.githubusercontent.com/u/12345"
}
```

## Stats Object

```json
{
  "totalReleases": 100,
  "totalRepos": 5,
  "releasesByMonth": {
    "2025-01": 10,
    "2024-12": 15
  },
  "releasesByRepo": {
    "org/repo1": 50,
    "org/repo2": 30
  }
}
```

### Legacy Stats Format

```json
{
  "total_releases": 100,
  "total_repos": 5,
  "releases_by_month": {...},
  "releases_by_repo": {...}
}
```

## Field Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"release" \| "tag"` | Release type |
| `tagName` / `tag_name` | `string` | Git tag |
| `name` | `string` | Release name |
| `repoPath` / `repo_path` | `string` | Full repo path (owner/name) |
| `repoOwner` / `repo_owner` | `string` | Repository owner |
| `repoName` / `repo_name` | `string` | Repository name |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | GitHub release ID |
| `body` | `string` | Release notes (markdown) |
| `publishedAt` / `published_at` | `string` | ISO 8601 timestamp |
| `createdAt` / `created_at` | `string` | ISO 8601 timestamp |
| `draft` | `boolean` | Draft release |
| `prerelease` | `boolean` | Pre-release |
| `urls` / `html_url` | `object \| string` | Related URLs |
| `downloads` / `assets` | `array` | Downloadable files |
| `author` / `author_login` | `object \| string` | Author info |
| `categories` | `string[]` | Categories |

## Validation

Use Zod schemas for TypeScript validation:

```typescript
import { parseReleaseLog, safeParseReleaseLog } from '@grokify/releaselog';

// Throws on invalid data
const data = parseReleaseLog(jsonData);

// Returns result object
const result = safeParseReleaseLog(jsonData);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```
