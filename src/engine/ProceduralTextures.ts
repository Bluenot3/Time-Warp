import * as THREE from 'three';
import { HistoricalSceneBlueprint, RegionStyle } from '../types/history';

const textureCache = new Map<string, THREE.CanvasTexture>();

const SHOP_NAMES_BY_ERA = [
  ['MERCHANTS BANK & TRUST', 'DAILY CHRONICLE PRESS'],
  ['CENTRAL PROVISIONS & BAKERY', 'UNION APOTHECARY'],
  ['GRAND THEATRE & AUTOMAT', 'CONTINENTAL TELEGRAPH CO.'],
  ['METROPOLITAN HARDWARE', 'TAILORS & DRY GOODS'],
];

export function createFacadeTexture(
  renderer: THREE.WebGLRenderer,
  options: {
    eraYear: number;
    regionStyle: RegionStyle;
    seed: number;
    boardedUp?: boolean;
    blackoutTape?: boolean;
  }
): THREE.CanvasTexture {
  const key = `facade-v2-${options.eraYear}-${options.regionStyle}-${options.seed}-${Boolean(options.boardedUp)}-${Boolean(options.blackoutTape)}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const palettes: Record<RegionStyle, string[]> = {
    northeast_urban: ['#5c2c22', '#49342a', '#6b5645', '#3e332c'],
    european_stone: ['#cbbda6', '#b8aa93', '#a39581', '#d6ccb9'],
    west_coast: ['#b89d7c', '#8c4936', '#c9bc9c', '#697278'],
    midwest_main: ['#6b3126', '#594233', '#7d6c57', '#423832'],
    modern_metropolis: ['#25303d', '#1f2937', '#334155', '#475569'],
  };

  const list = palettes[options.regionStyle] || palettes.northeast_urban;
  const baseColor = list[options.seed % list.length];
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Detailed brick / rusticated stone courses with vertical mortar joints
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1.5;
  for (let y = 0; y < 405; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const offset = (y / 12) % 2 === 0 ? 0 : 16;
    for (let x = offset; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
    }
  }

  // Dentil cornice band & stringcourses
  ctx.fillStyle = 'rgba(22, 18, 14, 0.6)';
  ctx.fillRect(0, 0, 512, 20);
  ctx.fillRect(0, 392, 512, 16);
  ctx.fillStyle = 'rgba(220, 206, 184, 0.45)';
  for (let dx = 4; dx < 512; dx += 16) {
    ctx.fillRect(dx, 16, 8, 5);
    ctx.fillRect(dx, 394, 8, 4);
  }

  // Ground floor commercial storefront entablature
  ctx.fillStyle = '#181512';
  ctx.fillRect(0, 408, 512, 104);

  // Gilded shopfront fascia signboard
  const shopPair = SHOP_NAMES_BY_ERA[options.seed % SHOP_NAMES_BY_ERA.length];
  ctx.fillStyle = '#120f0c';
  ctx.fillRect(16, 410, 480, 22);
  ctx.strokeStyle = '#c59b27';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(16, 410, 480, 22);

  ctx.fillStyle = '#ebd59b';
  ctx.font = 'bold 12px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(shopPair[0], 136, 425);
  ctx.fillText(shopPair[1], 376, 425);

  // Upper story windows (4 columns x 4 rows) with arches, keystones, shades & muntins
  const cols = 4;
  const rows = 4;
  const padX = 36;
  const padY = 34;
  const winW = 74;
  const winH = 62;
  const gapX = (512 - padX * 2 - cols * winW) / (cols - 1);
  const gapY = (376 - padY - rows * winH) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = padX + c * (winW + gapX);
      const wy = padY + r * (winH + gapY);

      // Recessed shadow frame
      ctx.fillStyle = 'rgba(10, 8, 6, 0.65)';
      ctx.fillRect(wx - 3, wy - 3, winW + 6, winH + 6);

      // Carved stone lintel + keystone + projecting sill
      ctx.fillStyle = 'rgba(222, 210, 190, 0.78)';
      ctx.fillRect(wx - 5, wy - 8, winW + 10, 7);
      ctx.fillRect(wx + winW / 2 - 6, wy - 11, 12, 10);
      ctx.fillRect(wx - 6, wy + winH, winW + 12, 6);

      const isLit =
        (r * 7 + c * 13 + options.seed) % 4 === 0 && !options.blackoutTape;
      if (options.eraYear >= 1990) {
        ctx.fillStyle = isLit ? '#bae6fd' : '#1e293b';
      } else if (options.blackoutTape) {
        ctx.fillStyle = '#080b10';
      } else {
        ctx.fillStyle = isLit ? '#f4c76e' : '#171a20';
      }
      ctx.fillRect(wx, wy, winW, winH);

      // Upper window roller shade / curtain detail
      if (!options.blackoutTape && options.eraYear < 1990) {
        ctx.fillStyle = 'rgba(194, 174, 140, 0.32)';
        ctx.fillRect(wx + 2, wy + 2, winW - 4, winH * 0.36);
      }

      // Double-hung sash mullions
      ctx.strokeStyle = '#2a231d';
      ctx.lineWidth = 3;
      ctx.strokeRect(wx, wy, winW, winH);
      ctx.beginPath();
      ctx.moveTo(wx, wy + winH / 2);
      ctx.lineTo(wx + winW, wy + winH / 2);
      ctx.moveTo(wx + winW / 2, wy);
      ctx.lineTo(wx + winW / 2, wy + winH);
      ctx.stroke();

      // WWII criss-cross blast tape
      if (options.blackoutTape) {
        ctx.strokeStyle = 'rgba(218, 202, 168, 0.72)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(wx + 4, wy + 4);
        ctx.lineTo(wx + winW - 4, wy + winH - 4);
        ctx.moveTo(wx + winW - 4, wy + 4);
        ctx.lineTo(wx + 4, wy + winH - 4);
        ctx.stroke();
      }
    }
  }

  // Ground floor commercial display windows
  for (let b = 0; b < 2; b++) {
    const bx = 28 + b * 244;
    const by = 436;
    const bw = 212;
    const bh = 68;

    ctx.fillStyle = options.boardedUp
      ? '#3d2b1f'
      : options.blackoutTape
      ? '#0d1015'
      : '#2c241b';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#9c8462';
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, bw, bh);

    if (options.boardedUp) {
      ctx.fillStyle = '#6e4f35';
      for (let p = 0; p < 4; p++) {
        ctx.fillRect(bx + 6, by + 6 + p * 15, bw - 12, 11);
      }
      ctx.fillStyle = '#f5efe4';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        b === 0 ? 'CLOSED • FOR RENT' : 'BANK SUSPENDED',
        bx + bw / 2,
        by + 39
      );
    } else if (!options.blackoutTape) {
      // Warm interior shop display glow
      ctx.fillStyle = 'rgba(245, 198, 105, 0.25)';
      ctx.fillRect(bx + 8, by + 8, bw - 16, bh - 16);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textureCache.set(key, tex);
  return tex;
}

export function createRoadTexture(
  renderer: THREE.WebGLRenderer,
  eraYear: number,
  hasTramTracks: boolean,
  isShantytownEarth: boolean
): THREE.CanvasTexture {
  const key = `road-v2-${eraYear}-${hasTramTracks}-${isShantytownEarth}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (isShantytownEarth) {
    ctx.fillStyle = '#2d241c';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 950; i++) {
      ctx.fillStyle =
        i % 2 === 0 ? 'rgba(72, 58, 42, 0.35)' : 'rgba(18, 14, 10, 0.35)';
      ctx.fillRect((i * 73) % 512, (i * 131) % 512, 6, 6);
    }
  } else if (eraYear <= 1948) {
    // Detailed Belgian block / granite cobblestone pavers with wheel ruts & drainage gutters
    ctx.fillStyle = '#1c1f24';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 14) {
      const offset = (y / 14) % 2 === 0 ? 0 : 11;
      for (let x = -11; x < 512; x += 22) {
        const shade = (x * 3 + y * 7) % 3 === 0 ? '#2b3037' : '#23272d';
        ctx.fillStyle = shade;
        ctx.fillRect(x + offset + 1, y + 1, 19, 11);
      }
    }
    // Curbstone drainage gutters along edges
    ctx.fillStyle = '#15171a';
    ctx.fillRect(0, 0, 22, 512);
    ctx.fillRect(490, 0, 22, 512);
  } else {
    ctx.fillStyle = '#1b1e23';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#e5a93c';
    for (let y = 0; y < 512; y += 64) {
      ctx.fillRect(252, y + 12, 8, 36);
    }
  }

  if (hasTramTracks && !isShantytownEarth) {
    // Dual steel streetcar rails + wooden/stone ties
    ctx.fillStyle = 'rgba(15, 17, 20, 0.55)';
    for (let y = 0; y < 512; y += 16) {
      ctx.fillRect(188, y, 56, 6);
      ctx.fillRect(268, y, 56, 6);
    }
    ctx.fillStyle = '#8b95a1';
    ctx.fillRect(195, 0, 5, 512);
    ctx.fillRect(233, 0, 5, 512);
    ctx.fillRect(274, 0, 5, 512);
    ctx.fillRect(312, 0, 5, 512);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 8);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generates a high-frequency PBR grayscale Bump Map for masonry mortar joints, window recesses, and sills
 */
export function createFacadeBumpTexture(
  renderer: THREE.WebGLRenderer
): THREE.CanvasTexture {
  const key = 'facade-bump-v1';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Raised stone/brick face height (mid-high gray)
  ctx.fillStyle = '#c8c8c8';
  ctx.fillRect(0, 0, 512, 512);

  // Recessed mortar joints (dark gray)
  ctx.strokeStyle = '#383838';
  ctx.lineWidth = 2;
  for (let y = 0; y < 405; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const offset = (y / 12) % 2 === 0 ? 0 : 16;
    for (let x = offset; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
    }
  }

  // Deeply recessed window cavities & raised projecting stone lintels/sills
  const cols = 4;
  const rows = 4;
  const padX = 36;
  const padY = 34;
  const winW = 74;
  const winH = 62;
  const gapX = (512 - padX * 2 - cols * winW) / (cols - 1);
  const gapY = (376 - padY - rows * winH) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = padX + c * (winW + gapX);
      const wy = padY + r * (winH + gapY);
      // Raised lintel & sill
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(wx - 5, wy - 8, winW + 10, 7);
      ctx.fillRect(wx - 6, wy + winH, winW + 12, 6);
      // Recessed glass plane
      ctx.fillStyle = '#202020';
      ctx.fillRect(wx, wy, winW, winH);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generates a PBR grayscale Bump Map for Belgian granite cobblestones and tram rails
 */
export function createRoadBumpTexture(
  renderer: THREE.WebGLRenderer,
  isCobblestone: boolean
): THREE.CanvasTexture {
  const key = `road-bump-v1-${isCobblestone}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#505050';
  ctx.fillRect(0, 0, 512, 512);

  if (isCobblestone) {
    for (let y = 0; y < 512; y += 14) {
      const offset = (y / 14) % 2 === 0 ? 0 : 11;
      for (let x = -11; x < 512; x += 22) {
        ctx.fillStyle = (x + y) % 4 === 0 ? '#e0e0e0' : '#b8b8b8';
        ctx.fillRect(x + offset + 2, y + 2, 18, 10);
      }
    }
  } else {
    // Fine asphalt grain
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#909090' : '#303030';
      ctx.fillRect((i * 79) % 512, (i * 137) % 512, 3, 3);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 8);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textureCache.set(key, tex);
  return tex;
}

export function createBannerSignTexture(
  renderer: THREE.WebGLRenderer,
  text: string,
  bgColor = '#18130e',
  fgColor = '#f4ead5',
  accentColor = '#d99b26'
): THREE.CanvasTexture {
  const key = `banner-v2-${text}-${bgColor}-${fgColor}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 1024, 192);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 1004, 172);

  ctx.strokeStyle = fgColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 984, 152);

  ctx.fillStyle = fgColor;
  ctx.font = 'bold 46px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.slice(0, 40).toUpperCase(), 512, 96);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generates the 2,400m x 2,400m Macro World Cartographic Theater Texture
 * Visible when the user zooms out to see neighboring and global cities!
 */
export function createWorldTheaterMapTexture(
  renderer: THREE.WebGLRenderer
): THREE.CanvasTexture {
  const key = 'world-theater-cartography-v1';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian cartographic bathyal & continental base
  ctx.fillStyle = '#0a0d12';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle continental landmass silhouettes (North America on left, Europe/Med/Africa center-right, East Asia far right)
  ctx.fillStyle = '#131820';
  ctx.strokeStyle = 'rgba(229, 169, 60, 0.28)';
  ctx.lineWidth = 2;

  // North America landmass polygon
  ctx.beginPath();
  ctx.moveTo(80, 220);
  ctx.lineTo(360, 240);
  ctx.lineTo(395, 480);
  ctx.lineTo(320, 660);
  ctx.lineTo(150, 620);
  ctx.lineTo(65, 420);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Europe & North Africa landmass polygon
  ctx.beginPath();
  ctx.moveTo(510, 210);
  ctx.lineTo(790, 210);
  ctx.lineTo(830, 520);
  ctx.lineTo(720, 720);
  ctx.lineTo(525, 680);
  ctx.lineTo(485, 410);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // East Asia / Pacific archipelago polygon
  ctx.beginPath();
  ctx.moveTo(840, 280);
  ctx.lineTo(985, 290);
  ctx.lineTo(975, 610);
  ctx.lineTo(855, 570);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Geodesic latitude / longitude graticule lines
  ctx.strokeStyle = 'rgba(245, 242, 235, 0.07)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 1024; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Concentric radar range rings around active focal sector
  ctx.strokeStyle = 'rgba(229, 169, 60, 0.16)';
  for (const r of [90, 190, 310, 440]) {
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textureCache.set(key, tex);
  return tex;
}

export function renderArchivalPlateDataUrl(
  blueprint: HistoricalSceneBlueprint
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d')!;

  const isWwiiNight = blueprint.reenactmentMode === 'wwii_blitz';
  const isDepression = blueprint.reenactmentMode.startsWith('depression');
  const isEarly = blueprint.year <= 1928;

  const skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
  if (isWwiiNight) {
    skyGrad.addColorStop(0, '#070b14');
    skyGrad.addColorStop(1, '#1a2436');
  } else if (isDepression) {
    skyGrad.addColorStop(0, '#2a2826');
    skyGrad.addColorStop(1, '#6e685f');
  } else if (isEarly) {
    skyGrad.addColorStop(0, '#3d3226');
    skyGrad.addColorStop(1, '#9c8567');
  } else {
    skyGrad.addColorStop(0, '#1e293b');
    skyGrad.addColorStop(1, '#64748b');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 800, 450);

  if (isWwiiNight || blueprint.reenactmentMode === 'wwii_liberation') {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const beams = [
      { x: 160, angle: -0.35 },
      { x: 420, angle: 0.22 },
      { x: 640, angle: -0.18 },
    ];
    for (const b of beams) {
      ctx.beginPath();
      ctx.moveTo(b.x, 340);
      ctx.lineTo(b.x + Math.sin(b.angle) * 450 - 70, 0);
      ctx.lineTo(b.x + Math.sin(b.angle) * 450 + 70, 0);
      ctx.closePath();
      const beamGrad = ctx.createLinearGradient(0, 340, 0, 0);
      beamGrad.addColorStop(0, 'rgba(255, 232, 163, 0.42)');
      beamGrad.addColorStop(1, 'rgba(255, 232, 163, 0.02)');
      ctx.fillStyle = beamGrad;
      ctx.fill();
    }
    ctx.restore();
  }

  const buildingBlocks = [
    { x: 20, w: 95, h: 210 },
    { x: 118, w: 80, h: 250 },
    { x: 202, w: 110, h: 185 },
    { x: 490, w: 95, h: 230 },
    { x: 590, w: 105, h: 265 },
    { x: 700, w: 85, h: 195 },
  ];
  for (const b of buildingBlocks) {
    ctx.fillStyle = isWwiiNight ? '#0d1118' : '#1e1b18';
    ctx.fillRect(b.x, 330 - b.h, b.w, b.h);
    ctx.fillStyle = isWwiiNight
      ? 'rgba(229, 169, 60, 0.18)'
      : 'rgba(245, 235, 210, 0.22)';
    for (let wy = 345 - b.h; wy < 310; wy += 18) {
      for (let wx = b.x + 10; wx < b.x + b.w - 14; wx += 16) {
        if ((wx + wy) % 3 !== 0) {
          ctx.fillRect(wx, wy, 8, 11);
        }
      }
    }
  }

  ctx.fillStyle = '#141210';
  ctx.fillRect(0, 330, 800, 120);

  ctx.strokeStyle = 'rgba(215, 200, 175, 0.25)';
  ctx.lineWidth = 2;
  for (const offset of [-320, -140, -40, 40, 140, 320]) {
    ctx.beginPath();
    ctx.moveTo(400 + offset * 0.15, 330);
    ctx.lineTo(400 + offset, 450);
    ctx.stroke();
  }

  ctx.fillStyle = '#090807';
  for (let i = 0; i < 22; i++) {
    const px = 60 + i * 31;
    const py = 338 + (i % 3) * 4;
    ctx.beginPath();
    ctx.arc(px, py - 24, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(px - 7, py - 27, 14, 2.5);
    ctx.fillRect(px - 6, py - 19, 12, 26);
  }

  if (isDepression) {
    const fireGrad = ctx.createRadialGradient(240, 352, 2, 240, 352, 48);
    fireGrad.addColorStop(0, 'rgba(255, 190, 70, 0.95)');
    fireGrad.addColorStop(0.5, 'rgba(229, 110, 35, 0.45)');
    fireGrad.addColorStop(1, 'rgba(229, 110, 35, 0)');
    ctx.fillStyle = fireGrad;
    ctx.fillRect(190, 304, 100, 96);
  }

  ctx.strokeStyle = 'rgba(245, 242, 235, 0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(14, 14, 772, 422);

  ctx.fillStyle = 'rgba(13, 15, 18, 0.84)';
  ctx.fillRect(24, 24, 460, 56);
  ctx.strokeStyle = 'rgba(229, 169, 60, 0.55)';
  ctx.lineWidth = 1;
  ctx.strokeRect(24, 24, 460, 56);

  ctx.fillStyle = '#E5A93C';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText(
    `ARCHIVAL SURVEY PLATE • ${blueprint.year} • ${blueprint.lat.toFixed(4)}°N ${blueprint.lng.toFixed(4)}°E`,
    36,
    45
  );
  ctx.fillStyle = '#F5F2EB';
  ctx.font = '600 15px "Cinzel", serif';
  ctx.fillText(blueprint.streetSignText.slice(0, 42), 36, 67);

  return canvas.toDataURL('image/jpeg', 0.9);
}
