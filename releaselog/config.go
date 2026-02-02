package releaselog

import (
	"os"

	"gopkg.in/yaml.v3"
)

// FetchType controls what to fetch from GitHub.
type FetchType string

const (
	FetchTypeReleases FetchType = "releases"
	FetchTypeTags     FetchType = "tags"
	FetchTypeBoth     FetchType = "both"
)

// VisibilityType controls which repos to include.
type VisibilityType string

const (
	VisibilityAll     VisibilityType = "all"
	VisibilityPublic  VisibilityType = "public"
	VisibilityPrivate VisibilityType = "private"
)

// Config defines sources and settings for fetching releases.
type Config struct {
	// Sources defines GitHub organizations, users, and explicit repos
	Sources []Source `json:"sources" yaml:"sources"`

	// FetchType controls what to fetch: "releases", "tags", or "both"
	FetchType FetchType `json:"fetch_type,omitempty" yaml:"fetch_type,omitempty"`

	// IncludePrereleases includes pre-release versions
	IncludePrereleases bool `json:"include_prereleases,omitempty" yaml:"include_prereleases,omitempty"`

	// IncludeDrafts includes draft releases (requires auth)
	IncludeDrafts bool `json:"include_drafts,omitempty" yaml:"include_drafts,omitempty"`

	// Since only fetches releases after this date (RFC3339 or YYYY-MM-DD)
	Since string `json:"since,omitempty" yaml:"since,omitempty"`

	// OutputPath is the path for the generated JSON IR
	OutputPath string `json:"output_path,omitempty" yaml:"output_path,omitempty"`
}

// SourceType indicates the type of GitHub source.
type SourceType string

const (
	SourceTypeOrg   SourceType = "org"
	SourceTypeUser  SourceType = "user"
	SourceTypeRepos SourceType = "repos"
)

// Source defines a GitHub source (org, user, or explicit repos).
type Source struct {
	// Type: "org", "user", or "repos"
	Type SourceType `json:"type" yaml:"type"`

	// Name is the org or user name (for type "org" or "user")
	Name string `json:"name,omitempty" yaml:"name,omitempty"`

	// Repos is an explicit list of repos (for type "repos")
	// Format: "owner/repo"
	Repos []string `json:"repos,omitempty" yaml:"repos,omitempty"`

	// Visibility: "all", "public", or "private" (default: "public")
	Visibility VisibilityType `json:"visibility,omitempty" yaml:"visibility,omitempty"`

	// Exclude repos matching these patterns
	Exclude []string `json:"exclude,omitempty" yaml:"exclude,omitempty"`
}

// LoadConfigFile loads a Config from a YAML file.
func LoadConfigFile(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return ParseConfig(data)
}

// ParseConfig parses a Config from YAML bytes.
func ParseConfig(data []byte) (*Config, error) {
	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

// Validate validates the configuration.
func (c *Config) Validate() error {
	if len(c.Sources) == 0 {
		return ErrNoSources
	}
	for _, s := range c.Sources {
		if err := s.Validate(); err != nil {
			return err
		}
	}
	return nil
}

// Validate validates a source configuration.
func (s *Source) Validate() error {
	switch s.Type {
	case SourceTypeOrg, SourceTypeUser:
		if s.Name == "" {
			return ErrSourceMissingName
		}
	case SourceTypeRepos:
		if len(s.Repos) == 0 {
			return ErrSourceMissingRepos
		}
	default:
		return ErrSourceInvalidType
	}
	return nil
}
