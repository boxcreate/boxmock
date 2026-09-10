import * as THREE from 'three';
import type { MockupOptions } from '../types';
import { getFinishColors } from './finishes';

// Singleton WebGL Renderer instance to prevent WebGL context leaks
let sharedRenderer: THREE.WebGLRenderer | null = null;

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
 * Creates a 2D rounded rectangle shape for Three.js extrusion.
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
 */
function createScreenCanvas(
  image: HTMLImageElement | null,
  options: MockupOptions,
  width: number = 1080,
  height: number = 2360
): HTMLCanvasElement {
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = width;
  screenCanvas.height = height;
  const sCtx = screenCanvas.getContext('2d');
  if (!sCtx) return screenCanvas;

  // 1. OLED True-Black Base
  sCtx.fillStyle = '#050608';
  sCtx.fillRect(0, 0, width, height);

  // 2. User Screenshot Content
  if (image) {
    sCtx.save();
    const fit = options.screenshotFit || 'cover';
    const userPanY = ((options.screenshotOffsetY || 0) / 100) * height;

    const imgW = image.width;
    const imgH = image.height;
    const screenAspect = width / height;
    const imgAspect = imgW / imgH;

    let drawW = width;
    let drawH = height;
    let drawX = 0;
    let drawY = userPanY;

    if (fit === 'cover') {
      if (imgAspect > screenAspect) {
        drawH = height;
        drawW = height * imgAspect;
        drawX = (width - drawW) / 2;
      } else {
        drawW = width;
        drawH = width / imgAspect;
        drawX = 0;
      }
    } else if (fit === 'contain') {
      if (imgAspect > screenAspect) {
        drawW = width;
        drawH = width / imgAspect;
        drawX = 0;
        drawY = (height - drawH) / 2 + userPanY;
      } else {
        drawH = height;
        drawW = height * imgAspect;
        drawX = (width - drawW) / 2;
        drawY = userPanY;
      }
    }

    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(image, drawX, drawY, drawW, drawH);

    // Subtle OLED edge shadow vignette
    const vig = sCtx.createRadialGradient(
      width / 2,
      height / 2,
      height * 0.4,
      width / 2,
      height / 2,
      height * 0.72
    );
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.18)');
    sCtx.fillStyle = vig;
    sCtx.fillRect(0, 0, width, height);

    sCtx.restore();
  }

  // 3. Precision Punch-Hole Camera Optics
  if (options.showCameraOptics) {
    const cx = width / 2;
    const cy = 70;
    const outerR = 18;
    const lensR = 12;

    sCtx.save();
    // Dark outer bezel ring
    sCtx.fillStyle = '#05070a';
    sCtx.beginPath();
    sCtx.arc(cx, cy, outerR, 0, Math.PI * 2);
    sCtx.fill();

    // Metallic trim ring
    sCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    sCtx.lineWidth = 1;
    sCtx.stroke();

    // Deep coated glass lens
    const lensGrad = sCtx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, lensR);
    lensGrad.addColorStop(0, '#101726');
    lensGrad.addColorStop(0.7, '#070b12');
    lensGrad.addColorStop(1, '#020305');
    sCtx.fillStyle = lensGrad;
    sCtx.beginPath();
    sCtx.arc(cx, cy, lensR, 0, Math.PI * 2);
    sCtx.fill();

    // Specular reflection dot
    sCtx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    sCtx.beginPath();
    sCtx.arc(cx + 3, cy - 3, 3, 0, Math.PI * 2);
    sCtx.fill();
    sCtx.restore();
  }

  // 4. Optional Material You Status Bar & Gesture Navigation Pill
  if (options.showStatusBar) {
    sCtx.save();
    const timeText = options.statusBarTime || '9:41';
    sCtx.fillStyle = options.statusBarTheme === 'dark' ? '#000000' : '#ffffff';
    sCtx.font = '600 32px sans-serif';
    sCtx.textAlign = 'left';
    sCtx.textBaseline = 'middle';
    sCtx.fillText(timeText, 64, 70);

    // Battery & Wi-Fi indicator pills
    sCtx.textAlign = 'right';
    sCtx.font = '500 24px sans-serif';
    sCtx.fillText('5G  100%', width - 64, 70);
    sCtx.restore();
  }

  if (options.showNavigationPill) {
    sCtx.save();
    const pillW = 240;
    const pillH = 10;
    const pillX = (width - pillW) / 2;
    const pillY = height - 36;
    sCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    sCtx.beginPath();
    sCtx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    sCtx.fill();
    sCtx.restore();
  }

  return screenCanvas;
}

/**
 * Builds the complete 3D Google Pixel 9 Pro model with PBR metallic shaders,
 * tactile side buttons, rear camera visor bar, and screen mesh.
 */
export function createPixel9ProMesh(
  image: HTMLImageElement | null,
  options: MockupOptions
): THREE.Group {
  const root = new THREE.Group();
  const finish = getFinishColors(options.finish, options.customFinishColor);

  // Scaled dimensions (proportional to Pixel 9 Pro: 72mm x 152.8mm x 8.5mm)
  const phoneW = 10.0;
  const phoneH = 21.22;
  const phoneD = 0.86;
  const cornerR = 1.16;

  // --- 1. Polished Metal Chassis Body ---
  const chassisShape = createRoundedRectShape(phoneW, phoneH, cornerR);
  const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, {
    depth: phoneD,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  });
  // Center extrusion around Z = 0
  chassisGeo.center();

  const metalColor = new THREE.Color(finish.railCore);
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: metalColor,
    metalness: 0.88,
    roughness: 0.18,
    envMapIntensity: 1.2,
  });

  const bodyMesh = new THREE.Mesh(chassisGeo, metalMaterial);
  root.add(bodyMesh);

  // --- 2. Matte Frosted Glass Rear Backplate ---
  const backShape = createRoundedRectShape(phoneW - 0.1, phoneH - 0.1, cornerR - 0.05);
  const backGeo = new THREE.ShapeGeometry(backShape);
  const backMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(finish.frameInner),
    metalness: 0.15,
    roughness: 0.42,
  });
  const backMesh = new THREE.Mesh(backGeo, backMaterial);
  backMesh.position.z = -(phoneD / 2 + 0.061);
  backMesh.rotation.y = Math.PI; // Face outwards to rear
  root.add(backMesh);

  // --- 3. Distinctive Pixel 9 Pro Rear Camera Visor Island ---
  const visorW = 9.2;
  const visorH = 3.1;
  const visorD = 0.34;
  const visorR = 1.55; // Symmetrical pill cap radius
  const visorY = 5.3; // Upper rear camera bar position

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

  const visorRimMaterial = new THREE.MeshStandardMaterial({
    color: metalColor,
    metalness: 0.9,
    roughness: 0.15,
  });
  const visorMesh = new THREE.Mesh(visorGeo, visorRimMaterial);
  visorMesh.position.set(0, visorY, -(phoneD / 2 + 0.06 + visorD / 2));
  root.add(visorMesh);

  // Visor Dark Glass Insert with 3 Camera Lenses
  const visorGlassShape = createRoundedRectShape(visorW - 0.32, visorH - 0.32, visorR - 0.16);
  const visorGlassGeo = new THREE.ShapeGeometry(visorGlassShape);
  const visorGlassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#07080b'),
    metalness: 0.25,
    roughness: 0.05,
  });
  const visorGlassMesh = new THREE.Mesh(visorGlassGeo, visorGlassMat);
  visorGlassMesh.position.set(0, visorY, -(phoneD / 2 + 0.06 + visorD + 0.041));
  visorGlassMesh.rotation.y = Math.PI;
  root.add(visorGlassMesh);

  // --- 4. Tactile Side Buttons on Right Rail ---
  const buttonGeo = (btnW: number, btnH: number) => {
    const s = createRoundedRectShape(btnW, btnH, 0.06);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.14,
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
  powerMesh.position.set(phoneW / 2 + 0.12, 4.8, 0);
  root.add(powerMesh);

  // Volume rocker (lower right)
  const volumeMesh = new THREE.Mesh(buttonGeo(0.12, 2.3), metalMaterial);
  volumeMesh.position.set(phoneW / 2 + 0.12, 2.7, 0);
  root.add(volumeMesh);

  // --- 5. Front OLED Display Screen ---
  const screenW = 9.48;
  const screenH = 20.70;
  const screenR = 0.90;

  const screenShape = createRoundedRectShape(screenW, screenH, screenR);
  const screenGeo = new THREE.ShapeGeometry(screenShape);

  // Map UVs correctly across the rounded screen geometry
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
  const screenCanvas = createScreenCanvas(image, options, 1080, 2360);
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
  screenTexture.magFilter = THREE.LinearFilter;
  screenTexture.generateMipmaps = true;

  // OLED Screen material: unlit basic material guarantees 100% color fidelity
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTexture,
    toneMapped: false,
  });

  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = phoneD / 2 + 0.061;
  root.add(screenMesh);

  // Front Glass Specular Reflection Layer
  if (options.showGlassGlare && options.glareIntensity > 0) {
    const glareMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: options.glareIntensity * 0.35,
      transparent: true,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.6,
    });
    const glareMesh = new THREE.Mesh(screenGeo, glareMat);
    glareMesh.position.z = phoneD / 2 + 0.063;
    root.add(glareMesh);
  }

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
  shadowCanvas.width = 1024;
  shadowCanvas.height = 1024;
  const sCtx = shadowCanvas.getContext('2d');
  if (!sCtx) return null;

  const opacity = options.shadowOpacity ?? 0.55;

  // Multi-stop radial studio shadow falloff
  const grad = sCtx.createRadialGradient(512, 512, 120, 512, 512, 480);
  grad.addColorStop(0, `rgba(0, 0, 0, ${opacity * 0.9})`);
  grad.addColorStop(0.3, `rgba(0, 0, 0, ${opacity * 0.5})`);
  grad.addColorStop(0.7, `rgba(0, 0, 0, ${opacity * 0.2})`);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  sCtx.fillStyle = grad;
  sCtx.beginPath();
  sCtx.arc(512, 512, 480, 0, Math.PI * 2);
  sCtx.fill();

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(36, 48);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: opacity,
    depthWrite: false,
  });

  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2; // Flat on the floor

  // Ground plane position beneath the phone
  shadowMesh.position.set(0, -13.5, 0);
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

  // Base canvas dimensions
  let canvasW = 2000;
  let canvasH = 2600;

  if (isPreset) {
    // Preset dimensions (Play Banner, GitHub Banner, etc.)
    if (options.canvasPreset === 'play_banner') {
      canvasW = 2048;
      canvasH = 1000;
    } else if (options.canvasPreset === 'github_banner') {
      canvasW = 2400;
      canvasH = 1200;
    } else if (options.canvasPreset === 'landscape_16_9') {
      canvasW = 2560;
      canvasH = 1440;
    } else if (options.canvasPreset === 'square_1_1') {
      canvasW = 1600;
      canvasH = 1600;
    } else if (options.canvasPreset === 'play_screenshot') {
      canvasW = 1080;
      canvasH = 2400;
    }
  } else if (options.tightCrop && options.backgroundType === 'transparent') {
    canvasW = 1600;
    canvasH = 2400;
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

  // Perspective camera (50mm equivalent: 42° FOV)
  const aspect = renderW / renderH;
  const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
  camera.position.set(0, 0, 36 / (options.deviceScale || 1.0));
  camera.lookAt(0, 0, 0);

  // 3-Point Studio Lighting Rig
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  // Key Light (Upper Left)
  const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.4);
  keyLight.position.set(-18, 26, 32);
  scene.add(keyLight);

  // Fill Light (Lower Right)
  const fillLight = new THREE.DirectionalLight(0xe8f0fe, 1.2);
  fillLight.position.set(22, -12, 22);
  scene.add(fillLight);

  // Rim Light (Top Edge Highlight)
  const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
  rimLight.position.set(0, 30, -20);
  scene.add(rimLight);

  // 3. Create 3D Phone Mesh
  const phoneGroup = createPixel9ProMesh(image, options);

  // Apply 3D Showcase Rotation
  // Convert degrees to radians
  const rotX = ((options.rotX || 0) * Math.PI) / 180; // Pitch
  const rotY = ((options.rotY || 0) * Math.PI) / 180; // Yaw
  const rotZ = (((options.rotZ || 0) + (options.deviceRotation || 0)) * Math.PI) / 180; // Roll

  phoneGroup.rotation.set(rotX, rotY, rotZ, 'YXZ');

  // Position offsets
  const offX = ((options.deviceOffsetX || 0) / 100) * 3.5;
  const offY = -((options.deviceOffsetY || 0) / 100) * 3.5;
  phoneGroup.position.set(offX, offY, 0);

  scene.add(phoneGroup);

  // 4. Ground Shadow Plane (dynamically grounded to the lowest point of the 3D phone)
  const shadowMesh = createStudioShadowPlane(options);
  if (shadowMesh) {
    phoneGroup.updateMatrixWorld(true);
    const bbox = new THREE.Box3().setFromObject(phoneGroup);
    const center = bbox.getCenter(new THREE.Vector3());
    shadowMesh.position.set(center.x, bbox.min.y - 0.5, center.z);
    scene.add(shadowMesh);
  }

  // 5. Render Three.js Scene to WebGL
  const renderer = getWebGLRenderer(renderW, renderH);
  renderer.render(scene, camera);

  // 6. Composite WebGL output onto target canvas
  tCtx.drawImage(renderer.domElement, 0, 0);

  // Clean up geometries and textures for memory safety
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose();
    }
  });
}
