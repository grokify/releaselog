package main

import (
	"fmt"
	"os"
	"time"

	"github.com/grokify/releaselog/output/json"
	"github.com/grokify/releaselog/output/markdown"
	"github.com/grokify/releaselog/output/xlsx"
	"github.com/grokify/releaselog/releaselog"
	"github.com/spf13/cobra"
)

var (
	genFormat     string
	genOutput     string
	genSince      string
	genUntil      string
	genRepo       string
	genOwner      string
	genType       string
	genCategories []string
	genByRepo     bool
)

var generateCmd = &cobra.Command{
	Use:   "generate <input.json>",
	Short: "Generate output from release log",
	Long: `Generate Markdown, XLSX, or filtered JSON from a release log.

The command reads a release log JSON file and outputs it in the specified format.
Filters can be applied to narrow down the releases.

Examples:
  # Generate Markdown
  releaselog generate releases.json --format md -o RELEASES.md

  # Generate Markdown grouped by repository
  releaselog generate releases.json --format md --by-repo -o RELEASES.md

  # Generate XLSX
  releaselog generate releases.json --format xlsx -o releases.xlsx

  # Generate filtered JSON for web
  releaselog generate releases.json --format json --since 2024-01-01 -o recent.json

  # Filter by project
  releaselog generate releases.json --format md --repo grokify/mogo -o mogo.md

  # Filter by owner
  releaselog generate releases.json --format md --owner grokify -o grokify.md

  # Filter by type
  releaselog generate releases.json --format md --type release -o releases-only.md`,
	Args: cobra.ExactArgs(1),
	RunE: runGenerate,
}

func init() {
	rootCmd.AddCommand(generateCmd)

	generateCmd.Flags().StringVar(&genFormat, "format", "md",
		"Output format: md, xlsx, json")
	generateCmd.Flags().StringVarP(&genOutput, "output", "o", "",
		"Output file (default: stdout for md/json)")
	generateCmd.Flags().StringVar(&genSince, "since", "",
		"Filter: only releases after this date (YYYY-MM-DD)")
	generateCmd.Flags().StringVar(&genUntil, "until", "",
		"Filter: only releases before this date (YYYY-MM-DD)")
	generateCmd.Flags().StringVar(&genRepo, "repo", "",
		"Filter: only this repo (owner/repo)")
	generateCmd.Flags().StringVar(&genOwner, "owner", "",
		"Filter: only repos from this owner")
	generateCmd.Flags().StringVar(&genType, "type", "",
		"Filter: release or tag")
	generateCmd.Flags().StringSliceVar(&genCategories, "category", nil,
		"Filter: releases with these categories")
	generateCmd.Flags().BoolVar(&genByRepo, "by-repo", false,
		"Group output by repository (Markdown only)")
}

func runGenerate(_ *cobra.Command, args []string) error {
	inputPath := args[0]

	// Load release log
	rl, err := releaselog.LoadFile(inputPath)
	if err != nil {
		return fmt.Errorf("load release log: %w", err)
	}

	// Build filter
	filter, err := buildFilter()
	if err != nil {
		return fmt.Errorf("build filter: %w", err)
	}

	// Generate output
	switch genFormat {
	case "md", "markdown":
		return generateMarkdown(rl, filter)
	case "xlsx", "excel":
		return generateXLSX(rl, filter)
	case "json":
		return generateJSON(rl, filter)
	default:
		return fmt.Errorf("unknown format: %s (use md, xlsx, or json)", genFormat)
	}
}

func buildFilter() (*releaselog.Filter, error) {
	filter := &releaselog.Filter{}
	hasFilter := false

	if genSince != "" {
		t, err := parseDate(genSince)
		if err != nil {
			return nil, fmt.Errorf("parse since: %w", err)
		}
		filter.Since = &t
		hasFilter = true
	}

	if genUntil != "" {
		t, err := parseDate(genUntil)
		if err != nil {
			return nil, fmt.Errorf("parse until: %w", err)
		}
		filter.Until = &t
		hasFilter = true
	}

	if genRepo != "" {
		filter.RepoPath = genRepo
		hasFilter = true
	}

	if genOwner != "" {
		filter.Owner = genOwner
		hasFilter = true
	}

	if genType != "" {
		filter.Type = releaselog.ReleaseType(genType)
		hasFilter = true
	}

	if len(genCategories) > 0 {
		filter.Categories = genCategories
		hasFilter = true
	}

	if !hasFilter {
		return nil, nil
	}

	return filter, nil
}

func generateMarkdown(rl *releaselog.ReleaseLog, filter *releaselog.Filter) error {
	gen, err := markdown.New()
	if err != nil {
		return fmt.Errorf("create markdown generator: %w", err)
	}

	// Determine output
	var out *os.File
	if genOutput == "" || genOutput == "-" {
		out = os.Stdout
	} else {
		f, err := os.Create(genOutput)
		if err != nil {
			return fmt.Errorf("create output file: %w", err)
		}
		defer func() { _ = f.Close() }()
		out = f
	}

	if genByRepo {
		if err := gen.GenerateByRepo(out, rl, filter); err != nil {
			return fmt.Errorf("generate markdown: %w", err)
		}
	} else {
		if err := gen.Generate(out, rl, filter); err != nil {
			return fmt.Errorf("generate markdown: %w", err)
		}
	}

	if genOutput != "" && genOutput != "-" {
		fmt.Fprintf(os.Stderr, "Wrote Markdown to %s\n", genOutput)
	}

	return nil
}

func generateXLSX(rl *releaselog.ReleaseLog, filter *releaselog.Filter) error {
	if genOutput == "" {
		return fmt.Errorf("XLSX format requires --output file")
	}

	gen := xlsx.New()
	if err := gen.Generate(genOutput, rl, filter); err != nil {
		return fmt.Errorf("generate xlsx: %w", err)
	}

	fmt.Fprintf(os.Stderr, "Wrote XLSX to %s\n", genOutput)
	return nil
}

func generateJSON(rl *releaselog.ReleaseLog, filter *releaselog.Filter) error {
	gen := json.New()

	if genOutput == "" || genOutput == "-" {
		return gen.Generate(os.Stdout, rl, filter)
	}

	if err := gen.GenerateFile(genOutput, rl, filter); err != nil {
		return fmt.Errorf("generate json: %w", err)
	}

	fmt.Fprintf(os.Stderr, "Wrote JSON to %s\n", genOutput)
	return nil
}

func parseDate(s string) (time.Time, error) {
	// Try RFC3339 first
	if t, err := time.Parse(time.RFC3339, s); err == nil {
		return t, nil
	}
	// Try YYYY-MM-DD
	return time.Parse("2006-01-02", s)
}
