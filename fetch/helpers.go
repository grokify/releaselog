package fetch

import (
	"errors"
	"path/filepath"
	"strings"
)

// parseRepoPath parses an "owner/repo" string.
func parseRepoPath(path string) (owner, repo string, err error) {
	parts := strings.SplitN(path, "/", 2)
	if len(parts) != 2 {
		return "", "", errors.New("invalid repo path: expected owner/repo")
	}
	return parts[0], parts[1], nil
}

// matchPattern performs simple glob matching.
func matchPattern(pattern, name string) (bool, error) {
	return filepath.Match(pattern, name)
}
