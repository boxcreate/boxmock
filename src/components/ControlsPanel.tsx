import React, { useState } from 'react';
import {
  Smartphone,
  Layers,
  Palette,
  Sun,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronsUpDown,
  RotateCcw,
} from 'lucide-react';
import type { MockupOptions } from '../types';
import { PIXEL_FINISHES } from '../engine/finishes';
import { CANVAS_PRESETS } from '../engine/presets';
import { ScreenshotSection } from './controls/ScreenshotSection';
import { DeviceSection } from './controls/DeviceSection';
import { CanvasSection } from './controls/CanvasSection';
import { ShadowSection } from './controls/ShadowSection';
import { LightingSection } from './controls/LightingSection';

interface ControlsPanelProps {
  options: MockupOptions;
  onOptionsChange: (options: MockupOptions) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasCustomImage: boolean;
  onResetSample: () => void;
  onResetFrame: () => void;
  onResetAll: () => void;
}

type TabType = 'all' | 'device' | 'canvas' | 'effects' | 'image';

const DEFAULT_COLLAPSED: Record<string, boolean> = {
  image: true,
  device: true,
  canvas: true,
  shadow: true,
  lighting: true,
};

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  options,
  onOptionsChange,
  onImageUpload,
  hasCustomImage,
  onResetSample,
  onResetFrame,
  onResetAll,
}) => {
  // 1. Persistent active tab (default 'all')
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      const saved = localStorage.getItem('boxmock_active_tab_v2');
      if (saved && ['all', 'device', 'canvas', 'effects', 'image'].includes(saved)) {
        return saved as TabType;
      }
    } catch {}
    return 'all';
  });

  // 2. Persistent collapse states (default all collapsed in all mode)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('boxmock_collapsed_v2');
      if (saved) {
        return { ...DEFAULT_COLLAPSED, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_COLLAPSED;
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('boxmock_active_tab_v2', tab);
    } catch {}
  };

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('boxmock_collapsed_v2', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const areAllCollapsed = Object.values(collapsed).every(Boolean);

  const toggleAllCollapse = () => {
    const nextVal = !areAllCollapsed;
    const next = {
      image: nextVal,
      device: nextVal,
      canvas: nextVal,
      shadow: nextVal,
      lighting: nextVal,
    };
    setCollapsed(next);
    try {
      localStorage.setItem('boxmock_collapsed_v2', JSON.stringify(next));
    } catch {}
  };

  const update = <K extends keyof MockupOptions>(key: K, value: MockupOptions[K]) => {
    onOptionsChange({ ...options, [key]: value });
  };

  // Live status summaries
  const finishLabel =
    options.finish === 'custom'
      ? 'Custom'
      : PIXEL_FINISHES[options.finish]?.label || 'Obsidian';
  const scalePercent = `${Math.round((options.deviceScale || 1.0) * 100)}%`;
  const canvasPresetLabel =
    CANVAS_PRESETS[options.canvasPreset || 'freeform']?.aspectRatioLabel || 'Auto';
  const shadowSummary = options.showShadow
    ? `${Math.round(options.shadowOpacity * 100)}%`
    : 'Off';
  const lightingSummary =
    options.lightingScope === 'flat' ? 'Flat' : options.lightingPreset;

  return (
    <aside className="w-96 border-r border-zinc-800/80 bg-[#0c0d10] flex flex-col h-full overflow-y-auto shrink-0 select-none text-zinc-300">
      {/* 1. Header Navigation Switcher */}
      <div className="p-3 border-b border-zinc-800/80 bg-[#0c0d10]/90 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center justify-between gap-1 p-0.5 bg-zinc-900/90 rounded-lg border border-zinc-800/80 text-xs">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'device', label: 'Device' },
              { id: 'canvas', label: 'Canvas' },
              { id: 'effects', label: 'Effects' },
              { id: 'image', label: 'Image' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-1.5 px-1 rounded-md text-center font-medium transition-all cursor-pointer capitalize ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Expand/Collapse Control in All Mode */}
        {activeTab === 'all' && (
          <div className="flex items-center justify-between pt-2.5 px-1 text-[10px] text-zinc-500 font-mono">
            <span>5 Section Groups</span>
            <button
              type="button"
              onClick={toggleAllCollapse}
              className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <ChevronsUpDown className="w-3 h-3" />
              <span>{areAllCollapsed ? 'Expand All' : 'Collapse All'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Main Content Body */}
      <div className="p-3 space-y-3 flex-1">
        {/* TAB MODE: DIRECT FOCUSED VIEWS */}
        {activeTab === 'image' && (
          <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
              Screenshot & Framing
            </h3>
            <ScreenshotSection
              options={options}
              update={update}
              onImageUpload={onImageUpload}
              hasCustomImage={hasCustomImage}
              onResetSample={onResetSample}
            />
          </div>
        )}

        {activeTab === 'device' && (
          <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
              Pixel 9 Pro Hardware & Framing
            </h3>
            <DeviceSection
              options={options}
              update={update}
              onOptionsChange={onOptionsChange}
              onResetFrame={onResetFrame}
            />
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
              Canvas Size & Background
            </h3>
            <CanvasSection
              options={options}
              update={update}
              onOptionsChange={onOptionsChange}
            />
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-3">
            <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
                Ground Drop Shadow
              </h3>
              <ShadowSection
                options={options}
                update={update}
                onOptionsChange={onOptionsChange}
              />
            </div>
            <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
                Studio Lighting & Reflections
              </h3>
              <LightingSection options={options} update={update} />
            </div>
          </div>
        )}

        {/* OVERVIEW (ALL) MODE: STRUCTURED ACCORDIONS */}
        {activeTab === 'all' && (
          <>
            {/* GROUP 1: SCREENSHOT */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCollapse('image')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">Screenshot</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                    {hasCustomImage ? 'Custom' : 'Sample'} · {options.screenshotFit || 'cover'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                      collapsed.image ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>
              </button>

              {!collapsed.image && (
                <div className="p-3 pt-0 border-t border-zinc-800/40 mt-1">
                  <ScreenshotSection
                    options={options}
                    update={update}
                    onImageUpload={onImageUpload}
                    hasCustomImage={hasCustomImage}
                    onResetSample={onResetSample}
                  />
                </div>
              )}
            </div>

            {/* GROUP 2: DEVICE & FRAMING */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCollapse('device')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">Device & Framing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                    {finishLabel} · {scalePercent}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                      collapsed.device ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>
              </button>

              {!collapsed.device && (
                <div className="p-3 pt-0 border-t border-zinc-800/40 mt-1">
                  <DeviceSection
                    options={options}
                    update={update}
                    onOptionsChange={onOptionsChange}
                    onResetFrame={onResetFrame}
                  />
                </div>
              )}
            </div>

            {/* GROUP 3: CANVAS & BACKDROP */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCollapse('canvas')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">Canvas & Layout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800 capitalize">
                    {canvasPresetLabel} · {options.backgroundType}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                      collapsed.canvas ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>
              </button>

              {!collapsed.canvas && (
                <div className="p-3 pt-0 border-t border-zinc-800/40 mt-1">
                  <CanvasSection
                    options={options}
                    update={update}
                    onOptionsChange={onOptionsChange}
                  />
                </div>
              )}
            </div>

            {/* GROUP 4: DROP SHADOW */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCollapse('shadow')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">Drop Shadow</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      options.showShadow
                        ? 'text-zinc-300 bg-zinc-900 border-zinc-800'
                        : 'text-zinc-500 bg-zinc-950 border-zinc-900'
                    }`}
                  >
                    {shadowSummary}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                      collapsed.shadow ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>
              </button>

              {!collapsed.shadow && (
                <div className="p-3 pt-0 border-t border-zinc-800/40 mt-1">
                  <ShadowSection
                    options={options}
                    update={update}
                    onOptionsChange={onOptionsChange}
                  />
                </div>
              )}
            </div>

            {/* GROUP 5: STUDIO LIGHTING */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCollapse('lighting')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">Studio Lighting</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800 capitalize">
                    {lightingSummary}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                      collapsed.lighting ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>
              </button>

              {!collapsed.lighting && (
                <div className="p-3 pt-0 border-t border-zinc-800/40 mt-1">
                  <LightingSection options={options} update={update} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 3. Footer: Session Persistence & Factory Reset */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#0c0d10]/95 flex items-center justify-between mt-auto">
        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          Saved to browser
        </span>
        <button
          type="button"
          onClick={onResetAll}
          title="Reset all settings and custom screenshot back to factory defaults"
          className="text-[10px] text-zinc-500 hover:text-rose-400 flex items-center gap-1 font-mono transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-zinc-900"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Reset All</span>
        </button>
      </div>
    </aside>
  );
};
