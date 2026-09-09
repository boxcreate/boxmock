import type { MockupOptions } from '../types';
import { renderMockup } from './renderer';

/**
 * Generates and triggers high-resolution image download (PNG, JPEG, WebP).
 */
export async function exportMockupFile(
  image: HTMLImageElement | null,
  options: MockupOptions
): Promise<void> {
  const offscreen = document.createElement('canvas');
  const scale = options.exportScale;

  renderMockup(offscreen, image, options, scale);

  // When background is transparent, JPEG cannot be used as it does not support alpha (flattening to solid black/white)
  let format = options.exportFormat || 'png';
  if (options.backgroundType === 'transparent' && format === 'jpeg') {
    format = 'png';
  }

  let mimeType = 'image/png';
  let ext = 'png';
  const quality = options.exportQuality || 0.95;

  if (format === 'jpeg') {
    mimeType = 'image/jpeg';
    ext = 'jpg';
  } else if (format === 'webp') {
    mimeType = 'image/webp';
    ext = 'webp';
  }

  return new Promise((resolve, reject) => {
    offscreen.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const presetTag = options.canvasPreset && options.canvasPreset !== 'freeform' ? `-${options.canvasPreset}` : '';
        const filename = `boxmock-pixel9pro${presetTag}-${options.finish}-${scale}x-${Date.now()}.${ext}`;

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        resolve();
      },
      mimeType,
      quality
    );
  });
}

/**
 * Backwards compatibility alias for exportMockupPNG.
 */
export const exportMockupPNG = exportMockupFile;

/**
 * Copies the high-resolution rendered mockup directly to the OS clipboard.
 * If 4x exceeds OS clipboard payload limits, gracefully retries at razor-sharp 2x.
 */
export async function copyMockupToClipboard(
  image: HTMLImageElement | null,
  options: MockupOptions
): Promise<void> {
  const scale = options.exportScale;
  const offscreen = document.createElement('canvas');
  renderMockup(offscreen, image, options, scale);

  return new Promise((resolve, reject) => {
    offscreen.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Canvas toBlob failed'));
        return;
      }

      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        resolve();
      } catch (err) {
        // If 4x failed due to OS clipboard size limits, gracefully retry at 2x
        if (scale > 2) {
          try {
            const fallbackCanvas = document.createElement('canvas');
            renderMockup(fallbackCanvas, image, options, 2);
            fallbackCanvas.toBlob(async (fallbackBlob) => {
              if (fallbackBlob) {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': fallbackBlob }),
                ]);
                resolve();
              } else {
                reject(err);
              }
            }, 'image/png');
            return;
          } catch {
            reject(err);
            return;
          }
        }
        reject(err);
      }
    }, 'image/png');
  });
}
