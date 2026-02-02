/**
 * ReleaseLog Zod Schemas
 * Matches the ReleaseLog Specification v0.1.0
 * https://github.com/grokify/releaselog/blob/main/spec/SPEC_v0.1.0.md
 */
import { z } from 'zod';
export declare const AuthorSchema: z.ZodObject<{
    login: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
    profileUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    login: string;
    avatarUrl?: string | undefined;
    profileUrl?: string | undefined;
}, {
    login: string;
    avatarUrl?: string | undefined;
    profileUrl?: string | undefined;
}>;
export type Author = z.infer<typeof AuthorSchema>;
export declare const DownloadSchema: z.ZodObject<{
    name: z.ZodString;
    url: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<["binary", "source", "package", "other"]>>;
    platform: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
    checksum: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    url: string;
    type?: "binary" | "source" | "package" | "other" | undefined;
    platform?: string | undefined;
    size?: number | undefined;
    checksum?: string | undefined;
}, {
    name: string;
    url: string;
    type?: "binary" | "source" | "package" | "other" | undefined;
    platform?: string | undefined;
    size?: number | undefined;
    checksum?: string | undefined;
}>;
export type Download = z.infer<typeof DownloadSchema>;
export declare const ReleaseURLsSchema: z.ZodObject<{
    githubRelease: z.ZodOptional<z.ZodString>;
    releaseNotes: z.ZodOptional<z.ZodString>;
    changelog: z.ZodOptional<z.ZodString>;
    changelogJson: z.ZodOptional<z.ZodString>;
    diff: z.ZodOptional<z.ZodString>;
    documentation: z.ZodOptional<z.ZodString>;
    migrationGuide: z.ZodOptional<z.ZodString>;
    tarball: z.ZodOptional<z.ZodString>;
    zipball: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    githubRelease?: string | undefined;
    releaseNotes?: string | undefined;
    changelog?: string | undefined;
    changelogJson?: string | undefined;
    diff?: string | undefined;
    documentation?: string | undefined;
    migrationGuide?: string | undefined;
    tarball?: string | undefined;
    zipball?: string | undefined;
}, {
    githubRelease?: string | undefined;
    releaseNotes?: string | undefined;
    changelog?: string | undefined;
    changelogJson?: string | undefined;
    diff?: string | undefined;
    documentation?: string | undefined;
    migrationGuide?: string | undefined;
    tarball?: string | undefined;
    zipball?: string | undefined;
}>;
export type ReleaseURLs = z.infer<typeof ReleaseURLsSchema>;
export declare const ReleaseTypeSchema: z.ZodEnum<["release", "tag"]>;
export type ReleaseType = z.infer<typeof ReleaseTypeSchema>;
export declare const ReleaseSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    repoPath: z.ZodString;
    repoOwner: z.ZodString;
    repoName: z.ZodString;
    type: z.ZodEnum<["release", "tag"]>;
    tagName: z.ZodString;
    name: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    publishedAt: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    draft: z.ZodOptional<z.ZodBoolean>;
    prerelease: z.ZodOptional<z.ZodBoolean>;
    urls: z.ZodOptional<z.ZodObject<{
        githubRelease: z.ZodOptional<z.ZodString>;
        releaseNotes: z.ZodOptional<z.ZodString>;
        changelog: z.ZodOptional<z.ZodString>;
        changelogJson: z.ZodOptional<z.ZodString>;
        diff: z.ZodOptional<z.ZodString>;
        documentation: z.ZodOptional<z.ZodString>;
        migrationGuide: z.ZodOptional<z.ZodString>;
        tarball: z.ZodOptional<z.ZodString>;
        zipball: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    }, {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    }>>;
    downloads: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<["binary", "source", "package", "other"]>>;
        platform: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        checksum: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }, {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }>, "many">>;
    author: z.ZodOptional<z.ZodObject<{
        login: z.ZodString;
        avatarUrl: z.ZodOptional<z.ZodString>;
        profileUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    }, {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    }>>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    highlights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    breakingChanges: z.ZodOptional<z.ZodBoolean>;
    previousVersion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "release" | "tag";
    name: string;
    repoPath: string;
    repoOwner: string;
    repoName: string;
    tagName: string;
    id?: number | undefined;
    body?: string | undefined;
    draft?: boolean | undefined;
    prerelease?: boolean | undefined;
    categories?: string[] | undefined;
    publishedAt?: string | undefined;
    createdAt?: string | undefined;
    urls?: {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    } | undefined;
    downloads?: {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }[] | undefined;
    author?: {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    } | undefined;
    highlights?: string[] | undefined;
    breakingChanges?: boolean | undefined;
    previousVersion?: string | undefined;
}, {
    type: "release" | "tag";
    name: string;
    repoPath: string;
    repoOwner: string;
    repoName: string;
    tagName: string;
    id?: number | undefined;
    body?: string | undefined;
    draft?: boolean | undefined;
    prerelease?: boolean | undefined;
    categories?: string[] | undefined;
    publishedAt?: string | undefined;
    createdAt?: string | undefined;
    urls?: {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    } | undefined;
    downloads?: {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }[] | undefined;
    author?: {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    } | undefined;
    highlights?: string[] | undefined;
    breakingChanges?: boolean | undefined;
    previousVersion?: string | undefined;
}>;
export type Release = z.infer<typeof ReleaseSchema>;
export declare const StatsSchema: z.ZodObject<{
    totalReleases: z.ZodNumber;
    totalRepos: z.ZodNumber;
    releasesByMonth: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    releasesByRepo: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    totalReleases: number;
    totalRepos: number;
    releasesByMonth?: Record<string, number> | undefined;
    releasesByRepo?: Record<string, number> | undefined;
}, {
    totalReleases: number;
    totalRepos: number;
    releasesByMonth?: Record<string, number> | undefined;
    releasesByRepo?: Record<string, number> | undefined;
}>;
export type Stats = z.infer<typeof StatsSchema>;
export declare const ReleaseLogSchema: z.ZodObject<{
    specVersion: z.ZodString;
    generatedAt: z.ZodString;
    sources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    releases: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        repoPath: z.ZodString;
        repoOwner: z.ZodString;
        repoName: z.ZodString;
        type: z.ZodEnum<["release", "tag"]>;
        tagName: z.ZodString;
        name: z.ZodString;
        body: z.ZodOptional<z.ZodString>;
        publishedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        draft: z.ZodOptional<z.ZodBoolean>;
        prerelease: z.ZodOptional<z.ZodBoolean>;
        urls: z.ZodOptional<z.ZodObject<{
            githubRelease: z.ZodOptional<z.ZodString>;
            releaseNotes: z.ZodOptional<z.ZodString>;
            changelog: z.ZodOptional<z.ZodString>;
            changelogJson: z.ZodOptional<z.ZodString>;
            diff: z.ZodOptional<z.ZodString>;
            documentation: z.ZodOptional<z.ZodString>;
            migrationGuide: z.ZodOptional<z.ZodString>;
            tarball: z.ZodOptional<z.ZodString>;
            zipball: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        }, {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        }>>;
        downloads: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
            type: z.ZodOptional<z.ZodEnum<["binary", "source", "package", "other"]>>;
            platform: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
            checksum: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }, {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }>, "many">>;
        author: z.ZodOptional<z.ZodObject<{
            login: z.ZodString;
            avatarUrl: z.ZodOptional<z.ZodString>;
            profileUrl: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        }, {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        }>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        highlights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        breakingChanges: z.ZodOptional<z.ZodBoolean>;
        previousVersion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "release" | "tag";
        name: string;
        repoPath: string;
        repoOwner: string;
        repoName: string;
        tagName: string;
        id?: number | undefined;
        body?: string | undefined;
        draft?: boolean | undefined;
        prerelease?: boolean | undefined;
        categories?: string[] | undefined;
        publishedAt?: string | undefined;
        createdAt?: string | undefined;
        urls?: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads?: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author?: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        highlights?: string[] | undefined;
        breakingChanges?: boolean | undefined;
        previousVersion?: string | undefined;
    }, {
        type: "release" | "tag";
        name: string;
        repoPath: string;
        repoOwner: string;
        repoName: string;
        tagName: string;
        id?: number | undefined;
        body?: string | undefined;
        draft?: boolean | undefined;
        prerelease?: boolean | undefined;
        categories?: string[] | undefined;
        publishedAt?: string | undefined;
        createdAt?: string | undefined;
        urls?: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads?: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author?: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        highlights?: string[] | undefined;
        breakingChanges?: boolean | undefined;
        previousVersion?: string | undefined;
    }>, "many">;
    stats: z.ZodOptional<z.ZodObject<{
        totalReleases: z.ZodNumber;
        totalRepos: z.ZodNumber;
        releasesByMonth: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        releasesByRepo: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    }, {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    specVersion: string;
    generatedAt: string;
    releases: {
        type: "release" | "tag";
        name: string;
        repoPath: string;
        repoOwner: string;
        repoName: string;
        tagName: string;
        id?: number | undefined;
        body?: string | undefined;
        draft?: boolean | undefined;
        prerelease?: boolean | undefined;
        categories?: string[] | undefined;
        publishedAt?: string | undefined;
        createdAt?: string | undefined;
        urls?: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads?: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author?: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        highlights?: string[] | undefined;
        breakingChanges?: boolean | undefined;
        previousVersion?: string | undefined;
    }[];
    sources?: string[] | undefined;
    stats?: {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    } | undefined;
}, {
    specVersion: string;
    generatedAt: string;
    releases: {
        type: "release" | "tag";
        name: string;
        repoPath: string;
        repoOwner: string;
        repoName: string;
        tagName: string;
        id?: number | undefined;
        body?: string | undefined;
        draft?: boolean | undefined;
        prerelease?: boolean | undefined;
        categories?: string[] | undefined;
        publishedAt?: string | undefined;
        createdAt?: string | undefined;
        urls?: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads?: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author?: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        highlights?: string[] | undefined;
        breakingChanges?: boolean | undefined;
        previousVersion?: string | undefined;
    }[];
    sources?: string[] | undefined;
    stats?: {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    } | undefined;
}>;
export type ReleaseLog = z.infer<typeof ReleaseLogSchema>;
/**
 * Schema that accepts both camelCase (spec) and snake_case (legacy) field names
 */
export declare const ReleaseLegacySchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    repoPath: z.ZodOptional<z.ZodString>;
    repo_path: z.ZodOptional<z.ZodString>;
    repoOwner: z.ZodOptional<z.ZodString>;
    repo_owner: z.ZodOptional<z.ZodString>;
    repoName: z.ZodOptional<z.ZodString>;
    repo_name: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["release", "tag"]>;
    tagName: z.ZodOptional<z.ZodString>;
    tag_name: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    publishedAt: z.ZodOptional<z.ZodString>;
    published_at: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodString>;
    draft: z.ZodOptional<z.ZodBoolean>;
    prerelease: z.ZodOptional<z.ZodBoolean>;
    urls: z.ZodOptional<z.ZodObject<{
        githubRelease: z.ZodOptional<z.ZodString>;
        releaseNotes: z.ZodOptional<z.ZodString>;
        changelog: z.ZodOptional<z.ZodString>;
        changelogJson: z.ZodOptional<z.ZodString>;
        diff: z.ZodOptional<z.ZodString>;
        documentation: z.ZodOptional<z.ZodString>;
        migrationGuide: z.ZodOptional<z.ZodString>;
        tarball: z.ZodOptional<z.ZodString>;
        zipball: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    }, {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    }>>;
    html_url: z.ZodOptional<z.ZodString>;
    downloads: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<["binary", "source", "package", "other"]>>;
        platform: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        checksum: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }, {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }>, "many">>;
    author: z.ZodOptional<z.ZodObject<{
        login: z.ZodString;
        avatarUrl: z.ZodOptional<z.ZodString>;
        profileUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    }, {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    }>>;
    author_login: z.ZodOptional<z.ZodString>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    previousVersion: z.ZodOptional<z.ZodString>;
    previous_version: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "release" | "tag";
    name: string;
    id?: number | undefined;
    repo_path?: string | undefined;
    repo_owner?: string | undefined;
    repo_name?: string | undefined;
    tag_name?: string | undefined;
    body?: string | undefined;
    published_at?: string | undefined;
    created_at?: string | undefined;
    draft?: boolean | undefined;
    prerelease?: boolean | undefined;
    html_url?: string | undefined;
    author_login?: string | undefined;
    categories?: string[] | undefined;
    repoPath?: string | undefined;
    repoOwner?: string | undefined;
    repoName?: string | undefined;
    tagName?: string | undefined;
    publishedAt?: string | undefined;
    createdAt?: string | undefined;
    urls?: {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    } | undefined;
    downloads?: {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }[] | undefined;
    author?: {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    } | undefined;
    previousVersion?: string | undefined;
    previous_version?: string | undefined;
}, {
    type: "release" | "tag";
    name: string;
    id?: number | undefined;
    repo_path?: string | undefined;
    repo_owner?: string | undefined;
    repo_name?: string | undefined;
    tag_name?: string | undefined;
    body?: string | undefined;
    published_at?: string | undefined;
    created_at?: string | undefined;
    draft?: boolean | undefined;
    prerelease?: boolean | undefined;
    html_url?: string | undefined;
    author_login?: string | undefined;
    categories?: string[] | undefined;
    repoPath?: string | undefined;
    repoOwner?: string | undefined;
    repoName?: string | undefined;
    tagName?: string | undefined;
    publishedAt?: string | undefined;
    createdAt?: string | undefined;
    urls?: {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    } | undefined;
    downloads?: {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }[] | undefined;
    author?: {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    } | undefined;
    previousVersion?: string | undefined;
    previous_version?: string | undefined;
}>, {
    id: number | undefined;
    repoPath: string;
    repoOwner: string;
    repoName: string;
    type: "release" | "tag";
    tagName: string;
    name: string;
    body: string | undefined;
    publishedAt: string | undefined;
    createdAt: string | undefined;
    draft: boolean | undefined;
    prerelease: boolean | undefined;
    urls: {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    } | undefined;
    downloads: {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }[] | undefined;
    author: {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    } | undefined;
    categories: string[] | undefined;
    previousVersion: string | undefined;
}, {
    type: "release" | "tag";
    name: string;
    id?: number | undefined;
    repo_path?: string | undefined;
    repo_owner?: string | undefined;
    repo_name?: string | undefined;
    tag_name?: string | undefined;
    body?: string | undefined;
    published_at?: string | undefined;
    created_at?: string | undefined;
    draft?: boolean | undefined;
    prerelease?: boolean | undefined;
    html_url?: string | undefined;
    author_login?: string | undefined;
    categories?: string[] | undefined;
    repoPath?: string | undefined;
    repoOwner?: string | undefined;
    repoName?: string | undefined;
    tagName?: string | undefined;
    publishedAt?: string | undefined;
    createdAt?: string | undefined;
    urls?: {
        githubRelease?: string | undefined;
        releaseNotes?: string | undefined;
        changelog?: string | undefined;
        changelogJson?: string | undefined;
        diff?: string | undefined;
        documentation?: string | undefined;
        migrationGuide?: string | undefined;
        tarball?: string | undefined;
        zipball?: string | undefined;
    } | undefined;
    downloads?: {
        name: string;
        url: string;
        type?: "binary" | "source" | "package" | "other" | undefined;
        platform?: string | undefined;
        size?: number | undefined;
        checksum?: string | undefined;
    }[] | undefined;
    author?: {
        login: string;
        avatarUrl?: string | undefined;
        profileUrl?: string | undefined;
    } | undefined;
    previousVersion?: string | undefined;
    previous_version?: string | undefined;
}>;
export declare const ReleaseLogLegacySchema: z.ZodEffects<z.ZodObject<{
    specVersion: z.ZodOptional<z.ZodString>;
    ir_version: z.ZodOptional<z.ZodString>;
    generatedAt: z.ZodOptional<z.ZodString>;
    generated_at: z.ZodOptional<z.ZodString>;
    sources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    releases: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        repoPath: z.ZodOptional<z.ZodString>;
        repo_path: z.ZodOptional<z.ZodString>;
        repoOwner: z.ZodOptional<z.ZodString>;
        repo_owner: z.ZodOptional<z.ZodString>;
        repoName: z.ZodOptional<z.ZodString>;
        repo_name: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["release", "tag"]>;
        tagName: z.ZodOptional<z.ZodString>;
        tag_name: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        body: z.ZodOptional<z.ZodString>;
        publishedAt: z.ZodOptional<z.ZodString>;
        published_at: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodString>;
        draft: z.ZodOptional<z.ZodBoolean>;
        prerelease: z.ZodOptional<z.ZodBoolean>;
        urls: z.ZodOptional<z.ZodObject<{
            githubRelease: z.ZodOptional<z.ZodString>;
            releaseNotes: z.ZodOptional<z.ZodString>;
            changelog: z.ZodOptional<z.ZodString>;
            changelogJson: z.ZodOptional<z.ZodString>;
            diff: z.ZodOptional<z.ZodString>;
            documentation: z.ZodOptional<z.ZodString>;
            migrationGuide: z.ZodOptional<z.ZodString>;
            tarball: z.ZodOptional<z.ZodString>;
            zipball: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        }, {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        }>>;
        html_url: z.ZodOptional<z.ZodString>;
        downloads: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
            type: z.ZodOptional<z.ZodEnum<["binary", "source", "package", "other"]>>;
            platform: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
            checksum: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }, {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }>, "many">>;
        author: z.ZodOptional<z.ZodObject<{
            login: z.ZodString;
            avatarUrl: z.ZodOptional<z.ZodString>;
            profileUrl: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        }, {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        }>>;
        author_login: z.ZodOptional<z.ZodString>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        previousVersion: z.ZodOptional<z.ZodString>;
        previous_version: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "release" | "tag";
        name: string;
        id?: number | undefined;
        repo_path?: string | undefined;
        repo_owner?: string | undefined;
        repo_name?: string | undefined;
        tag_name?: string | undefined;
        body?: string | undefined;
        published_at?: string | undefined;
        created_at?: string | undefined;
        draft?: boolean | undefined;
        prerelease?: boolean | undefined;
        html_url?: string | undefined;
        author_login?: string | undefined;
        categories?: string[] | undefined;
        repoPath?: string | undefined;
        repoOwner?: string | undefined;
        repoName?: string | undefined;
        tagName?: string | undefined;
        publishedAt?: string | undefined;
        createdAt?: string | undefined;
        urls?: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads?: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author?: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        previousVersion?: string | undefined;
        previous_version?: string | undefined;
    }, {
        type: "release" | "tag";
        name: string;
        id?: number | undefined;
        repo_path?: string | undefined;
        repo_owner?: string | undefined;
        repo_name?: string | undefined;
        tag_name?: string | undefined;
        body?: string | undefined;
        published_at?: string | undefined;
        created_at?: string | undefined;
        draft?: boolean | undefined;
        prerelease?: boolean | undefined;
        html_url?: string | undefined;
        author_login?: string | undefined;
        categories?: string[] | undefined;
        repoPath?: string | undefined;
        repoOwner?: string | undefined;
        repoName?: string | undefined;
        tagName?: string | undefined;
        publishedAt?: string | undefined;
        createdAt?: string | undefined;
        urls?: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads?: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author?: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        previousVersion?: string | undefined;
        previous_version?: string | undefined;
    }>, {
        id: number | undefined;
        repoPath: string;
        repoOwner: string;
        repoName: string;
        type: "release" | "tag";
        tagName: string;
        name: string;
        body: string | undefined;
        publishedAt: string | undefined;
        createdAt: string | undefined;
        draft: boolean | undefined;
        prerelease: boolean | undefined;
        urls: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        categories: string[] | undefined;
        previousVersion: string | undefined;
    }, {
        type: "release" | "tag";
        name: string;
        id?: number | undefined;
        repo_path?: string | undefined;
        repo_owner?: string | undefined;
        repo_name?: string | undefined;
        tag_name?: string | undefined;
        body?: string | undefined;
        published_at?: string | undefined;
        created_at?: string | undefined;
        draft?: boolean | undefined;
        prerelease?: boolean | undefined;
        html_url?: string | undefined;
        author_login?: string | undefined;
        categories?: string[] | undefined;
        repoPath?: string | undefined;
        repoOwner?: string | undefined;
        repoName?: string | undefined;
        tagName?: string | undefined;
        publishedAt?: string | undefined;
        createdAt?: string | undefined;
        urls?: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads?: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author?: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        previousVersion?: string | undefined;
        previous_version?: string | undefined;
    }>, "many">;
    stats: z.ZodOptional<z.ZodObject<{
        totalReleases: z.ZodNumber;
        totalRepos: z.ZodNumber;
        releasesByMonth: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        releasesByRepo: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    }, {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    releases: {
        id: number | undefined;
        repoPath: string;
        repoOwner: string;
        repoName: string;
        type: "release" | "tag";
        tagName: string;
        name: string;
        body: string | undefined;
        publishedAt: string | undefined;
        createdAt: string | undefined;
        draft: boolean | undefined;
        prerelease: boolean | undefined;
        urls: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        categories: string[] | undefined;
        previousVersion: string | undefined;
    }[];
    specVersion?: string | undefined;
    generatedAt?: string | undefined;
    sources?: string[] | undefined;
    stats?: {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    } | undefined;
    ir_version?: string | undefined;
    generated_at?: string | undefined;
}, {
    releases: {
        type: "release" | "tag";
        name: string;
        id?: number | undefined;
        repo_path?: string | undefined;
        repo_owner?: string | undefined;
        repo_name?: string | undefined;
        tag_name?: string | undefined;
        body?: string | undefined;
        published_at?: string | undefined;
        created_at?: string | undefined;
        draft?: boolean | undefined;
        prerelease?: boolean | undefined;
        html_url?: string | undefined;
        author_login?: string | undefined;
        categories?: string[] | undefined;
        repoPath?: string | undefined;
        repoOwner?: string | undefined;
        repoName?: string | undefined;
        tagName?: string | undefined;
        publishedAt?: string | undefined;
        createdAt?: string | undefined;
        urls?: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads?: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author?: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        previousVersion?: string | undefined;
        previous_version?: string | undefined;
    }[];
    specVersion?: string | undefined;
    generatedAt?: string | undefined;
    sources?: string[] | undefined;
    stats?: {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    } | undefined;
    ir_version?: string | undefined;
    generated_at?: string | undefined;
}>, {
    specVersion: string;
    generatedAt: string;
    sources: string[] | undefined;
    releases: {
        id: number | undefined;
        repoPath: string;
        repoOwner: string;
        repoName: string;
        type: "release" | "tag";
        tagName: string;
        name: string;
        body: string | undefined;
        publishedAt: string | undefined;
        createdAt: string | undefined;
        draft: boolean | undefined;
        prerelease: boolean | undefined;
        urls: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        categories: string[] | undefined;
        previousVersion: string | undefined;
    }[];
    stats: {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    } | undefined;
}, {
    releases: {
        type: "release" | "tag";
        name: string;
        id?: number | undefined;
        repo_path?: string | undefined;
        repo_owner?: string | undefined;
        repo_name?: string | undefined;
        tag_name?: string | undefined;
        body?: string | undefined;
        published_at?: string | undefined;
        created_at?: string | undefined;
        draft?: boolean | undefined;
        prerelease?: boolean | undefined;
        html_url?: string | undefined;
        author_login?: string | undefined;
        categories?: string[] | undefined;
        repoPath?: string | undefined;
        repoOwner?: string | undefined;
        repoName?: string | undefined;
        tagName?: string | undefined;
        publishedAt?: string | undefined;
        createdAt?: string | undefined;
        urls?: {
            githubRelease?: string | undefined;
            releaseNotes?: string | undefined;
            changelog?: string | undefined;
            changelogJson?: string | undefined;
            diff?: string | undefined;
            documentation?: string | undefined;
            migrationGuide?: string | undefined;
            tarball?: string | undefined;
            zipball?: string | undefined;
        } | undefined;
        downloads?: {
            name: string;
            url: string;
            type?: "binary" | "source" | "package" | "other" | undefined;
            platform?: string | undefined;
            size?: number | undefined;
            checksum?: string | undefined;
        }[] | undefined;
        author?: {
            login: string;
            avatarUrl?: string | undefined;
            profileUrl?: string | undefined;
        } | undefined;
        previousVersion?: string | undefined;
        previous_version?: string | undefined;
    }[];
    specVersion?: string | undefined;
    generatedAt?: string | undefined;
    sources?: string[] | undefined;
    stats?: {
        totalReleases: number;
        totalRepos: number;
        releasesByMonth?: Record<string, number> | undefined;
        releasesByRepo?: Record<string, number> | undefined;
    } | undefined;
    ir_version?: string | undefined;
    generated_at?: string | undefined;
}>;
/**
 * Parse and validate a ReleaseLog JSON object
 * Supports both camelCase (spec) and snake_case (legacy) formats
 */
export declare function parseReleaseLog(data: unknown): ReleaseLog;
/**
 * Safely parse a ReleaseLog, returning a result object
 */
export declare function safeParseReleaseLog(data: unknown): z.SafeParseReturnType<unknown, ReleaseLog>;
//# sourceMappingURL=index.d.ts.map