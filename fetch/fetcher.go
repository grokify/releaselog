// Package fetch provides GitHub release fetching functionality.
package fetch

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"sort"
	"time"

	"github.com/google/go-github/v82/github"
	"github.com/grokify/releaselog/releaselog"
	"golang.org/x/oauth2"
)

// Fetcher coordinates fetching releases from multiple GitHub sources.
type Fetcher struct {
	client *github.Client
	config *releaselog.Config
	logger *slog.Logger
}

// NewFetcher creates a new Fetcher with the given configuration.
// It uses the GITHUB_TOKEN environment variable for authentication.
func NewFetcher(config *releaselog.Config) *Fetcher {
	return NewFetcherWithClient(config, newGitHubClient())
}

// NewFetcherWithClient creates a new Fetcher with a custom GitHub client.
func NewFetcherWithClient(config *releaselog.Config, client *github.Client) *Fetcher {
	return &Fetcher{
		client: client,
		config: config,
		logger: slog.Default(),
	}
}

// SetLogger sets the logger for the fetcher.
func (f *Fetcher) SetLogger(logger *slog.Logger) {
	f.logger = logger
}

// newGitHubClient creates a GitHub client using GITHUB_TOKEN env var.
func newGitHubClient() *github.Client {
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		return github.NewClient(nil)
	}

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	tc := oauth2.NewClient(ctx, ts)
	return github.NewClient(tc)
}

// Fetch fetches all releases from configured sources.
func (f *Fetcher) Fetch(ctx context.Context) (*releaselog.ReleaseLog, error) {
	rl := releaselog.New()

	for _, source := range f.config.Sources {
		repos, err := f.discoverRepos(ctx, source)
		if err != nil {
			return nil, fmt.Errorf("discover repos for %s: %w", source.Name, err)
		}

		f.logger.Info("discovered repos", "source", source.Name, "count", len(repos))
		rl.Sources = append(rl.Sources, fmt.Sprintf("%s:%s", source.Type, source.Name))

		for _, repo := range repos {
			releases, err := f.fetchRepo(ctx, repo)
			if err != nil {
				f.logger.Warn("failed to fetch repo", "repo", repo, "error", err)
				continue
			}
			f.logger.Debug("fetched releases", "repo", repo, "count", len(releases))
			rl.AddReleases(releases)
		}
	}

	rl.SortByDate()
	rl.CalculateStats()

	return rl, nil
}

// discoverRepos discovers repositories based on source configuration.
func (f *Fetcher) discoverRepos(ctx context.Context, source releaselog.Source) ([]string, error) {
	switch source.Type {
	case releaselog.SourceTypeOrg:
		return f.listOrgRepos(ctx, source)
	case releaselog.SourceTypeUser:
		return f.listUserRepos(ctx, source)
	case releaselog.SourceTypeRepos:
		return source.Repos, nil
	default:
		return nil, fmt.Errorf("unknown source type: %s", source.Type)
	}
}

// fetchRepo fetches releases and/or tags from a single repository.
func (f *Fetcher) fetchRepo(ctx context.Context, repoPath string) ([]releaselog.Release, error) {
	owner, repo, err := parseRepoPath(repoPath)
	if err != nil {
		return nil, err
	}

	var releases []releaselog.Release

	// Fetch GitHub Releases
	if f.config.FetchType == "" || f.config.FetchType == releaselog.FetchTypeReleases || f.config.FetchType == releaselog.FetchTypeBoth {
		rels, err := f.fetchReleases(ctx, owner, repo, repoPath)
		if err != nil {
			return nil, fmt.Errorf("fetch releases: %w", err)
		}
		releases = append(releases, rels...)
	}

	// Fetch Git Tags
	if f.config.FetchType == releaselog.FetchTypeTags || f.config.FetchType == releaselog.FetchTypeBoth {
		tags, err := f.fetchTags(ctx, owner, repo, repoPath)
		if err != nil {
			return nil, fmt.Errorf("fetch tags: %w", err)
		}
		releases = append(releases, tags...)
	}

	// Apply since filter
	if f.config.Since != "" {
		sinceTime, err := parseSince(f.config.Since)
		if err != nil {
			return nil, fmt.Errorf("parse since: %w", err)
		}
		filtered := make([]releaselog.Release, 0, len(releases))
		for _, r := range releases {
			if !r.Date().Before(sinceTime) {
				filtered = append(filtered, r)
			}
		}
		releases = filtered
	}

	// Filter out prereleases if not included
	if !f.config.IncludePrereleases {
		filtered := make([]releaselog.Release, 0, len(releases))
		for _, r := range releases {
			if !r.Prerelease {
				filtered = append(filtered, r)
			}
		}
		releases = filtered
	}

	// Filter out drafts if not included
	if !f.config.IncludeDrafts {
		filtered := make([]releaselog.Release, 0, len(releases))
		for _, r := range releases {
			if !r.Draft {
				filtered = append(filtered, r)
			}
		}
		releases = filtered
	}

	return releases, nil
}

// fetchReleases fetches GitHub Releases from a repository.
func (f *Fetcher) fetchReleases(ctx context.Context, owner, repo, repoPath string) ([]releaselog.Release, error) {
	var allReleases []releaselog.Release

	opts := &github.ListOptions{PerPage: 100}
	for {
		ghReleases, resp, err := f.client.Repositories.ListReleases(ctx, owner, repo, opts)
		if err != nil {
			return nil, err
		}

		for _, ghR := range ghReleases {
			r := convertGitHubRelease(ghR, repoPath)
			allReleases = append(allReleases, r)
		}

		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	return allReleases, nil
}

// fetchTags fetches Git Tags from a repository.
func (f *Fetcher) fetchTags(ctx context.Context, owner, repo, repoPath string) ([]releaselog.Release, error) {
	var allReleases []releaselog.Release

	opts := &github.ListOptions{PerPage: 100}
	for {
		tags, resp, err := f.client.Repositories.ListTags(ctx, owner, repo, opts)
		if err != nil {
			return nil, err
		}

		for _, tag := range tags {
			r := convertGitHubTag(tag, repoPath)
			allReleases = append(allReleases, r)
		}

		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	return allReleases, nil
}

// convertGitHubRelease converts a GitHub Release to our Release type.
func convertGitHubRelease(ghR *github.RepositoryRelease, repoPath string) releaselog.Release {
	r := releaselog.Release{
		ID:         ghR.GetID(),
		Type:       releaselog.ReleaseTypeRelease,
		TagName:    ghR.GetTagName(),
		Name:       ghR.GetName(),
		Body:       ghR.GetBody(),
		Draft:      ghR.GetDraft(),
		Prerelease: ghR.GetPrerelease(),
		URLs: &releaselog.ReleaseURLs{
			GitHubRelease: ghR.GetHTMLURL(),
			Tarball:       ghR.GetTarballURL(),
			Zipball:       ghR.GetZipballURL(),
		},
	}
	r.SetRepoPath(repoPath)

	if ghR.PublishedAt != nil {
		t := ghR.PublishedAt.Time
		r.PublishedAt = &t
	}
	if ghR.CreatedAt != nil {
		t := ghR.CreatedAt.Time
		r.CreatedAt = &t
	}

	if ghR.Author != nil {
		r.Author = &releaselog.Author{
			Login:      ghR.Author.GetLogin(),
			AvatarURL:  ghR.Author.GetAvatarURL(),
			ProfileURL: ghR.Author.GetHTMLURL(),
		}
	}

	// Convert assets to downloads
	for _, asset := range ghR.Assets {
		r.Downloads = append(r.Downloads, releaselog.Download{
			Name:     asset.GetName(),
			URL:      asset.GetBrowserDownloadURL(),
			Type:     "binary",
			Size:     int64(asset.GetSize()),
			Checksum: "", // Not available from GitHub API
		})
	}

	return r
}

// convertGitHubTag converts a GitHub Tag to our Release type.
func convertGitHubTag(tag *github.RepositoryTag, repoPath string) releaselog.Release {
	r := releaselog.Release{
		Type:    releaselog.ReleaseTypeTag,
		TagName: tag.GetName(),
		Name:    tag.GetName(),
		URLs: &releaselog.ReleaseURLs{
			Tarball: tag.GetTarballURL(),
			Zipball: tag.GetZipballURL(),
		},
	}
	r.SetRepoPath(repoPath)

	if tag.Commit != nil {
		r.URLs.GitHubRelease = tag.Commit.GetURL()
	}

	return r
}

// listOrgRepos lists repositories for an organization.
func (f *Fetcher) listOrgRepos(ctx context.Context, source releaselog.Source) ([]string, error) {
	var repos []string

	opts := &github.RepositoryListByOrgOptions{
		Type:        getVisibilityType(source.Visibility),
		ListOptions: github.ListOptions{PerPage: 100},
	}

	for {
		ghRepos, resp, err := f.client.Repositories.ListByOrg(ctx, source.Name, opts)
		if err != nil {
			return nil, err
		}

		for _, ghRepo := range ghRepos {
			if !f.isExcluded(ghRepo.GetName(), source.Exclude) {
				repos = append(repos, ghRepo.GetFullName())
			}
		}

		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	sort.Strings(repos)
	return repos, nil
}

// listUserRepos lists repositories for a user.
func (f *Fetcher) listUserRepos(ctx context.Context, source releaselog.Source) ([]string, error) {
	var repos []string

	opts := &github.RepositoryListByUserOptions{
		Type:        getVisibilityType(source.Visibility),
		ListOptions: github.ListOptions{PerPage: 100},
	}

	for {
		ghRepos, resp, err := f.client.Repositories.ListByUser(ctx, source.Name, opts)
		if err != nil {
			return nil, err
		}

		for _, ghRepo := range ghRepos {
			if !f.isExcluded(ghRepo.GetName(), source.Exclude) {
				repos = append(repos, ghRepo.GetFullName())
			}
		}

		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	sort.Strings(repos)
	return repos, nil
}

// isExcluded checks if a repo name matches any exclude pattern.
func (f *Fetcher) isExcluded(name string, patterns []string) bool {
	for _, pattern := range patterns {
		if matched, _ := matchPattern(pattern, name); matched {
			return true
		}
	}
	return false
}

// getVisibilityType converts our visibility type to GitHub's.
func getVisibilityType(v releaselog.VisibilityType) string {
	switch v {
	case releaselog.VisibilityPublic:
		return "public"
	case releaselog.VisibilityPrivate:
		return "private"
	case releaselog.VisibilityAll:
		return "all"
	default:
		return "public"
	}
}

// parseSince parses a since string (RFC3339 or YYYY-MM-DD) to time.Time.
func parseSince(s string) (time.Time, error) {
	// Try RFC3339 first
	if t, err := time.Parse(time.RFC3339, s); err == nil {
		return t, nil
	}
	// Try YYYY-MM-DD
	return time.Parse("2006-01-02", s)
}
