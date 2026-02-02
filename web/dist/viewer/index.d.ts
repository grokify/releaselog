/**
 * ReleaseLog Viewer Entry Point
 *
 * This module exports the ReleaseLogViewer class for use as:
 * - ESM import: `import { ReleaseLogViewer } from '@grokify/releaselog/viewer'`
 * - IIFE/CDN: `new ReleaseLogViewer('#container', options)`
 *
 * @packageDocumentation
 */
import { ReleaseLogViewer } from './ReleaseLogViewer';
import type { ViewerOptions, ViewerState, NormalizedRelease, DayData, HeatmapState } from './types';
import { DEFAULT_HEATMAP_COLORS } from './types';
export { ReleaseLogViewer };
export type { ViewerOptions, ViewerState, NormalizedRelease, DayData, HeatmapState, };
export { DEFAULT_HEATMAP_COLORS };
export default ReleaseLogViewer;
//# sourceMappingURL=index.d.ts.map