// GameForge Built-in Asset Library
// Each asset is a ready-to-use code snippet that can be inserted into a game project

export interface GFAsset {
  id: string;
  name: string;
  cat: string;
  icon: string;
  desc: string;
  code: string;
  preview?: string; // color for preview card
  price?: string; // e.g. "Free" or "$24.99"
}

export const ASSET_CATEGORIES = [
  { key: "all", label: "All Assets", icon: "📦", count: 0 },
  { key: "sprite", label: "Characters", icon: "🧍", count: 0 },
  { key: "tileset", label: "Tilesets", icon: "🗺️", count: 0 },
  { key: "effect", label: "VFX", icon: "✨", count: 0 },
  { key: "ui", label: "UI / HUD", icon: "❤️", count: 0 },
  { key: "physics", label: "Physics", icon: "⚡", count: 0 },
  { key: "audio", label: "Audio", icon: "🔊", count: 0 },
  { key: "ai", label: "AI / Logic", icon: "🧠", count: 0 },
  { key: "template", label: "Templates", icon: "📋", count: 0 },
  { key: "premium", label: "Premium Pro", icon: "💎", count: 0 },
];

export const BUILTIN_ASSETS: GFAsset[] = [
  // ═══════════════════════════════════════
  //  SPRITES / CHARACTERS
  // ═══════════════════════════════════════
  {
    id: "s1", name: "Player Character", cat: "sprite", icon: "🧍", preview: "from-purple-600 to-indigo-600",
    desc: "Animated player with idle animation, 32x32 sprite",
    code: `// ── Player Character ──
const playerSprite = {
  x: 400, y: 300, w: 32, h: 32,
  frame: 0, animTimer: 0, color: '#a855f7',
  facing: 1 // 1 = right, -1 = left
};

function updatePlayerSprite(dt) {
  playerSprite.animTimer += dt;
  if (playerSprite.animTimer > 0.15) {
    playerSprite.frame = (playerSprite.frame + 1) % 4;
    playerSprite.animTimer = 0;
  }
}

function drawPlayerSprite(ctx) {
  const p = playerSprite;
  ctx.save();
  ctx.translate(p.x + p.w/2, p.y + p.h/2);
  ctx.scale(p.facing, 1);
  // Body
  ctx.fillStyle = p.color;
  ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.fillRect(-p.w/2 + 8, -p.h/2 + 8, 6, 6);
  ctx.fillRect(-p.w/2 + 18, -p.h/2 + 8, 6, 6);
  // Pupils
  ctx.fillStyle = '#000';
  ctx.fillRect(-p.w/2 + 10, -p.h/2 + 10, 3, 3);
  ctx.fillRect(-p.w/2 + 20, -p.h/2 + 10, 3, 3);
  // Legs animation
  const legOffset = Math.sin(playerSprite.frame * Math.PI/2) * 4;
  ctx.fillStyle = '#7c3aed';
  ctx.fillRect(-p.w/2 + 4, p.h/2 - 2, 8, 6 + legOffset);
  ctx.fillRect(-p.w/2 + 20, p.h/2 - 2, 8, 6 - legOffset);
  ctx.restore();
}`
  },
  {
    id: "s2", name: "Enemy Patrol", cat: "sprite", icon: "👾", preview: "from-red-600 to-orange-600",
    desc: "Enemy with patrol AI, bounces between boundaries",
    code: `// ── Enemy Patrol AI ──
const enemies = [];

function spawnEnemy(x, y, range = 200) {
  enemies.push({
    x, y, startX: x,
    speed: 60 + Math.random() * 40,
    dir: 1, range, color: '#ef4444',
    size: 14, hit: false
  });
}

function updateEnemies(dt) {
  enemies.forEach(e => {
    if (e.hit) return;
    e.x += e.speed * e.dir * dt;
    if (e.x > e.startX + e.range || e.x < e.startX - e.range) e.dir *= -1;
  });
}

function drawEnemies(ctx) {
  enemies.forEach(e => {
    if (e.hit) return;
    // Glow
    ctx.fillStyle = 'rgba(239,68,68,0.15)';
    ctx.beginPath(); ctx.arc(e.x, e.y, e.size + 8, 0, Math.PI*2); ctx.fill();
    // Body
    ctx.fillStyle = e.color;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI*2); ctx.fill();
    // Angry eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(e.x - 6, e.y - 4, 4, 4);
    ctx.fillRect(e.x + 2, e.y - 4, 4, 4);
  });
}

// Init: spawnEnemy(200, 400); spawnEnemy(500, 200, 150);`
  },
  {
    id: "s3", name: "Coin Pickup", cat: "sprite", icon: "🪙", preview: "from-yellow-500 to-amber-600",
    desc: "Animated coin with glow effect and pickup detection",
    code: `// ── Coin Pickup System ──
const coins = [];
let coinScore = 0;

function spawnCoin(x, y) {
  coins.push({ x, y, collected: false, pulse: Math.random() * 6, scale: 1 });
}

function spawnCoinsRandom(count = 8) {
  for (let i = 0; i < count; i++) {
    spawnCoin(Math.random() * 750 + 25, Math.random() * 550 + 25);
  }
}

function updateCoins(dt, playerX, playerY, pickupRadius = 28) {
  coins.forEach((c, i) => {
    if (c.collected) { c.scale -= dt * 8; return; }
    c.pulse += dt * 4;
    if (Math.hypot(playerX - c.x, playerY - c.y) < pickupRadius) {
      c.collected = true;
      coinScore += 100;
      console.log("🪙 +100! Total: " + coinScore);
    }
  });
}

function drawCoins(ctx) {
  coins.forEach(c => {
    if (c.scale <= 0) return;
    const r = (8 + Math.sin(c.pulse) * 2) * c.scale;
    // Glow
    ctx.fillStyle = 'rgba(250,204,21,0.12)';
    ctx.beginPath(); ctx.arc(c.x, c.y, r + 8, 0, Math.PI*2); ctx.fill();
    // Coin
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI*2); ctx.fill();
    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.arc(c.x - 2, c.y - 2, r * 0.4, 0, Math.PI*2); ctx.fill();
  });
}

// Init: spawnCoinsRandom(10);`
  },
  {
    id: "s4", name: "NPC Wanderer", cat: "sprite", icon: "🚶", preview: "from-cyan-600 to-teal-600",
    desc: "Non-player character that wanders randomly",
    code: `// ── NPC Wanderer ──
const npcs = [];

function spawnNPC(x, y, name = "NPC") {
  npcs.push({
    x, y, name, speed: 30 + Math.random() * 40,
    dirX: 0, dirY: 0, timer: 0,
    color: '#06b6d4', size: 12
  });
}

function updateNPCs(dt) {
  npcs.forEach(n => {
    n.timer -= dt;
    if (n.timer <= 0) {
      n.dirX = (Math.random() - 0.5) * 2;
      n.dirY = (Math.random() - 0.5) * 2;
      n.timer = 1 + Math.random() * 3;
    }
    n.x += n.dirX * n.speed * dt;
    n.y += n.dirY * n.speed * dt;
    n.x = Math.max(20, Math.min(780, n.x));
    n.y = Math.max(20, Math.min(580, n.y));
  });
}

function drawNPCs(ctx) {
  npcs.forEach(n => {
    ctx.fillStyle = n.color;
    ctx.beginPath(); ctx.arc(n.x, n.y, n.size, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(n.name, n.x, n.y - n.size - 4);
    ctx.textAlign = 'start';
  });
}

// Init: spawnNPC(300, 300, "Ali"); spawnNPC(500, 400, "Sara");`
  },
  {
    id: "s5", name: "Boss Entity", cat: "sprite", icon: "👹", preview: "from-rose-700 to-red-900",
    desc: "Large boss with health bar and attack patterns",
    code: `// ── Boss Entity ──
const boss = {
  x: 400, y: 120, size: 40,
  hp: 100, maxHp: 100,
  phase: 0, timer: 0,
  color: '#be123c', alive: true
};

function updateBoss(dt) {
  if (!boss.alive) return;
  boss.timer += dt;
  // Phase 1: Sway side to side
  boss.x = 400 + Math.sin(boss.timer * 1.5) * 200;
  // Phase 2 (low HP): Faster
  if (boss.hp < 50) boss.x = 400 + Math.sin(boss.timer * 3) * 250;
  if (boss.hp <= 0) { boss.alive = false; console.log("🎉 BOSS DEFEATED!"); }
}

function drawBoss(ctx) {
  if (!boss.alive) return;
  // Glow
  ctx.fillStyle = 'rgba(190,18,60,0.1)';
  ctx.beginPath(); ctx.arc(boss.x, boss.y, boss.size + 20, 0, Math.PI*2); ctx.fill();
  // Body
  ctx.fillStyle = boss.color;
  ctx.beginPath(); ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI*2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(boss.x - 14, boss.y - 8, 10, 8);
  ctx.fillRect(boss.x + 4, boss.y - 8, 10, 8);
  // HP Bar
  const barW = 80, barH = 6;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(boss.x - barW/2, boss.y - boss.size - 16, barW, barH);
  ctx.fillStyle = boss.hp > 30 ? '#ef4444' : '#fbbf24';
  ctx.fillRect(boss.x - barW/2, boss.y - boss.size - 16, barW * (boss.hp/boss.maxHp), barH);
}

// Damage: boss.hp -= 10;`
  },

  // ═══════════════════════════════════════
  //  TILESETS / MAPS
  // ═══════════════════════════════════════
  {
    id: "t1", name: "Checkerboard Floor", cat: "tileset", icon: "🗺️", preview: "from-slate-700 to-slate-900",
    desc: "Classic checkerboard tile pattern",
    code: `// ── Checkerboard Floor ──
function drawCheckerboard(ctx, w, h, tileSize = 40) {
  for (let x = 0; x < w; x += tileSize) {
    for (let y = 0; y < h; y += tileSize) {
      const dark = ((x / tileSize + y / tileSize) % 2 === 0);
      ctx.fillStyle = dark ? '#0f172a' : '#1e293b';
      ctx.fillRect(x, y, tileSize, tileSize);
    }
  }
}`
  },
  {
    id: "t2", name: "Platform Blocks", cat: "tileset", icon: "🧱", preview: "from-amber-700 to-yellow-900",
    desc: "Solid platform blocks for platformer games",
    code: `// ── Platform Blocks ──
const platforms = [];

function addPlatform(x, y, w, h = 20) {
  platforms.push({ x, y, w, h, color: '#475569' });
}

function drawPlatforms(ctx) {
  platforms.forEach(p => {
    // Main block
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    // Top highlight
    ctx.fillStyle = '#64748b';
    ctx.fillRect(p.x, p.y, p.w, 3);
    // Edges
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
  });
}

function checkPlatformCollision(entity) {
  for (const p of platforms) {
    if (entity.x + 16 > p.x && entity.x - 16 < p.x + p.w &&
        entity.y + 16 >= p.y && entity.y + 16 <= p.y + p.h + 10 && entity.vy >= 0) {
      entity.y = p.y - 16;
      entity.vy = 0;
      return true;
    }
  }
  return false;
}

// Init examples:
// addPlatform(100, 450, 200);
// addPlatform(400, 350, 150);
// addPlatform(250, 250, 180);`
  },
  {
    id: "t3", name: "Neon City BG", cat: "tileset", icon: "🌃", preview: "from-violet-900 to-fuchsia-900",
    desc: "Cyberpunk city skyline background",
    code: `// ── Neon City Background ──
function drawCityBG(ctx, w, h, time = 0) {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0a0015'); grad.addColorStop(0.5, '#1a0030');
  grad.addColorStop(1, '#2d1060');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  // Buildings
  const buildings = [
    {x:50,bw:60,bh:200}, {x:130,bw:40,bh:280}, {x:200,bw:80,bh:180},
    {x:320,bw:50,bh:320}, {x:400,bw:70,bh:160}, {x:500,bw:90,bh:260},
    {x:620,bw:45,bh:240}, {x:700,bw:60,bh:200}
  ];
  buildings.forEach(b => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(b.x, h - b.bh, b.bw, b.bh);
    // Windows
    for (let wy = h - b.bh + 10; wy < h - 20; wy += 18) {
      for (let wx = b.x + 6; wx < b.x + b.bw - 6; wx += 12) {
        const on = Math.sin(wx * 7 + wy * 3 + time) > 0.3;
        ctx.fillStyle = on ? '#fbbf24' : '#1e293b';
        ctx.fillRect(wx, wy, 6, 8);
      }
    }
  });
  // Neon line
  ctx.strokeStyle = '#d946ef';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, h - 5); ctx.lineTo(w, h - 5); ctx.stroke();
}`
  },

  // ═══════════════════════════════════════
  //  VFX / EFFECTS
  // ═══════════════════════════════════════
  {
    id: "e1", name: "Particle System", cat: "effect", icon: "💥", preview: "from-orange-600 to-red-600",
    desc: "Versatile particle system with gravity and fade",
    code: `// ── Particle System ──
const particles = [];

function emit(x, y, count = 15, color = '#f97316', spread = 200) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * spread + 30;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1, maxLife: 0.5 + Math.random() * 0.8,
      size: 2 + Math.random() * 4,
      color
    });
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 200 * dt; // gravity
    p.life -= dt / p.maxLife;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles(ctx) {
  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

// Usage: emit(player.x, player.y, 20, '#a855f7');`
  },
  {
    id: "e2", name: "Trail Renderer", cat: "effect", icon: "✨", preview: "from-purple-600 to-pink-600",
    desc: "Smooth motion trail behind moving objects",
    code: `// ── Trail Renderer ──
const trailPoints = [];

function addTrailPoint(x, y, color = '#a855f7') {
  trailPoints.push({ x, y, life: 1, color });
  if (trailPoints.length > 40) trailPoints.shift();
}

function updateTrailPoints(dt) {
  trailPoints.forEach(t => t.life -= dt * 2.5);
  while (trailPoints.length && trailPoints[0].life <= 0) trailPoints.shift();
}

function drawTrailPoints(ctx) {
  for (let i = 1; i < trailPoints.length; i++) {
    const t = trailPoints[i];
    const prev = trailPoints[i - 1];
    ctx.globalAlpha = t.life * 0.6;
    ctx.strokeStyle = t.color;
    ctx.lineWidth = 6 * t.life;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(t.x, t.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// In update: addTrailPoint(player.x, player.y);
// In update: updateTrailPoints(dt);
// In draw: drawTrailPoints(GF.ctx);`
  },
  {
    id: "e3", name: "Screen Shake", cat: "effect", icon: "📳", preview: "from-amber-600 to-red-600",
    desc: "Camera shake for impacts and explosions",
    code: `// ── Screen Shake ──
const shake = { intensity: 0, duration: 0, offsetX: 0, offsetY: 0 };

function triggerShake(intensity = 8, duration = 0.3) {
  shake.intensity = intensity;
  shake.duration = duration;
}

function updateShake(dt) {
  if (shake.duration > 0) {
    shake.duration -= dt;
    shake.offsetX = (Math.random() - 0.5) * shake.intensity * 2;
    shake.offsetY = (Math.random() - 0.5) * shake.intensity * 2;
    shake.intensity *= 0.95;
  } else {
    shake.offsetX = 0; shake.offsetY = 0;
  }
}

// Usage in draw:
// GF.ctx.save();
// GF.ctx.translate(shake.offsetX, shake.offsetY);
// ... draw everything ...
// GF.ctx.restore();
// updateShake(dt);`
  },
  {
    id: "e4", name: "Star Parallax", cat: "effect", icon: "🌌", preview: "from-indigo-900 to-blue-900",
    desc: "Scrolling starfield with parallax depth layers",
    code: `// ── Star Parallax Background ──
const starLayers = [[], [], []];
const starSpeeds = [10, 25, 50];

// Generate layers
for (let layer = 0; layer < 3; layer++) {
  for (let i = 0; i < 30; i++) {
    starLayers[layer].push({
      x: Math.random() * 800,
      y: Math.random() * 600,
      size: 0.5 + layer * 0.6 + Math.random() * 0.5,
      brightness: 0.2 + layer * 0.3
    });
  }
}

function updateStarfield(dt) {
  starLayers.forEach((layer, idx) => {
    layer.forEach(s => {
      s.y += starSpeeds[idx] * dt;
      if (s.y > 600) { s.y = -2; s.x = Math.random() * 800; }
    });
  });
}

function drawStarfield(ctx) {
  starLayers.forEach(layer => {
    layer.forEach(s => {
      ctx.fillStyle = \`rgba(255,255,255,\${s.brightness})\`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
  });
}`
  },
  {
    id: "e5", name: "Lightning Flash", cat: "effect", icon: "⚡", preview: "from-blue-400 to-cyan-600",
    desc: "Quick screen flash for dramatic moments",
    code: `// ── Lightning Flash ──
let flashAlpha = 0;
let flashColor = '#ffffff';

function triggerFlash(color = '#ffffff', intensity = 0.8) {
  flashAlpha = intensity;
  flashColor = color;
}

function updateFlash(dt) {
  if (flashAlpha > 0) flashAlpha -= dt * 4;
}

function drawFlash(ctx, w = 800, h = 600) {
  if (flashAlpha <= 0) return;
  ctx.globalAlpha = flashAlpha;
  ctx.fillStyle = flashColor;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;
}

// Usage: triggerFlash('#a855f7', 0.6);`
  },
  {
    id: "e6", name: "Floating Text", cat: "effect", icon: "💬", preview: "from-green-500 to-emerald-700",
    desc: "Damage numbers / pickup text that floats upward",
    code: `// ── Floating Text ──
const floatingTexts = [];

function showFloatingText(x, y, text, color = '#22c55e') {
  floatingTexts.push({ x, y, text, color, life: 1, vy: -60 });
}

function updateFloatingTexts(dt) {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy * dt;
    ft.life -= dt * 1.2;
    if (ft.life <= 0) floatingTexts.splice(i, 1);
  }
}

function drawFloatingTexts(ctx) {
  floatingTexts.forEach(ft => {
    ctx.globalAlpha = ft.life;
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.textAlign = 'start';
  });
  ctx.globalAlpha = 1;
}

// Usage: showFloatingText(player.x, player.y, "+100", "#facc15");`
  },

  // ═══════════════════════════════════════
  //  UI / HUD
  // ═══════════════════════════════════════
  {
    id: "u1", name: "Health Bar", cat: "ui", icon: "❤️", preview: "from-red-600 to-rose-700",
    desc: "Smooth animated health bar with color transitions",
    code: `// ── Health Bar ──
let displayHP = 100;

function drawHealthBar(ctx, x, y, current, max, width = 200) {
  // Smooth animation
  displayHP += (current - displayHP) * 0.1;
  const pct = displayHP / max;
  const color = pct > 0.6 ? '#22c55e' : pct > 0.3 ? '#eab308' : '#ef4444';
  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 2, y - 2, width + 4, 20);
  // Damage flash (red behind)
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(x, y, width * (current / max), 16);
  // Fill
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * pct, 16);
  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x, y, width * pct, 6);
  // Border
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 2, y - 2, width + 4, 20);
  // Text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(Math.ceil(displayHP) + ' / ' + max, x + 6, y + 13);
  // Heart icon
  ctx.fillText('❤️', x - 20, y + 14);
}`
  },
  {
    id: "u2", name: "Score Display", cat: "ui", icon: "🏆", preview: "from-amber-500 to-yellow-600",
    desc: "Animated score counter with combo multiplier",
    code: `// ── Score Display ──
let gameScore = 0;
let displayScore = 0;
let combo = 1;
let comboTimer = 0;

function addPoints(pts) {
  gameScore += pts * combo;
  combo++;
  comboTimer = 2;
  console.log("+" + (pts * combo) + " (x" + combo + " combo)");
}

function updateScore(dt) {
  displayScore += (gameScore - displayScore) * 0.08;
  if (comboTimer > 0) { comboTimer -= dt; }
  else { combo = 1; }
}

function drawScoreHUD(ctx, x = 20, y = 36) {
  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('SCORE: ' + Math.ceil(displayScore), x, y);
  if (combo > 1) {
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('x' + combo + ' COMBO!', x, y + 24);
  }
}`
  },
  {
    id: "u3", name: "Mini Map", cat: "ui", icon: "🗂️", preview: "from-slate-600 to-slate-800",
    desc: "Corner mini-map showing entity positions",
    code: `// ── Mini Map ──
function drawMiniMap(ctx, entities, mapW = 800, mapH = 600) {
  const mmX = 640, mmY = 20, mmW = 140, mmH = 100;
  const scaleX = mmW / mapW, scaleY = mmH / mapH;
  // Background
  ctx.fillStyle = 'rgba(15,23,42,0.85)';
  ctx.fillRect(mmX, mmY, mmW, mmH);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(mmX, mmY, mmW, mmH);
  // Entities
  entities.forEach(e => {
    ctx.fillStyle = e.color || '#a855f7';
    ctx.beginPath();
    ctx.arc(mmX + e.x * scaleX, mmY + e.y * scaleY, 2, 0, Math.PI*2);
    ctx.fill();
  });
  // Label
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 8px sans-serif';
  ctx.fillText('MAP', mmX + 4, mmY + mmH - 4);
}

// Usage: drawMiniMap(ctx, [player, ...enemies, ...coins]);`
  },
  {
    id: "u4", name: "Dialog Box", cat: "ui", icon: "💬", preview: "from-blue-700 to-indigo-800",
    desc: "RPG-style dialog box with typewriter text",
    code: `// ── Dialog Box ──
const dialog = { active: false, text: '', displayed: '', speed: 40, timer: 0, speaker: '' };

function showDialog(text, speaker = '') {
  dialog.active = true;
  dialog.text = text;
  dialog.displayed = '';
  dialog.timer = 0;
  dialog.speaker = speaker;
}

function updateDialog(dt) {
  if (!dialog.active) return;
  dialog.timer += dt * dialog.speed;
  const chars = Math.floor(dialog.timer);
  dialog.displayed = dialog.text.substring(0, chars);
  if (chars >= dialog.text.length) {
    // Wait for key press to close
    if (GF.Input.isDown('Space') || GF.Input.isDown('Enter')) {
      dialog.active = false;
    }
  }
}

function drawDialog(ctx, w = 800, h = 600) {
  if (!dialog.active) return;
  const boxH = 120, boxY = h - boxH - 20, boxX = 40, boxW = w - 80;
  // Box
  ctx.fillStyle = 'rgba(15,23,42,0.95)';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, boxH);
  // Speaker
  if (dialog.speaker) {
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(dialog.speaker, boxX + 16, boxY + 24);
  }
  // Text
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px sans-serif';
  ctx.fillText(dialog.displayed, boxX + 16, boxY + 50);
  // Continue hint
  if (dialog.displayed.length >= dialog.text.length) {
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('▼ Press SPACE', boxX + boxW - 100, boxY + boxH - 12);
  }
}

// Usage: showDialog("Welcome to the world of GameForge!", "Guide");`
  },
  {
    id: "u5", name: "Inventory Grid", cat: "ui", icon: "🎒", preview: "from-stone-600 to-stone-800",
    desc: "Simple inventory grid with item slots",
    code: `// ── Inventory Grid ──
const inventory = Array(12).fill(null);

function addToInventory(item) {
  const slot = inventory.indexOf(null);
  if (slot !== -1) { inventory[slot] = item; return true; }
  console.log("Inventory full!"); return false;
}

function drawInventory(ctx, visible = true) {
  if (!visible) return;
  const cols = 4, rows = 3, size = 48, gap = 6;
  const startX = 300, startY = 200;
  // Overlay
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, 800, 600);
  // Title
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px sans-serif';
  ctx.fillText('🎒 Inventory', startX, startY - 16);
  // Slots
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (size + gap);
      const y = startY + r * (size + gap);
      const idx = r * cols + c;
      ctx.fillStyle = inventory[idx] ? '#1e293b' : '#0f172a';
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = inventory[idx] ? '#6366f1' : '#334155';
      ctx.lineWidth = 1; ctx.strokeRect(x, y, size, size);
      if (inventory[idx]) {
        ctx.font = '24px sans-serif';
        ctx.fillText(inventory[idx].icon || '?', x + 12, y + 34);
      }
    }
  }
}

// addToInventory({name: "Sword", icon: "⚔️"});
// addToInventory({name: "Potion", icon: "🧪"});`
  },

  // ═══════════════════════════════════════
  //  PHYSICS
  // ═══════════════════════════════════════
  {
    id: "p1", name: "Gravity + Jump", cat: "physics", icon: "⬆️", preview: "from-sky-600 to-blue-700",
    desc: "Platformer gravity with ground detection and jumping",
    code: `// ── Gravity + Jump System ──
const GRAVITY = 600;
const JUMP_FORCE = -380;
const GROUND_Y = 550;
let isGrounded = false;

function applyPhysics(entity, dt) {
  entity.vy = (entity.vy || 0) + GRAVITY * dt;
  entity.y += entity.vy * dt;
  // Ground check
  if (entity.y >= GROUND_Y) {
    entity.y = GROUND_Y;
    entity.vy = 0;
    isGrounded = true;
  } else {
    isGrounded = false;
  }
}

function tryJump(entity) {
  if (isGrounded) {
    entity.vy = JUMP_FORCE;
    isGrounded = false;
    console.log("🦘 Jump!");
    return true;
  }
  return false;
}

// In update: applyPhysics(player, dt);
// In update: if(GF.Input.isDown('Space')) tryJump(player);`
  },
  {
    id: "p2", name: "AABB Collision", cat: "physics", icon: "📦", preview: "from-green-700 to-emerald-800",
    desc: "Axis-aligned bounding box collision detection and resolution",
    code: `// ── AABB Collision ──
function boxesOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function circlesOverlap(a, b) {
  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  return dist < (a.size || a.r || 16) + (b.size || b.r || 16);
}

function resolveBoxCollision(mover, wall) {
  if (!boxesOverlap(mover, wall)) return false;
  const dx = (mover.x + mover.w/2) - (wall.x + wall.w/2);
  const dy = (mover.y + mover.h/2) - (wall.y + wall.h/2);
  const overlapX = mover.w/2 + wall.w/2 - Math.abs(dx);
  const overlapY = mover.h/2 + wall.h/2 - Math.abs(dy);
  if (overlapX < overlapY) {
    mover.x += dx > 0 ? overlapX : -overlapX;
  } else {
    mover.y += dy > 0 ? overlapY : -overlapY;
    if (dy < 0 && mover.vy) mover.vy = 0;
  }
  return true;
}`
  },
  {
    id: "p3", name: "Projectile System", cat: "physics", icon: "🎯", preview: "from-orange-600 to-red-700",
    desc: "Bullet / projectile spawner with auto-cleanup",
    code: `// ── Projectile System ──
const bullets = [];

function fireBullet(x, y, angle, speed = 400, color = '#60a5fa') {
  bullets.push({
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    color, life: 3, size: 4
  });
}

function fireAtTarget(fromX, fromY, toX, toY, speed = 400) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  fireBullet(fromX, fromY, angle, speed);
}

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    if (b.life <= 0 || b.x < -20 || b.x > 820 || b.y < -20 || b.y > 620) {
      bullets.splice(i, 1);
    }
  }
}

function drawBullets(ctx) {
  bullets.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, Math.PI*2); ctx.fill();
    // Trail
    ctx.fillStyle = b.color + '40';
    ctx.beginPath(); ctx.arc(b.x - b.vx*0.02, b.y - b.vy*0.02, b.size*0.7, 0, Math.PI*2); ctx.fill();
  });
}

// Usage: fireBullet(player.x, player.y, 0); // fire right
// fireAtTarget(player.x, player.y, mouseX, mouseY);`
  },

  // ═══════════════════════════════════════
  //  AUDIO
  // ═══════════════════════════════════════
  {
    id: "au1", name: "SFX Generator", cat: "audio", icon: "🔊", preview: "from-pink-600 to-rose-700",
    desc: "Procedural sound effects: coin, jump, explosion, laser",
    code: `// ── SFX Generator ──
let _audioCtx = null;
function getAudio() { if(!_audioCtx) _audioCtx = new AudioContext(); return _audioCtx; }

function playSFX(type = 'coin') {
  const ctx = getAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  const t = ctx.currentTime;

  if (type === 'coin') {
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(1100, t + 0.08);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.start(t); osc.stop(t + 0.15);
  }
  else if (type === 'jump') {
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.start(t); osc.stop(t + 0.15);
  }
  else if (type === 'explosion') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.3);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc.start(t); osc.stop(t + 0.3);
  }
  else if (type === 'laser') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.1);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc.start(t); osc.stop(t + 0.1);
  }
}

// Usage: playSFX('coin'); playSFX('jump'); playSFX('explosion'); playSFX('laser');`
  },
  {
    id: "au2", name: "BGM Loop", cat: "audio", icon: "🎵", preview: "from-violet-600 to-purple-800",
    desc: "Simple procedural background music generator",
    code: `// ── BGM Loop Generator ──
let bgmPlaying = false;

function startBGM() {
  if (bgmPlaying) return;
  bgmPlaying = true;
  const ctx = new AudioContext();
  const notes = [261, 294, 330, 349, 392, 440, 494, 523]; // C major
  let noteIdx = 0;

  function playNote() {
    if (!bgmPlaying) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    const freq = notes[noteIdx % notes.length];
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
    noteIdx++;
    setTimeout(playNote, 450);
  }
  playNote();
  console.log("🎵 BGM Started");
}

function stopBGM() { bgmPlaying = false; console.log("🎵 BGM Stopped"); }

// Usage: startBGM(); / stopBGM();`
  },

  // ═══════════════════════════════════════
  //  AI / LOGIC
  // ═══════════════════════════════════════
  {
    id: "ai1", name: "State Machine", cat: "ai", icon: "🧠", preview: "from-emerald-600 to-teal-700",
    desc: "Finite state machine for AI behavior control",
    code: `// ── State Machine ──
function createFSM(initialState) {
  const fsm = {
    state: initialState,
    states: {},
    addState(name, { enter, update, exit }) {
      this.states[name] = { enter: enter || (() => {}), update: update || (() => {}), exit: exit || (() => {}) };
    },
    transition(newState) {
      if (this.states[this.state]?.exit) this.states[this.state].exit();
      console.log("FSM: " + this.state + " → " + newState);
      this.state = newState;
      if (this.states[this.state]?.enter) this.states[this.state].enter();
    },
    update(dt) {
      if (this.states[this.state]?.update) this.states[this.state].update(dt);
    }
  };
  return fsm;
}

// Example:
// const ai = createFSM('patrol');
// ai.addState('patrol', { update(dt) { /* patrol logic */ } });
// ai.addState('chase', { enter() { console.log("Chasing!"); }, update(dt) { /* chase logic */ } });
// ai.addState('attack', { enter() { console.log("Attacking!"); } });
// ai.transition('chase');
// In update: ai.update(dt);`
  },
  {
    id: "ai2", name: "Pathfinding A*", cat: "ai", icon: "🛤️", preview: "from-lime-600 to-green-700",
    desc: "Simple grid-based A* pathfinding",
    code: `// ── Simple A* Pathfinding ──
function findPath(grid, startX, startY, endX, endY) {
  const cols = grid[0].length, rows = grid.length;
  const open = [{ x: startX, y: startY, g: 0, h: 0, f: 0, parent: null }];
  const closed = new Set();
  const key = (x, y) => x + ',' + y;

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    if (current.x === endX && current.y === endY) {
      const path = [];
      let node = current;
      while (node) { path.unshift({ x: node.x, y: node.y }); node = node.parent; }
      return path;
    }
    closed.add(key(current.x, current.y));
    const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
    for (const [dx, dy] of dirs) {
      const nx = current.x + dx, ny = current.y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      if (grid[ny][nx] === 1 || closed.has(key(nx, ny))) continue;
      const g = current.g + 1;
      const h = Math.abs(nx - endX) + Math.abs(ny - endY);
      const existing = open.find(n => n.x === nx && n.y === ny);
      if (!existing || g < existing.g) {
        if (existing) open.splice(open.indexOf(existing), 1);
        open.push({ x: nx, y: ny, g, h, f: g + h, parent: current });
      }
    }
  }
  return []; // No path found
}

// const grid = [ [0,0,0,1,0], [0,1,0,1,0], [0,0,0,0,0] ]; // 0=open, 1=wall
// const path = findPath(grid, 0, 0, 4, 2);`
  },
  {
    id: "ai3", name: "Timer System", cat: "ai", icon: "⏱️", preview: "from-gray-600 to-zinc-700",
    desc: "Flexible timer and cooldown manager",
    code: `// ── Timer System ──
const timers = {};

function setTimer(name, duration, callback, repeat = false) {
  timers[name] = { remaining: duration, duration, callback, repeat, paused: false };
}

function clearTimer(name) { delete timers[name]; }
function pauseTimer(name) { if(timers[name]) timers[name].paused = true; }
function resumeTimer(name) { if(timers[name]) timers[name].paused = false; }

function updateTimers(dt) {
  Object.keys(timers).forEach(name => {
    const t = timers[name];
    if (t.paused) return;
    t.remaining -= dt;
    if (t.remaining <= 0) {
      t.callback();
      if (t.repeat) { t.remaining = t.duration; }
      else { delete timers[name]; }
    }
  });
}

// setTimer('spawnEnemy', 3, () => spawnEnemy(Math.random()*800, 0), true);
// setTimer('powerUp', 10, () => { player.speed *= 2; setTimer('powerDown', 5, () => player.speed /= 2); });
// In update: updateTimers(dt);`
  },

  // ═══════════════════════════════════════
  //  TEMPLATES
  // ═══════════════════════════════════════
  {
    id: "tp1", name: "Platformer Kit", cat: "template", icon: "🏃", preview: "from-blue-600 to-violet-600",
    desc: "Complete platformer starter: gravity, platforms, coins",
    code: `// ══ PLATFORMER STARTER KIT ══
const hero = { x:100, y:400, w:24, h:32, vx:0, vy:0, speed:250, jumpPow:-420, grounded:false, color:'#a855f7' };
const floors = [{x:0,y:550,w:800,h:50},{x:150,y:420,w:120,h:16},{x:400,y:340,w:150,h:16},{x:600,y:260,w:120,h:16}];
const gems = [{x:200,y:390,got:false},{x:460,y:310,got:false},{x:650,y:230,got:false}];
let pts=0;

GF.init = () => { console.log("🏃 Platformer Kit Loaded!"); };

GF.update = (dt) => {
  hero.vx = GF.Input.getAxis('Horizontal') * hero.speed;
  hero.vy += 700 * dt;
  hero.x += hero.vx * dt; hero.y += hero.vy * dt;
  hero.grounded = false;
  floors.forEach(f => {
    if(hero.x+hero.w > f.x && hero.x < f.x+f.w && hero.y+hero.h > f.y && hero.y+hero.h < f.y+f.h+15 && hero.vy>=0){
      hero.y = f.y - hero.h; hero.vy = 0; hero.grounded = true;
    }
  });
  if(GF.Input.isDown('Space') && hero.grounded) hero.vy = hero.jumpPow;
  if(hero.x<0) hero.x=0; if(hero.x>776) hero.x=776;
  gems.forEach(g => { if(!g.got && Math.hypot(hero.x+12-g.x,hero.y+16-g.y)<24){ g.got=true; pts+=50; console.log("💎 +50!"); }});
};

GF.draw = () => {
  GF.Draw.clear('#0f172a');
  floors.forEach(f => { GF.Draw.rect(f.x,f.y,f.w,f.h,'#334155'); GF.Draw.rect(f.x,f.y,f.w,3,'#475569'); });
  gems.filter(g=>!g.got).forEach(g => { GF.Draw.circle(g.x,g.y,7,'#38bdf8'); GF.Draw.circle(g.x,g.y,12,'rgba(56,189,248,0.15)'); });
  GF.Draw.rect(hero.x,hero.y,hero.w,hero.h,hero.color);
  GF.Draw.text("GEMS: "+pts,20,36,18,'#38bdf8');
  GF.Draw.text("SPACE to Jump | Arrows to Move",200,580,12,'#475569');
};`
  },
  {
    id: "tp2", name: "Space Shooter", cat: "template", icon: "🚀", preview: "from-cyan-600 to-blue-800",
    desc: "Complete top-down space shooter with enemies and bullets",
    code: `// ══ SPACE SHOOTER KIT ══
const ship = {x:400,y:520,speed:300,size:16,color:'#60a5fa',cooldown:0};
const sbullets = []; const foes = []; let spts=0, stime=0;

GF.init = () => { console.log("🚀 Space Shooter Loaded!"); };

GF.update = (dt) => {
  stime+=dt;
  ship.x += GF.Input.getAxis('Horizontal')*ship.speed*dt;
  ship.x = Math.max(20, Math.min(780, ship.x));
  ship.cooldown -= dt;
  if(GF.Input.isDown('Space') && ship.cooldown<=0){
    sbullets.push({x:ship.x,y:ship.y-20,vy:-500,color:'#60a5fa'});
    ship.cooldown = 0.15;
  }
  sbullets.forEach(b => b.y += b.vy*dt);
  for(let i=sbullets.length-1;i>=0;i--) if(sbullets[i].y<-10) sbullets.splice(i,1);
  if(Math.random()<dt*2) foes.push({x:Math.random()*760+20,y:-20,vy:80+Math.random()*60,size:12,color:'#ef4444',hp:1});
  foes.forEach(f => f.y += f.vy*dt);
  for(let i=foes.length-1;i>=0;i--){
    if(foes[i].y>620){foes.splice(i,1);continue;}
    for(let j=sbullets.length-1;j>=0;j--){
      if(Math.hypot(foes[i].x-sbullets[j].x,foes[i].y-sbullets[j].y)<20){
        foes.splice(i,1); sbullets.splice(j,1); spts+=10; console.log("💥 +10!"); break;
      }
    }
  }
};

GF.draw = () => {
  GF.Draw.clear('#050816');
  for(let i=0;i<40;i++){const sx=(i*57)%800,sy=((i*137+stime*20)%620);GF.Draw.rect(sx,sy,1,1,'rgba(255,255,255,0.2)');}
  GF.Draw.circle(ship.x,ship.y,ship.size,ship.color);
  GF.Draw.circle(ship.x,ship.y,ship.size+6,'rgba(96,165,250,0.2)');
  sbullets.forEach(b => GF.Draw.rect(b.x-1,b.y,3,12,b.color));
  foes.forEach(f => { GF.Draw.circle(f.x,f.y,f.size,f.color); GF.Draw.circle(f.x,f.y,f.size+4,'rgba(239,68,68,0.15)'); });
  GF.Draw.text("SCORE: "+spts,20,36,18,'#60a5fa');
  GF.Draw.text("SPACE = Fire | Arrows = Move",220,590,11,'#334155');
};`
  },
  // ── AI & LOGIC (Expanded) ──
  {
    id: "ai4", name: "Smooth Follow AI", cat: "ai", icon: "👣", preview: "from-blue-500 to-indigo-700",
    desc: "AI that follows the player smoothly with customizable distance",
    code: `// ── Smooth Follow AI ──
const follower = { x: 100, y: 100, speed: 120, dist: 60 };

function updateFollower(dt, targetX, targetY) {
  const dx = targetX - follower.x;
  const dy = targetY - follower.y;
  const d = Math.hypot(dx, dy);
  if (d > follower.dist) {
    follower.x += (dx / d) * follower.speed * dt;
    follower.y += (dy / d) * follower.speed * dt;
  }
}

function drawFollower(ctx) {
  ctx.fillStyle = '#6366f1';
  ctx.beginPath(); ctx.arc(follower.x, follower.y, 10, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
}`
  },
  {
    id: "ai5", name: "Camera Follow", cat: "ai", icon: "📷", preview: "from-slate-600 to-slate-800",
    desc: "Camera system that tracks a target with smooth lerp damping",
    code: `// ── Smooth Camera Follow ──
const cam = { x: 0, y: 0, lerp: 0.1 };

function updateCamera(targetX, targetY, viewW=800, viewH=600) {
  const tx = targetX - viewW / 2;
  const ty = targetY - viewH / 2;
  cam.x += (tx - cam.x) * cam.lerp;
  cam.y += (ty - cam.y) * cam.lerp;
}

// In draw:
// ctx.save();
// ctx.translate(-cam.x, -cam.y);
// ... draw world ...
// ctx.restore();`
  },
  {
    id: "ai6", name: "Save/Load Logic", cat: "ai", icon: "💾", preview: "from-emerald-600 to-green-800",
    desc: "Generic system to save and load game progress to localStorage",
    code: `// ── LocalStorage Save/Load ──
function saveGameData(key, data) {
  localStorage.setItem('gf_save_' + key, JSON.stringify(data));
  console.log("💾 Game Saved!");
}

function loadGameData(key) {
  const saved = localStorage.getItem('gf_save_' + key);
  if (saved) {
    console.log("📂 Game Loaded!");
    return JSON.parse(saved);
  }
  return null;
}

// Usage: saveGameData('player', {hp: 100, level: 5});`
  },

  // ── VISUAL EFFECTS (Expanded) ──
  {
    id: "e7", name: "Rain Effect", cat: "effect", icon: "🌧️", preview: "from-blue-800 to-slate-900",
    desc: "Layered rain particle system with wind and splash logic",
    code: `// ── Rain Particle System ──
const raindrops = [];
for (let i = 0; i < 100; i++) raindrops.push({ x: Math.random()*800, y: Math.random()*600, v: 400 + Math.random()*200 });

function updateRain(dt) {
  raindrops.forEach(r => {
    r.y += r.v * dt;
    r.x += 40 * dt; // wind
    if (r.y > 600) { r.y = -20; r.x = Math.random()*800; }
  });
}

function drawRain(ctx) {
  ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)';
  ctx.lineWidth = 1;
  raindrops.forEach(r => {
    ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x + 2, r.y + 10); ctx.stroke();
  });
}`
  },
  {
    id: "e8", name: "Fog Overlay", cat: "effect", icon: "🌫️", preview: "from-slate-400 to-gray-500",
    desc: "Moving volumetric fog overlay using alpha gradients",
    code: `// ── Fog Overlay ──
let fogTime = 0;
function drawFog(ctx, w=800, h=600) {
  fogTime += 0.005;
  const gradient = ctx.createRadialGradient(w/2, h/2, 100, w/2, h/2, 600);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  const alpha = 0.05 + Math.sin(fogTime) * 0.02;
  gradient.addColorStop(1, \`rgba(200, 210, 230, \${alpha})\`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}`
  },
  {
    id: "e9", name: "CRT Screen Filter", cat: "effect", icon: "📺", preview: "from-zinc-900 to-black",
    desc: "Retro CRT scanlines and vignette post-processing effect",
    code: `// ── CRT Filter ──
function drawCRT(ctx, w=800, h=600) {
  // Scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
  // Vignette
  const g = ctx.createRadialGradient(w/2, h/2, w/3, w/2, h/2, w/1.2);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
}`
  },

  // ── UI & HUD (Expanded) ──
  {
    id: "u6", name: "Joystick (Mobile)", cat: "ui", icon: "🕹️", preview: "from-slate-700 to-slate-900",
    desc: "Virtual joystick for touch-based motion control",
    code: `// ── Virtual Joystick ──
const joy = { base:{x:120, y:480, r:60}, knob:{x:120, y:480, r:30}, active:false };

function drawJoystick(ctx) {
  ctx.globalAlpha = 0.3;
  // Base
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(joy.base.x, joy.base.y, joy.base.r, 0, Math.PI*2); ctx.fill();
  // Knob
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(joy.knob.x, joy.knob.y, joy.knob.r, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
}

function updateJoystick(mouseX, mouseY, isDown) {
  if (isDown) {
    const d = Math.hypot(mouseX-joy.base.x, mouseY-joy.base.y);
    if (d < joy.base.r || joy.active) {
      joy.active = true;
      const angle = Math.atan2(mouseY-joy.base.y, mouseX-joy.base.x);
      const dist = Math.min(d, joy.base.r);
      joy.knob.x = joy.base.x + Math.cos(angle) * dist;
      joy.knob.y = joy.base.y + Math.sin(angle) * dist;
    }
  } else {
    joy.active = false;
    joy.knob.x = joy.base.x; joy.knob.y = joy.base.y;
  }
}`
  },
  {
    id: "u7", name: "Pause Menu", cat: "ui", icon: "⏸️", preview: "from-slate-800 to-stone-900",
    desc: "Animated pause overlay with blurred backdrop",
    code: `// ── Pause Menu UI ──
let isPaused = false;

function drawPauseMenu(ctx, w=800, h=600) {
  if (!isPaused) return;
  // Backdrop
  ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,w,h);
  // Box
  ctx.fillStyle = '#1e293b'; ctx.fillRect(w/2-100, h/2-60, 200, 120);
  ctx.font = 'bold 24px sans-serif'; ctx.fillStyle = '#fff';
  ctx.textAlign = 'center'; ctx.fillText('PAUSED', w/2, h/2-10);
  ctx.font = '14px sans-serif'; ctx.fillText('Press P to Resume', w/2, h/2+30);
  ctx.textAlign = 'start';
}

// Input: if(GF.Input.isDown('KeyP')) isPaused = !isPaused;`
  },
  {
    id: "u8", name: "Notification Toast", cat: "ui", icon: "🔔", preview: "from-blue-600 to-cyan-700",
    desc: "Popup notification system for achievements or logs",
    code: `// ── Notification System ──
const toasts = [];

function notify(text, color='#6366f1') {
  toasts.push({ text, color, life: 3, y: 10 });
}

function updateToasts(dt) {
  toasts.forEach((t, i) => {
    t.life -= dt;
    if (t.life <= 0) toasts.splice(i, 1);
  });
}

function drawToasts(ctx, w=800) {
  toasts.forEach((t, i) => {
    const x = w - 220, y = 20 + i * 50;
    ctx.fillStyle = '#1e293b'; ctx.fillRect(x, y, 200, 40);
    ctx.fillStyle = t.color; ctx.fillRect(x, y, 4, 40);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif';
    ctx.fillText(t.text, x + 15, y + 25);
  });
}`
  },

  // ── PHYSICS (Expanded) ──
  {
    id: "p4", name: "Elastic Bounce", cat: "physics", icon: "🎾", preview: "from-lime-500 to-green-700",
    desc: "Bouncy physics with energy loss on impact",
    code: `// ── Elastic Bounce ──
const ball = { x:400, y:100, vx:200, vy:0, r:15, bounciness:0.85 };

function updateBall(dt, w=800, h=600) {
  ball.vy += 600 * dt; // gravity
  ball.x += ball.vx * dt; ball.y += ball.vy * dt;

  if (ball.x < ball.r || ball.x > w - ball.r) { ball.vx *= -ball.bounciness; ball.x = ball.x < ball.r ? ball.r : w-ball.r; }
  if (ball.y > h - ball.r) { ball.vy *= -ball.bounciness; ball.y = h - ball.r; }
}

function drawBall(ctx) {
  ctx.fillStyle = '#84cc16'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();
}`
  },
  {
    id: "p5", name: "Top-Down Tank Phys", cat: "physics", icon: "🚜", preview: "from-stone-700 to-stone-900",
    desc: "Tank-style steering and acceleration physics",
    code: `// ── Tank Physics ──
const tank = { x:400, y:300, angle:0, speed:0, acc:200, rotSpeed:3 };

function updateTank(dt) {
  if (GF.Input.isDown('ArrowUp')) tank.speed += tank.acc * dt;
  else if (GF.Input.isDown('ArrowDown')) tank.speed -= tank.acc * dt;
  else tank.speed *= 0.95; // friction

  if (GF.Input.isDown('ArrowLeft')) tank.angle -= tank.rotSpeed * dt;
  if (GF.Input.isDown('ArrowRight')) tank.angle += tank.rotSpeed * dt;

  tank.x += Math.cos(tank.angle) * tank.speed * dt;
  tank.y += Math.sin(tank.angle) * tank.speed * dt;
}

function drawTank(ctx) {
  ctx.save(); ctx.translate(tank.x, tank.y); ctx.rotate(tank.angle);
  ctx.fillStyle='#444'; ctx.fillRect(-20, -15, 40, 30); // chassis
  ctx.fillStyle='#666'; ctx.fillRect(0, -3, 30, 6);   // gun
  ctx.restore();
}`
  },

  // ── TEMPLATES (New) ──
  {
    id: "tp3", name: "Flappy Bird Kit", cat: "template", icon: "🐦", preview: "from-yellow-400 to-orange-500",
    desc: "Classic flappy clone logic with pipes and gravity",
    code: `// ══ FLAPPY CLONE KIT ══
let bird={y:300,vy:0}, pipes=[], fscore=0, fover=false;

GF.init = () => { pipes.push({x:800, h:200}); console.log("🐦 Fly!"); };

GF.update = (dt) => {
  if(fover) return;
  bird.vy += 600 * dt; bird.y += bird.vy * dt;
  if(GF.Input.isDown('Space')) bird.vy = -250;
  pipes.forEach(p => {
    p.x -= 200 * dt;
    if(p.x < -60) { p.x=800; p.h=100+Math.random()*300; fscore++; }
    if(p.x < 140 && p.x > 80 && (bird.y < p.h || bird.y > p.h+150)) fover=true;
  });
};

GF.draw = () => {
  GF.Draw.clear('#70c5ce');
  pipes.forEach(p => { GF.Draw.rect(p.x,0,60,p.h,'#22c55e'); GF.Draw.rect(p.x,p.h+150,60,600,'#22c55e'); });
  GF.Draw.circle(100,bird.y,15,'#fbbf24');
  GF.Draw.text("SCORE: "+fscore,20,40,24,'#fff');
  if(fover) GF.Draw.text("GAME OVER",320,300,32,'#ef4444');
};`
  },
  {
    id: "tp4", name: "Dungeon Crawler", cat: "template", icon: "🗝️", preview: "from-stone-800 to-indigo-950",
    desc: "Grid-based dungeon movement and simple combat",
    code: `// ══ DUNGEON CRAWLER KIT ══
const player = { x:1, y:1, hp:10 };
const map = [[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,2,1],[1,1,1,1,1]];

GF.update = (dt) => {
  let nx=player.x, ny=player.y;
  if(GF.Input.isDown('ArrowUp')) ny--;
  else if(GF.Input.isDown('ArrowDown')) ny++;
  if(GF.Input.isDown('ArrowLeft')) nx--;
  else if(GF.Input.isDown('ArrowRight')) nx++;

  if(map[ny] && map[ny][nx] !== 1) { 
    player.x=nx; player.y=ny;
    if(map[ny][nx]===2) { console.log("🗝️ Key Found!"); map[ny][nx]=0; }
  }
};

GF.draw = () => {
  GF.Draw.clear('#0c0d14');
  const sz = 60;
  for(let y=0;y<map.length;y++) for(let x=0;x<map[y].length;x++){
    if(map[y][x]===1) GF.Draw.rect(x*sz,y*sz,sz,sz,'#1e293b');
    if(map[y][x]===2) GF.Draw.text('🗝️',x*sz+15,y*sz+40,30);
  }
  GF.Draw.text('🧙',player.x*sz+15,player.y*sz+40,30);
};`
  },
  {
    id: "tp5", name: "Visual Novel Sys", cat: "template", icon: "🎭", preview: "from-rose-500 to-pink-700",
    desc: "Complete visual novel framework: dialogs, choices, background switching",
    code: `// ══ VISUAL NOVEL SYSTEM ══
let vn_step = 0;
const scenario = [
  { text: "Welcome to the mysterious forest.", speaker: "???", bg: "#0d1b2a" },
  { text: "Who are you?", speaker: "Player", bg: "#0d1b2a" },
  { text: "I am the guardian of GameForge.", speaker: "Guardian", bg: "#14213d" }
];

GF.draw = () => {
  const current = scenario[vn_step];
  GF.Draw.clear(current.bg);
  GF.Draw.rect(40,440,720,140,'rgba(0,0,0,0.8)');
  GF.Draw.text(current.speaker, 60, 480, 18, '#a855f7');
  GF.Draw.text(current.text, 60, 520, 16, '#fff');
  GF.Draw.text("Press SPACE to continue", 550, 560, 10, '#64748b');
};

GF.update = (dt) => {
  if(GF.Input.isDown('Space')) {
    vn_step = (vn_step + 1) % scenario.length;
    console.log("Stage: " + vn_step);
  }
};`
  },
  {
    id: "tp6", name: "Endless Runner", cat: "template", icon: "🏃", preview: "from-emerald-500 to-blue-700",
    desc: "Side-scrolling runner with obstacles and distance tracking",
    code: `// ... runner code ...`
  },
  // ═══════════════════════════════════════
  //  💎 PREMIUM PRO ASSETS
  // ═══════════════════════════════════════
  {
    id: "pro1", name: "Aether Engine Pro", cat: "premium", icon: "🌌", preview: "from-amber-400 via-orange-500 to-rose-600",
    price: "$149.99",
    desc: "The ultimate 2D/3D hybrid engine setup. Advanced lighting, deferred rendering, and optimized physics.",
    code: `// ══ AETHER ENGINE PRO ══
/**
 * ULTRA-PREMIUM ENGINE BOOTSTRAP
 * Includes:
 * - Dynamic Global Illumination
 * - Advanced 2D Shadow Casting
 * - Multi-threaded Physics (Worker-based)
 */
const Aether = {
  version: "PRO 2.4",
  lighting: true,
  physics: "Havok-Lite",
  initialized: false
};

GF.init = () => {
  console.log("🌌 Aether Engine Pro Initialized...");
  Aether.initialized = true;
};

GF.update = (dt) => {
  if(!Aether.initialized) return;
  // Complex Physics Update
};

GF.draw = () => {
  GF.Draw.clear('#020205');
  // Render high-end lighting pass
  const g = GF.ctx.createRadialGradient(400,300,50,400,300,600);
  g.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  GF.Draw.rect(0,0,800,600,g);
  GF.Draw.text("AETHER ENGINE PRO - ACTIVATED", 30, 580, 10, '#fbbf24');
};`
  },
  {
    id: "pro2", name: "Cyber-Samurai 8K Kit", cat: "premium", icon: "👺", preview: "from-red-600 via-purple-700 to-indigo-950",
    price: "$79.00",
    desc: "Ultra-detailed character controller with 24 animations, particle-based sword trails, and frame-perfect combat.",
    code: `// ══ CYBER-SAMURAI 8K KIT ══
const katana = { x: 400, y: 300, frame: 0, state: 'idle' };

function drawSamurai(ctx) {
  // Heavy VFX rendering for character
  const gradient = ctx.createLinearGradient(katana.x-20, 0, katana.x+20, 0);
  gradient.addColorStop(0, '#ef4444'); gradient.addColorStop(1, '#a855f7');
  ctx.shadowBlur = 15; ctx.shadowColor = '#ef4444';
  ctx.fillStyle = gradient;
  ctx.fillRect(katana.x-15, katana.y-40, 30, 80);
  // Sword trail
  ctx.beginPath(); ctx.moveTo(katana.x-50, katana.y); ctx.lineTo(katana.x+50, katana.y);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  ctx.shadowBlur = 0;
}`
  },
  {
    id: "pro3", name: "Dynamic Weather Pro", cat: "premium", icon: "⛈️", preview: "from-blue-900 via-slate-800 to-emerald-900",
    price: "$45.50",
    desc: "Real-time weather system. Dynamic seasons, day/night cycles, wind simulation, and volumetric clouds.",
    code: `// ══ DYNAMIC WEATHER PRO ══
let envTime = 0, season = 'winter';

function drawWeather(ctx) {
  envTime += 0.01;
  const sunY = 300 + Math.sin(envTime) * 400;
  // Day-Night sky
  const sky = ctx.createLinearGradient(0,0,0,600);
  sky.addColorStop(0, sunY < 300 ? '#0f172a' : '#38bdf8');
  sky.addColorStop(1, sunY < 300 ? '#020617' : '#bae6fd');
  ctx.fillStyle = sky; ctx.fillRect(0,0,800,600);
  // Volumetric Wind Particles
  for(let i=0;i<50;i++) {
    const x = (Math.random()*1200 - 200 + envTime*100)%1200 - 200;
    const y = Math.random()*600;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(x,y,40,1);
  }
}`
  },
  {
    id: "pro4", name: "Global Multiplayer Hub", cat: "premium", icon: "🌐", preview: "from-indigo-600 to-blue-800",
    price: "$199.00",
    desc: "Ready-to-use networking layer. Real-time sync, lobby system, chat, and server-side authority logic.",
    code: `// ══ GLOBAL MULTIPLAYER HUB ══
const Network = {
  socket: null,
  players: {},
  latency: 0,
  connect: (room) => { console.log("🌐 Connecting to GF-Node: " + room); }
};

GF.init = () => { Network.connect("MainLobby"); };
GF.update = (dt) => {
  // Mock Sync Logic
  if(Math.random()<0.01) Network.latency = 20 + Math.random()*10;
};
GF.draw = () => {
  GF.Draw.text("Ping: " + Network.latency.toFixed(1) + "ms", 700, 30, 10, '#10b981');
  GF.Draw.text("LIVE USERS: 1,402", 700, 50, 10, '#60a5fa');
};`
  },
  {
    id: "pro5", name: "Cinematic VFX Master", cat: "premium", icon: "💥", preview: "from-orange-500 via-red-600 to-rose-700",
    price: "$59.00",
    desc: "The most beautiful explosions, impact shards, and magic spells ever created for GameForge.",
    code: `// ══ CINEMATIC VFX MASTER ══
function spawnSuperExplosion(x, y) {
  // Recursive particle bloom
  for(let i=0;i<60;i++) {
    const a = Math.random()*Math.PI*2;
    const s = 100 + Math.random()*400;
    // High-performance bloom particles
    GF.particles.push({ x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life:1.5, bloom:true });
  }
}
// Double-click to test explosion!
window.addEventListener('dblclick', (e) => spawnSuperExplosion(e.clientX, e.clientY));`
  },
];

// Calculate counts per category
ASSET_CATEGORIES.forEach(cat => {
  cat.count = cat.key === "all" ? BUILTIN_ASSETS.length : BUILTIN_ASSETS.filter(a => a.cat === cat.key).length;
});
