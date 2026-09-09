import type { MockupOptions } from '../types';
import { PIXEL_9_PRO } from './pixel9pro';
import { PIXEL_FINISHES, getFinishColors } from './finishes';
import { CANVAS_PRESETS } from './presets';

/**
 * Renders the Pixel 9 Pro mockup onto an HTML5 2D Canvas with photorealistic studio lighting.
 */
export function renderMockup(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement | null,
  options: MockupOptions,
  scale: number = 1
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const deviceW = PIXEL_9_PRO.deviceWidth;
  const deviceH = PIXEL_9_PRO.deviceHeight;
  const buttonExtraW = PIXEL_9_PRO.buttons.power.width; // 4.5px protrusion

  const isPreset = options.canvasPreset && options.canvasPreset !== 'freeform';
  const isPureCutout = !isPreset && options.backgroundType === 'transparent' && !options.showShadow;

  let phoneX = 0;
  let phoneY = 0;
  let phoneScale = 1.0;
  let totalWidth = 0;
  let totalHeight = 0;

  if (isPreset) {
    const preset = CANVAS_PRESETS[options.canvasPreset];
    totalWidth = preset.width;
    totalHeight = preset.height;

    phoneScale = preset.defaultScale * (options.deviceScale || 1.0);
    const scaledW = deviceW * phoneScale;
    const scaledH = deviceH * phoneScale;

    const anchor = options.deviceAnchor || preset.defaultAnchor;
    const userOx = options.deviceOffsetX || 0;
    const userOy = options.deviceOffsetY || 0;

    if (anchor === 'bottom_bleed') {
      // Bottom Bleed: Anchors phone so bottom cuts off nicely, making screen large and legible
      phoneX = (totalWidth - scaledW) / 2 + userOx;
      phoneY = totalHeight - scaledH * 0.74 + userOy;
    } else if (anchor === 'right_split') {
      phoneX = totalWidth * 0.68 - scaledW / 2 + userOx;
      phoneY = (totalHeight - scaledH) / 2 + userOy;
    } else if (anchor === 'left_split') {
      phoneX = totalWidth * 0.32 - scaledW / 2 + userOx;
      phoneY = (totalHeight - scaledH) / 2 + userOy;
    } else {
      // center
      phoneX = (totalWidth - scaledW) / 2 + userOx;
      phoneY = (totalHeight - scaledH) / 2 + userOy;
    }
  } else if (isPureCutout) {
    // Exact tight phone crop: snaps strictly to phone edges with 4px anti-alias buffer
    const edgeMargin = 4;
    phoneX = edgeMargin;
    phoneY = edgeMargin;
    phoneScale = 1.0;
    totalWidth = deviceW + buttonExtraW + edgeMargin * 2;
    totalHeight = deviceH + edgeMargin * 2;
  } else {
    // Freeform: Symmetrical safety buffers ensuring the phone NEVER shifts when adjusting shadow offsets
    const blur = options.shadowBlur;
    const spread = Math.max(0, options.shadowSpread);
    const ox = options.shadowOffsetX;
    const oy = options.shadowOffsetY;

    // Generous buffer calculation ensuring diffused Gaussian falloff never clips on export
    const shadowReachX = options.showShadow ? Math.max(40, Math.abs(ox) + blur * 1.6 + spread + 40) : 0;
    const shadowReachY = options.showShadow ? Math.max(40, Math.abs(oy) + blur * 1.6 + spread + 40) : 0;

    const padX = options.padding + shadowReachX;
    const padY = options.padding + shadowReachY;

    phoneX = padX + (options.deviceOffsetX || 0);
    phoneY = padY + (options.deviceOffsetY || 0);
    phoneScale = options.deviceScale || 1.0;
    totalWidth = deviceW + buttonExtraW + padX * 2;
    totalHeight = deviceH + padY * 2;
  }

  // Resize canvas according to scale
  canvas.width = Math.round(totalWidth * scale);
  canvas.height = Math.round(totalHeight * scale);

  ctx.save();
  ctx.scale(scale, scale);

  // Clear canvas to 100% transparent alpha
  ctx.clearRect(0, 0, totalWidth, totalHeight);

  // 1. Draw Canvas Background (only for non-transparent backgrounds)
  if (options.backgroundType !== 'transparent') {
    drawBackground(ctx, totalWidth, totalHeight, options);
  }

  // Draw Phone with translated/scaled coordinate space
  ctx.save();
  ctx.translate(phoneX, phoneY);
  ctx.scale(phoneScale, phoneScale);

  // 2. Draw Multi-Stage Realistic Shadow (with zero-cut guarantees, disabled in pure cutout)
  if (options.showShadow && !isPureCutout) {
    drawRealisticShadow(ctx, 0, 0, deviceW, deviceH, options);
  }

  // 3. Draw Physical Button Silhouettes
  drawButtons(ctx, 0, 0, options);

  // 4. Draw Polished Metal Chassis & Anisotropic Corner Gleams
  drawMetalChassis(ctx, 0, 0, deviceW, deviceH, options);

  // 5. Draw Ultra-Thin OLED Display Bezel
  drawDisplayBezel(ctx, 0, 0, deviceW, deviceH);

  // 6. Draw User Screenshot (with pristine pixels in frame_only and flat modes)
  drawScreenContent(ctx, 0, 0, image, options);

  // 7. Draw 2.5D Curved Glass Perimeter Refraction
  if (options.glassEdgeRefraction && options.lightingScope !== 'flat') {
    drawGlassEdgeRefraction(ctx, 0, 0);
  }

  // 8. Draw Front Glass Specular Sheen (strictly disabled in frame_only and flat modes)
  if (
    options.lightingScope === 'full' &&
    options.showGlassGlare &&
    options.glareIntensity > 0
  ) {
    drawGlassGlare(ctx, 0, 0, options.glareIntensity, options.lightingPreset);
  }

  // 9. Draw Precision Camera Punch-Hole Optics & Micro-Etched Speaker Grill
  drawCameraAndSpeaker(ctx, 0, 0, options);

  // 10. Optional Material You Status Bar & Gesture Navigation Pill
  if (options.showStatusBar || options.showNavigationPill) {
    drawSystemUIOverlays(ctx, 0, 0, options);
  }

  ctx.restore(); // Restore phone transform
  ctx.restore(); // Restore global canvas scale
}

/**
 * Draws solid, gradient, or leaves transparent.
 */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: MockupOptions
) {
  if (options.backgroundType === 'solid') {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (options.backgroundType === 'gradient') {
    const angleRad = (options.gradientAngle * Math.PI) / 180;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.sqrt(cx * cx + cy * cy);

    const x0 = cx - Math.cos(angleRad) * r;
    const y0 = cy - Math.sin(angleRad) * r;
    const x1 = cx + Math.cos(angleRad) * r;
    const y1 = cy + Math.sin(angleRad) * r;

    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, options.gradientColorStart);
    grad.addColorStop(1, options.gradientColorEnd);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Deep fine-tunable studio shadow: tight contact occlusion + directional floor falloff + ambient glow.
 * Supports custom shadow colors, 0px hard shadows, and up to 350px ultra-soft studio dispersion.
 */
function drawRealisticShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  options: MockupOptions
) {
  const r = PIXEL_9_PRO.outerCornerRadius;
  const opacity = options.shadowOpacity ?? 0.45;
  const ox = options.shadowOffsetX ?? 0;
  const oy = options.shadowOffsetY ?? 30;
  const blur = options.shadowBlur ?? 60;
  const spread = options.shadowSpread ?? 4;
  const contactWeight = options.shadowContactIntensity ?? 0.65;
  const [sR, sG, sB] = hexToRgb(options.shadowColor || '#000000');

  if (opacity <= 0) return;

  // Expanded shadow footprint geometry based on spread
  const sx = x - spread;
  const sy = y - spread;
  const sw = Math.max(10, w + spread * 2);
  const sh = Math.max(10, h + spread * 2);
  const sr = Math.max(8, r + spread);

  ctx.save();

  // If blur is 0, draw crisp graphic poster shadow
  if (blur <= 0) {
    ctx.fillStyle = `rgba(${sR}, ${sG}, ${sB}, ${opacity * 0.8})`;
    ctx.beginPath();
    ctx.roundRect(sx + ox, sy + oy, sw, sh, sr);
    ctx.fill();
    ctx.restore();
    return;
  }

  // Stage 1: Tight Ambient Contact Occlusion (grounds the phone chassis)
  if (contactWeight > 0) {
    ctx.save();
    const contactBlur = Math.max(1, Math.min(24, blur * 0.18));
    ctx.filter = `blur(${contactBlur}px)`;
    ctx.fillStyle = `rgba(${sR}, ${sG}, ${sB}, ${opacity * 0.55 * contactWeight})`;
    ctx.beginPath();
    ctx.roundRect(x + ox * 0.12, y + Math.max(0, oy * 0.18), w, h, r);
    ctx.fill();
    ctx.restore();
  }

  // Stage 2: Primary Directional Floor Shadow (body falloff)
  ctx.save();
  const midBlur = Math.max(2, blur * 0.75);
  ctx.filter = `blur(${midBlur}px)`;
  ctx.fillStyle = `rgba(${sR}, ${sG}, ${sB}, ${opacity * 0.38})`;
  ctx.beginPath();
  ctx.roundRect(sx + ox * 0.65, sy + oy * 0.75, sw, sh, sr);
  ctx.fill();
  ctx.restore();

  // Stage 3: Soft Atmospheric Diffused Penumbra (broad dispersion)
  ctx.save();
  const wideBlur = Math.max(4, blur * 1.45);
  ctx.filter = `blur(${wideBlur}px)`;
  ctx.fillStyle = `rgba(${sR}, ${sG}, ${sB}, ${opacity * 0.25})`;
  ctx.beginPath();
  ctx.roundRect(sx + ox, sy + oy, sw, sh, sr);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/**
 * Physical button silhouettes with metallic edge highlight.
 */
function drawButtons(
  ctx: CanvasRenderingContext2D,
  devX: number,
  devY: number,
  options: MockupOptions
) {
  const finish = getFinishColors(options.finish, options.customFinishColor);
  const { power, volume } = PIXEL_9_PRO.buttons;

  ctx.save();

  // Metallic gradient on buttons matching chassis finish
  const btnGrad = ctx.createLinearGradient(devX + power.x, devY, devX + power.x + 5, devY);
  btnGrad.addColorStop(0, finish.frameShadow);
  btnGrad.addColorStop(0.4, finish.railCore);
  btnGrad.addColorStop(1, finish.frameHighlight);
  ctx.fillStyle = btnGrad;

  // Power button
  ctx.beginPath();
  ctx.roundRect(devX + power.x, devY + power.y, power.width, power.height, [0, power.radius, power.radius, 0]);
  ctx.fill();

  // Volume rocker
  ctx.beginPath();
  ctx.roundRect(devX + volume.x, devY + volume.y, volume.width, volume.height, [0, volume.radius, volume.radius, 0]);
  ctx.fill();

  ctx.restore();
}

/**
 * Polished metal frame with true-color foundation, delicate satin sheen, and specular chamfers.
 * STRICTLY CLIPPED to device geometry so NO white strokes or gleams can bleed into transparent space.
 */
function drawMetalChassis(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  options: MockupOptions
) {
  const finish = getFinishColors(options.finish, options.customFinishColor);
  const r = PIXEL_9_PRO.outerCornerRadius;
  const railW = PIXEL_9_PRO.metalRailThickness;
  const gleamInt = options.lightingScope === 'flat' ? 0 : (options.cornerGleamIntensity ?? 0.85);

  ctx.save();

  // CRITICAL: Strictly clip all metal frame drawing to exact phone outer radius
  // Prevents any outer stroke or corner gleam from leaking onto transparent canvases
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();

  // 1. Solid Base Body Color: Guarantees authentic color is NEVER lost or washed out
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = finish.railCore;
  ctx.fill();

  // 2. Soft Directional Anisotropic Satin Sheen (Low-contrast 20% modulation)
  // Replaces harsh white-to-black diagonal wash with natural studio key-light modulation
  if (options.lightingScope !== 'flat') {
    const satinGrad = ctx.createLinearGradient(x, y, x + w * 0.75, y + h * 0.95);
    satinGrad.addColorStop(0, finish.frameHighlight);
    satinGrad.addColorStop(0.25, finish.frameInner);
    satinGrad.addColorStop(0.55, finish.railCore);
    satinGrad.addColorStop(0.85, finish.frameOuter);
    satinGrad.addColorStop(1, finish.frameShadow);

    ctx.save();
    ctx.globalAlpha = 0.52; // Graceful blending preserves 100% of underlying hue
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = satinGrad;
    ctx.fill();
    ctx.restore();
  }

  // 3. Color-Tinted Corner Specular Accents (Tight 44px radius avoids washing out rail)
  if (gleamInt > 0) {
    // Top-Left Key Light Corner Gleam
    const tlGleam = ctx.createRadialGradient(x + 22, y + 22, 1, x + 22, y + 22, 46);
    tlGleam.addColorStop(0, finish.cornerGleam);
    tlGleam.addColorStop(0.45, 'rgba(255, 255, 255, 0.18)');
    tlGleam.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.save();
    ctx.globalAlpha = 0.65 * gleamInt;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = tlGleam;
    ctx.fill();
    ctx.restore();

    // Bottom-Right Ambient Bounce Corner Gleam
    const brGleam = ctx.createRadialGradient(x + w - 22, y + h - 22, 1, x + w - 22, y + h - 22, 42);
    brGleam.addColorStop(0, finish.cornerGleam);
    brGleam.addColorStop(0.45, 'rgba(255, 255, 255, 0.12)');
    brGleam.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.save();
    ctx.globalAlpha = 0.45 * gleamInt;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = brGleam;
    ctx.fill();
    ctx.restore();
  }

  // 4. Polished Outer Rim Mirror Chamfer (Hairline stroke inset 1px so it stays strictly inside rail)
  if (options.lightingScope !== 'flat') {
    ctx.beginPath();
    ctx.roundRect(x + 1, y + 1, w - 2, h - 2, Math.max(0, r - 1));
    ctx.lineWidth = 1.5;
    const rimGrad = ctx.createLinearGradient(x, y, x, y + h);
    rimGrad.addColorStop(0, finish.rimHighlight);
    rimGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.25)');
    rimGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.22)');
    rimGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.18)');
    rimGrad.addColorStop(1, finish.rimHighlight);
    ctx.strokeStyle = rimGrad;
    ctx.stroke();
  }

  // 5. Antenna Band Micro-Grooves
  ctx.fillStyle = finish.antennaBand;
  for (const band of PIXEL_9_PRO.antennaBands) {
    ctx.fillRect(x, y + band.y, railW, band.height);
    ctx.fillRect(x + w - railW, y + band.y, railW, band.height);

    // Specular highlight at antenna seam
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x, y + band.y - 0.75, railW, 0.75);
    ctx.fillRect(x + w - railW, y + band.y - 0.75, railW, 0.75);
    ctx.fillStyle = finish.antennaBand;
  }

  // 6. Inner Metal Lip Chamfer (Seam where metal meets display bezel)
  ctx.beginPath();
  ctx.roundRect(
    x + railW,
    y + railW,
    w - railW * 2,
    h - railW * 2,
    r - railW
  );
  ctx.lineWidth = 1;
  ctx.strokeStyle = finish.frameShadow;
  ctx.stroke();

  ctx.restore(); // Restores clip!
}

/**
 * Ultra-thin symmetrical deep OLED display bezel.
 */
function drawDisplayBezel(
  ctx: CanvasRenderingContext2D,
  devX: number,
  devY: number,
  w: number,
  h: number
) {
  const railW = PIXEL_9_PRO.metalRailThickness;
  const x = devX + railW;
  const y = devY + railW;
  const innerW = w - railW * 2;
  const innerH = h - railW * 2;
  const r = PIXEL_9_PRO.outerCornerRadius - railW;

  ctx.save();
  ctx.fillStyle = '#050608';
  ctx.beginPath();
  ctx.roundRect(x, y, innerW, innerH, r);
  ctx.fill();

  // Micro-shadow on inner edge of bezel
  ctx.lineWidth = 0.75;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.stroke();

  ctx.restore();
}

/**
 * 2.5D Curved Glass Perimeter Refraction (the glowing edge line around screen glass).
 */
function drawGlassEdgeRefraction(
  ctx: CanvasRenderingContext2D,
  devX: number,
  devY: number
) {
  const sx = devX + PIXEL_9_PRO.screenX;
  const sy = devY + PIXEL_9_PRO.screenY;
  const sw = PIXEL_9_PRO.screenWidth;
  const sh = PIXEL_9_PRO.screenHeight;
  const sr = PIXEL_9_PRO.screenCornerRadius;

  ctx.save();

  // Draw 1.5px glowing refraction perimeter
  const glassRefractGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh);
  glassRefractGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  glassRefractGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.15)');
  glassRefractGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
  glassRefractGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)');
  glassRefractGrad.addColorStop(1, 'rgba(255, 255, 255, 0.35)');

  ctx.beginPath();
  ctx.roundRect(sx, sy, sw, sh, sr);
  ctx.lineWidth = 1.0;
  ctx.strokeStyle = glassRefractGrad;
  ctx.stroke();

  ctx.restore();
}

/**
 * Clips and draws user screenshot with OLED physical depth vignette.
 */
function drawScreenContent(
  ctx: CanvasRenderingContext2D,
  devX: number,
  devY: number,
  image: HTMLImageElement | null,
  options: MockupOptions
) {
  const sx = devX + PIXEL_9_PRO.screenX;
  const sy = devY + PIXEL_9_PRO.screenY;
  const sw = PIXEL_9_PRO.screenWidth;
  const sh = PIXEL_9_PRO.screenHeight;
  const sr = PIXEL_9_PRO.screenCornerRadius;

  ctx.save();

  // Clean screen clipping path
  ctx.beginPath();
  ctx.roundRect(sx, sy, sw, sh, sr);
  ctx.clip();

  if (image && image.complete && image.naturalWidth > 0) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(sx, sy, sw, sh);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Scale and crop based on screenshotFit and screenshotOffsetY
    const imgRatio = image.naturalWidth / image.naturalHeight;
    const screenRatio = sw / sh;
    const fit = options.screenshotFit || 'cover';
    const panY = options.screenshotOffsetY || 0;

    let dw = sw;
    let dh = sh;
    let dx = sx;
    let dy = sy;

    if (fit === 'fill') {
      dw = sw;
      dh = sh;
      dx = sx;
      dy = sy;
    } else if (fit === 'contain') {
      if (imgRatio > screenRatio) {
        dw = sw;
        dh = sw / imgRatio;
        dx = sx;
        dy = sy + (sh - dh) / 2 + panY;
      } else {
        dh = sh;
        dw = sh * imgRatio;
        dx = sx + (sw - dw) / 2;
        dy = sy + panY;
      }
    } else {
      // Cover (center crop with pan)
      if (imgRatio > screenRatio) {
        dw = sh * imgRatio;
        dh = sh;
        dx = sx - (dw - sw) / 2;
        dy = sy + panY;
      } else {
        dh = sw / imgRatio;
        dw = sw;
        dx = sx;
        dy = sy - (dh - sh) / 2 + panY;
      }
    }

    ctx.drawImage(image, dx, dy, dw, dh);
  } else {
    // Elegant fallback wallpaper gradient
    const fallbackGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh);
    fallbackGrad.addColorStop(0, '#101522');
    fallbackGrad.addColorStop(0.4, '#090d16');
    fallbackGrad.addColorStop(1, '#04060a');
    ctx.fillStyle = fallbackGrad;
    ctx.fillRect(sx, sy, sw, sh);

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1.5;
    for (let py = sy; py < sy + sh; py += 75) {
      ctx.beginPath();
      ctx.moveTo(sx, py);
      ctx.lineTo(sx + sw, py);
      ctx.stroke();
    }
  }

  // OLED Physical Depth: only applied in full lighting mode so pixels stay pristine in frame_only and flat
  if (options.lightingScope === 'full') {
    ctx.beginPath();
    ctx.roundRect(sx, sy, sw, sh, sr);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Front glass specular sheen (soft diagonal light streak with lighting presets).
 */
function drawGlassGlare(
  ctx: CanvasRenderingContext2D,
  devX: number,
  devY: number,
  intensity: number,
  preset: string
) {
  const sx = devX + PIXEL_9_PRO.screenX;
  const sy = devY + PIXEL_9_PRO.screenY;
  const sw = PIXEL_9_PRO.screenWidth;
  const sh = PIXEL_9_PRO.screenHeight;
  const sr = PIXEL_9_PRO.screenCornerRadius;

  ctx.save();

  // Clip to screen curvature
  ctx.beginPath();
  ctx.roundRect(sx, sy, sw, sh, sr);
  ctx.clip();

  ctx.globalCompositeOperation = 'screen';

  const alpha = Math.min(1, Math.max(0, intensity * 0.36));

  if (preset === 'dramatic') {
    // High-contrast sharp diagonal streak
    const glareGrad = ctx.createLinearGradient(sx, sy, sx + sw * 0.8, sy + sh * 0.5);
    glareGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
    glareGrad.addColorStop(0.12, `rgba(255, 255, 255, ${alpha * 0.3})`);
    glareGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glareGrad;
    ctx.fillRect(sx, sy, sw, sh);
  } else if (preset === 'golden') {
    // Warm golden hour reflection
    const glareGrad = ctx.createLinearGradient(sx - sw * 0.1, sy, sx + sw * 1.1, sy + sh * 0.6);
    glareGrad.addColorStop(0, `rgba(255, 230, 180, ${alpha * 0.7})`);
    glareGrad.addColorStop(0.25, `rgba(255, 210, 150, ${alpha * 0.4})`);
    glareGrad.addColorStop(0.5, 'rgba(255, 200, 120, 0)');
    ctx.fillStyle = glareGrad;
    ctx.fillRect(sx, sy, sw, sh);
  } else if (preset === 'neon') {
    // Electric cyber dual-tone sheen
    const glareGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh * 0.7);
    glareGrad.addColorStop(0, `rgba(56, 189, 248, ${alpha * 0.6})`);
    glareGrad.addColorStop(0.3, `rgba(168, 85, 247, ${alpha * 0.4})`);
    glareGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glareGrad;
    ctx.fillRect(sx, sy, sw, sh);
  } else {
    // Default Studio Clean
    const glareGrad = ctx.createLinearGradient(
      sx - sw * 0.2,
      sy,
      sx + sw * 1.2,
      sy + sh * 0.65
    );
    glareGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.6})`);
    glareGrad.addColorStop(0.18, `rgba(255, 255, 255, ${alpha})`);
    glareGrad.addColorStop(0.35, `rgba(255, 255, 255, ${alpha * 0.3})`);
    glareGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glareGrad;
    ctx.fillRect(sx, sy, sw, sh);
  }

  // Top-edge curved glass specular highlight
  const topEdgeGrad = ctx.createLinearGradient(sx, sy, sx, sy + 25);
  topEdgeGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.45})`);
  topEdgeGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = topEdgeGrad;
  ctx.fillRect(sx, sy, sw, 25);

  ctx.restore();
}

/**
 * Precision camera punch-hole with iridescent coating, dual glints & micro-etched speaker.
 */
function drawCameraAndSpeaker(
  ctx: CanvasRenderingContext2D,
  devX: number,
  devY: number,
  options: MockupOptions
) {
  const finish = getFinishColors(options.finish, options.customFinishColor);
  const { camera, speakerGrill } = PIXEL_9_PRO;

  ctx.save();

  // 1. Micro-Etched Speaker Earpiece Grill
  const spX = devX + speakerGrill.cx - speakerGrill.width / 2;
  const spY = devY + speakerGrill.y;
  ctx.beginPath();
  ctx.roundRect(spX, spY, speakerGrill.width, speakerGrill.height, speakerGrill.radius);
  ctx.fillStyle = '#06070a';
  ctx.fill();

  // Metallic micro-highlight on speaker lip
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // 2. Camera Punch Hole Assembly
  if (options.showCameraOptics) {
    const cx = devX + camera.cx;
    const cy = devY + camera.cy;

    // Outer aperture ring (matching hardware frame bezel)
    ctx.beginPath();
    ctx.arc(cx, cy, camera.outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = finish.punchHoleRing;
    ctx.fill();

    // Secondary aperture bevel step
    ctx.beginPath();
    ctx.arc(cx, cy, camera.apertureRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#020304';
    ctx.fill();

    // Inner dark sensor pupil core
    ctx.beginPath();
    ctx.arc(cx, cy, camera.lensRadius, 0, Math.PI * 2);
    ctx.fillStyle = finish.punchHoleLens;
    ctx.fill();

    // Iridescent anti-reflective coating sheen (sapphire / emerald tint)
    const coatingGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, camera.lensRadius);
    coatingGrad.addColorStop(0, finish.cameraCoatingTint);
    coatingGrad.addColorStop(0.7, 'rgba(10, 14, 24, 0.95)');
    coatingGrad.addColorStop(1, 'rgba(4, 5, 8, 1)');
    ctx.beginPath();
    ctx.arc(cx, cy, camera.lensRadius - 0.5, 0, Math.PI * 2);
    ctx.fillStyle = coatingGrad;
    ctx.fill();

    // Primary Specular Key Light Glint (crisp sharp catchlight)
    const refX = cx + camera.reflectionOffset.x;
    const refY = cy + camera.reflectionOffset.y;
    const dotGrad = ctx.createRadialGradient(refX, refY, 0.5, refX, refY, camera.reflectionRadius);
    dotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    dotGrad.addColorStop(0.4, 'rgba(180, 220, 255, 0.5)');
    dotGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.beginPath();
    ctx.arc(refX, refY, camera.reflectionRadius, 0, Math.PI * 2);
    ctx.fillStyle = dotGrad;
    ctx.fill();

    // Secondary Soft Ambient Bounce Glint (opposite side, gives lens glass spherical depth)
    const secX = cx + camera.secondaryReflectionOffset.x;
    const secY = cy + camera.secondaryReflectionOffset.y;
    const secGrad = ctx.createRadialGradient(secX, secY, 0.2, secX, secY, camera.secondaryReflectionRadius);
    secGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    secGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.beginPath();
    ctx.arc(secX, secY, camera.secondaryReflectionRadius, 0, Math.PI * 2);
    ctx.fillStyle = secGrad;
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws crisp Material You status bar & bottom navigation gesture pill.
 */
function drawSystemUIOverlays(
  ctx: CanvasRenderingContext2D,
  devX: number,
  devY: number,
  options: MockupOptions
) {
  const sx = devX + PIXEL_9_PRO.screenX;
  const sy = devY + PIXEL_9_PRO.screenY;
  const sw = PIXEL_9_PRO.screenWidth;
  const sh = PIXEL_9_PRO.screenHeight;

  const isLightIcons = options.statusBarTheme === 'light' || options.statusBarTheme === 'auto';
  const iconColor = isLightIcons ? '#ffffff' : '#0f172a';

  ctx.save();

  // 1. Pristine Status Bar (Top)
  if (options.showStatusBar) {
    const timeText = options.statusBarTime || '9:41';
    const topY = sy + 40;

    // Time on the Left
    ctx.font = '600 23px -apple-system, BlinkMacSystemFont, "Google Sans", "Roboto", sans-serif';
    ctx.fillStyle = iconColor;
    ctx.textBaseline = 'middle';
    ctx.fillText(timeText, sx + 50, topY);

    // Right Icons: Wi-Fi, Cellular, Battery
    const rightMargin = sx + sw - 52;

    // Battery Body
    const battW = 32;
    const battH = 16;
    const battX = rightMargin - battW;
    const battY = topY - battH / 2;

    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.roundRect(battX, battY, battW, battH, 3.5);
    ctx.stroke();

    // Battery terminal
    ctx.fillStyle = iconColor;
    ctx.beginPath();
    ctx.roundRect(battX + battW + 1, battY + 4.5, 2, 7, 1);
    ctx.fill();

    // Battery 100% fill
    ctx.fillStyle = iconColor;
    ctx.beginPath();
    ctx.roundRect(battX + 3, battY + 3, battW - 6, battH - 6, 1.5);
    ctx.fill();

    // Cellular Bars (4 bars)
    const cellX = battX - 34;
    const barW = 3.5;
    const barGap = 2.5;
    const maxBarH = 15;
    for (let i = 0; i < 4; i++) {
      const h = (maxBarH / 4) * (i + 1);
      ctx.fillStyle = iconColor;
      ctx.beginPath();
      ctx.roundRect(cellX + i * (barW + barGap), topY + (maxBarH / 2) - h, barW, h, 1);
      ctx.fill();
    }

    // Wi-Fi Icon Arcs
    const wifiX = cellX - 26;
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let arc = 0; arc < 3; arc++) {
      const radius = 5 + arc * 4.5;
      ctx.beginPath();
      ctx.arc(wifiX, topY + 5, radius, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.stroke();
    }
    // Wi-Fi center dot
    ctx.fillStyle = iconColor;
    ctx.beginPath();
    ctx.arc(wifiX, topY + 5, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Bottom Navigation Gesture Pill
  if (options.showNavigationPill) {
    const pillW = 140;
    const pillH = 5;
    const pillX = sx + (sw - pillW) / 2;
    const pillY = sy + sh - 22;

    ctx.fillStyle = isLightIcons ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 2.5);
    ctx.fill();
  }

  ctx.restore();
}
