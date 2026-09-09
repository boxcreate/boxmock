import React from 'react';
import type { MockupOptions, CanvasPreset, BackgroundType } from '../../types';
import { CANVAS_PRESETS } from '../../engine/presets';
import { SegmentedSwitch } from '../ui/SegmentedSwitch';
import { SliderControl } from '../ui/SliderControl';
import { ToggleRow } from '../ui/ToggleRow';
import { HelpTip } from '../Tooltip';

interface CanvasSectionProps {
  options: MockupOptions;
  update: <K extends keyof MockupOptions>(key: K, value: MockupOptions[K]) => void;
  onOptionsChange: (options: MockupOptions) => void;
}

const GRADIENT_PRESETS = [
  { name: 'Dark Studio', start: '#090a0f', end: '#1a1f2c', angle: 135 },
  { name: 'Subtle Slate', start: '#0f172a', end: '#1e293b', angle: 135 },
  { name: 'Warm Sunset', start: '#1c1917', end: '#431407', angle: 135 },
  { name: 'Clean White', start: '#f8fafc', end: '#e2e8f0', angle: 135 },
];

export const CanvasSection: React.FC<CanvasSectionProps> = ({
  options,
  update,
  onOptionsChange,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Canvas Dimension Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-zinc-300 font-medium">Canvas Preset</span>
            <HelpTip text="Export dimensions for Google Play Store banners, GitHub Readmes, or custom aspect ratios." />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {CANVAS_PRESETS[options.canvasPreset || 'freeform']?.aspectRatioLabel}
          </span>
        </div>

        <select
          value={options.canvasPreset || 'freeform'}
          onChange={(e) => {
            const presetKey = e.target.value as CanvasPreset;
            const p = CANVAS_PRESETS[presetKey];
            onOptionsChange({
              ...options,
              canvasPreset: presetKey,
              deviceAnchor: p.defaultAnchor,
              deviceScale: 1.0,
              deviceOffsetX: p.defaultOffsetX,
              deviceOffsetY: p.defaultOffsetY,
              backgroundType:
                presetKey !== 'freeform' && options.backgroundType === 'transparent'
                  ? 'solid'
                  : options.backgroundType,
              backgroundColor: presetKey === 'play_banner' ? '#0b0f19' : options.backgroundColor,
            });
          }}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 cursor-pointer font-medium"
        >
          {Object.values(CANVAS_PRESETS).map((p) => (
            <option key={p.id} value={p.id}>
              {p.label} ({p.aspectRatioLabel})
            </option>
          ))}
        </select>
      </div>

      <div className="h-px bg-zinc-800/60" />

      {/* 2. Background Style */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-zinc-300 font-medium">Background Type</span>
            <HelpTip text="Transparent cutout (PNG/WebP), solid studio color, or smooth gradient." />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono capitalize">
            {options.backgroundType}
          </span>
        </div>

        <SegmentedSwitch<BackgroundType>
          options={[
            { id: 'transparent', label: 'Transparent' },
            { id: 'solid', label: 'Solid' },
            { id: 'gradient', label: 'Gradient' },
          ]}
          value={options.backgroundType}
          onChange={(type) => {
            if (type === 'transparent') {
              onOptionsChange({
                ...options,
                backgroundType: 'transparent',
                tightCrop: !options.showShadow,
                padding: 0,
              });
            } else {
              onOptionsChange({
                ...options,
                backgroundType: type,
                tightCrop: false,
                padding: options.padding === 0 ? 50 : options.padding,
              });
            }
          }}
        />

        {/* Transparent Options */}
        {options.backgroundType === 'transparent' && (
          <div className="space-y-2.5 pt-1">
            <ToggleRow
              label="Tight Frame Crop"
              tip="Trims away all empty canvas margins, snapping export boundaries directly to the phone chassis."
              checked={options.tightCrop && !options.showShadow}
              onChange={(next) => {
                onOptionsChange({
                  ...options,
                  tightCrop: next,
                  showShadow: next ? false : options.showShadow,
                  padding: next ? 0 : options.padding,
                });
              }}
            />

            {/* Studio Stage Backdrop Picker */}
            <div className="space-y-1.5 pt-1 border-t border-zinc-800/40">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400">Editor Stage Backdrop</span>
                  <HelpTip text="Preview-only stage color to inspect transparent cutouts. Does not affect export." />
                </div>
                <span className="text-[9px] font-mono text-zinc-500">Preview Only</span>
              </div>

              <div className="grid grid-cols-4 gap-1 p-0.5 bg-zinc-900 rounded-lg border border-zinc-800 text-[10px]">
                {[
                  { id: 'light-checker', label: 'Light' },
                  { id: 'dark-checker', label: 'Dark' },
                  { id: 'white', label: 'White' },
                  { id: 'dark', label: 'Solid Dark' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => update('previewBackdrop', mode.id as MockupOptions['previewBackdrop'])}
                    className={`py-1 rounded text-center transition-colors cursor-pointer ${
                      options.previewBackdrop === mode.id
                        ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Solid Color Options */}
        {options.backgroundType === 'solid' && (
          <div className="flex items-center justify-between p-2 bg-zinc-900/60 rounded-lg border border-zinc-800 text-xs">
            <span className="text-zinc-300 font-medium">Color Value</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-zinc-400">{options.backgroundColor}</span>
              <input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => update('backgroundColor', e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border border-zinc-700 bg-transparent p-0"
              />
            </div>
          </div>
        )}

        {/* Gradient Options */}
        {options.backgroundType === 'gradient' && (
          <div className="space-y-2 pt-1">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    update('gradientColorStart', preset.start);
                    update('gradientColorEnd', preset.end);
                    update('gradientAngle', preset.angle);
                  }}
                  title={preset.name}
                  className="w-7 h-7 rounded-md border border-white/10 shrink-0 hover:scale-105 transition-transform cursor-pointer shadow-sm"
                  style={{
                    background: `linear-gradient(${preset.angle}deg, ${preset.start}, ${preset.end})`,
                  }}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-1.5 bg-zinc-900/60 rounded border border-zinc-800 text-xs">
                <span className="text-[10px] text-zinc-400">Start</span>
                <input
                  type="color"
                  value={options.gradientColorStart}
                  onChange={(e) => update('gradientColorStart', e.target.value)}
                  className="w-4 h-4 rounded cursor-pointer border border-zinc-700 bg-transparent p-0"
                />
              </div>
              <div className="flex items-center justify-between p-1.5 bg-zinc-900/60 rounded border border-zinc-800 text-xs">
                <span className="text-[10px] text-zinc-400">End</span>
                <input
                  type="color"
                  value={options.gradientColorEnd}
                  onChange={(e) => update('gradientColorEnd', e.target.value)}
                  className="w-4 h-4 rounded cursor-pointer border border-zinc-700 bg-transparent p-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Canvas Padding */}
        <SliderControl
          label="Canvas Padding"
          tip="Outer margin space surrounding the phone inside the canvas boundary."
          value={options.padding}
          min={0}
          max={250}
          step={10}
          unit="px"
          defaultValue={50}
          onChange={(val) => update('padding', val)}
        />
      </div>
    </div>
  );
};
