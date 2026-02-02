package releaselog

import "errors"

// Configuration errors.
var (
	ErrNoSources          = errors.New("no sources configured")
	ErrSourceMissingName  = errors.New("source missing name")
	ErrSourceMissingRepos = errors.New("source type 'repos' requires repos list")
	ErrSourceInvalidType  = errors.New("invalid source type")
)
