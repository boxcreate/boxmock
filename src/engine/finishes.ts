import type { DeviceFinish, FinishColors } from '../types';

/**
 * High-precision, calibrated finishes reflecting actual Google Pixel and flagship anodized titanium/aluminum.
 * Calibrated with rich base hues so phone frames NEVER crush to pure black or wash out to pure chalky white.
 */
export const PIXEL_FINISHES: Record<Exclude<DeviceFinish, 'custom'>, FinishColors> = {
  obsidian: {
    name: 'obsidian',
    label: 'Obsidian',
    railCore: '#22252c', // Deep space graphite titanium (rich dark luster)
    frameInner: '#323742',
    frameHighlight: '#596070',
    frameOuter: '#191b20',
    frameShadow: '#101216',
    cornerGleam: 'rgba(215, 225, 245, 0.85)',
    rimHighlight: 'rgba(180, 195, 225, 0.45)',
    antennaBand: '#3b404d',
    punchHoleRing: '#1a1c22',
    punchHoleLens: '#07080b',
    cameraCoatingTint: 'rgba(50, 90, 170, 0.55)',
    swatch: '#22252c',
  },
  porcelain: {
    name: 'porcelain',
    label: 'Porcelain',
    railCore: '#dce0e8', // Pearlescent warm silver (silky metal, not blown-out white)
    frameInner: '#edf0f6',
    frameHighlight: '#ffffff',
    frameOuter: '#b8bdca',
    frameShadow: '#9aa0ad',
    cornerGleam: 'rgba(255, 255, 255, 0.95)',
    rimHighlight: 'rgba(255, 255, 255, 0.8)',
    antennaBand: '#b5bac4',
    punchHoleRing: '#2a2d34',
    punchHoleLens: '#080a0e',
    cameraCoatingTint: 'rgba(50, 110, 190, 0.5)',
    swatch: '#e6e8ee',
  },
  hazel: {
    name: 'hazel',
    label: 'Hazel',
    railCore: '#687563', // Signature warm olive sage green with metallic warmth
    frameInner: '#82907c',
    frameHighlight: '#b2c2ab',
    frameOuter: '#515c4d',
    frameShadow: '#3c4538',
    cornerGleam: 'rgba(240, 248, 230, 0.85)',
    rimHighlight: 'rgba(215, 230, 205, 0.55)',
    antennaBand: '#6e7a69',
    punchHoleRing: '#242922',
    punchHoleLens: '#080a08',
    cameraCoatingTint: 'rgba(50, 140, 100, 0.5)',
    swatch: '#687563',
  },
  rose_quartz: {
    name: 'rose_quartz',
    label: 'Rose Quartz',
    railCore: '#d49fa9', // Luxurious warm blush rose gold
    frameInner: '#e4b6bf',
    frameHighlight: '#fde3e8',
    frameOuter: '#b5818c',
    frameShadow: '#8e5d67',
    cornerGleam: 'rgba(255, 240, 244, 0.9)',
    rimHighlight: 'rgba(255, 215, 225, 0.6)',
    antennaBand: '#c08e98',
    punchHoleRing: '#2c2024',
    punchHoleLens: '#0c080a',
    cameraCoatingTint: 'rgba(150, 60, 130, 0.5)',
    swatch: '#d49fa9',
  },
  wintergreen: {
    name: 'wintergreen',
    label: 'Wintergreen',
    railCore: '#5aa38a', // Vibrant refreshing eucalyptus/mint green
    frameInner: '#75bfa6',
    frameHighlight: '#b3edd9',
    frameOuter: '#45856f',
    frameShadow: '#326352',
    cornerGleam: 'rgba(230, 255, 245, 0.85)',
    rimHighlight: 'rgba(195, 245, 225, 0.6)',
    antennaBand: '#609a84',
    punchHoleRing: '#1c2e26',
    punchHoleLens: '#060a08',
    cameraCoatingTint: 'rgba(40, 160, 120, 0.55)',
    swatch: '#5aa38a',
  },
  peony: {
    name: 'peony',
    label: 'Peony',
    railCore: '#e05c77', // Saturated coral poppy / flamingo sunset
    frameInner: '#ec7891',
    frameHighlight: '#ffb5c5',
    frameOuter: '#bb3f58',
    frameShadow: '#8a243a',
    cornerGleam: 'rgba(255, 235, 240, 0.9)',
    rimHighlight: 'rgba(255, 200, 215, 0.65)',
    antennaBand: '#c85068',
    punchHoleRing: '#33161d',
    punchHoleLens: '#0d0709',
    cameraCoatingTint: 'rgba(180, 50, 110, 0.55)',
    swatch: '#e05c77',
  },
  bay: {
    name: 'bay',
    label: 'Bay Blue',
    railCore: '#468ec9', // Electric arctic / sky blue
    frameInner: '#65a5db',
    frameHighlight: '#b5ddff',
    frameOuter: '#3571a3',
    frameShadow: '#225078',
    cornerGleam: 'rgba(230, 245, 255, 0.9)',
    rimHighlight: 'rgba(190, 225, 255, 0.6)',
    antennaBand: '#4e8dbf',
    punchHoleRing: '#182736',
    punchHoleLens: '#06090d',
    cameraCoatingTint: 'rgba(30, 120, 210, 0.55)',
    swatch: '#468ec9',
  },
  natural_titanium: {
    name: 'natural_titanium',
    label: 'Natural Titanium',
    railCore: '#8e897e', // Warm industrial satin titanium alloy
    frameInner: '#a9a499',
    frameHighlight: '#dcd8cc',
    frameOuter: '#716c61',
    frameShadow: '#524e45',
    cornerGleam: 'rgba(250, 248, 240, 0.85)',
    rimHighlight: 'rgba(235, 230, 220, 0.55)',
    antennaBand: '#8a857a',
    punchHoleRing: '#2b2926',
    punchHoleLens: '#0a0908',
    cameraCoatingTint: 'rgba(110, 110, 150, 0.5)',
    swatch: '#8e897e',
  },
  champagne_gold: {
    name: 'champagne_gold',
    label: 'Champagne Gold',
    railCore: '#c4a464', // Lustrous jewelry-grade warm gold
    frameInner: '#d9bd81',
    frameHighlight: '#fbe9be',
    frameOuter: '#9e8146',
    frameShadow: '#735b2a',
    cornerGleam: 'rgba(255, 250, 230, 0.95)',
    rimHighlight: 'rgba(255, 235, 190, 0.7)',
    antennaBand: '#b59757',
    punchHoleRing: '#332917',
    punchHoleLens: '#0d0b07',
    cameraCoatingTint: 'rgba(180, 140, 50, 0.55)',
    swatch: '#c4a464',
  },
};

/**
 * Parses hex color to RGB tuple.
 */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return [r, g, b];
}

/**
 * Adjusts color brightness and saturation mathematically.
 */
function adjustColor(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Dynamically synthesizes a complete, photorealistic FinishColors palette from any arbitrary hex color.
 */
export function generateCustomFinish(colorHex: string): FinishColors {
  const [r, g, b] = hexToRgb(colorHex);
  return {
    name: 'custom',
    label: 'Custom Color',
    railCore: colorHex,
    frameInner: adjustColor(colorHex, 20),
    frameHighlight: adjustColor(colorHex, 45),
    frameOuter: adjustColor(colorHex, -22),
    frameShadow: adjustColor(colorHex, -45),
    cornerGleam: `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, 0.9)`,
    rimHighlight: `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, 0.65)`,
    antennaBand: adjustColor(colorHex, -12),
    punchHoleRing: adjustColor(colorHex, -60),
    punchHoleLens: '#07080b',
    cameraCoatingTint: `rgba(${r}, ${g}, ${b}, 0.55)`,
    swatch: colorHex,
  };
}

/**
 * Retrieves the calibrated FinishColors palette for the specified finish,
 * dynamically generating custom palettes when 'custom' is selected.
 */
export function getFinishColors(finish: DeviceFinish, customColor?: string): FinishColors {
  if (finish === 'custom') {
    return generateCustomFinish(customColor || '#3b82f6');
  }
  return PIXEL_FINISHES[finish] || PIXEL_FINISHES.obsidian;
}
