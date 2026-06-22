/** @format */

import { createPresets } from './createPresets';
import { darkColors } from './palettes';

const defaultPresets = createPresets(darkColors);

/** Static dark-theme presets for modules that load before ThemeProvider (e.g. legacy SVG defaults). */
export const layoutPresets = defaultPresets.layoutPresets;
export const textPresets = defaultPresets.textPresets;
export const iconBoxPresets = defaultPresets.iconBoxPresets;
export const switchTrackColors = defaultPresets.switchTrackColors;

export { createPresets } from './createPresets';
