// Package json generates filtered JSON output from release logs.
package json

import (
	"encoding/json"
	"io"
	"os"

	"github.com/grokify/releaselog/releaselog"
)

// Generator generates filtered JSON from a ReleaseLog.
type Generator struct{}

// New creates a new JSON generator.
func New() *Generator {
	return &Generator{}
}

// Generate writes the filtered release log as JSON.
func (g *Generator) Generate(w io.Writer, rl *releaselog.ReleaseLog, filter *releaselog.Filter) error {
	releases := rl.Releases
	if filter != nil {
		releases = filter.Apply(rl)
	}

	output := &releaselog.ReleaseLog{
		SpecVersion: rl.SpecVersion,
		GeneratedAt: rl.GeneratedAt,
		Sources:     rl.Sources,
		Releases:    releases,
	}
	output.CalculateStats()

	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	return enc.Encode(output)
}

// GenerateFile writes the filtered release log to a JSON file.
func (g *Generator) GenerateFile(path string, rl *releaselog.ReleaseLog, filter *releaselog.Filter) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer func() { _ = f.Close() }()

	return g.Generate(f, rl, filter)
}
