/**
 * Generates an ultra-stylish, fun spatial music player UI screenshot
 * on an in-memory canvas to use as the default sample screenshot for boxmock.
 */
export function createSampleScreenshot(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const width = 1080;
    const height = 2400;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      const img = new Image();
      resolve(img);
      return;
    }

    // 1. Deep Space Atmospheric Canvas Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0a0a10');
    bgGrad.addColorStop(0.35, '#0f0c1b');
    bgGrad.addColorStop(0.7, '#130c1e');
    bgGrad.addColorStop(1, '#08080d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Multi-tone atmospheric aura orbs
    // Top-left Violet Glow
    const orb1 = ctx.createRadialGradient(250, 420, 20, 250, 420, 650);
    orb1.addColorStop(0, 'rgba(147, 51, 234, 0.35)');
    orb1.addColorStop(0.6, 'rgba(147, 51, 234, 0.08)');
    orb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, width, height);

    // Center-Right Hot Pink Aura
    const orb2 = ctx.createRadialGradient(880, 950, 30, 880, 950, 750);
    orb2.addColorStop(0, 'rgba(236, 72, 153, 0.3)');
    orb2.addColorStop(0.6, 'rgba(236, 72, 153, 0.06)');
    orb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, width, height);

    // Bottom-Left Cyan Ambient Fill
    const orb3 = ctx.createRadialGradient(220, 1800, 40, 220, 1800, 700);
    orb3.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    orb3.addColorStop(0.7, 'rgba(6, 182, 212, 0.04)');
    orb3.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orb3;
    ctx.fillRect(0, 0, width, height);

    // 2. Status Bar Header
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 36px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText('9:41', 75, 95);

    // Minimal Status Icons (Wi-Fi, 5G, Battery)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    // 5G label
    ctx.font = '700 24px -apple-system, sans-serif';
    ctx.fillText('5G', width - 210, 95);
    // Battery pill
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(width - 145, 68, 56, 30, 8);
    ctx.stroke();
    ctx.fillRect(width - 139, 74, 38, 18);
    ctx.fillRect(width - 86, 77, 4, 12);

    // 3. Top Navigation / Category Header
    ctx.save();
    // Glassy "VIBE STATION" pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(75, 175, 280, 68, 34);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(115, 209, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '700 24px -apple-system, sans-serif';
    ctx.fillText('NOW PLAYING', 140, 217);

    // Right device icon/cast button
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(width - 145, 175, 70, 68, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Sound wave icon
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(width - 120, 197, 4, 24);
    ctx.fillRect(width - 112, 191, 4, 36);
    ctx.fillRect(width - 104, 202, 4, 14);
    ctx.restore();

    // 4. Hero Album Artwork Card
    const artW = 860;
    const artH = 860;
    const artX = (width - artW) / 2;
    const artY = 290;
    const artR = 56;

    // Album card ground shadow
    ctx.save();
    ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
    ctx.shadowBlur = 90;
    ctx.shadowOffsetY = 45;
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.roundRect(artX, artY, artW, artH, artR);
    ctx.fill();
    ctx.restore();

    // Album Artwork Canvas
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(artX, artY, artW, artH, artR);
    ctx.clip();

    // Rich Chromatic Swirl Art Background
    const artGrad = ctx.createLinearGradient(artX, artY, artX + artW, artY + artH);
    artGrad.addColorStop(0, '#0f172a');
    artGrad.addColorStop(0.28, '#4c1d95');
    artGrad.addColorStop(0.62, '#db2777');
    artGrad.addColorStop(0.85, '#f97316');
    artGrad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = artGrad;
    ctx.fillRect(artX, artY, artW, artH);

    // Floating glowing organic spheres inside album art
    const artGlow1 = ctx.createRadialGradient(artX + 320, artY + 380, 20, artX + 320, artY + 380, 420);
    artGlow1.addColorStop(0, 'rgba(244, 114, 182, 0.85)');
    artGlow1.addColorStop(0.5, 'rgba(168, 85, 247, 0.5)');
    artGlow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = artGlow1;
    ctx.fillRect(artX, artY, artW, artH);

    const artGlow2 = ctx.createRadialGradient(artX + 620, artY + 580, 10, artX + 620, artY + 580, 360);
    artGlow2.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
    artGlow2.addColorStop(0.6, 'rgba(30, 58, 138, 0.4)');
    artGlow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = artGlow2;
    ctx.fillRect(artX, artY, artW, artH);

    // Holographic Vinyl Rings inside artwork
    ctx.lineWidth = 3;
    for (let r = 80; r < 360; r += 45) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + (r / 360) * 0.15})`;
      ctx.beginPath();
      ctx.arc(artX + artW / 2, artY + artH / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Stylized typography on album art
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = '800 58px -apple-system, sans-serif';
    ctx.fillText('SOLAR ECHOES', artX + 70, artY + 130);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '600 24px monospace';
    ctx.fillText('VOL. 04 // SPATIAL MASTER', artX + 72, artY + 175);

    // Floating Glass Reflection Line across Album
    const glassLine = ctx.createLinearGradient(artX, artY, artX + artW, artY + artH);
    glassLine.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    glassLine.addColorStop(0.2, 'rgba(255, 255, 255, 0.08)');
    glassLine.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glassLine;
    ctx.fillRect(artX, artY, artW, artH);

    // Album border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(artX, artY, artW, artH, artR);
    ctx.stroke();
    ctx.restore();

    // 5. Track Title & Artist Info
    const infoY = 1240;

    // Song Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 72px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Midnight Mirage', 110, infoY);

    // Artist & Featured
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 38px -apple-system, sans-serif';
    ctx.fillText('Kroma • feat. Nova', 110, infoY + 60);

    // Floating Heart Action Button
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(width - 200, infoY - 45, 90, 90, 45);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Red Heart symbol
    ctx.fillStyle = '#f43f5e';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♥', width - 155, infoY);
    ctx.restore();

    // 6. Dolby Atmos & Lossless Audio Pill
    const tagY = infoY + 125;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(110, tagY, 390, 52, 26);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 22px monospace';
    ctx.fillText('✦ LOSSLESS • 24-BIT/96k', 135, tagY + 33);
    ctx.restore();

    // 7. Interactive Audio Waveform Visualizer
    const waveY = 1490;
    const waveW = 860;
    const waveX = (width - waveW) / 2;
    const barCount = 38;
    const barW = 12;
    const barGap = (waveW - barCount * barW) / (barCount - 1);

    // Pre-calculated wave bar heights for authentic natural music curve
    const heights = [
      25, 40, 65, 80, 45, 30, 55, 90, 110, 75, 40, 60, 95, 120, 85, 50, 70, 105, 130, 90,
      60, 80, 115, 140, 95, 65, 45, 70, 95, 60, 35, 50, 75, 55, 35, 45, 30, 20,
    ];

    const currentProgressIdx = 23; // Bar at which current time stands

    for (let i = 0; i < barCount; i++) {
      const h = heights[i];
      const bx = waveX + i * (barW + barGap);
      const by = waveY - h / 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx, by, barW, h, 6);

      if (i <= currentProgressIdx) {
        // Played: Vibrant gradient from cyan to magenta
        const barGrad = ctx.createLinearGradient(0, by, 0, by + h);
        barGrad.addColorStop(0, '#38bdf8');
        barGrad.addColorStop(0.5, '#c084fc');
        barGrad.addColorStop(1, '#f43f5e');
        ctx.fillStyle = barGrad;
      } else {
        // Unplayed: Muted slate
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      }
      ctx.fill();
      ctx.restore();
    }

    // Time Readouts
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 26px monospace';
    ctx.fillText('2:41', waveX, waveY + 95);
    ctx.fillText('-1:37', waveX + waveW - 80, waveY + 95);

    // 8. Sleek Modern Playback Controls Dock
    const ctrlY = 1710;

    // Shuffle Button (Active Cyan)
    ctx.fillStyle = '#38bdf8';
    ctx.font = '36px sans-serif';
    ctx.fillText('⇄', 150, ctrlY + 42);
    ctx.beginPath();
    ctx.arc(165, ctrlY + 68, 4, 0, Math.PI * 2);
    ctx.fill();

    // Previous Track Button
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '54px sans-serif';
    ctx.fillText('⏮', 320, ctrlY + 45);

    // Master Play/Pause Floating Orb
    const playX = width / 2;
    const playR = 64;

    ctx.save();
    ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 15;

    const playGrad = ctx.createLinearGradient(playX - playR, ctrlY - playR, playX + playR, ctrlY + playR);
    playGrad.addColorStop(0, '#ffffff');
    playGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = playGrad;
    ctx.beginPath();
    ctx.arc(playX, ctrlY + 30, playR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pause bars inside play button
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(playX - 18, ctrlY + 7, 10, 46, 5);
    ctx.roundRect(playX + 8, ctrlY + 7, 10, 46, 5);
    ctx.fill();

    // Next Track Button
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '54px sans-serif';
    ctx.fillText('⏭', width - 370, ctrlY + 45);

    // Repeat Button
    ctx.fillStyle = '#94a3b8';
    ctx.font = '36px sans-serif';
    ctx.fillText('↻', width - 200, ctrlY + 42);

    // 9. Floating Glassmorphic Lyrics Snippet Card
    const lyrY = 1880;
    const lyrH = 290;
    const lyrW = 860;
    const lyrX = (width - lyrW) / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(lyrX, lyrY, lyrW, lyrH, 44);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Header label
    ctx.fillStyle = '#f43f5e';
    ctx.font = '700 22px monospace';
    ctx.fillText('LIVE LYRICS', lyrX + 50, lyrY + 65);

    // Lyric line 1 (Faded)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '600 34px -apple-system, sans-serif';
    ctx.fillText('Catching echoes in the solar wind...', lyrX + 50, lyrY + 130);

    // Lyric line 2 (Active Vibrant)
    const lyrGrad = ctx.createLinearGradient(lyrX + 50, lyrY + 160, lyrX + 600, lyrY + 220);
    lyrGrad.addColorStop(0, '#ffffff');
    lyrGrad.addColorStop(0.6, '#f472b6');
    lyrGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = lyrGrad;
    ctx.font = '700 42px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Neon frequencies fade to gold.', lyrX + 50, lyrY + 205);
    ctx.restore();

    // 10. Bottom Gesture Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 140, height - 50, 280, 8, 4);
    ctx.fill();

    const img = new Image();
    img.onload = () => resolve(img);
    img.src = canvas.toDataURL('image/png');
  });
}
