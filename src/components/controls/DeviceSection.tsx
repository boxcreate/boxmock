import React from 'react';
import { RotateCcw } from 'lucide-react';
import type { MockupOptions, DeviceAnchor, DeviceFinish } from '../../types';
import { PIXEL_FINISHES } from '../../engine/finishes';
import { SegmentedSwitch } from '../ui/SegmentedSwitch';
import { SliderControl } from '../ui/SliderControl';
import { HelpTip } from '../Tooltip';

interface DeviceSectionProps {
  options: MockupOptions;
  update: <K extends keyof MockupOptions>(key: K, value: MockupOptions[K]) => void;
  onOptionsChange: (options: MockupOptions) => void;
  onResetFrame: () => void;
}

export const DeviceSection: React.FC<DeviceSectionProps> = ({
  options,
  update,
  onOptionsChange,
  onResetFrame,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Hardware Finish */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-zinc-300 font-medium">Chassis Finish</span>
            <HelpTip text="Authentic Google Pixel 9 Pro metal frame finishes and satellite camera visor colors." />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Pixel 9 Pro</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(PIXEL_FINISHES) as (keyof typeof PIXEL_FINISHES)[]).map((key) => {
            const finish = PIXEL_FINISHES[key];
            const isSelected = options.finish === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => update('finish', key)}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-500 text-zinc-100 font-semibold shadow-sm ring-1 ring-zinc-500/30'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850/50'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                  style={{ backgroundColor: finish.swatch }}
                />
                <span className="truncate">{finish.label}</span>
              </button>
            );
          })}

          {/* Custom Color Option */}
          <div className="col-span-2">
            <label
              onClick={() => {
                if (options.finish !== 'custom') update('finish', 'custom');
              }}
              className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all cursor-pointer select-none ${
                options.finish === 'custom'
                  ? 'bg-zinc-800 border-zinc-500 text-zinc-100 font-semibold shadow-sm ring-1 ring-zinc-500/30'
                  : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm shrink-0"
                  style={{ backgroundColor: options.customFinishColor || '#3b82f6' }}
                />
                <span className="font-medium">Custom Brand Color</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-400">
                  {options.customFinishColor || '#3b82f6'}
                </span>
                <input
                  type="color"
                  value={options.customFinishColor || '#3b82f6'}
                  onChange={(e) => {
                    onOptionsChange({
                      ...options,
                      finish: 'custom',
                      customFinishColor: e.target.value,
                    });
                  }}
                  className="w-5 h-5 rounded cursor-pointer border border-zinc-700 bg-transparent p-0"
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="h-px bg-zinc-800/60" />

      {/* 2. Showcase Angle & Orientation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-zinc-300 font-medium">Showcase Angle</span>
            <HelpTip text="Curated presentation tilts for Dribbble, hero headers, and App Store showcases." />
          </div>
          {(options.deviceRotation || 0) !== 0 && (
            <button
              type="button"
              onClick={() => update('deviceRotation', 0)}
              title="Reset angle to 0°"
              className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-zinc-850"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset 0°</span>
            </button>
          )}
        </div>

        {/* Preset Angle Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Front', angle: 0, tag: '0°' },
            { label: 'Hero Left', angle: -12, tag: '-12°' },
            { label: 'Hero Right', angle: 12, tag: '+12°' },
            { label: 'Subtle Left', angle: -5, tag: '-5°' },
            { label: 'Subtle Right', angle: 5, tag: '+5°' },
            { label: 'Landscape', angle: 90, tag: '90°' },
          ].map((p) => {
            const isSelected = (options.deviceRotation || 0) === p.angle;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => update('deviceRotation', p.angle)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-500 text-zinc-100 font-semibold shadow-sm ring-1 ring-zinc-500/30'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850/50'
                }`}
              >
                <span className="truncate leading-tight text-[11px] font-medium">{p.label}</span>
                <span className="text-[10px] font-mono text-zinc-500 mt-0.5">{p.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Angle Slider */}
        <SliderControl
          label="Angle Rotation"
          tip="Fine-tune device rotation angle (-90° to +90°). Double-click value to reset to 0°."
          value={options.deviceRotation || 0}
          min={-90}
          max={90}
          step={1}
          unit="°"
          defaultValue={0}
          onChange={(val) => update('deviceRotation', val)}
        />
      </div>

      <div className="h-px bg-zinc-800/60" />

      {/* 3. Framing & Placement */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-zinc-300 font-medium">Layout & Anchors</span>
            <HelpTip text="Snap phone into hero marketing layouts (bottom bleed for large screens, side splits for copy)." />
          </div>
          <button
            type="button"
            onClick={onResetFrame}
            title="Reset position, scale, and framing to default"
            className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-zinc-850"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        </div>

        <SegmentedSwitch<DeviceAnchor>
          options={[
            { id: 'center', label: 'Center' },
            { id: 'bottom_bleed', label: 'Bleed' },
            { id: 'left_split', label: 'Left' },
            { id: 'right_split', label: 'Right' },
          ]}
          value={options.deviceAnchor || 'center'}
          onChange={(anchor) => update('deviceAnchor', anchor)}
          size="sm"
        />

        {/* Scale */}
        <SliderControl
          label="Phone Scale"
          tip="Zoom the phone size on the canvas without altering resolution."
          value={options.deviceScale || 1.0}
          min={0.5}
          max={1.5}
          step={0.05}
          unit="%"
          defaultValue={1.0}
          onChange={(val) => update('deviceScale', val)}
        />

        {/* Offset X & Y */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <SliderControl
            label="Position X"
            tip="Nudge phone left (-) or right (+)."
            value={options.deviceOffsetX || 0}
            min={-600}
            max={600}
            step={10}
            unit="px"
            defaultValue={0}
            onChange={(val) => update('deviceOffsetX', val)}
          />
          <SliderControl
            label="Position Y"
            tip="Nudge phone up (-) or down (+)."
            value={options.deviceOffsetY || 0}
            min={-600}
            max={600}
            step={10}
            unit="px"
            defaultValue={0}
            onChange={(val) => update('deviceOffsetY', val)}
          />
        </div>
      </div>
    </div>
  );
};
