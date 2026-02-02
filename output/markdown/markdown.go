// Package markdown generates Markdown output from release logs.
package markdown

import (
	"embed"
	"io"
	"strings"
	"text/template"
	"time"

	"github.com/grokify/releaselog/releaselog"
)

//go:embed templates/*.tmpl
var templates embed.FS

// Generator generates Markdown from a ReleaseLog.
type Generator struct {
	tmpl *template.Template
}

// New creates a new Markdown generator.
func New() (*Generator, error) {
	funcMap := template.FuncMap{
		"formatDate":  formatDate,
		"truncate":    truncate,
		"escapeTitle": escapeTitle,
		"join":        strings.Join,
	}

	tmpl, err := template.New("").Funcs(funcMap).ParseFS(templates, "templates/*.tmpl")
	if err != nil {
		return nil, err
	}
	return &Generator{tmpl: tmpl}, nil
}

// Generate writes the release log as Markdown.
func (g *Generator) Generate(w io.Writer, rl *releaselog.ReleaseLog, filter *releaselog.Filter) error {
	releases := rl.Releases
	if filter != nil {
		releases = filter.Apply(rl)
	}

	data := struct {
		Log      *releaselog.ReleaseLog
		Releases []releaselog.Release
	}{
		Log:      rl,
		Releases: releases,
	}

	return g.tmpl.ExecuteTemplate(w, "changelog.md.tmpl", data)
}

// GenerateByRepo writes the release log grouped by repository.
func (g *Generator) GenerateByRepo(w io.Writer, rl *releaselog.ReleaseLog, filter *releaselog.Filter) error {
	releases := rl.Releases
	if filter != nil {
		releases = filter.Apply(rl)
	}

	// Group by repo
	byRepo := make(map[string][]releaselog.Release)
	for _, r := range releases {
		byRepo[r.RepoPath] = append(byRepo[r.RepoPath], r)
	}

	data := struct {
		Log      *releaselog.ReleaseLog
		ByRepo   map[string][]releaselog.Release
		Releases []releaselog.Release
	}{
		Log:      rl,
		ByRepo:   byRepo,
		Releases: releases,
	}

	return g.tmpl.ExecuteTemplate(w, "changelog_by_repo.md.tmpl", data)
}

// formatDate formats a time.Time as YYYY-MM-DD.
func formatDate(t *time.Time) string {
	if t == nil {
		return ""
	}
	return t.Format("2006-01-02")
}

// truncate truncates a string to max length, adding "..." if truncated.
func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max-3] + "..."
}

// escapeTitle escapes special Markdown characters in titles.
func escapeTitle(s string) string {
	// Replace common problematic characters
	s = strings.ReplaceAll(s, "|", "\\|")
	s = strings.ReplaceAll(s, "[", "\\[")
	s = strings.ReplaceAll(s, "]", "\\]")
	return s
}
