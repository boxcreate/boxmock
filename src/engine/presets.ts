import type { CanvasPreset, DeviceAnchor } from '../types';

export interface CanvasPresetConfig {
  id: CanvasPreset;
  label: string;
  category: 'store' | 'social' | 'custom';
  width: number;
  height: number;
  description: string;
  defaultScale: number;
  defaultAnchor: DeviceAnchor;
  defaultOffsetX: number;
  defaultOffsetY: number;
  aspectRatioLabel: string;
}

export const CANVAS_PRESETS: Record<CanvasPreset, CanvasPresetConfig> = {
  freeform: {
    id: 'freeform',
    label: 'Fit Device',
    category: 'custom',
    width: 0,
    height: 0,
    description: 'Dynamic canvas fitting device + margins',
    defaultScale: 1.0,
    defaultAnchor: 'center',
    defaultOffsetX: 0,
    defaultOffsetY: 0,
    aspectRatioLabel: 'Auto',
  },
  play_banner: {
    id: 'play_banner',
    label: 'Google Play Banner',
    category: 'store',
    width: 2048, // 1024 × 500 @ 2x for sharp retina rendering
    height: 1000,
    description: '1024 × 500 px Google Play Store feature graphic',
    defaultScale: 0.85,
    defaultAnchor: 'bottom_bleed',
    defaultOffsetX: 380,
    defaultOffsetY: 120,
    aspectRatioLabel: '1024 × 500',
  },
  github_banner: {
    id: 'github_banner',
    label: 'GitHub Hero Banner',
    category: 'social',
    width: 2400,
    height: 1200,
    description: '2400 × 1200 px (2:1) retina README hero banner',
    defaultScale: 0.85,
    defaultAnchor: 'right_split',
    defaultOffsetX: 440,
    defaultOffsetY: 0,
    aspectRatioLabel: '2:1 (2400 × 1200)',
  },
  landscape_16_9: {
    id: 'landscape_16_9',
    label: '16:9 Landscape',
    category: 'social',
    width: 2560,
    height: 1440,
    description: '2560 × 1440 px widescreen presentation / X header',
    defaultScale: 0.85,
    defaultAnchor: 'center',
    defaultOffsetX: 0,
    defaultOffsetY: 0,
    aspectRatioLabel: '16:9 (2560 × 1440)',
  },
  square_1_1: {
    id: 'square_1_1',
    label: '1:1 Square',
    category: 'social',
    width: 1600,
    height: 1600,
    description: '1600 × 1600 px square post / avatar',
    defaultScale: 0.72,
    defaultAnchor: 'center',
    defaultOffsetX: 0,
    defaultOffsetY: 0,
    aspectRatioLabel: '1:1 (1600 × 1600)',
  },
  play_screenshot: {
    id: 'play_screenshot',
    label: 'Play Store Screenshot',
    category: 'store',
    width: 1080,
    height: 2400,
    description: '1080 × 2400 px (9:20) phone screenshot',
    defaultScale: 0.94,
    defaultAnchor: 'center',
    defaultOffsetX: 0,
    defaultOffsetY: 0,
    aspectRatioLabel: '9:20 (1080 × 2400)',
  },
};
