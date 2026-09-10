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

      {/* 2. 3D Showcase Angle & Perspective */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-zinc-300 font-medium">3D Showcase Angles</span>
            <HelpTip text="True 3D perspective orientation revealing polished metallic rails, tactile buttons, camera island, and depth." />
          </div>
          {((options.rotX || 0) !== 0 || (options.rotY || 0) !== 0 || (options.rotZ || 0) !== 0) && (
            <button
              type="button"
              onClick={() => {
                onOptionsChange({
                  ...options,
                  rotX: 0,
                  rotY: 0,
                  rotZ: 0,
                  deviceRotation: 0,
                });
              }}
              title="Reset 3D rotation to straight-on front view"
              className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-zinc-850"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset 0°</span>
            </button>
          )}
        </div>

        {/* 3D Showcase Preset Chips */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Front', rotX: 0, rotY: 0, rotZ: 0, tag: 'Flat' },
            { label: 'Persp. Left', rotX: 8, rotY: -20, rotZ: -4, tag: '-20°' },
            { label: 'Persp. Right', rotX: 8, rotY: 20, rotZ: 4, tag: '+20°' },
            { label: 'Floating Hero', rotX: 12, rotY: -14, rotZ: -12, tag: 'Hero' },
            { label: 'Isometric', rotX: 20, rotY: -30, rotZ: 0, tag: 'Iso' },
            { label: 'Laydown', rotX: 45, rotY: -12, rotZ: 0, tag: 'Desk' },
          ].map((p) => {
            const isSelected =
              (options.rotX || 0) === p.rotX &&
              (options.rotY || 0) === p.rotY &&
              (options.rotZ || 0) === p.rotZ;

            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  onOptionsChange({
                    ...options,
                    rotX: p.rotX,
                    rotY: p.rotY,
                    rotZ: p.rotZ,
                    deviceRotation: 0,
                  });
                }}
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

        {/* 3D Sliders: Turn (Yaw) & Tilt (Pitch) */}
        <div className="space-y-2.5 pt-1">
          <SliderControl
            label="Turn 3D (Yaw)"
            tip="Turn the phone left (-) or right (+) in 3D to reveal polished metal side rails and buttons."
            value={options.rotY || 0}
            min={-60}
            max={60}
            step={1}
            unit="°"
            defaultValue={0}
            onChange={(val) => update('rotY', val)}
          />
          <SliderControl
            label="Tilt 3D (Pitch)"
            tip="Tilt the phone backwards (-) or forwards (+) in 3D perspective."
            value={options.rotX || 0}
            min={-45}
            max={60}
            step={1}
            unit="°"
            defaultValue={0}
            onChange={(val) => update('rotX', val)}
          />
          <SliderControl
            label="Slant (Roll)"
            tip="Slant the device diagonally."
            value={options.rotZ || 0}
            min={-45}
            max={45}
            step={1}
            unit="°"
            defaultValue={0}
            onChange={(val) => update('rotZ', val)}
          />
        </div>
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
