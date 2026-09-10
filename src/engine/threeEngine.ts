import * as THREE from 'three';
import type { MockupOptions } from '../types';
import { getFinishColors } from './finishes';
import { CANVAS_PRESETS } from './presets';

// Reusable WebGL Renderer instance to prevent WebGL context exhaustion
let sharedRenderer: THREE.WebGLRenderer | null = null;
let sharedStudioEnv: THREE.Texture | null = null;

function getWebGLRenderer(width: number, height: number): THREE.WebGLRenderer {
  if (!sharedRenderer) {
    const canvas = document.createElement('canvas');
    sharedRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    sharedRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    sharedRenderer.toneMappingExposure = 1.05;
    sharedRenderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  sharedRenderer.setSize(width, height, false);
  return sharedRenderer;
}

/**
 * Builds a dynamic high-fidelity studio environment map using PMREMGenerator.
 * Provides soft overhead key softboxes and side reflectors for authentic metal rail reflections.
 */
function getStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  if (sharedStudioEnv) return sharedStudioEnv;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  // Neutral dark studio ambient background
  const bg = ctx.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, '#505663');
  bg.addColorStop(0.3, '#252932');
  bg.addColorStop(0.7, '#15171e');
  bg.addColorStop(1, '#090a0d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 512);

  // Large overhead studio softbox strip (gleams along top rail and chamfers)
  const softbox = ctx.createLinearGradient(180, 20, 844, 20);
  softbox.addColorStop(0, 'rgba(255, 255, 255, 0)');
  softbox.addColorStop(0.25, 'rgba(255, 252, 246, 0.96)');
  softbox.addColorStop(0.75, 'rgba(255, 252, 246, 0.96)');
  softbox.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = softbox;
  ctx.fillRect(160, 15, 704, 110);

  // Key light reflector (left side rail gleam)
  const leftReflector = ctx.createLinearGradient(30, 120, 150, 120);
  leftReflector.addColorStop(0, 'rgba(230, 240, 255, 0.85)');
  leftReflector.addColorStop(1, 'rgba(230, 240, 255, 0)');
  ctx.fillStyle = leftReflector;
  ctx.fillRect(30, 80, 120, 320);

  // Rim light reflector (right rail gleam)
  const rightReflector = ctx.createLinearGradient(874, 120, 994, 120);
  rightReflector.addColorStop(0, 'rgba(255, 240, 230, 0)');
  rightReflector.addColorStop(1, 'rgba(255, 240, 230, 0.8)');
  ctx.fillStyle = rightReflector;
  ctx.fillRect(874, 80, 120, 320);

  const envTex = new THREE.CanvasTexture(c);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  sharedStudioEnv = pmrem.fromEquirectangular(envTex).texture;
  pmrem.dispose();
  envTex.dispose();

  return sharedStudioEnv;
}

/**
 * Creates a 2D rounded rectangle shape for Three.js geometry.
 */
function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

/**
 * Renders the front display screen texture onto an offscreen canvas.
 * Uses exact 2D pixel math for screenshot fitting (cover, contain, fill) and vertical panning.
 */
function createScreenCanvas(
  image: HTMLImageElement | null,
  options: MockupOptions
): HTMLCanvasElement {
  // Ultra-crisp 2x retina screen texture (Pixel 9 Pro screen is 948 x 2070)
  const sw = 948 * 2; // 1896
  const sh = 2070 * 2; // 4140

  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = sw;
  screenCanvas.height = sh;
  const sCtx = screenCanvas.getContext('2d');
  if (!sCtx) return screenCanvas;

  // 1. OLED True-Black Base
  sCtx.fillStyle = '#050608';
  sCtx.fillRect(0, 0, sw, sh);

  // 2. User Screenshot Content (exact crop, scale, and pan)
  if (image && image.complete && image.naturalWidth > 0) {
    const imgW = image.naturalWidth || image.width;
    const imgH = image.naturalHeight || image.height;
    const imgRatio = imgW / imgH;
    const screenRatio = sw / sh;
    const fit = options.screenshotFit || 'cover';
    const userPanY = ((options.screenshotOffsetY || 0) / 100) * sh;

    let dw = sw;
    let dh = sh;
    let dx = 0;
    let dy = 0;

    if (fit === 'fill') {
      dw = sw;
      dh = sh;
      dx = 0;
      dy = 0;
    } else if (fit === 'contain') {
      if (imgRatio > screenRatio) {
        dw = sw;
        dh = sw / imgRatio;
        dx = 0;
        dy = (sh - dh) / 2 + userPanY;
      } else {
        dh = sh;
        dw = sh * imgRatio;
        dx = (sw - dw) / 2;
        dy = userPanY;
      }
    } else {
      // Cover (center crop with pan)
      if (imgRatio > screenRatio) {
        dw = sh * imgRatio;
        dh = sh;
        dx = -(dw - sw) / 2;
        dy = userPanY;
      } else {
        dh = sw / imgRatio;
        dw = sw;
        dx = 0;
        dy = -(dh - sh) / 2 + userPanY;
      }
    }

    sCtx.save();
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(image, dx, dy, dw, dh);

    // Subtle OLED edge shadow vignette
    const vig = sCtx.createRadialGradient(
      sw / 2,
      sh / 2,
      sh * 0.42,
      sw / 2,
      sh / 2,
      sh * 0.72
    );
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
    sCtx.fillStyle = vig;
    sCtx.fillRect(0, 0, sw, sh);
    sCtx.restore();
  }

  // 3. Precision Punch-Hole Camera Optics
  if (options.showCameraOptics) {
    const cx = sw / 2;
    const cy = 76;
    const outerR = 32;
    const lensR = 22;

    sCtx.save();
    // Dark outer bezel ring
    sCtx.fillStyle = '#05070a';
    sCtx.beginPath();
    sCtx.arc(cx, cy, outerR, 0, Math.PI * 2);
    sCtx.fill();

    // Metallic trim ring
    sCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    sCtx.lineWidth = 2;
    sCtx.stroke();

    // Deep coated glass lens
    const lensGrad = sCtx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, lensR);
    lensGrad.addColorStop(0, '#121a2d');
    lensGrad.addColorStop(0.7, '#070b14');
    lensGrad.addColorStop(1, '#020305');
    sCtx.fillStyle = lensGrad;
    sCtx.beginPath();
    sCtx.arc(cx, cy, lensR, 0, Math.PI * 2);
    sCtx.fill();

    // Specular reflection glint
    sCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    sCtx.beginPath();
    sCtx.arc(cx + 6, cy - 6, 6, 0, Math.PI * 2);
    sCtx.fill();
    sCtx.restore();
  }

  // 4. Optional Material You Status Bar & Gesture Navigation Pill
  if (options.showStatusBar) {
    sCtx.save();
    const timeText = options.statusBarTime || '9:41';
    sCtx.fillStyle = options.statusBarTheme === 'dark' ? '#000000' : '#ffffff';
    sCtx.font = '600 52px sans-serif';
    sCtx.textAlign = 'left';
    sCtx.textBaseline = 'middle';
    sCtx.fillText(timeText, 80, 76);

    // Battery & Wi-Fi indicator
    sCtx.textAlign = 'right';
    sCtx.font = '500 40px sans-serif';
    sCtx.fillText('5G  100%', sw - 80, 76);
    sCtx.restore();
  }

  if (options.showNavigationPill) {
    sCtx.save();
    const pillW = 400;
    const pillH = 16;
    const pillX = (sw - pillW) / 2;
    const pillY = sh - 56;
    sCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    sCtx.beginPath();
    sCtx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    sCtx.fill();
    sCtx.restore();
  }

  // 5. Specular Front Glass Sheen (drawn directly onto screen canvas, avoiding coplanar Z-fighting)
  if (options.showGlassGlare && options.glareIntensity > 0) {
    sCtx.save();
    const glareGrad = sCtx.createLinearGradient(0, 0, sw, sh);
    const alpha = (options.glareIntensity || 0.35) * 0.22;
    glareGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    glareGrad.addColorStop(0.28, `rgba(255, 255, 255, ${alpha * 0.35})`);
    glareGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0)');
    sCtx.fillStyle = glareGrad;
    sCtx.fillRect(0, 0, sw, sh);
    sCtx.restore();
  }

  return screenCanvas;
}

/**
 * Builds the complete 3D Google Pixel 9 Pro model with hollow frame to eliminate Z-fighting,
 * authentic PBR metallic rails, tactile side buttons, rear camera visor bar, and screen mesh.
 */
export function createPixel9ProMesh(
  image: HTMLImageElement | null,
  options: MockupOptions
): THREE.Group {
  const root = new THREE.Group();
  const finish = getFinishColors(options.finish, options.customFinishColor);

  // Proportional 3D units (matching Pixel 9 Pro: 1000 x 2122 x 85)
  const phoneW = 10.0;
  const phoneH = 21.22;
  const phoneD = 0.86;
  const cornerR = 1.16;

  const screenW = 9.48;
  const screenH = 20.70;
  const screenR = 0.90;

  // --- 1. Polished Metal Chassis Frame (WITH HOLE to eliminate coplanar Z-fighting) ---
  const chassisShape = createRoundedRectShape(phoneW, phoneH, cornerR);
  // Cutout hole for screen so chassis has ZERO faces behind the display screen
  const screenHole = createRoundedRectShape(screenW, screenH, screenR);
  chassisShape.holes.push(screenHole);

  const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, {
    depth: phoneD,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  });
  chassisGeo.center();

  const metalColor = new THREE.Color(finish.railCore);
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: metalColor,
    metalness: 0.90,
    roughness: 0.16,
    envMapIntensity: 1.4,
    side: THREE.FrontSide,
  });

  const bodyMesh = new THREE.Mesh(chassisGeo, metalMaterial);
  root.add(bodyMesh);

  // --- 2. Matte Frosted Glass Rear Backplate ---
  const backShape = createRoundedRectShape(phoneW - 0.1, phoneH - 0.1, cornerR - 0.05);
  const backGeo = new THREE.ShapeGeometry(backShape);
  const backMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(finish.frameInner),
    metalness: 0.15,
    roughness: 0.38,
    side: THREE.FrontSide,
  });
  const backMesh = new THREE.Mesh(backGeo, backMaterial);
  backMesh.position.z = -(phoneD / 2 + 0.051);
  backMesh.rotation.y = Math.PI; // Faces strictly backwards
  root.add(backMesh);

  // --- 3. Distinctive Pixel 9 Pro Rear Camera Visor Island ---
  const visorW = 9.2;
  const visorH = 3.1;
  const visorD = 0.32;
  const visorR = 1.55; // Symmetrical pill cap
  const visorY = 5.3;

  const visorShape = createRoundedRectShape(visorW, visorH, visorR);
  const visorGeo = new THREE.ExtrudeGeometry(visorShape, {
    depth: visorD,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  });
  visorGeo.center();

  const visorMesh = new THREE.Mesh(visorGeo, metalMaterial);
  visorMesh.position.set(0, visorY, -(phoneD / 2 + 0.05 + visorD / 2));
  root.add(visorMesh);

  // Visor Dark Glass Insert with 3 Camera Lenses
  const visorGlassShape = createRoundedRectShape(visorW - 0.36, visorH - 0.36, visorR - 0.18);
  const visorGlassGeo = new THREE.ShapeGeometry(visorGlassShape);
  const visorGlassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#07080b'),
    metalness: 0.3,
    roughness: 0.04,
    side: THREE.FrontSide,
  });
  const visorGlassMesh = new THREE.Mesh(visorGlassGeo, visorGlassMat);
  visorGlassMesh.position.set(0, visorY, -(phoneD / 2 + 0.05 + visorD + 0.041));
  visorGlassMesh.rotation.y = Math.PI;
  root.add(visorGlassMesh);

  // --- 4. Tactile Side Buttons on Right Rail ---
  const buttonGeo = (btnW: number, btnH: number) => {
    const s = createRoundedRectShape(btnW, btnH, 0.05);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    g.center();
    return g;
  };

  // Power button (upper right)
  const powerMesh = new THREE.Mesh(buttonGeo(0.12, 1.1), metalMaterial);
  powerMesh.position.set(phoneW / 2 + 0.11, 4.8, 0);
  root.add(powerMesh);

  // Volume rocker (lower right)
  const volumeMesh = new THREE.Mesh(buttonGeo(0.12, 2.3), metalMaterial);
  volumeMesh.position.set(phoneW / 2 + 0.11, 2.7, 0);
  root.add(volumeMesh);

  // --- 5. Front OLED Display Screen ---
  // Sits cleanly inside the chassis hole with zero coplanar overlapping geometry
  const screenShapeObj = createRoundedRectShape(screenW, screenH, screenR);
  const screenGeo = new THREE.ShapeGeometry(screenShapeObj);

  // Map UVs across rounded screen geometry (0 to 1)
  const pos = screenGeo.attributes.position;
  const uvs: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const u = (x + screenW / 2) / screenW;
    const v = (y + screenH / 2) / screenH;
    uvs.push(u, v);
  }
  screenGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  // Render screenshot onto offscreen canvas texture
  const screenCanvas = createScreenCanvas(image, options);
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
  screenTexture.magFilter = THREE.LinearFilter;
  screenTexture.generateMipmaps = true;

  // OLED Screen: unlit basic material guarantees 100% color fidelity
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTexture,
    toneMapped: false,
    side: THREE.FrontSide,
  });

  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  // Position flush with the front of the frame
  screenMesh.position.z = phoneD / 2 + 0.025;
  root.add(screenMesh);

  return root;
}

/**
 * Creates a photorealistic 3D studio floor shadow plane beneath the floating phone.
 */
function createStudioShadowPlane(
  options: MockupOptions
): THREE.Mesh | null {
  if (!options.showShadow) return null;

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 512;
  shadowCanvas.height = 512;
  const sCtx = shadowCanvas.getContext('2d');
  if (!sCtx) return null;

  const opacity = options.shadowOpacity ?? 0.55;

  // Multi-stop radial studio shadow falloff
  const grad = sCtx.createRadialGradient(256, 256, 40, 256, 256, 250);
  grad.addColorStop(0, `rgba(0, 0, 0, ${opacity * 0.95})`);
  grad.addColorStop(0.3, `rgba(0, 0, 0, ${opacity * 0.6})`);
  grad.addColorStop(0.65, `rgba(0, 0, 0, ${opacity * 0.2})`);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  sCtx.fillStyle = grad;
  sCtx.beginPath();
  sCtx.arc(256, 256, 250, 0, Math.PI * 2);
  sCtx.fill();

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(32, 44);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: opacity,
    depthWrite: false,
  });

  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2; // Flat on the floor
  return shadowMesh;
}

/**
 * Renders the 3D Pixel 9 Pro scene with Three.js WebGL and outputs onto an HTMLCanvasElement.
 */
export function renderMockup3D(
  targetCanvas: HTMLCanvasElement,
  image: HTMLImageElement | null,
  options: MockupOptions,
  scale: number = 1
): void {
  const isPreset = options.canvasPreset && options.canvasPreset !== 'freeform';

  // Symmetrical canvas dimensions matching 2D coordinate space
  let canvasW = 1200;
  let canvasH = 2320;

  if (isPreset) {
    const preset = CANVAS_PRESETS[options.canvasPreset];
    canvasW = preset.width;
    canvasH = preset.height;
  } else if (options.tightCrop && options.backgroundType === 'transparent') {
    canvasW = 1100;
    canvasH = 2220;
  } else {
    // Freeform
    const pad = options.padding || 50;
    canvasW = 1000 + pad * 2 + 120;
    canvasH = 2122 + pad * 2 + 120;
  }

  const renderW = Math.round(canvasW * scale);
  const renderH = Math.round(canvasH * scale);

  targetCanvas.width = renderW;
  targetCanvas.height = renderH;

  const tCtx = targetCanvas.getContext('2d');
  if (!tCtx) return;

  // Clear target canvas
  tCtx.clearRect(0, 0, renderW, renderH);

  // 1. Draw 2D Background (solid color or linear gradient)
  if (options.backgroundType === 'solid') {
    tCtx.fillStyle = options.backgroundColor;
    tCtx.fillRect(0, 0, renderW, renderH);
  } else if (options.backgroundType === 'gradient') {
    const rad = ((options.gradientAngle || 135) * Math.PI) / 180;
    const cx = renderW / 2;
    const cy = renderH / 2;
    const r = Math.sqrt(cx * cx + cy * cy);
    const grad = tCtx.createLinearGradient(
      cx - Math.cos(rad) * r,
      cy - Math.sin(rad) * r,
      cx + Math.cos(rad) * r,
      cy + Math.sin(rad) * r
    );
    grad.addColorStop(0, options.gradientColorStart);
    grad.addColorStop(1, options.gradientColorEnd);
    tCtx.fillStyle = grad;
    tCtx.fillRect(0, 0, renderW, renderH);
  }

  // 2. Set up Three.js 3D Scene
  const scene = new THREE.Scene();
  const renderer = getWebGLRenderer(renderW, renderH);

  // Set studio environment for authentic metallic reflections
  scene.environment = getStudioEnvironment(renderer);

  // Perspective camera (calibrated to match 2D visual size seamlessly)
  const aspect = renderW / renderH;
  const fov = 40;
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);

  const baseDistance = (21.22 / (2 * Math.tan((fov * Math.PI) / 360))) * (canvasH / 2122);
  const camDist = Math.max(22, (baseDistance * 0.94) / (options.deviceScale || 1.0));

  camera.position.set(0, 0, camDist);
  camera.lookAt(0, 0, 0);

  // 3-Point Studio Lighting Rig
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  // Key Light (Upper Left)
  const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
  keyLight.position.set(-18, 26, 32);
  scene.add(keyLight);

  // Fill Light (Lower Right)
  const fillLight = new THREE.DirectionalLight(0xe8f0fe, 1.2);
  fillLight.position.set(22, -12, 22);
  scene.add(fillLight);

  // Rim Light (Top Edge Highlight)
  const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
  rimLight.position.set(0, 30, -20);
  scene.add(rimLight);

  // 3. Create 3D Phone Mesh
  const phoneGroup = createPixel9ProMesh(image, options);

  // Apply 3D Showcase Rotation
  const rotX = ((options.rotX || 0) * Math.PI) / 180; // Pitch
  const rotY = ((options.rotY || 0) * Math.PI) / 180; // Yaw
  const rotZ = (((options.rotZ || 0) + (options.deviceRotation || 0)) * Math.PI) / 180; // Roll

  phoneGroup.rotation.set(rotX, rotY, rotZ, 'YXZ');

  // Position offsets
  const offX = ((options.deviceOffsetX || 0) / 100) * (camDist * 0.09);
  const offY = -((options.deviceOffsetY || 0) / 100) * (camDist * 0.09);
  phoneGroup.position.set(offX, offY, 0);

  scene.add(phoneGroup);

  // 4. Ground Shadow Plane (dynamically grounded to the lowest point of the 3D phone)
  const shadowMesh = createStudioShadowPlane(options);
  if (shadowMesh) {
    phoneGroup.updateMatrixWorld(true);
    const bbox = new THREE.Box3().setFromObject(phoneGroup);
    const center = bbox.getCenter(new THREE.Vector3());
    shadowMesh.position.set(center.x, bbox.min.y - 0.4, center.z);
    scene.add(shadowMesh);
  }

  // 5. Render Three.js Scene to WebGL
  renderer.render(scene, camera);

  // 6. Composite WebGL output onto target canvas
  tCtx.drawImage(renderer.domElement, 0, 0);

  // Clean up scene geometries for memory safety
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose();
    }
  });
}
