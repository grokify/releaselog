# Installation

ReleaseLog can be installed via npm or included directly from a CDN.

## npm Installation

```bash
npm install @grokify/releaselog
```

### Package Exports

The package provides multiple entry points:

```javascript
// Main entry - includes all utilities
import { ReleaseLog, parseReleaseLog, filterReleases } from '@grokify/releaselog';

// Zod schemas only
import { ReleaseSchema, ReleaseLogSchema } from '@grokify/releaselog/schemas';

// CSS (import in your bundler)
import '@grokify/releaselog/css';
```

## CDN Installation

Include directly in your HTML:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/@grokify/releaselog/dist/releaselog.css">

<!-- JavaScript (UMD) -->
<script src="https://unpkg.com/@grokify/releaselog/dist/releaselog.umd.js"></script>
```

Or use ESM modules:

```html
<script type="module">
  import { ReleaseLog, parseReleaseLog } from 'https://unpkg.com/@grokify/releaselog/dist/releaselog.esm.js';
</script>
```

## Standalone HTML Viewer

For a complete standalone viewer, download or copy:

- `standalone.html` - The viewer page
- `releaselog.css` - Styles
- `releaselog.umd.js` - JavaScript library

Then open `standalone.html` in a browser and load your JSON file.

## Optional: Heatmap Support

For the heatmap visualization feature, also include cal-heatmap:

```html
<!-- Cal-heatmap CSS -->
<link rel="stylesheet" href="https://unpkg.com/cal-heatmap/dist/cal-heatmap.css">

<!-- Cal-heatmap JS -->
<script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>
<script src="https://unpkg.com/cal-heatmap/dist/plugins/Tooltip.min.js"></script>
```

## Requirements

- **Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Node.js**: 18+ (for npm package)
- **No dependencies** for the standalone viewer (cal-heatmap is optional)

## Verify Installation

### npm

```javascript
import { ReleaseLog, parseReleaseLog } from '@grokify/releaselog';

const data = { releases: [], specVersion: '0.1.0', generatedAt: new Date().toISOString() };
const parsed = parseReleaseLog(data);
console.log('ReleaseLog installed successfully');
```

### CDN

```html
<script>
  if (typeof ReleaseLog !== 'undefined') {
    console.log('ReleaseLog loaded');
  }
</script>
```

## Next Steps

- [Quick Start](quick-start.md) - Create your first release viewer
- [JSON Format](../guide/json-format.md) - Understand the data format
