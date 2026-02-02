package main

import (
	"log/slog"
	"os"

	"github.com/spf13/cobra"
)

var (
	cfgFile string
	verbose bool
)

var rootCmd = &cobra.Command{
	Use:   "releaselog",
	Short: "Aggregate and display releases across GitHub organizations",
	Long: `Releaselog fetches releases from GitHub organizations and users,
stores them in a JSON Intermediate Representation, and generates
outputs in Markdown, XLSX, or JSON formats for web consumption.

Examples:
  # Fetch releases from an organization
  releaselog fetch --org grokify -o releases.json

  # Fetch releases from a config file
  releaselog fetch -c config.yaml -o releases.json

  # Fetch releases from a specific user
  releaselog fetch --user johndoe -o releases.json

  # Fetch from explicit repos
  releaselog fetch --repo google/go-github --repo spf13/cobra -o releases.json`,
	PersistentPreRun: func(_ *cobra.Command, _ []string) {
		if verbose {
			slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
				Level: slog.LevelDebug,
			})))
		}
	},
}

func init() {
	rootCmd.PersistentFlags().StringVarP(&cfgFile, "config", "c", "",
		"config file (YAML)")
	rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false,
		"verbose output")
}
