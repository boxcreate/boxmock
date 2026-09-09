import React, { useState, useEffect, useCallback } from 'react';
import type { MockupOptions } from './types';
import { Header } from './components/Header';
import { ControlsPanel } from './components/ControlsPanel';
import { CanvasPreview } from './components/CanvasPreview';
import { createSampleScreenshot } from './components/SampleScreenshot';
import { exportMockupPNG, copyMockupToClipboard } from './engine/exporter';
import {
  saveOptions,
  loadOptions,
  clearOptions,
  saveCustomScreenshot,
  loadCustomScreenshot,
  clearCustomScreenshot,
} from './engine/storage';

const DEFAULT_OPTIONS: MockupOptions = {
  finish: 'obsidian',
  customFinishColor: '#3b82f6',
  lightingPreset: 'studio',
  lightingScope: 'full',
  showGlassGlare: true,
  glareIntensity: 0.35,
  cornerGleamIntensity: 0.85,
  glassEdgeRefraction: true,
  showCameraOptics: true,
  showShadow: false,
  shadowOpacity: 0.65,
  shadowBlur: 60,
  shadowOffsetY: 30,
  shadowOffsetX: 0,
  shadowSpread: 5,
  shadowColor: '#000000',
  shadowContactIntensity: 0.65,
  backgroundType: 'transparent',
  backgroundColor: '#090a0f',
  gradientAngle: 135,
  gradientColorStart: '#090a0f',
  gradientColorEnd: '#1a1f2c',
  padding: 0,
  exportScale: 2,
  tightCrop: true,
  previewBackdrop: 'light-checker',
  previewColor: '#1e293b',
  canvasPreset: 'freeform',
  deviceScale: 1.0,
  deviceOffsetX: 0,
  deviceOffsetY: 0,
  deviceAnchor: 'center',
  screenshotFit: 'cover',
  screenshotOffsetY: 0,
  showStatusBar: false,
  statusBarTime: '9:41',
  statusBarTheme: 'auto',
  showNavigationPill: false,
  exportFormat: 'png',
  exportQuality: 0.95,
};

export const BoxmockApp: React.FC = () => {
  // Auto-restore saved options from localStorage on initial load
  const [options, setOptions] = useState<MockupOptions>(() => loadOptions(DEFAULT_OPTIONS));
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [hasCustomImage, setHasCustomImage] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Restore saved custom screenshot from IndexedDB, or fallback to sample
  useEffect(() => {
    let isMounted = true;
    async function restoreSession() {
      try {
        const savedDataUrl = await loadCustomScreenshot();
        if (savedDataUrl && isMounted) {
          const img = new Image();
          img.onload = () => {
            if (isMounted) {
              setImage(img);
              setHasCustomImage(true);
            }
          };
          img.src = savedDataUrl;
          return;
        }
      } catch (err) {
        console.warn('Could not restore custom screenshot:', err);
      }

      if (isMounted) {
        const sample = await createSampleScreenshot();
        if (isMounted) {
          setImage(sample);
          setHasCustomImage(false);
        }
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-save options to localStorage whenever options change (debounced 250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveOptions(options);
    }, 250);
    return () => clearTimeout(timer);
  }, [options]);

  // Ensure options are saved immediately on page unload / refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveOptions(options);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [options]);

  // Reset to initial sample UI screenshot (clears custom screenshot from storage)
  const loadSample = useCallback(async () => {
    await clearCustomScreenshot();
    const sample = await createSampleScreenshot();
    setImage(sample);
    setHasCustomImage(false);
  }, []);

  // Reset Frame: restores phone anchor, scale, and X/Y offsets back to pristine center
  const handleResetFrame = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      deviceAnchor: 'center',
      deviceScale: 1.0,
      deviceOffsetX: 0,
      deviceOffsetY: 0,
      screenshotOffsetY: 0,
      screenshotFit: 'cover',
    }));
  }, []);

  // Reset All: restores all settings to default options and resets sample
  const handleResetAll = useCallback(async () => {
    clearOptions();
    await clearCustomScreenshot();
    setOptions(DEFAULT_OPTIONS);
    const sample = await createSampleScreenshot();
    setImage(sample);
    setHasCustomImage(false);
  }, []);

  // Load image from File & persist to IndexedDB
  const handleFileLoad = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        const dataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setHasCustomImage(true);
          saveCustomScreenshot(dataUrl);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle file input change
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileLoad(e.target.files[0]);
    }
  };

  // Global paste handler (Cmd+V / Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileLoad(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFileLoad]);

  // Copy mockup handler
  const handleCopy = useCallback(async () => {
    try {
      await copyMockupToClipboard(image, options);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  }, [image, options]);

  // Global copy shortcut (Cmd+C / Ctrl+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'c' || e.key === 'C')) {
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        e.preventDefault();
        handleCopy();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCopy]);

  // Trigger export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportMockupPNG(image, options);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Top Header */}
      <Header
        image={image}
        options={options}
        onOptionsChange={setOptions}
        onExport={handleExport}
        onResetFrame={handleResetFrame}
        onCopy={handleCopy}
        copied={copied}
        isExporting={isExporting}
      />

      {/* Main Studio Viewport */}
      <div className="flex flex-1 overflow-hidden relative">
        <ControlsPanel
          options={options}
          onOptionsChange={setOptions}
          onImageUpload={handleImageUpload}
          hasCustomImage={hasCustomImage}
          onResetSample={loadSample}
          onResetFrame={handleResetFrame}
          onResetAll={handleResetAll}
        />

        <CanvasPreview
          image={image}
          options={options}
          onOptionsChange={setOptions}
          onFileDrop={handleFileLoad}
        />
      </div>
    </div>
  );
};

export default BoxmockApp;
