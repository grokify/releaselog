// Package releaselog provides types for aggregated release log data.
// JSON field names use camelCase per the ReleaseLog Specification v0.1.0.
package releaselog

import (
	"slices"
	"strings"
	"time"
)

// ReleaseType indicates whether this is a GitHub Release or a Git Tag.
type ReleaseType string

const (
	ReleaseTypeRelease ReleaseType = "release"
	ReleaseTypeTag     ReleaseType = "tag"
)

// Release represents a single release or tag entry.
type Release struct {
	// Core identifiers
	ID        int64  `json:"id,omitempty"`
	RepoPath  string `json:"repoPath"`  // Format: "owner/repo"
	RepoOwner string `json:"repoOwner"` // Extracted owner
	RepoName  string `json:"repoName"`  // Extracted repo name

	// Release/tag info
	Type    ReleaseType `json:"type"`           // "release" or "tag"
	TagName string      `json:"tagName"`        // Git tag (e.g., "v1.2.3")
	Name    string      `json:"name"`           // Release name (may differ from tag)
	Body    string      `json:"body,omitempty"` // Release notes/description

	// Timestamps
	PublishedAt *time.Time `json:"publishedAt,omitempty"` // When published
	CreatedAt   *time.Time `json:"createdAt,omitempty"`   // When created

	// Release metadata (only for type="release")
	Draft      bool `json:"draft,omitempty"`
	Prerelease bool `json:"prerelease,omitempty"`

	// URLs (structured)
	URLs *ReleaseURLs `json:"urls,omitempty"`

	// Downloads (binaries, packages, containers)
	Downloads []Download `json:"downloads,omitempty"`

	// Author info (structured)
	Author *Author `json:"author,omitempty"`

	// User-defined categorization (for filtering UI)
	Categories []string `json:"categories,omitempty"` // e.g., ["breaking-change", "feature"]

	// Highlights - key features/changes (short list)
	Highlights []string `json:"highlights,omitempty"`

	// Breaking changes indicator
	BreakingChanges bool `json:"breakingChanges,omitempty"`

	// Previous version (for diff URL construction)
	PreviousVersion string `json:"previousVersion,omitempty"`
}

// ReleaseURLs contains all URLs related to a release.
type ReleaseURLs struct {
	GitHubRelease  string `json:"githubRelease,omitempty"`  // GitHub release page
	ReleaseNotes   string `json:"releaseNotes,omitempty"`   // Detailed release notes
	Changelog      string `json:"changelog,omitempty"`      // Link to CHANGELOG.md
	ChangelogJSON  string `json:"changelogJson,omitempty"`  // Link to CHANGELOG.json
	Diff           string `json:"diff,omitempty"`           // Git diff comparison URL
	Documentation  string `json:"documentation,omitempty"`  // Version-specific docs
	MigrationGuide string `json:"migrationGuide,omitempty"` // Upgrade instructions
	Tarball        string `json:"tarball,omitempty"`        // Source tarball URL
	Zipball        string `json:"zipball,omitempty"`        // Source zipball URL
}

// Download represents a downloadable artifact.
type Download struct {
	Name     string `json:"name"`               // Display name (e.g., "Linux (amd64)")
	URL      string `json:"url"`                // Download URL or install command
	Type     string `json:"type,omitempty"`     // "binary", "package", "container", "installer", "archive"
	Platform string `json:"platform,omitempty"` // e.g., "linux/amd64", "darwin/arm64"
	Size     int64  `json:"size,omitempty"`     // File size in bytes
	Checksum string `json:"checksum,omitempty"` // e.g., "sha256:abc123..."
}

// Author represents release author information.
type Author struct {
	Login      string `json:"login"`                // GitHub username
	AvatarURL  string `json:"avatarUrl,omitempty"`  // Avatar image URL
	ProfileURL string `json:"profileUrl,omitempty"` // GitHub profile URL
}

// Asset represents a GitHub release asset (binary, archive, etc.).
// Deprecated: Use Download instead for new code.
type Asset struct {
	ID            int64  `json:"id"`
	Name          string `json:"name"`
	Label         string `json:"label,omitempty"`
	ContentType   string `json:"contentType,omitempty"`
	Size          int64  `json:"size,omitempty"`
	DownloadCount int    `json:"downloadCount,omitempty"`
	DownloadURL   string `json:"downloadUrl,omitempty"`
}

// Date returns the best available date for sorting.
func (r *Release) Date() time.Time {
	if r.PublishedAt != nil {
		return *r.PublishedAt
	}
	if r.CreatedAt != nil {
		return *r.CreatedAt
	}
	return time.Time{}
}

// DateString returns the date in YYYY-MM-DD format.
func (r *Release) DateString() string {
	return r.Date().Format("2006-01-02")
}

// IsBreaking returns true if this release is marked as a breaking change.
func (r *Release) IsBreaking() bool {
	if r.BreakingChanges {
		return true
	}
	return slices.Contains(r.Categories, "breaking-change")
}

// SetRepoPath sets the repo path and extracts owner/name.
func (r *Release) SetRepoPath(path string) {
	r.RepoPath = path
	parts := strings.SplitN(path, "/", 2)
	if len(parts) == 2 {
		r.RepoOwner = parts[0]
		r.RepoName = parts[1]
	}
}

// GitHubReleaseURL returns the GitHub release page URL.
func (r *Release) GitHubReleaseURL() string {
	if r.URLs != nil && r.URLs.GitHubRelease != "" {
		return r.URLs.GitHubRelease
	}
	return ""
}

// SetGitHubReleaseURL sets the GitHub release page URL.
func (r *Release) SetGitHubReleaseURL(url string) {
	if r.URLs == nil {
		r.URLs = &ReleaseURLs{}
	}
	r.URLs.GitHubRelease = url
}

// DiffURL returns or constructs the diff URL.
func (r *Release) DiffURL() string {
	if r.URLs != nil && r.URLs.Diff != "" {
		return r.URLs.Diff
	}
	if r.PreviousVersion != "" && r.RepoPath != "" {
		return "https://github.com/" + r.RepoPath + "/compare/" + r.PreviousVersion + "..." + r.TagName
	}
	return ""
}
