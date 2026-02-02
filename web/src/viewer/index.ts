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
import type {
  ViewerOptions,
  ViewerState,
  NormalizedRelease,
  DayData,
  HeatmapState,
} from './types';
import { DEFAULT_HEATMAP_COLORS } from './types';

// Export the main class
export { ReleaseLogViewer };

// Export types
export type {
  ViewerOptions,
  ViewerState,
  NormalizedRelease,
  DayData,
  HeatmapState,
};

// Export constants
export { DEFAULT_HEATMAP_COLORS };

// Default export for convenience
export default ReleaseLogViewer;
