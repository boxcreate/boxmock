export type DeviceFinish =
  | 'obsidian'
  | 'porcelain'
  | 'hazel'
  | 'rose_quartz'
  | 'wintergreen'
  | 'peony'
  | 'bay'
  | 'natural_titanium'
  | 'champagne_gold'
  | 'custom';

export type BackgroundType = 'transparent' | 'solid' | 'gradient';

export type ExportScale = 1 | 2 | 4;

export type LightingPreset = 'studio' | 'dramatic' | 'neon' | 'golden';

export type LightingScope = 'full' | 'frame_only' | 'flat';

export interface GradientStop {
  color: string;
  position: number; // 0 to 1
}

export interface FinishColors {
  name: string;
  label: string;
  // Frame rails & rim
  frameOuter: string;
  frameInner: string;
  frameHighlight: string;
  frameShadow: string;
  railCore: string;
  // Anisotropic corner gleam colors
  cornerGleam: string;
  rimHighlight: string;
  // Accent & camera
  antennaBand: string;
  punchHoleRing: string;
  punchHoleLens: string;
  cameraCoatingTint: string;
  // Indicator dot preview
  swatch: string;
}

export interface MockupOptions {
  finish: DeviceFinish;
  customFinishColor?: string; // Hex color for custom finish
  lightingPreset: LightingPreset;
  lightingScope: LightingScope; // 'full' (frame+screen) | 'frame_only' (pristine screen) | 'flat' (no lighting)
  // Glass & reflections
  showGlassGlare: boolean;
  glareIntensity: number; // 0 to 1
  cornerGleamIntensity: number; // 0 to 1 (specular rail highlights)
  glassEdgeRefraction: boolean; // 2.5D curved glass rim highlight
  showCameraOptics: boolean;
  // Fine-tuned Shadow Controls
  showShadow: boolean;
  shadowOpacity: number; // 0 to 1
  shadowBlur: number; // 0 to 350
  shadowOffsetY: number; // -100 to 300 (floor distance)
  shadowOffsetX: number; // -200 to 200 (light angle)
  shadowSpread: number; // -40 to 120
  shadowColor?: string; // Hex color tint (defaults to '#000000')
  shadowContactIntensity?: number; // 0 to 1 (tight contact occlusion grounding)
  // Canvas & Background
  backgroundType: BackgroundType;
  backgroundColor: string;
  gradientAngle: number;
  gradientColorStart: string;
  gradientColorEnd: string;
  padding: number; // margin around device (0 to 200)
  exportScale: ExportScale;
  tightCrop: boolean;
  // Stage Preview Backdrop (inspection only, does not affect export)
  previewBackdrop: PreviewBackdrop;
  previewColor: string;
  // Canvas Aspect Ratio & Store Presets
  canvasPreset: CanvasPreset;
  deviceScale: number; // 0.5 to 1.8 (zoom level inside canvas)
  deviceOffsetX: number; // horizontal placement offset
  deviceOffsetY: number; // vertical placement offset
  // 3D Showcase Rotation
  rotX: number; // Pitch / tilt (-60° to +60°, default 0)
  rotY: number; // Yaw / turn (-60° to +60°, default 0)
  rotZ: number; // Roll / slant (-60° to +60°, default 0)
  deviceRotation?: number; // legacy 2D rotation alias
  deviceAnchor: DeviceAnchor; // 'center' | 'bottom_bleed' | 'left_split' | 'right_split'
  // Screenshot Fit & Pan
  screenshotFit: ScreenshotFit; // 'cover' | 'contain' | 'fill'
  screenshotOffsetY: number; // vertical pan inside frame
  // Material You Status Bar & Gesture Navigation
  showStatusBar: boolean;
  statusBarTime: string;
  statusBarTheme: StatusBarTheme; // 'auto' | 'light' | 'dark'
  showNavigationPill: boolean;
  // Export Settings
  exportFormat: ExportFormat; // 'png' | 'jpeg' | 'webp'
  exportQuality: number; // 0.8 to 1.0
}

export type PreviewBackdrop = 'light-checker' | 'dark-checker' | 'white' | 'dark' | 'custom';
export type CanvasPreset = 'freeform' | 'play_banner' | 'github_banner' | 'landscape_16_9' | 'square_1_1' | 'play_screenshot';
export type DeviceAnchor = 'center' | 'bottom_bleed' | 'left_split' | 'right_split';
export type ScreenshotFit = 'cover' | 'contain' | 'fill';
export type ExportFormat = 'png' | 'jpeg' | 'webp';
export type StatusBarTheme = 'auto' | 'light' | 'dark';
