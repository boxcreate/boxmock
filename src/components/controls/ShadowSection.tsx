import React from 'react';
import type { MockupOptions } from '../../types';
import { SliderControl } from '../ui/SliderControl';
import { ToggleRow } from '../ui/ToggleRow';
import { HelpTip } from '../Tooltip';

interface ShadowSectionProps {
  options: MockupOptions;
  update: <K extends keyof MockupOptions>(key: K, value: MockupOptions[K]) => void;
  onOptionsChange?: (options: MockupOptions) => void;
}

const SHADOW_PRESETS = [
  { name: 'Studio', opacity: 0.45, blur: 60, spread: 4, offsetY: 30, offsetX: 0, contact: 0.65 },
  { name: 'Floating', opacity: 0.35, blur: 140, spread: 12, offsetY: 80, offsetX: 0, contact: 0.25 },
  { name: 'Crisp', opacity: 0.55, blur: 25, spread: -2, offsetY: 18, offsetX: 30, contact: 0.8 },
  { name: 'Ambient', opacity: 0.6, blur: 15, spread: -6, offsetY: 8, offsetX: 0, contact: 0.9 },
  { name: 'Hard', opacity: 0.7, blur: 0, spread: 0, offsetY: 20, offsetX: 20, contact: 0 },
];

const QUICK_SHADOW_COLORS = [
  { label: 'Pitch Black', hex: '#000000' },
  { label: 'Deep Slate', hex: '#090d16' },
  { label: 'Warm Charcoal', hex: '#1c1917' },
  { label: 'Night Navy', hex: '#0a0e27' },
];

export const ShadowSection: React.FC<ShadowSectionProps> = ({
  options,
  update,
  onOptionsChange,
}) => {
  const currentShadowColor = options.shadowColor || '#000000';

  const applyPreset = (preset: (typeof SHADOW_PRESETS)[0]) => {
    if (onOptionsChange) {
      onOptionsChange({
        ...options,
        showShadow: true,
        shadowOpacity: preset.opacity,
        shadowBlur: preset.blur,
        shadowSpread: preset.spread,
        shadowOffsetY: preset.offsetY,
        shadowOffsetX: preset.offsetX,
        shadowContactIntensity: preset.contact,
      });
    } else {
      update('showShadow', true);
      update('shadowOpacity', preset.opacity);
      update('shadowBlur', preset.blur);
      update('shadowSpread', preset.spread);
      update('shadowOffsetY', preset.offsetY);
      update('shadowOffsetX', preset.offsetX);
      update('shadowContactIntensity', preset.contact);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Master Toggle */}
      <ToggleRow
        label="Enable Ground Shadow"
        tip="Cast a realistic, multi-layered ground shadow beneath the device with zero clipping."
        checked={options.showShadow}
        onChange={(checked) => update('showShadow', checked)}
      />

      {options.showShadow && (
        <div className="space-y-3.5 pt-1">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Presets</span>
              <HelpTip text="One-click studio lighting setups ranging from tight ambient to high-altitude floating hero." />
            </div>
            <div className="grid grid-cols-5 gap-1 p-0.5 bg-zinc-900/90 rounded-lg border border-zinc-800/80 text-[10px]">
              {SHADOW_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="py-1 px-1 rounded text-center font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all cursor-pointer truncate"
                  title={`${p.name}: Blur ${p.blur}px, Y ${p.offsetY}px`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color Tint */}
          <div className="flex items-center justify-between p-2 bg-zinc-900/60 rounded-lg border border-zinc-850 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-300 font-medium">Color Tint</span>
              <HelpTip text="Tint the shadow with brand or slate colors instead of pure black." />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {QUICK_SHADOW_COLORS.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => update('shadowColor', swatch.hex)}
                    title={swatch.label}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                      currentShadowColor.toLowerCase() === swatch.hex.toLowerCase()
                        ? 'border-white scale-110 ring-1 ring-zinc-400'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={currentShadowColor}
                onChange={(e) => update('shadowColor', e.target.value)}
                className="w-4.5 h-4.5 rounded cursor-pointer border border-zinc-700 bg-transparent p-0 ml-1"
              />
            </div>
          </div>

          {/* Sliders */}
          <SliderControl
            label="Opacity"
            tip="Overall darkness and density of the cast shadow."
            value={options.shadowOpacity}
            min={0}
            max={1}
            step={0.05}
            unit="%"
            defaultValue={0.45}
            onChange={(val) => update('shadowOpacity', val)}
          />

          <SliderControl
            label="Blur Softness"
            tip="0px creates a razor-sharp graphic poster shadow. Up to 350px creates ultra-soft ambient studio falloff."
            value={options.shadowBlur}
            min={0}
            max={350}
            step={5}
            unit="px"
            defaultValue={60}
            onChange={(val) => update('shadowBlur', val)}
          />

          <SliderControl
            label="Spread"
            tip="Expands or contracts the shadow perimeter outward beyond the phone."
            value={options.shadowSpread}
            min={-40}
            max={120}
            step={2}
            unit="px"
            defaultValue={4}
            onChange={(val) => update('shadowSpread', val)}
          />

          <SliderControl
            label="Contact Occlusion"
            tip="Tight shadow directly under the phone. 0% for floating in air; 100% for firmly grounded on surface."
            value={options.shadowContactIntensity ?? 0.65}
            min={0}
            max={1}
            step={0.05}
            unit="%"
            defaultValue={0.65}
            onChange={(val) => update('shadowContactIntensity', val)}
          />

          <div className="grid grid-cols-2 gap-3 pt-1">
            <SliderControl
              label="Floor Distance (Y)"
              tip="Simulates phone elevation above the surface by shifting shadow downward."
              value={options.shadowOffsetY || 0}
              min={-100}
              max={300}
              step={5}
              unit="px"
              defaultValue={30}
              onChange={(val) => update('shadowOffsetY', val)}
            />
            <SliderControl
              label="Light Angle (X)"
              tip="Horizontal light angle. Shifts shadow left (-) or right (+)."
              value={options.shadowOffsetX || 0}
              min={-200}
              max={200}
              step={5}
              unit="px"
              defaultValue={0}
              onChange={(val) => update('shadowOffsetX', val)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
