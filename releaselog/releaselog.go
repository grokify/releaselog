package releaselog

import (
	"encoding/json"
	"os"
	"sort"
	"time"
)

// SpecVersion is the current version of the ReleaseLog specification.
const SpecVersion = "0.1.0"

// ReleaseLog is the root type for aggregated release data.
type ReleaseLog struct {
	// SpecVersion is the ReleaseLog specification version
	SpecVersion string `json:"specVersion"`

	// GeneratedAt is when this log was generated
	GeneratedAt time.Time `json:"generatedAt"`

	// Sources lists the GitHub sources that were fetched
	Sources []string `json:"sources,omitempty"`

	// Releases is the list of all releases, sorted by date descending
	Releases []Release `json:"releases"`

	// Stats provides summary statistics
	Stats *Stats `json:"stats,omitempty"`
}

// Stats provides summary statistics about the release log.
type Stats struct {
	TotalReleases   int            `json:"totalReleases"`
	TotalRepos      int            `json:"totalRepos"`
	ReleasesByMonth map[string]int `json:"releasesByMonth,omitempty"`
	ReleasesByRepo  map[string]int `json:"releasesByRepo,omitempty"`
}

// New creates a new ReleaseLog with the current spec version.
func New() *ReleaseLog {
	return &ReleaseLog{
		SpecVersion: SpecVersion,
		GeneratedAt: time.Now().UTC(),
		Releases:    []Release{},
	}
}

// LoadFile loads a ReleaseLog from a JSON file.
func LoadFile(path string) (*ReleaseLog, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return Parse(data)
}

// Parse parses a ReleaseLog from JSON bytes.
func Parse(data []byte) (*ReleaseLog, error) {
	var rl ReleaseLog
	if err := json.Unmarshal(data, &rl); err != nil {
		return nil, err
	}
	return &rl, nil
}

// JSON returns the release log as formatted JSON bytes.
func (rl *ReleaseLog) JSON() ([]byte, error) {
	return json.MarshalIndent(rl, "", "  ")
}

// WriteFile writes the release log to a JSON file.
func (rl *ReleaseLog) WriteFile(path string) error {
	data, err := rl.JSON()
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0600)
}

// AddRelease adds a release to the log.
func (rl *ReleaseLog) AddRelease(r Release) {
	rl.Releases = append(rl.Releases, r)
}

// AddReleases adds multiple releases to the log.
func (rl *ReleaseLog) AddReleases(releases []Release) {
	rl.Releases = append(rl.Releases, releases...)
}

// SortByDate sorts releases by date descending (newest first).
func (rl *ReleaseLog) SortByDate() {
	sort.Slice(rl.Releases, func(i, j int) bool {
		return rl.Releases[i].Date().After(rl.Releases[j].Date())
	})
}

// SortByRepo sorts releases by repo path, then by date descending.
func (rl *ReleaseLog) SortByRepo() {
	sort.Slice(rl.Releases, func(i, j int) bool {
		if rl.Releases[i].RepoPath != rl.Releases[j].RepoPath {
			return rl.Releases[i].RepoPath < rl.Releases[j].RepoPath
		}
		return rl.Releases[i].Date().After(rl.Releases[j].Date())
	})
}

// CalculateStats computes and sets the Stats field.
func (rl *ReleaseLog) CalculateStats() {
	stats := &Stats{
		TotalReleases:   len(rl.Releases),
		ReleasesByMonth: make(map[string]int),
		ReleasesByRepo:  make(map[string]int),
	}

	repos := make(map[string]bool)
	for _, r := range rl.Releases {
		// Count by month
		month := r.Date().Format("2006-01")
		stats.ReleasesByMonth[month]++

		// Count by repo
		stats.ReleasesByRepo[r.RepoPath]++
		repos[r.RepoPath] = true
	}

	stats.TotalRepos = len(repos)
	rl.Stats = stats
}

// Repos returns a list of unique repository paths.
func (rl *ReleaseLog) Repos() []string {
	repos := make(map[string]bool)
	for _, r := range rl.Releases {
		repos[r.RepoPath] = true
	}

	result := make([]string, 0, len(repos))
	for repo := range repos {
		result = append(result, repo)
	}
	sort.Strings(result)
	return result
}

// Filter returns a new ReleaseLog with only releases matching the filter.
func (rl *ReleaseLog) Filter(f *Filter) *ReleaseLog {
	filtered := New()
	filtered.Sources = rl.Sources

	for _, r := range rl.Releases {
		if f.Matches(&r) {
			filtered.Releases = append(filtered.Releases, r)
		}
	}

	filtered.CalculateStats()
	return filtered
}
