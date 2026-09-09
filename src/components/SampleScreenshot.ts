/**
 * Generates an ultra-clean, minimalist developer & engineering task management UI
 * (Linear / Raycast / Apple style) with pure typography, razor-sharp 1px geometry,
 * ZERO fuzzy glows, and ZERO neon gradients.
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

    // --- 1. Clean Matte Background (Zero glows, zero color bleed) ---
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // --- Helper Drawing Functions ---
    const drawRoundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      fill?: string,
      stroke?: string,
      lineWidth = 1
    ) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };

    // --- 2. Crisp Vector Status Bar ---
    ctx.fillStyle = '#f4f4f5';
    ctx.font = '600 36px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText('9:41', 75, 100);

    // 5G
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '600 24px -apple-system, sans-serif';
    ctx.fillText('5G', width - 210, 98);

    // Battery (crisp vector)
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(width - 145, 76, 56, 28, 7);
    ctx.stroke();
    ctx.fillStyle = '#f4f4f5';
    ctx.fillRect(width - 140, 81, 40, 18);
    ctx.fillRect(width - 86, 84, 4, 12);

    // --- 3. Top Navigation & Workspace Row ---
    const navY = 175;

    // Workspace Selector Pill (Flat matte, hairline border)
    drawRoundRect(75, navY, 280, 68, 16, '#18181b', '#27272a', 1.5);

    // Organization avatar (monochrome geometric square)
    drawRoundRect(90, navY + 14, 40, 40, 8, '#27272a');
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px -apple-system, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BL', 110, navY + 41);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#f4f4f5';
    ctx.font = '600 26px -apple-system, sans-serif';
    ctx.fillText('boxlore team', 145, navY + 43);

    // Down chevron
    ctx.strokeStyle = '#71717a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(320, navY + 31);
    ctx.lineTo(327, navY + 38);
    ctx.lineTo(334, navY + 31);
    ctx.stroke();

    // Right Action Icons: Filter & Search (Clean vector line icons)
    const drawIconButton = (x: number, iconType: 'search' | 'plus') => {
      drawRoundRect(x, navY, 68, 68, 16, '#18181b', '#27272a', 1.5);
      ctx.strokeStyle = '#d4d4d8';
      ctx.lineWidth = 2.5;
      if (iconType === 'search') {
        ctx.beginPath();
        ctx.arc(x + 31, navY + 31, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 40, navY + 40);
        ctx.lineTo(x + 50, navY + 50);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(x + 34, navY + 20);
        ctx.lineTo(x + 34, navY + 48);
        ctx.moveTo(x + 20, navY + 34);
        ctx.lineTo(x + 48, navY + 34);
        ctx.stroke();
      }
    };

    drawIconButton(width - 143, 'plus');
    drawIconButton(width - 225, 'search');

    // --- 4. Page Title Header ---
    const titleY = 320;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 56px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Sprint 42', 75, titleY);

    ctx.fillStyle = '#71717a';
    ctx.font = '500 26px -apple-system, sans-serif';
    ctx.fillText('Sep 4 – Sep 18 • 14 tasks remaining', 75, titleY + 46);

    // --- 5. Clean Metrics Overview Grid (3 crisp flat cards) ---
    const metricsY = 415;
    const cardGap = 20;
    const cardW = (width - 150 - 2 * cardGap) / 3;
    const cardH = 175;

    const metrics = [
      { label: 'COMPLETED', val: '28', sub: '↑ 8 this week', subColor: '#10b981' },
      { label: 'IN PROGRESS', val: '12', sub: '3 blocked', subColor: '#f59e0b' },
      { label: 'VELOCITY', val: '94%', sub: '+4.2 pts', subColor: '#71717a' },
    ];

    metrics.forEach((m, i) => {
      const mx = 75 + i * (cardW + cardGap);
      drawRoundRect(mx, metricsY, cardW, cardH, 20, '#121215', '#27272a', 1);

      ctx.fillStyle = '#71717a';
      ctx.font = '600 20px -apple-system, monospace';
      ctx.fillText(m.label, mx + 24, metricsY + 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 48px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(m.val, mx + 24, metricsY + 104);

      ctx.fillStyle = m.subColor;
      ctx.font = '500 20px -apple-system, sans-serif';
      ctx.fillText(m.sub, mx + 24, metricsY + 144);
    });

    // --- 6. Task Status Group / Filter Tabs ---
    const tabsY = 645;
    const tabs = ['All Issues', 'Active (12)', 'Backlog', 'Roadmap'];
    let tabX = 75;

    tabs.forEach((tab, i) => {
      const isSelected = i === 0;
      ctx.font = isSelected ? '600 24px -apple-system, sans-serif' : '500 24px -apple-system, sans-serif';
      const textW = ctx.measureText(tab).width;
      const pillW = textW + 40;

      drawRoundRect(
        tabX,
        tabsY,
        pillW,
        56,
        14,
        isSelected ? '#ffffff' : '#18181b',
        isSelected ? undefined : '#27272a',
        1
      );

      ctx.fillStyle = isSelected ? '#09090b' : '#a1a1aa';
      ctx.fillText(tab, tabX + 20, tabsY + 37);

      tabX += pillW + 14;
    });

    // --- 7. Crisp Linear-Style Issue Cards List ---
    const issues = [
      {
        id: 'BOX-418',
        title: 'Optimize Canvas 2D frame shadow rasterizer',
        project: 'boxmock',
        status: 'in-progress',
        priority: 'high',
        author: 'Aswin C.',
        time: 'Updated 20m ago',
      },
      {
        id: 'BOX-415',
        title: 'Calibrate realistic titanium edge reflections',
        project: 'engine',
        status: 'in-progress',
        priority: 'urgent',
        author: 'Aswin C.',
        time: '1h ago',
      },
      {
        id: 'BOX-409',
        title: 'Implement lossless 4x PNG and WebP clipboard export',
        project: 'boxmock',
        status: 'done',
        priority: 'medium',
        author: 'Aswin C.',
        time: 'Yesterday',
      },
      {
        id: 'BOX-402',
        title: 'Refactor audio service queue synchronization pipeline',
        project: 'boxlore-core',
        status: 'done',
        priority: 'medium',
        author: 'Aswin C.',
        time: 'Sep 7',
      },
      {
        id: 'BOX-396',
        title: 'Audit SharedPreferences encryption boundaries',
        project: 'security',
        status: 'todo',
        priority: 'low',
        author: 'Aswin C.',
        time: 'Sep 5',
      },
      {
        id: 'BOX-391',
        title: 'Update Material 3 dynamic color tokens for Android 15',
        project: 'designsystem',
        status: 'todo',
        priority: 'low',
        author: 'Aswin C.',
        time: 'Sep 4',
      },
    ];

    let issueY = 745;
    const issueH = 185;

    issues.forEach((iss) => {
      // Card Container: flat matte surface with sharp hairline border
      drawRoundRect(75, issueY, width - 150, issueH, 20, '#121215', '#27272a', 1);

      // Top row: Issue ID + Project Pill + Priority
      drawRoundRect(100, issueY + 22, 115, 36, 8, '#18181b', '#27272a', 1);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '600 18px -apple-system, monospace';
      ctx.fillText(iss.id, 115, issueY + 47);

      // Project tag
      ctx.fillStyle = '#71717a';
      ctx.font = '500 20px -apple-system, monospace';
      ctx.fillText('// ' + iss.project, 230, issueY + 47);

      // Priority indicator (clean icon/dot, no blur)
      if (iss.priority === 'urgent') {
        ctx.fillStyle = '#f43f5e';
        ctx.font = '600 20px -apple-system, sans-serif';
        ctx.fillText('▲ High', width - 180, issueY + 47);
      } else if (iss.priority === 'high') {
        ctx.fillStyle = '#f59e0b';
        ctx.font = '600 20px -apple-system, sans-serif';
        ctx.fillText('▲ Medium', width - 195, issueY + 47);
      } else {
        ctx.fillStyle = '#71717a';
        ctx.font = '500 20px -apple-system, sans-serif';
        ctx.fillText('— Normal', width - 190, issueY + 47);
      }

      // Status Icon + Issue Title
      const titleRowY = issueY + 100;

      if (iss.status === 'done') {
        // Crisp checkmark in purple/blue square
        drawRoundRect(100, titleRowY - 24, 34, 34, 8, '#6366f1');
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(108, titleRowY - 7);
        ctx.lineTo(114, titleRowY - 1);
        ctx.lineTo(126, titleRowY - 15);
        ctx.stroke();
      } else if (iss.status === 'in-progress') {
        // Crisp progress circle
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(117, titleRowY - 7, 14, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.strokeStyle = '#27272a';
        ctx.beginPath();
        ctx.arc(117, titleRowY - 7, 14, Math.PI * 1.5, Math.PI * 2);
        ctx.stroke();
      } else {
        // Hollow circle
        ctx.strokeStyle = '#52525b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(117, titleRowY - 7, 13, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Title Text
      ctx.fillStyle = '#f4f4f5';
      ctx.font = '600 28px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(iss.title, 150, titleRowY);

      // Bottom Row: Author + Timestamp
      ctx.fillStyle = '#71717a';
      ctx.font = '500 20px -apple-system, sans-serif';
      ctx.fillText(iss.author + ' • ' + iss.time, 150, issueY + 148);

      issueY += issueH + 16;
    });

    // --- 8. Floating Minimal Bottom Navigation Bar ---
    const dockY = height - 210;
    const dockW = width - 150;
    const dockH = 110;

    // Solid dark slate dock with crisp 1px border
    drawRoundRect(75, dockY, dockW, dockH, 55, '#121215', '#27272a', 1.5);

    const tabsNav = [
      { label: 'Issues', active: true },
      { label: 'Projects', active: false },
      { label: 'Inbox', active: false },
      { label: 'Settings', active: false },
    ];

    const tabWidth = dockW / tabsNav.length;
    tabsNav.forEach((t, i) => {
      const tx = 75 + i * tabWidth;

      if (t.active) {
        // Crisp active pill
        drawRoundRect(tx + 24, dockY + 16, tabWidth - 48, 78, 39, '#27272a');
      }

      ctx.fillStyle = t.active ? '#ffffff' : '#71717a';
      ctx.font = t.active ? '600 24px -apple-system, sans-serif' : '500 24px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.label, tx + tabWidth / 2, dockY + 63);
      ctx.textAlign = 'left';
    });

    // --- 9. Home Gesture Indicator ---
    ctx.fillStyle = '#71717a';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 120, height - 36, 240, 6, 3);
    ctx.fill();

    // Convert to Image and resolve
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = canvas.toDataURL('image/png');
  });
}
