/**
 * ReleaseLog Zod Schemas
 * Matches the ReleaseLog Specification v0.1.0
 * https://github.com/grokify/releaselog/blob/main/spec/SPEC_v0.1.0.md
 */

import { z } from 'zod';

// ============================================================================
// Author Schema
// ============================================================================

export const AuthorSchema = z.object({
  login: z.string().describe('GitHub username'),
  avatarUrl: z.string().url().optional().describe('URL to avatar image'),
  profileUrl: z.string().url().optional().describe('URL to GitHub profile'),
});

export type Author = z.infer<typeof AuthorSchema>;

// ============================================================================
// Download Schema
// ============================================================================

export const DownloadSchema = z.object({
  name: z.string().describe('Filename'),
  url: z.string().url().describe('Download URL'),
  type: z.enum(['binary', 'source', 'package', 'other']).optional().describe('Asset type'),
  platform: z.string().optional().describe('Target platform (e.g., linux_amd64)'),
  size: z.number().int().positive().optional().describe('File size in bytes'),
  checksum: z.string().optional().describe('Checksum (e.g., sha256:abc123...)'),
});

export type Download = z.infer<typeof DownloadSchema>;

// ============================================================================
// ReleaseURLs Schema
// ============================================================================

export const ReleaseURLsSchema = z.object({
  githubRelease: z.string().url().optional().describe('GitHub release page URL'),
  releaseNotes: z.string().url().optional().describe('Dedicated release notes URL'),
  changelog: z.string().url().optional().describe('CHANGELOG.md URL'),
  changelogJson: z.string().url().optional().describe('CHANGELOG.json URL'),
  diff: z.string().url().optional().describe('Git diff URL'),
  documentation: z.string().url().optional().describe('Documentation URL'),
  migrationGuide: z.string().url().optional().describe('Migration guide URL'),
  tarball: z.string().url().optional().describe('Source tarball URL'),
  zipball: z.string().url().optional().describe('Source zipball URL'),
});

export type ReleaseURLs = z.infer<typeof ReleaseURLsSchema>;

// ============================================================================
// Release Schema
// ============================================================================

export const ReleaseTypeSchema = z.enum(['release', 'tag']);
export type ReleaseType = z.infer<typeof ReleaseTypeSchema>;

export const ReleaseSchema = z.object({
  id: z.number().int().optional().describe('GitHub release ID'),
  repoPath: z.string().describe('Repository path (owner/repo)'),
  repoOwner: z.string().describe('Repository owner'),
  repoName: z.string().describe('Repository name'),
  type: ReleaseTypeSchema.describe('Release type'),
  tagName: z.string().describe('Git tag name'),
  name: z.string().describe('Release title/name'),
  body: z.string().optional().describe('Release description (markdown)'),
  publishedAt: z.string().datetime().optional().describe('Publication timestamp (ISO 8601)'),
  createdAt: z.string().datetime().optional().describe('Creation timestamp (ISO 8601)'),
  draft: z.boolean().optional().describe('Is this a draft release'),
  prerelease: z.boolean().optional().describe('Is this a pre-release'),
  urls: ReleaseURLsSchema.optional().describe('Related URLs'),
  downloads: z.array(DownloadSchema).optional().describe('Downloadable assets'),
  author: AuthorSchema.optional().describe('Release author'),
  categories: z.array(z.string()).optional().describe('Release categories'),
  highlights: z.array(z.string()).optional().describe('Key highlights'),
  breakingChanges: z.boolean().optional().describe('Contains breaking changes'),
  previousVersion: z.string().optional().describe('Previous version tag for diff'),
});

export type Release = z.infer<typeof ReleaseSchema>;

// ============================================================================
// Stats Schema
// ============================================================================

export const StatsSchema = z.object({
  totalReleases: z.number().int().nonnegative().describe('Total number of releases'),
  totalRepos: z.number().int().nonnegative().describe('Total number of repositories'),
  releasesByMonth: z.record(z.string(), z.number().int()).optional().describe('Releases by month (YYYY-MM)'),
  releasesByRepo: z.record(z.string(), z.number().int()).optional().describe('Releases by repository'),
});

export type Stats = z.infer<typeof StatsSchema>;

// ============================================================================
// ReleaseLog Schema (Root)
// ============================================================================

export const ReleaseLogSchema = z.object({
  specVersion: z.string().describe('Specification version'),
  generatedAt: z.string().datetime().describe('Generation timestamp (ISO 8601)'),
  sources: z.array(z.string()).optional().describe('Data sources'),
  releases: z.array(ReleaseSchema).describe('List of releases'),
  stats: StatsSchema.optional().describe('Aggregate statistics'),
});

export type ReleaseLog = z.infer<typeof ReleaseLogSchema>;

// ============================================================================
// Legacy Support (snake_case)
// ============================================================================

/**
 * Schema that accepts both camelCase (spec) and snake_case (legacy) field names
 */
export const ReleaseLegacySchema = z.object({
  id: z.number().int().optional(),
  repoPath: z.string().optional(),
  repo_path: z.string().optional(),
  repoOwner: z.string().optional(),
  repo_owner: z.string().optional(),
  repoName: z.string().optional(),
  repo_name: z.string().optional(),
  type: ReleaseTypeSchema,
  tagName: z.string().optional(),
  tag_name: z.string().optional(),
  name: z.string(),
  body: z.string().optional(),
  publishedAt: z.string().optional(),
  published_at: z.string().optional(),
  createdAt: z.string().optional(),
  created_at: z.string().optional(),
  draft: z.boolean().optional(),
  prerelease: z.boolean().optional(),
  urls: ReleaseURLsSchema.optional(),
  html_url: z.string().url().optional(),
  downloads: z.array(DownloadSchema).optional(),
  author: AuthorSchema.optional(),
  author_login: z.string().optional(),
  categories: z.array(z.string()).optional(),
  previousVersion: z.string().optional(),
  previous_version: z.string().optional(),
}).transform((data) => ({
  id: data.id,
  repoPath: data.repoPath || data.repo_path || '',
  repoOwner: data.repoOwner || data.repo_owner || '',
  repoName: data.repoName || data.repo_name || '',
  type: data.type,
  tagName: data.tagName || data.tag_name || '',
  name: data.name,
  body: data.body,
  publishedAt: data.publishedAt || data.published_at,
  createdAt: data.createdAt || data.created_at,
  draft: data.draft,
  prerelease: data.prerelease,
  urls: data.urls || (data.html_url ? { githubRelease: data.html_url } : undefined),
  downloads: data.downloads,
  author: data.author || (data.author_login ? { login: data.author_login } : undefined),
  categories: data.categories,
  previousVersion: data.previousVersion || data.previous_version,
}));

export const ReleaseLogLegacySchema = z.object({
  specVersion: z.string().optional(),
  ir_version: z.string().optional(),
  generatedAt: z.string().optional(),
  generated_at: z.string().optional(),
  sources: z.array(z.string()).optional(),
  releases: z.array(ReleaseLegacySchema),
  stats: StatsSchema.optional(),
}).transform((data) => ({
  specVersion: data.specVersion || data.ir_version || 'unknown',
  generatedAt: data.generatedAt || data.generated_at || new Date().toISOString(),
  sources: data.sources,
  releases: data.releases,
  stats: data.stats,
}));

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Parse and validate a ReleaseLog JSON object
 * Supports both camelCase (spec) and snake_case (legacy) formats
 */
export function parseReleaseLog(data: unknown): ReleaseLog {
  return ReleaseLogLegacySchema.parse(data);
}

/**
 * Safely parse a ReleaseLog, returning a result object
 */
export function safeParseReleaseLog(data: unknown): z.SafeParseReturnType<unknown, ReleaseLog> {
  return ReleaseLogLegacySchema.safeParse(data);
}
