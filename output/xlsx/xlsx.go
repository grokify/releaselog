// Package xlsx generates XLSX output from release logs.
package xlsx

import (
	"strings"

	"github.com/grokify/releaselog/releaselog"
	"github.com/xuri/excelize/v2"
)

// Generator generates XLSX from a ReleaseLog.
type Generator struct{}

// New creates a new XLSX generator.
func New() *Generator {
	return &Generator{}
}

// Generate writes the release log as XLSX.
func (g *Generator) Generate(path string, rl *releaselog.ReleaseLog, filter *releaselog.Filter) error {
	f := excelize.NewFile()
	defer func() { _ = f.Close() }()

	sheet := "Releases"
	index, err := f.NewSheet(sheet)
	if err != nil {
		return err
	}
	f.SetActiveSheet(index)

	// Delete default sheet (ignore error if sheet doesn't exist)
	_ = f.DeleteSheet("Sheet1")

	// Apply filter
	releases := rl.Releases
	if filter != nil {
		releases = filter.Apply(rl)
	}

	// Write headers
	headers := []string{
		"Date", "Repository", "Owner", "Repo Name", "Tag", "Name",
		"Type", "Prerelease", "Draft", "Author", "URL", "Categories",
	}
	if err := g.writeRow(f, sheet, 1, headers); err != nil {
		return err
	}

	// Style headers
	headerStyle, err := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#E0E0E0"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center"},
	})
	if err != nil {
		return err
	}

	endCol, _ := excelize.ColumnNumberToName(len(headers))
	if err := f.SetCellStyle(sheet, "A1", endCol+"1", headerStyle); err != nil {
		return err
	}

	// Write data rows
	for i, r := range releases {
		row := i + 2
		authorLogin := ""
		if r.Author != nil {
			authorLogin = r.Author.Login
		}
		htmlURL := ""
		if r.URLs != nil {
			htmlURL = r.URLs.GitHubRelease
		}
		data := []string{
			r.DateString(),
			r.RepoPath,
			r.RepoOwner,
			r.RepoName,
			r.TagName,
			r.Name,
			string(r.Type),
			boolToString(r.Prerelease),
			boolToString(r.Draft),
			authorLogin,
			htmlURL,
			strings.Join(r.Categories, ", "),
		}
		if err := g.writeRow(f, sheet, row, data); err != nil {
			return err
		}
	}

	// Auto-filter
	endRow := len(releases) + 1
	if endRow > 1 {
		filterRange := "A1:" + endCol + string(rune('0'+endRow%10))
		if endRow >= 10 {
			filterRange = "A1:" + endCol + intToStr(endRow)
		}
		_ = f.AutoFilter(sheet, filterRange, nil)
	}

	// Set column widths
	colWidths := map[string]float64{
		"A": 12, // Date
		"B": 30, // Repository
		"C": 15, // Owner
		"D": 20, // Repo Name
		"E": 15, // Tag
		"F": 40, // Name
		"G": 10, // Type
		"H": 10, // Prerelease
		"I": 8,  // Draft
		"J": 15, // Author
		"K": 50, // URL
		"L": 25, // Categories
	}
	for col, width := range colWidths {
		_ = f.SetColWidth(sheet, col, col, width)
	}

	// Add summary sheet
	if err := g.addSummarySheet(f, rl, releases); err != nil {
		return err
	}

	return f.SaveAs(path)
}

func (g *Generator) writeRow(f *excelize.File, sheet string, row int, data []string) error {
	for i, val := range data {
		col, _ := excelize.ColumnNumberToName(i + 1)
		cell := col + intToStr(row)
		if err := f.SetCellValue(sheet, cell, val); err != nil {
			return err
		}
	}
	return nil
}

func (g *Generator) addSummarySheet(f *excelize.File, rl *releaselog.ReleaseLog, releases []releaselog.Release) error {
	sheet := "Summary"
	_, err := f.NewSheet(sheet)
	if err != nil {
		return err
	}

	row := 1

	// Title
	_ = f.SetCellValue(sheet, "A"+intToStr(row), "Release Log Summary")
	row += 2

	// Generated at
	_ = f.SetCellValue(sheet, "A"+intToStr(row), "Generated:")
	_ = f.SetCellValue(sheet, "B"+intToStr(row), rl.GeneratedAt.Format("2006-01-02 15:04:05 UTC"))
	row++

	// Total releases
	_ = f.SetCellValue(sheet, "A"+intToStr(row), "Total Releases:")
	_ = f.SetCellValue(sheet, "B"+intToStr(row), len(releases))
	row++

	// Count by repo
	byRepo := make(map[string]int)
	for _, r := range releases {
		byRepo[r.RepoPath]++
	}
	_ = f.SetCellValue(sheet, "A"+intToStr(row), "Total Repositories:")
	_ = f.SetCellValue(sheet, "B"+intToStr(row), len(byRepo))
	row += 2

	// Releases by repo
	_ = f.SetCellValue(sheet, "A"+intToStr(row), "Releases by Repository")
	row++
	_ = f.SetCellValue(sheet, "A"+intToStr(row), "Repository")
	_ = f.SetCellValue(sheet, "B"+intToStr(row), "Count")
	row++

	for repo, count := range byRepo {
		_ = f.SetCellValue(sheet, "A"+intToStr(row), repo)
		_ = f.SetCellValue(sheet, "B"+intToStr(row), count)
		row++
	}

	// Set column widths
	_ = f.SetColWidth(sheet, "A", "A", 40)
	_ = f.SetColWidth(sheet, "B", "B", 15)

	return nil
}

func boolToString(b bool) string {
	if b {
		return "Yes"
	}
	return "No"
}

func intToStr(n int) string {
	if n == 0 {
		return "0"
	}
	s := ""
	for n > 0 {
		s = string(rune('0'+n%10)) + s
		n /= 10
	}
	return s
}
