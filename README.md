# boxmock

> **Ultra-realistic, browser-based Google Pixel 9 Pro mockup generator with studio lighting, physical finishes, and instant export.**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-aswin.cx%2Fboxmock-emerald)](https://aswin.cx/boxmock/)

**boxmock** is a zero-friction, client-side tool for designers, mobile engineers, and indie hackers to create publication-grade device mockups for app stores, marketing assets, and social media showcase cards in seconds.

---

## ✨ Features

- **📱 Authentic Pixel 9 Pro Geometry**: Precise corner curvature, antenna bands, polished titanium-look rails, speaker slit, and punch-hole front camera.
- **🎨 Physical Finishes**: Pre-calibrated finishes (Obsidian, Porcelain, Hazel, Rose Quartz, Mint, Bay Blue, Lemonade) or custom hex tinting.
- **💡 Studio Lighting Engine**: Realistic multi-directional reflections, specular highlights, and presets (Ambient, Soft Studio, Dramatic Rim, Cyberpunk Neon, Golden Hour).
- **🌑 Multi-Layer Elevation Shadows**: Natural ambient contact shadows with configurable blur, distance, opacity, and direction.
- **📐 Aspect Ratio & Canvas Presets**: Ready-to-use sizes for Twitter/X (16:9), Instagram (1:1 & 4:5), Stories (9:16), Dribbble (4:3), and custom canvas dimensions.
- **⚡ Instant Export & Copy**: High-resolution 1× / 2× / 3× export to PNG or WebP, or direct 1-click copy to clipboard.
- **🔒 100% Private & Client-Side**: No analytics tracking, no server uploads. All image rendering and processing runs locally in your browser via Canvas 2D.

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/ashwkun/boxmock.git
cd boxmock

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5174/boxmock/` in your browser.

---

## 🛠️ Build & Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

Static files will be bundled into the `dist/` directory.

---

## 📄 License

This project is licensed under the **Apache License, Version 2.0**. See the [LICENSE](LICENSE) file for details.
