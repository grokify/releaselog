# JavaScript Library

ReleaseLog provides a flexible JavaScript API for embedding release viewers in any website.

## Installation

```bash
npm install @grokify/releaselog
```

Or via CDN:

```html
<script src="https://unpkg.com/@grokify/releaselog/dist/releaselog.umd.js"></script>
```

## Basic Usage

```javascript
import { ReleaseLog } from '@grokify/releaselog';

const table = new ReleaseLog('#releases', {
  ajaxURL: '/api/releases.json',
  pagination: { enabled: true, size: 25 }
});
```

## Constructor

```javascript
new ReleaseLog(selector, options)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `selector` | `string \| HTMLElement` | CSS selector or DOM element |
| `options` | `ReleaseLogOptions` | Configuration options |

## Options

### Data Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` | `ReleaseLogData` | - | Inline data object |
| `ajaxURL` | `string` | - | URL to fetch JSON from |
| `ajaxConfig` | `RequestInit` | `{}` | Fetch options |

### Layout Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `layout` | `string` | 'fitColumns' | Layout mode |
| `responsiveLayout` | `boolean` | true | Responsive behavior |
| `minHeight` | `string` | - | Minimum height |
| `maxHeight` | `string` | - | Maximum height |
| `placeholder` | `string` | 'No releases found' | Empty state text |

### Column Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `columns` | `ColumnDefinition[]` | DEFAULT_COLUMNS | Column definitions |
| `autoColumns` | `boolean` | false | Auto-generate columns |

### Sorting & Filtering

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialSort` | `SortConfig[]` | `[]` | Initial sort |
| `headerSort` | `boolean` | true | Enable header sorting |
| `initialFilter` | `FilterConfig` | `{}` | Initial filter |
| `showFilters` | `boolean` | true | Show filter controls |
| `filterPosition` | `'top' \| 'bottom'` | 'top' | Filter position |

### Pagination

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pagination` | `boolean \| PaginationConfig` | false | Pagination settings |

```javascript
pagination: {
  enabled: true,
  size: 25,
  sizeSelector: [10, 25, 50, 100],
  buttonCount: 5
}
```

### Display Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showStats` | `boolean` | true | Show statistics |
| `showHeader` | `boolean` | true | Show table header |
| `rowHeight` | `string` | - | Row height |
| `alternateRowColors` | `boolean` | true | Zebra striping |
| `theme` | `string` | 'default' | Theme name |

## Methods

### Data Methods

```javascript
// Load data from URL
await table.loadData('https://example.com/releases.json');

// Set data directly
table.setData(releaseLogData);

// Get current data
const data = table.getData();

// Get filtered data
const filtered = table.getFilteredData();
```

### Filter Methods

```javascript
// Set filter
table.setFilter({ search: 'v1.0', type: 'release' });

// Add filter
table.addFilter('repo', 'org/repo');

// Clear filters
table.clearFilter();
```

### Sort Methods

```javascript
// Set sort
table.setSort('published_at', 'desc');
```

### Pagination Methods

```javascript
// Set page
table.setPage(2);

// Get current page
const page = table.getPage();

// Set page size
table.setPageSize(50);
```

### Heatmap Methods

```javascript
// Create heatmap
table.createHeatmap('#heatmap', { colorScheme: 'green' });

// Create navigable heatmap
table.createNavigableHeatmap('#heatmap', { range: 12 });
```

### Other Methods

```javascript
// Redraw table
table.redraw();

// Destroy table
table.destroy();
```

## Events

```javascript
const table = new ReleaseLog('#releases', {
  events: {
    dataLoaded: (data) => { /* data loaded */ },
    dataLoadError: (error) => { /* load failed */ },
    releaseClick: (event, release) => { /* row clicked */ },
    releaseDblClick: (event, release) => { /* row double-clicked */ },
    filterChange: (filters) => { /* filters changed */ },
    sortChange: (sort) => { /* sort changed */ },
    pageChange: (page, pageSize) => { /* page changed */ },
    tableBuilt: () => { /* table rendered */ }
  }
});
```

## Column Definitions

```javascript
const columns = [
  {
    field: 'published_at',
    title: 'Date',
    width: '120px',
    sortable: true,
    formatter: 'date'
  },
  {
    field: 'repo_path',
    title: 'Repository',
    sortable: true,
    formatter: 'link',
    formatterParams: { urlPrefix: 'https://github.com/' }
  },
  {
    field: 'tag_name',
    title: 'Version',
    formatter: 'link',
    formatterParams: { urlField: 'html_url' }
  },
  {
    field: 'type',
    title: 'Type',
    formatter: 'badge'
  },
  {
    field: 'author_login',
    title: 'Author',
    formatter: 'avatar',
    visible: false
  }
];
```

### Built-in Formatters

- `date` - Format as localized date
- `link` - Render as hyperlink
- `badge` - Render as colored badge
- `avatar` - Render with avatar image
- `markdown` - Basic markdown rendering

### Custom Formatter

```javascript
{
  field: 'custom',
  title: 'Custom',
  formatter: (value, release, element) => {
    return `<span class="custom">${value}</span>`;
  }
}
```
