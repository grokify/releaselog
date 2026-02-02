# TypeScript & Zod

ReleaseLog provides full TypeScript support with Zod schemas for runtime validation.

## Installation

```bash
npm install @grokify/releaselog zod
```

## Type Imports

```typescript
import type {
  Release,
  ReleaseLogData,
  FilterConfig,
  SortConfig,
  ColumnDefinition,
  ReleaseLogOptions,
} from '@grokify/releaselog';
```

## Zod Schemas

### Import Schemas

```typescript
import {
  ReleaseSchema,
  ReleaseLogSchema,
  ReleaseLogLegacySchema,
  parseReleaseLog,
  safeParseReleaseLog,
} from '@grokify/releaselog';
```

### Available Schemas

- `AuthorSchema` - Author information
- `DownloadSchema` - Downloadable asset
- `ReleaseURLsSchema` - Related URLs
- `ReleaseTypeSchema` - 'release' | 'tag'
- `ReleaseSchema` - Single release (camelCase)
- `StatsSchema` - Statistics
- `ReleaseLogSchema` - Root object (camelCase)
- `ReleaseLegacySchema` - Release with snake_case support
- `ReleaseLogLegacySchema` - Root with snake_case support

### Validation

```typescript
import { parseReleaseLog, safeParseReleaseLog } from '@grokify/releaselog';

// Throws on invalid data
try {
  const data = parseReleaseLog(jsonResponse);
  console.log(data.releases.length);
} catch (error) {
  console.error('Invalid data:', error);
}

// Safe parse (doesn't throw)
const result = safeParseReleaseLog(jsonResponse);
if (result.success) {
  const data = result.data;
  // data is fully typed
} else {
  console.error('Validation errors:', result.error.errors);
}
```

### Legacy Data Support

The legacy schema automatically transforms snake_case to camelCase:

```typescript
import { ReleaseLogLegacySchema } from '@grokify/releaselog';

const legacyData = {
  ir_version: 'v1.0',
  generated_at: '2025-01-15T10:00:00Z',
  releases: [{
    repo_path: 'org/repo',
    tag_name: 'v1.0.0',
    // ...
  }]
};

const result = ReleaseLogLegacySchema.parse(legacyData);
// result.specVersion === 'v1.0'
// result.generatedAt === '2025-01-15T10:00:00Z'
// result.releases[0].repoPath === 'org/repo'
// result.releases[0].tagName === 'v1.0.0'
```

## Type-Safe Usage

### ReleaseLog Class

```typescript
import { ReleaseLog, ReleaseLogOptions, ReleaseLogData } from '@grokify/releaselog';

const options: ReleaseLogOptions = {
  ajaxURL: '/api/releases.json',
  pagination: { enabled: true, size: 25 },
  events: {
    dataLoaded: (data: ReleaseLogData) => {
      console.log(`Loaded ${data.releases.length} releases`);
    }
  }
};

const table = new ReleaseLog('#releases', options);
```

### Column Definitions

```typescript
import { ColumnDefinition, Release } from '@grokify/releaselog';

const columns: ColumnDefinition[] = [
  {
    field: 'published_at',
    title: 'Date',
    sortable: true,
    formatter: 'date'
  },
  {
    field: 'repo_path',
    title: 'Repository',
    formatter: (value: string, release: Release) => {
      return `<a href="https://github.com/${value}">${value}</a>`;
    }
  }
];
```

### Filter Configuration

```typescript
import { FilterConfig } from '@grokify/releaselog';

const filter: FilterConfig = {
  since: new Date('2025-01-01'),
  repos: ['org/repo1', 'org/repo2'],
  type: 'release',
  excludePrereleases: true
};

table.setFilter(filter);
```

## Utility Functions

```typescript
import {
  filterReleases,
  sortReleases,
  aggregateReleasesByDate,
  type FilterOptions,
  type SortOptions,
  type Release,
} from '@grokify/releaselog';

// Filter releases
const filtered = filterReleases(releases, {
  searchQuery: 'v1.0',
  repoFilter: new Set(['org/repo']),
  typeFilter: 'release'
} as FilterOptions);

// Sort releases
const sorted = sortReleases(filtered, {
  field: 'publishedAt',
  direction: 'desc'
} as SortOptions);

// Aggregate by date
const counts: Record<string, number> = aggregateReleasesByDate(releases);
```

## Schema vs Legacy Types

ReleaseLog exports two sets of types:

### Schema Types (camelCase)

Used internally by Zod schemas:

```typescript
import type { SchemaRelease, SchemaReleaseLog } from '@grokify/releaselog';

// SchemaRelease uses camelCase: repoPath, tagName, publishedAt
```

### Legacy Types (snake_case)

Used by the ReleaseLog class for backward compatibility:

```typescript
import type { Release, ReleaseLogData } from '@grokify/releaselog';

// Release uses snake_case: repo_path, tag_name, published_at
```

The `setData()` method automatically handles conversion between formats.
