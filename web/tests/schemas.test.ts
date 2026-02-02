/**
 * Tests for Zod schemas
 */

import { describe, it, expect } from 'vitest';
import {
  ReleaseSchema,
  ReleaseLogSchema,
  ReleaseLegacySchema,
  ReleaseLogLegacySchema,
  parseReleaseLog,
  safeParseReleaseLog,
} from '../src/schemas';

describe('ReleaseSchema', () => {
  it('should validate a valid release', () => {
    const release = {
      repoPath: 'owner/repo',
      repoOwner: 'owner',
      repoName: 'repo',
      type: 'release',
      tagName: 'v1.0.0',
      name: 'Version 1.0.0',
      publishedAt: '2025-01-15T10:00:00Z',
    };

    const result = ReleaseSchema.safeParse(release);
    expect(result.success).toBe(true);
  });

  it('should reject invalid release type', () => {
    const release = {
      repoPath: 'owner/repo',
      repoOwner: 'owner',
      repoName: 'repo',
      type: 'invalid',
      tagName: 'v1.0.0',
      name: 'Version 1.0.0',
    };

    const result = ReleaseSchema.safeParse(release);
    expect(result.success).toBe(false);
  });
});

describe('ReleaseLegacySchema', () => {
  it('should transform snake_case to camelCase', () => {
    const legacyRelease = {
      repo_path: 'owner/repo',
      repo_owner: 'owner',
      repo_name: 'repo',
      type: 'release',
      tag_name: 'v1.0.0',
      name: 'Version 1.0.0',
      published_at: '2025-01-15T10:00:00Z',
      html_url: 'https://github.com/owner/repo/releases/tag/v1.0.0',
      author_login: 'johndoe',
    };

    const result = ReleaseLegacySchema.safeParse(legacyRelease);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.repoPath).toBe('owner/repo');
      expect(result.data.tagName).toBe('v1.0.0');
      expect(result.data.publishedAt).toBe('2025-01-15T10:00:00Z');
      expect(result.data.urls?.githubRelease).toBe('https://github.com/owner/repo/releases/tag/v1.0.0');
      expect(result.data.author?.login).toBe('johndoe');
    }
  });

  it('should accept camelCase input', () => {
    const release = {
      repoPath: 'owner/repo',
      repoOwner: 'owner',
      repoName: 'repo',
      type: 'release',
      tagName: 'v1.0.0',
      name: 'Version 1.0.0',
    };

    const result = ReleaseLegacySchema.safeParse(release);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.repoPath).toBe('owner/repo');
    }
  });
});

describe('ReleaseLogLegacySchema', () => {
  it('should transform legacy ir_version to specVersion', () => {
    const legacyData = {
      ir_version: 'v1.0',
      generated_at: '2025-01-15T10:00:00Z',
      releases: [
        {
          repo_path: 'owner/repo',
          repo_owner: 'owner',
          repo_name: 'repo',
          type: 'release',
          tag_name: 'v1.0.0',
          name: 'Version 1.0.0',
        },
      ],
    };

    const result = ReleaseLogLegacySchema.safeParse(legacyData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.specVersion).toBe('v1.0');
      expect(result.data.generatedAt).toBe('2025-01-15T10:00:00Z');
      expect(result.data.releases).toHaveLength(1);
    }
  });
});

describe('parseReleaseLog', () => {
  it('should parse valid legacy data', () => {
    const data = {
      ir_version: 'v1.0',
      generated_at: '2025-01-15T10:00:00Z',
      releases: [
        {
          repo_path: 'owner/repo',
          repo_owner: 'owner',
          repo_name: 'repo',
          type: 'release',
          tag_name: 'v1.0.0',
          name: 'Version 1.0.0',
        },
      ],
    };

    const result = parseReleaseLog(data);
    expect(result.specVersion).toBe('v1.0');
    expect(result.releases).toHaveLength(1);
  });

  it('should throw on invalid data', () => {
    const invalidData = {
      releases: 'not an array',
    };

    expect(() => parseReleaseLog(invalidData)).toThrow();
  });
});

describe('safeParseReleaseLog', () => {
  it('should return success for valid data', () => {
    const data = {
      specVersion: 'v1.0',
      generatedAt: '2025-01-15T10:00:00Z',
      releases: [
        {
          repoPath: 'owner/repo',
          repoOwner: 'owner',
          repoName: 'repo',
          type: 'release',
          tagName: 'v1.0.0',
          name: 'Version 1.0.0',
        },
      ],
    };

    const result = safeParseReleaseLog(data);
    expect(result.success).toBe(true);
  });

  it('should return error for invalid data', () => {
    const invalidData = {
      releases: 'not an array',
    };

    const result = safeParseReleaseLog(invalidData);
    expect(result.success).toBe(false);
  });
});
