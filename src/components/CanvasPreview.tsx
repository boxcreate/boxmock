import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, UploadCloud, Monitor, Moon, Sun, Grid } from 'lucide-react';
import type { MockupOptions } from '../types';
import { renderMockup } from '../engine/renderer';

type PreviewBackdrop = 'light-checker' | 'dark-checker' | 'white' | 'dark';

interface CanvasPreviewProps {
  image: HTMLImageElement | null;
  options: MockupOptions;
  onOptionsChange: (options: MockupOptions) => void;
  onFileDrop: (file: File) => void;
}

const ToolbarTooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="relative group/tip flex items-center justify-center">
    {children}
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover/tip:flex items-center px-2 py-0.5 bg-zinc-900 border border-zinc-700/80 rounded text-[10px] font-medium text-zinc-200 tracking-tight whitespace-nowrap pointer-events-none shadow-xl z-30 animate-in fade-in duration-100">
      {text}
    </div>
  </div>
);

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  image,
  options,
  onOptionsChange,
  onFileDrop,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Default zoom set to 0.26 so the phone sits with generous breathing room
  const [zoom, setZoom] = useState<number>(0.26);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderMockup(canvasRef.current, image, options, 1);
  }, [image, options]);

  // Generous Fit to View calculation (keeps healthy buffer margins)
  const handleFitToScreen = () => {
    if (!containerRef.current || !canvasRef.current) return;
    const paddingX = 200;
    const paddingY = 160;
    const availableW = containerRef.current.clientWidth - paddingX;
    const availableH = containerRef.current.clientHeight - paddingY;
    const scaleW = availableW / canvasRef.current.width;
    const scaleH = availableH / canvasRef.current.height;
    const bestFit = Math.min(scaleW, scaleH, 0.42);
    setZoom(Math.max(0.14, Math.round(bestFit * 100) / 100));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileDrop(file);
      }
    }
  };

  // Determine container backdrop style
  const getBackdropClass = () => {
    if (options.backgroundType !== 'transparent') {
      return 'bg-[#09090b]';
    }
    switch (options.previewBackdrop) {
      case 'light-checker':
        return 'bg-checkerboard-light';
      case 'dark-checker':
        return 'bg-checkerboard-dark';
      case 'white':
        return 'bg-white';
      case 'dark':
        return 'bg-[#09090b]';
      case 'custom':
        return '';
      default:
        return 'bg-checkerboard-light';
    }
  };

  const setBackdrop = (mode: typeof options.previewBackdrop) => {
    onOptionsChange({ ...options, previewBackdrop: mode });
  };

  const handleCustomColorChange = (color: string) => {
    onOptionsChange({ ...options, previewBackdrop: 'custom', previewColor: color });
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        backgroundColor:
          options.backgroundType === 'transparent' && options.previewBackdrop === 'custom'
            ? options.previewColor
            : undefined,
      }}
      className={`relative flex-1 h-full overflow-auto flex items-center justify-center p-12 transition-colors duration-200 select-none ${getBackdropClass()}`}
    >
      {/* Visual Canvas Container with smooth transform */}
      <div
        className="transition-transform duration-150 ease-out origin-center flex items-center justify-center will-change-transform"
        style={{ transform: `scale(${zoom})` }}
      >
        <canvas
          ref={canvasRef}
          className="rounded-2xl transition-all"
        />
      </div>

      {/* Drag & Drop Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md border-2 border-dashed border-zinc-400 flex flex-col items-center justify-center gap-3 z-30 animate-in fade-in duration-150">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-zinc-100 flex items-center justify-center border border-zinc-700 shadow-xl">
            <UploadCloud className="w-7 h-7 animate-bounce" />
          </div>
          <p className="text-sm font-semibold text-zinc-100 tracking-tight">Drop screenshot to load</p>
          <p className="text-xs text-zinc-400 font-mono">PNG, JPG, or WebP</p>
        </div>
      )}

      {/* Floating Studio Toolbar (Bottom Center Dock) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-950/90 backdrop-blur-xl px-2.5 py-1 rounded-xl border border-zinc-800 shadow-2xl shadow-black/60 z-10 text-xs select-none">
        
        {/* Backdrop inspection modes (Only active in transparent mode) */}
        {options.backgroundType === 'transparent' && (
          <>
            <div className="flex items-center gap-0.5 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <ToolbarTooltip text="Light Grid">
                <button
                  onClick={() => setBackdrop('light-checker')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    options.previewBackdrop === 'light-checker'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
              </ToolbarTooltip>

              <ToolbarTooltip text="Dark Grid">
                <button
                  onClick={() => setBackdrop('dark-checker')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    options.previewBackdrop === 'dark-checker'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </ToolbarTooltip>

              <ToolbarTooltip text="White Stage">
                <button
                  onClick={() => setBackdrop('white')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    options.previewBackdrop === 'white'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </ToolbarTooltip>

              <ToolbarTooltip text="Dark Stage">
                <button
                  onClick={() => setBackdrop('dark')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    options.previewBackdrop === 'dark'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </ToolbarTooltip>

              {/* Custom Color Backdrop Picker */}
              <ToolbarTooltip text={`Custom Color (${options.previewColor})`}>
                <label
                  className={`relative p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                    options.previewBackdrop === 'custom'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm ring-1 ring-zinc-400'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: options.previewColor }}
                  />
                  <input
                    type="color"
                    value={options.previewColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </ToolbarTooltip>
            </div>

            <div className="w-px h-3.5 bg-zinc-800" />
          </>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5">
          <ToolbarTooltip text="Zoom Out (-4%)">
            <button
              onClick={() => setZoom((z) => Math.max(0.12, Math.round((z - 0.04) * 100) / 100))}
              className="p-1 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-md transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </ToolbarTooltip>

          <span className="px-1.5 font-mono text-[11px] font-medium text-zinc-300 w-11 text-center">
            {Math.round(zoom * 100)}%
          </span>

          <ToolbarTooltip text="Zoom In (+4%)">
            <button
              onClick={() => setZoom((z) => Math.min(1.2, Math.round((z + 0.04) * 100) / 100))}
              className="p-1 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-md transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </ToolbarTooltip>

          <ToolbarTooltip text="Fit to Viewport">
            <button
              onClick={handleFitToScreen}
              className="flex items-center gap-1 px-2 py-0.5 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-md text-[11px] font-medium transition-colors cursor-pointer ml-0.5"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fit</span>
            </button>
          </ToolbarTooltip>
        </div>
      </div>
    </div>
  );
};
