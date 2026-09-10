import React from 'react';
import { Download, RotateCcw, Command, Copy, Check } from 'lucide-react';
import type { MockupOptions, ExportFormat } from '../types';
import { BoxmockLogo } from './Logo';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  image: HTMLImageElement | null;
  options: MockupOptions;
  onOptionsChange: (options: MockupOptions) => void;
  onExport: () => void;
  onResetFrame: () => void;
  onCopy: () => void;
  copied: boolean;
  isExporting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  image,
  options,
  onOptionsChange,
  onExport,
  onResetFrame,
  onCopy,
  copied,
  isExporting,
}) => {
  const isCopyDisabled = Boolean(options.showShadow || !options.tightCrop);

  const getCopyDisabledReason = () => {
    if (options.showShadow && !options.tightCrop) {
      return 'Clipboard copy is disabled while Drop Shadow is enabled and Tight Framing is off. Desktop apps (like Photoshop) flatten clipboard transparency into a white halo. Please use Export to download the PNG file, or disable Drop Shadow and enable Tight Frame Cutout.';
    }
    if (options.showShadow) {
      return 'Clipboard copy is disabled while Drop Shadow is enabled. Desktop apps (like Photoshop) flatten clipboard shadow transparency into a white halo. Please use Export (PNG) to download, or turn off Drop Shadow.';
    }
    if (!options.tightCrop) {
      return 'Clipboard copy is disabled while Tight Framing is off. Desktop apps (like Photoshop) flatten clipboard transparency into a white halo. Please use Export (PNG) to download, or enable Tight Frame Cutout.';
    }
    return '';
  };

  return (
    <header className="h-13 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Brand */}
      <div className="flex items-center gap-2.5">
        <BoxmockLogo className="w-6 h-6 shrink-0 shadow-sm" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-zinc-100 font-sans">boxmock</span>
          <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
            Pixel 9 Pro
          </span>
        </div>
      </div>

      {/* Center: Command shortcuts */}
      <div className="hidden md:flex items-center gap-2 text-[11px] text-zinc-400 bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-800/80">
        <Command className="w-3 h-3 text-zinc-400" />
        <span className="flex items-center gap-1.5">
          <kbd className="font-mono text-zinc-200 font-semibold">⌘V</kbd>
          <span>paste</span>
          <span className="text-zinc-600">•</span>
          <kbd className={`font-mono font-semibold ${isCopyDisabled ? 'text-zinc-600' : 'text-zinc-200'}`}>⌘C</kbd>
          <span className={isCopyDisabled ? 'text-zinc-600' : ''}>copy</span>
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Reset Frame */}
        <button
          onClick={onResetFrame}
          title="Reset device position, scale, and framing to default"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline font-medium">Reset Frame</span>
        </button>

        {/* Format Selector (PNG, JPG, WebP) */}
        <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
          {(['png', 'jpeg', 'webp'] as const).map((fmt) => {
            const isJpgDisabled = options.backgroundType === 'transparent' && fmt === 'jpeg';
            return (
              <button
                key={fmt}
                disabled={isJpgDisabled}
                onClick={() => onOptionsChange({ ...options, exportFormat: fmt as ExportFormat })}
                title={isJpgDisabled ? 'JPG does not support transparency (use PNG or WebP)' : undefined}
                className={`px-2 py-1 rounded-md font-mono text-[10px] uppercase font-medium transition-colors ${
                  isJpgDisabled
                    ? 'opacity-30 cursor-not-allowed text-zinc-600'
                    : options.exportFormat === fmt
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm cursor-pointer'
                    : 'text-zinc-400 hover:text-zinc-300 cursor-pointer'
                }`}
              >
                {fmt === 'jpeg' ? 'JPG' : fmt}
              </button>
            );
          })}
        </div>

        {/* Resolution Selector */}
        <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
          {([1, 2, 4] as const).map((scale) => (
            <button
              key={scale}
              onClick={() => onOptionsChange({ ...options, exportScale: scale })}
              className={`px-2 py-1 rounded-md font-mono font-medium transition-colors cursor-pointer ${
                options.exportScale === scale
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {scale}×
            </button>
          ))}
        </div>

        {/* Copy to Clipboard */}
        {isCopyDisabled ? (
          <Tooltip content={getCopyDisabledReason()} className="cursor-not-allowed">
            <button
              type="button"
              disabled
              tabIndex={-1}
              aria-disabled="true"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-500 bg-zinc-900/40 border border-zinc-800/60 rounded-lg opacity-40 shadow-none pointer-events-none select-none"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-600" />
              <span>Copy</span>
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={onCopy}
            title="Copy high-resolution image to clipboard (⌘C)"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        )}

        {/* Primary Export Button */}
        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-zinc-900" />
          <span>{isExporting ? 'Exporting...' : `Export ${options.exportScale}× ${options.exportFormat === 'jpeg' ? 'JPG' : options.exportFormat.toUpperCase()}`}</span>
        </button>
      </div>
    </header>
  );
};
