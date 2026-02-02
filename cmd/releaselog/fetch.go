package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/grokify/releaselog/fetch"
	"github.com/grokify/releaselog/releaselog"
	"github.com/spf13/cobra"
)

var (
	fetchOrgs   []string
	fetchUsers  []string
	fetchRepos  []string
	fetchType   string
	fetchSince  string
	fetchOutput string
	fetchPublic bool
)

var fetchCmd = &cobra.Command{
	Use:   "fetch",
	Short: "Fetch releases from GitHub",
	Long: `Fetch releases and/or tags from configured GitHub sources.

The command reads sources from a config file or from command line flags.
Results are written to a JSON file (the Release Log IR format).

Examples:
  # Fetch from config file
  releaselog fetch -c config.yaml -o releases.json

  # Fetch from a single org
  releaselog fetch --org grokify -o releases.json

  # Fetch from multiple users
  releaselog fetch --user alice --user bob -o releases.json

  # Fetch only releases (not tags)
  releaselog fetch --org myorg --type releases -o releases.json

  # Fetch since a specific date
  releaselog fetch --org myorg --since 2024-01-01 -o releases.json

  # Fetch from explicit repos
  releaselog fetch --repo google/go-github --repo spf13/cobra -o releases.json`,
	RunE: runFetch,
}

func init() {
	rootCmd.AddCommand(fetchCmd)

	fetchCmd.Flags().StringSliceVar(&fetchOrgs, "org", nil, "GitHub organization(s) to fetch from")
	fetchCmd.Flags().StringSliceVar(&fetchUsers, "user", nil, "GitHub user(s) to fetch from")
	fetchCmd.Flags().StringSliceVar(&fetchRepos, "repo", nil, "Explicit repo(s) in owner/repo format")
	fetchCmd.Flags().StringVar(&fetchType, "type", "releases",
		"What to fetch: releases, tags, or both")
	fetchCmd.Flags().StringVar(&fetchSince, "since", "",
		"Only fetch releases after this date (YYYY-MM-DD)")
	fetchCmd.Flags().StringVarP(&fetchOutput, "output", "o", "releaselog.json",
		"Output JSON file")
	fetchCmd.Flags().BoolVar(&fetchPublic, "public", true,
		"Only fetch from public repositories")
}

func runFetch(_ *cobra.Command, _ []string) error {
	// Build config from flags or file
	cfg, err := buildConfig()
	if err != nil {
		return fmt.Errorf("build config: %w", err)
	}

	if err := cfg.Validate(); err != nil {
		return fmt.Errorf("invalid config: %w", err)
	}

	// Set up context with cancellation
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	// Create fetcher and fetch
	fetcher := fetch.NewFetcher(cfg)
	slog.Info("starting fetch", "sources", len(cfg.Sources))

	rl, err := fetcher.Fetch(ctx)
	if err != nil {
		return fmt.Errorf("fetch: %w", err)
	}

	slog.Info("fetch complete", "releases", len(rl.Releases), "repos", rl.Stats.TotalRepos)

	// Write output
	if err := rl.WriteFile(fetchOutput); err != nil {
		return fmt.Errorf("write output: %w", err)
	}

	fmt.Printf("Wrote %d releases to %s\n", len(rl.Releases), fetchOutput)
	return nil
}

func buildConfig() (*releaselog.Config, error) {
	// If config file is specified, load it
	if cfgFile != "" {
		return releaselog.LoadConfigFile(cfgFile)
	}

	// Otherwise, build from command line flags
	cfg := &releaselog.Config{
		FetchType: releaselog.FetchType(fetchType),
		Since:     fetchSince,
	}

	visibility := releaselog.VisibilityPublic
	if !fetchPublic {
		visibility = releaselog.VisibilityAll
	}

	// Add org sources
	for _, org := range fetchOrgs {
		cfg.Sources = append(cfg.Sources, releaselog.Source{
			Type:       releaselog.SourceTypeOrg,
			Name:       org,
			Visibility: visibility,
		})
	}

	// Add user sources
	for _, user := range fetchUsers {
		cfg.Sources = append(cfg.Sources, releaselog.Source{
			Type:       releaselog.SourceTypeUser,
			Name:       user,
			Visibility: visibility,
		})
	}

	// Add explicit repos
	if len(fetchRepos) > 0 {
		cfg.Sources = append(cfg.Sources, releaselog.Source{
			Type:  releaselog.SourceTypeRepos,
			Repos: fetchRepos,
		})
	}

	return cfg, nil
}
