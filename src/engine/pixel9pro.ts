export const PIXEL_9_PRO = {
  // Physical dimensions (normalized canvas space)
  deviceWidth: 1000,
  deviceHeight: 2122,
  
  // Ultra-slim modern chassis & rails (~1.4mm physical equivalent)
  outerCornerRadius: 116,
  metalRailThickness: 16, // Polished colored metal frame rail
  chamferWidth: 3,
  
  // Ultra-thin symmetrical OLED display bezel
  bezelThickness: 10, // Symmetrical edge-to-edge
  
  // Display screen bounds
  get screenX() {
    return this.metalRailThickness + this.bezelThickness; // 26px total margin
  },
  get screenY() {
    return this.metalRailThickness + this.bezelThickness;
  },
  get screenWidth() {
    return this.deviceWidth - (this.screenX * 2); // 948px
  },
  get screenHeight() {
    return this.deviceHeight - (this.screenY * 2); // 2070px
  },
  get screenCornerRadius() {
    return this.outerCornerRadius - (this.metalRailThickness + this.bezelThickness); // 90px concentric
  },
  
  // Precision punch-hole camera
  camera: {
    cx: 500,
    cy: 64, // Positioned inside status bar area
    outerRadius: 16,
    apertureRadius: 13,
    lensRadius: 11,
    reflectionOffset: { x: 3, y: -3 },
    reflectionRadius: 3,
    secondaryReflectionOffset: { x: -2.5, y: 2.5 },
    secondaryReflectionRadius: 1.5,
  },
  
  // Micro-etched speaker earpiece slit
  speakerGrill: {
    cx: 500,
    y: 8,
    width: 96,
    height: 3,
    radius: 1.5,
  },
  
  // Physical buttons (subtle silhouettes on the right rail)
  buttons: {
    power: { x: 1000, y: 490, width: 4.5, height: 110, radius: 2 },
    volume: { x: 1000, y: 670, width: 4.5, height: 230, radius: 2 },
  },
  
  // Antenna band micro-grooves
  antennaBands: [
    { y: 270, height: 5 },
    { y: 1850, height: 5 },
  ],
};
