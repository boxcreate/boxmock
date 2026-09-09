import React from 'react';
import { Upload, RotateCcw } from 'lucide-react';
import type { MockupOptions, ScreenshotFit } from '../../types';
import { SegmentedSwitch } from '../ui/SegmentedSwitch';
import { SliderControl } from '../ui/SliderControl';
import { HelpTip } from '../Tooltip';

interface ScreenshotSectionProps {
  options: MockupOptions;
  update: <K extends keyof MockupOptions>(key: K, value: MockupOptions[K]) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasCustomImage: boolean;
  onResetSample: () => void;
}

export const ScreenshotSection: React.FC<ScreenshotSectionProps> = ({
  options,
  update,
  onImageUpload,
  hasCustomImage,
  onResetSample,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageUpload}
      />

      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-750 text-zinc-100 text-xs font-semibold rounded-lg border border-zinc-750 shadow-sm transition-all cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-zinc-300" />
          <span>Upload Image</span>
          <kbd className="hidden sm:inline font-mono text-[9px] text-zinc-400 bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700">⌘V</kbd>
        </button>

        <button
          type="button"
          onClick={onResetSample}
          disabled={!hasCustomImage}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium rounded-lg border border-zinc-800 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample</span>
        </button>
      </div>

      {/* Image Fit Mode */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-zinc-300 font-medium">Image Fit</span>
            <HelpTip text="Cover fills the display without black bars. Contain fits the entire screenshot inside. Fill stretches to match." />
          </div>
          <span className="font-mono text-[10px] text-zinc-400 capitalize">
            {options.screenshotFit || 'cover'}
          </span>
        </div>
        <SegmentedSwitch<ScreenshotFit>
          options={[
            { id: 'cover', label: 'Cover' },
            { id: 'contain', label: 'Contain' },
            { id: 'fill', label: 'Fill' },
          ]}
          value={options.screenshotFit || 'cover'}
          onChange={(fit) => update('screenshotFit', fit)}
        />
      </div>

      {/* Vertical Pan */}
      <SliderControl
        label="Vertical Pan"
        tip="Slide your screenshot up or down inside the phone display to align the main content."
        value={options.screenshotOffsetY || 0}
        min={-200}
        max={200}
        step={5}
        unit="px"
        defaultValue={0}
        onChange={(val) => update('screenshotOffsetY', val)}
      />
    </div>
  );
};
