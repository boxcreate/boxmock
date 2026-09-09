import React from 'react';
import type { MockupOptions, LightingPreset, LightingScope } from '../../types';
import { SegmentedSwitch } from '../ui/SegmentedSwitch';
import { SliderControl } from '../ui/SliderControl';
import { ToggleRow } from '../ui/ToggleRow';
import { HelpTip } from '../Tooltip';

interface LightingSectionProps {
  options: MockupOptions;
  update: <K extends keyof MockupOptions>(key: K, value: MockupOptions[K]) => void;
}

const LIGHTING_PRESETS: { id: LightingPreset; label: string }[] = [
  { id: 'studio', label: 'Studio' },
  { id: 'dramatic', label: 'Noir' },
  { id: 'neon', label: 'Neon' },
  { id: 'golden', label: 'Golden' },
];

export const LightingSection: React.FC<LightingSectionProps> = ({ options, update }) => {
  return (
    <div className="space-y-3.5">
      {/* 1. Lighting Scope */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-zinc-300 font-medium">Lighting Scope</span>
            <HelpTip text="Full Studio lights frame and screen. Frame Only keeps screenshot raw and unglared. Flat disables all gleams." />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono capitalize">
            {options.lightingScope.replace('_', ' ')}
          </span>
        </div>

        <SegmentedSwitch<LightingScope>
          options={[
            { id: 'full', label: 'Full Studio' },
            { id: 'frame_only', label: 'Frame Only' },
            { id: 'flat', label: 'Flat' },
          ]}
          value={options.lightingScope}
          onChange={(scope) => update('lightingScope', scope)}
        />

        {options.lightingScope === 'frame_only' && (
          <p className="text-[10px] text-zinc-400 font-mono leading-relaxed bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
            ✓ Screenshot is 100% clean with zero glare. Lighting only hits the metal frame.
          </p>
        )}
        {options.lightingScope === 'flat' && (
          <p className="text-[10px] text-zinc-400 font-mono leading-relaxed bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
            ✓ Flat technical mode: all specular highlights and corner gleams disabled.
          </p>
        )}
      </div>

      {/* 2. Studio Mood (Active when not flat) */}
      {options.lightingScope !== 'flat' && (
        <div className="space-y-1.5 pt-1 border-t border-zinc-800/60">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <span className="text-zinc-300 font-medium">Studio Mood</span>
              <HelpTip text="Lighting color temperature and key light direction presets." />
            </div>
            <span className="text-[10px] text-zinc-500 font-mono capitalize">
              {options.lightingPreset}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-0.5 bg-zinc-900/90 rounded-lg border border-zinc-800/80 text-[11px]">
            {LIGHTING_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => update('lightingPreset', preset.id)}
                className={`py-1 rounded text-center font-medium transition-all cursor-pointer ${
                  options.lightingPreset === preset.id
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-750'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Corner Gleams */}
      {options.lightingScope !== 'flat' && (
        <SliderControl
          label="Metallic Corner Gleams"
          tip="Specular glints reflecting off the curved aerospace aluminum corner chassis."
          value={options.cornerGleamIntensity}
          min={0}
          max={1}
          step={0.05}
          unit="%"
          defaultValue={0.85}
          onChange={(val) => update('cornerGleamIntensity', val)}
        />
      )}

      {/* 4. Front Glass Sheen (Full mode only) */}
      {options.lightingScope === 'full' && (
        <div className="space-y-2 pt-1 border-t border-zinc-800/60">
          <ToggleRow
            label="Screen Glass Sheen"
            tip="Gentle diagonal studio reflection across the front display glass for depth."
            checked={options.showGlassGlare}
            onChange={(checked) => update('showGlassGlare', checked)}
          />

          {options.showGlassGlare && (
            <SliderControl
              label="Sheen Opacity"
              value={options.glareIntensity}
              min={0.05}
              max={1}
              step={0.05}
              unit="%"
              defaultValue={0.35}
              onChange={(val) => update('glareIntensity', val)}
            />
          )}
        </div>
      )}

      {/* 5. 2.5D Curved Glass Rim */}
      <div className="pt-1 border-t border-zinc-800/60">
        <ToggleRow
          label="2.5D Rim Refraction"
          tip="Subtle polished glass bevel edge highlight running along the inner screen perimeter."
          checked={options.glassEdgeRefraction}
          onChange={(checked) => update('glassEdgeRefraction', checked)}
        />
      </div>

      {/* 6. Camera Optics */}
      <div className="pt-1 border-t border-zinc-800/60">
        <ToggleRow
          label="Camera Optics & Speaker"
          tip="Detailed camera punch-hole lens with anti-reflective optical coatings and speaker slit."
          checked={options.showCameraOptics}
          onChange={(checked) => update('showCameraOptics', checked)}
        />
      </div>
    </div>
  );
};
