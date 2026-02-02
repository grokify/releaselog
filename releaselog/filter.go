package releaselog

import (
	"slices"
	"time"
)

// Filter defines criteria for filtering releases.
type Filter struct {
	// Date range
	Since *time.Time `json:"since,omitempty"`
	Until *time.Time `json:"until,omitempty"`

	// Project filtering
	RepoPath  string   `json:"repo_path,omitempty"`  // Single repo
	RepoPaths []string `json:"repo_paths,omitempty"` // Multiple repos
	Owner     string   `json:"owner,omitempty"`      // Filter by owner

	// Type filtering
	Type ReleaseType `json:"type,omitempty"` // "release" or "tag"

	// Category filtering
	Categories []string `json:"categories,omitempty"` // Any of these categories

	// Exclusions
	ExcludePrereleases bool `json:"exclude_prereleases,omitempty"`
	ExcludeDrafts      bool `json:"exclude_drafts,omitempty"`
}

// Apply filters the release log and returns matching releases.
func (f *Filter) Apply(rl *ReleaseLog) []Release {
	if rl == nil {
		return nil
	}
	var result []Release
	for _, r := range rl.Releases {
		if f.Matches(&r) {
			result = append(result, r)
		}
	}
	return result
}

// Matches returns true if the release matches the filter criteria.
func (f *Filter) Matches(r *Release) bool {
	// Date range checks
	if f.Since != nil && r.Date().Before(*f.Since) {
		return false
	}
	if f.Until != nil && r.Date().After(*f.Until) {
		return false
	}

	// Repo path checks
	if f.RepoPath != "" && r.RepoPath != f.RepoPath {
		return false
	}
	if len(f.RepoPaths) > 0 && !slices.Contains(f.RepoPaths, r.RepoPath) {
		return false
	}
	if f.Owner != "" && r.RepoOwner != f.Owner {
		return false
	}

	// Type check
	if f.Type != "" && r.Type != f.Type {
		return false
	}

	// Category check (any match)
	if len(f.Categories) > 0 && !hasAnyCategory(r.Categories, f.Categories) {
		return false
	}

	// Exclusions
	if f.ExcludePrereleases && r.Prerelease {
		return false
	}
	if f.ExcludeDrafts && r.Draft {
		return false
	}

	return true
}

// hasAnyCategory returns true if releaseCategories contains any of filterCategories.
func hasAnyCategory(releaseCategories, filterCategories []string) bool {
	for _, fc := range filterCategories {
		if slices.Contains(releaseCategories, fc) {
			return true
		}
	}
	return false
}
