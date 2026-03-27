"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { saveGame } from "../../lib/actions";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const BUILTIN_ASSETS = [
  { id: "a1", name: "Player Idle", cat: "sprite", icon: "🧍", code: `// Player Sprite Component\nconst playerSprite = { x:400, y:300, w:32, h:32, frame:0, color:'#a855f7' };\n\nfunction drawPlayer(ctx) {\n  ctx.fillStyle = playerSprite.color;\n  ctx.fillRect(playerSprite.x, playerSprite.y, playerSprite.w, playerSprite.h);\n  // Eyes\n  ctx.fillStyle = '#fff'; ctx.fillRect(playerSprite.x+8, playerSprite.y+8, 6, 6);\n  ctx.fillRect(playerSprite.x+18, playerSprite.y+8, 6, 6);\n}` },
  { id: "a2", name: "Enemy Patrol", cat: "sprite", code: `// Enemy Patrol AI\nconst enemy = { x:200, y:200, speed:80, dir:1, color:'#ef4444' };\n\nfunction updateEnemy(dt) {\n  enemy.x += enemy.speed * enemy.dir * dt;\n  if(enemy.x > 700 || enemy.x < 100) enemy.dir *= -1;\n}\nfunction drawEnemy(ctx) {\n  ctx.fillStyle = enemy.color;\n  ctx.beginPath(); ctx.arc(enemy.x, enemy.y, 16, 0, Math.PI*2); ctx.fill();\n}`, icon: "👾" },
  { id: "a3", name: "Coin Collectible", cat: "sprite", code: `// Coin Collectible\nconst coins = [];\nfor(let i=0;i<5;i++) coins.push({x:Math.random()*750+25,y:Math.random()*550+25,collected:false,pulse:Math.random()*6});\n\nfunction updateCoins(dt, px, py) {\n  coins.forEach(c => {\n    if(c.collected) return;\n    c.pulse += dt*4;\n    if(Math.hypot(px-c.x, py-c.y) < 25) { c.collected=true; console.log("⭐ Coin!"); }\n  });\n}\nfunction drawCoins(ctx) {\n  coins.filter(c=>!c.collected).forEach(c => {\n    const r = 8 + Math.sin(c.pulse)*2;\n    ctx.fillStyle='#facc15'; ctx.beginPath(); ctx.arc(c.x,c.y,r,0,Math.PI*2); ctx.fill();\n  });\n}`, icon: "🪙" },
  { id: "a4", name: "Tilemap Grid", cat: "tileset", code: `// Tilemap Grid Background\nfunction drawTilemap(ctx, w, h) {\n  const tileSize = 40;\n  for(let x=0; x<w; x+=tileSize) {\n    for(let y=0; y<h; y+=tileSize) {\n      const shade = ((x/tileSize + y/tileSize) % 2 === 0) ? '#0f172a' : '#111827';\n      ctx.fillStyle = shade;\n      ctx.fillRect(x, y, tileSize, tileSize);\n    }\n  }\n}`, icon: "🗺️" },
  { id: "a5", name: "Particle Explosion", cat: "effect", code: `// Particle Explosion System\nconst particles = [];\n\nfunction spawnExplosion(x, y, color='#f97316') {\n  for(let i=0;i<20;i++) {\n    const angle = Math.random()*Math.PI*2;\n    const speed = Math.random()*200+50;\n    particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,color});\n  }\n}\nfunction updateParticles(dt) {\n  particles.forEach(p => { p.x+=p.vx*dt; p.y+=p.vy*dt; p.life-=dt*2; });\n  while(particles.length && particles[0].life<=0) particles.shift();\n}\nfunction drawParticles(ctx) {\n  particles.forEach(p => {\n    ctx.globalAlpha=p.life; ctx.fillStyle=p.color;\n    ctx.beginPath(); ctx.arc(p.x,p.y,3*p.life,0,Math.PI*2); ctx.fill();\n  });\n  ctx.globalAlpha=1;\n}`, icon: "💥" },
  { id: "a6", name: "Trail Effect", cat: "effect", code: `// Trail Renderer\nconst trail = [];\n\nfunction addTrail(x, y, color='#a855f7') {\n  trail.push({x, y, life:1, color});\n  if(trail.length > 30) trail.shift();\n}\nfunction updateTrail(dt) {\n  trail.forEach(t => t.life -= dt * 3);\n  while(trail.length && trail[0].life <= 0) trail.shift();\n}\nfunction drawTrail(ctx) {\n  trail.forEach(t => {\n    ctx.globalAlpha = t.life * 0.5;\n    ctx.fillStyle = t.color;\n    ctx.beginPath(); ctx.arc(t.x, t.y, 8*t.life, 0, Math.PI*2); ctx.fill();\n  });\n  ctx.globalAlpha = 1;\n}`, icon: "✨" },
  { id: "a7", name: "Health Bar UI", cat: "ui", code: `// Health Bar HUD\nfunction drawHealthBar(ctx, x, y, current, max, width=200) {\n  const pct = current / max;\n  const color = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#eab308' : '#ef4444';\n  // Background\n  ctx.fillStyle = '#1e293b'; ctx.fillRect(x, y, width, 16);\n  // Fill\n  ctx.fillStyle = color; ctx.fillRect(x+2, y+2, (width-4)*pct, 12);\n  // Border\n  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1; ctx.strokeRect(x, y, width, 16);\n  // Text\n  ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif';\n  ctx.fillText(current + ' / ' + max, x + width/2 - 20, y + 12);\n}`, icon: "❤️" },
  { id: "a8", name: "Score Counter", cat: "ui", code: `// Score Counter HUD\nlet score = 0;\nfunction addScore(points) { score += points; console.log("Score: " + score); }\nfunction drawScore(ctx, x=20, y=36) {\n  ctx.fillStyle = '#a855f7'; ctx.font = 'bold 22px sans-serif';\n  ctx.fillText('SCORE: ' + score, x, y);\n}`, icon: "🏆" },
  { id: "a9", name: "Platform Physics", cat: "physics", code: `// Simple Platform Physics\nconst gravity = 600;\nconst jumpForce = -350;\nlet onGround = false;\n\nfunction applyGravity(entity, dt, groundY=550) {\n  entity.vy = (entity.vy || 0) + gravity * dt;\n  entity.y += entity.vy * dt;\n  if(entity.y >= groundY) {\n    entity.y = groundY; entity.vy = 0; onGround = true;\n  } else { onGround = false; }\n}\nfunction jump(entity) {\n  if(onGround) { entity.vy = jumpForce; onGround = false; console.log("Jump!"); }\n}`, icon: "⬆️" },
  { id: "a10", name: "Collision AABB", cat: "physics", code: `// AABB Collision Detection\nfunction checkCollision(a, b) {\n  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;\n}\n\nfunction resolveCollision(a, b) {\n  if(!checkCollision(a, b)) return false;\n  const overlapX = Math.min(a.x+a.w - b.x, b.x+b.w - a.x);\n  const overlapY = Math.min(a.y+a.h - b.y, b.y+b.h - a.y);\n  if(overlapX < overlapY) { a.x += (a.x < b.x) ? -overlapX : overlapX; }\n  else { a.y += (a.y < b.y) ? -overlapY : overlapY; }\n  return true;\n}`, icon: "📦" },
  { id: "a11", name: "Ambient Beat", cat: "audio", code: `// Audio Context Beat Generator\nlet audioCtx = null;\nfunction playBeat(freq=440, dur=0.1) {\n  if(!audioCtx) audioCtx = new AudioContext();\n  const osc = audioCtx.createOscillator();\n  const gain = audioCtx.createGain();\n  osc.connect(gain); gain.connect(audioCtx.destination);\n  osc.frequency.value = freq;\n  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);\n  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);\n  osc.start(); osc.stop(audioCtx.currentTime + dur);\n}\nfunction playCoinSound() { playBeat(880, 0.08); setTimeout(()=>playBeat(1100,0.08), 80); }`, icon: "🔊" },
  { id: "a12", name: "Star Parallax BG", cat: "effect", code: `// Starfield Parallax Background\nconst stars = [];\nfor(let i=0;i<60;i++) stars.push({x:Math.random()*800,y:Math.random()*600,s:Math.random()*2+0.5,speed:Math.random()*30+10});\n\nfunction updateStars(dt) {\n  stars.forEach(s => { s.y += s.speed * dt; if(s.y > 600) { s.y = 0; s.x = Math.random()*800; } });\n}\nfunction drawStars(ctx) {\n  stars.forEach(s => {\n    ctx.fillStyle = 'rgba(255,255,255,' + (s.s/3) + ')';\n    ctx.fillRect(s.x, s.y, s.s, s.s);\n  });\n}`, icon: "🌌" },
];

const ASSET_CATEGORIES = [
  { key: "all", label: "All", icon: "📦" },
  { key: "sprite", label: "Sprites", icon: "🧍" },
  { key: "tileset", label: "Tilesets", icon: "🗺️" },
  { key: "effect", label: "Effects", icon: "✨" },
  { key: "ui", label: "UI", icon: "❤️" },
  { key: "physics", label: "Physics", icon: "⬆️" },
  { key: "audio", label: "Audio", icon: "🔊" },
];

export default function GameForgeEditor() {
  const [isRunning, setIsRunning] = useState(false);
  const [runHash, setRunHash] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"success"|"error">("idle");
  const [logs, setLogs] = useState<{id:number;text:string;type:"info"|"warn"|"error"}[]>([]);
  const [activeFile, setActiveFile] = useState("main.js");
  const [fps, setFps] = useState(0);
  const [editorReady, setEditorReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAssetPanel, setShowAssetPanel] = useState(false);
  const [assetFilter, setAssetFilter] = useState("all");
  const [bottomTab, setBottomTab] = useState<"code"|"console">("code");
  const logsEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<Record<string,string>>({
    "main.js": `// ═══════════════════════════════════════════
//   🎮 GameForge Engine — Starter Template
//   Engine: GF Core v1.0
// ═══════════════════════════════════════════

let player = { x:400, y:300, vx:0, vy:0, size:18, color:'#a855f7', trail:[] };
let stars = [];
let score = 0;
let time = 0;

GF.init = () => {
  console.log("🚀 Engine Initialized!");
  console.log("🎮 Arrow Keys / WASD to move");
  console.log("⭐ Collect the orbs!");
  for(let i=0; i<8; i++) {
    stars.push({ x:Math.random()*780+10, y:Math.random()*580+10, pulse:Math.random()*Math.PI*2 });
  }
};

GF.update = (dt) => {
  time += dt;
  const accel=800, friction=0.92;
  player.vx += GF.Input.getAxis('Horizontal') * accel * dt;
  player.vy += GF.Input.getAxis('Vertical') * accel * dt;
  player.vx *= friction; player.vy *= friction;
  player.x += player.vx*dt; player.y += player.vy*dt;
  // Bounce
  if(player.x < player.size){player.x=player.size;player.vx*=-0.6;}
  if(player.x > 800-player.size){player.x=800-player.size;player.vx*=-0.6;}
  if(player.y < player.size){player.y=player.size;player.vy*=-0.6;}
  if(player.y > 600-player.size){player.y=600-player.size;player.vy*=-0.6;}
  // Trail
  player.trail.push({x:player.x,y:player.y,life:1});
  player.trail = player.trail.filter(t=>{t.life-=dt*3;return t.life>0;});
  // Stars
  stars.forEach((s,i) => {
    s.pulse += dt*3;
    if(Math.hypot(player.x-s.x,player.y-s.y)<30){
      score+=100; console.log("⭐ +100! Score: "+score);
      stars[i]={x:Math.random()*780+10,y:Math.random()*580+10,pulse:0};
    }
  });
};

GF.draw = () => {
  GF.Draw.clear('#0c0e1a');
  // Grid
  for(let x=0;x<800;x+=40) GF.Draw.rect(x,0,1,600,'rgba(100,120,255,0.03)');
  for(let y=0;y<600;y+=40) GF.Draw.rect(0,y,800,1,'rgba(100,120,255,0.03)');
  // Trail
  player.trail.forEach(t=>{
    GF.Draw.circle(t.x,t.y,player.size*t.life,\`rgba(168,85,247,\${t.life*0.4})\`);
  });
  // Stars
  stars.forEach(s=>{
    const g=Math.sin(s.pulse)*4+8;
    GF.Draw.circle(s.x,s.y,g+4,'rgba(250,204,21,0.15)');
    GF.Draw.circle(s.x,s.y,g,'#facc15');
  });
  // Player
  GF.Draw.circle(player.x,player.y,player.size+12,'rgba(168,85,247,0.15)');
  GF.Draw.circle(player.x,player.y,player.size+6,'rgba(168,85,247,0.25)');
  GF.Draw.circle(player.x,player.y,player.size,player.color);
  GF.Draw.circle(player.x-4,player.y-4,6,'rgba(255,255,255,0.3)');
  // HUD
  GF.Draw.text("SCORE: "+score,24,36,18,'#a855f7');
  GF.Draw.text("TIME: "+time.toFixed(1)+"s",680,36,14,'#64748b');
};`,
    "config.gf": `{\n  "engine": "GF Core v1.0",\n  "canvas": { "width": 800, "height": 600 },\n  "physics": { "gravity": 0, "friction": 0.92 },\n  "rendering": { "antiAlias": true, "fps": 60 }\n}`
  });

  const [code, setCode] = useState(files["main.js"]);

  useEffect(() => {
    const h = (e: MessageEvent) => {
      if(e.data?.type==="GF_LOG"){
        const isErr=e.data.msg.includes("ERROR"), isWarn=e.data.msg.includes("WARN");
        setLogs(p=>[...p.slice(-80),{id:Date.now()+Math.random(),text:e.data.msg,type:isErr?"error":isWarn?"warn":"info"}]);
      }
      if(e.data?.type==="GF_FPS") setFps(e.data.fps);
    };
    window.addEventListener("message",h);
    return ()=>window.removeEventListener("message",h);
  },[]);

  useEffect(()=>{logsEndRef.current?.scrollIntoView({behavior:"smooth"});},[logs]);

  const handleRun = useCallback(()=>{setRunHash(Date.now());setIsRunning(true);setLogs([{id:0,text:"--- ENGINE REBOOT ---",type:"info"}]);},[]);
  const handleStop = useCallback(()=>{setIsRunning(false);setLogs(p=>[...p,{id:Date.now(),text:"--- ENGINE HALTED ---",type:"warn"}]);},[]);
  const handleSave = async()=>{setIsSaving(true);setSaveStatus("saving");const r=await saveGame("demo",{code,title:"my_game"});setSaveStatus(r.success?"success":"error");if(r.success)setTimeout(()=>setSaveStatus("idle"),3000);setIsSaving(false);};

  const switchFile=(name:string)=>{
    setFiles(prev=>({...prev,[activeFile]:code}));
    setActiveFile(name);
    setCode(files[name]||"");
  };

  const insertAsset=(asset:typeof BUILTIN_ASSETS[0])=>{
    const separator = `\n\n// ─── Asset: ${asset.name} ───\n`;
    setCode(prev => prev + separator + asset.code + "\n");
    setLogs(p=>[...p,{id:Date.now(),text:`✅ Inserted asset: ${asset.name}`,type:"info"}]);
  };

  const toggleFullscreen = ()=>{
    if(!isFullscreen && viewportRef.current){
      viewportRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(()=>{
    const h=()=>{ if(!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange",h);
    return ()=>document.removeEventListener("fullscreenchange",h);
  },[]);

  const filteredAssets = assetFilter==="all" ? BUILTIN_ASSETS : BUILTIN_ASSETS.filter(a=>a.cat===assetFilter);

  const htmlTemplate = `<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden;background:#0c0e1a;display:flex;justify-content:center;align-items:center}
  </style></head><body>
  <canvas id="gameCanvas" width="800" height="600"></canvas>
  <script>
    window.GF=(()=>{const c=document.getElementById('gameCanvas'),x=c.getContext('2d'),k={};
    window.addEventListener('keydown',e=>{k[e.code]=true;e.preventDefault()});window.addEventListener('keyup',e=>{k[e.code]=false});
    const G={canvas:c,ctx:x,dt:0,init:()=>{},update:()=>{},draw:()=>{},
    Input:{isDown:c=>!!k[c],getAxis:a=>{if(a==='Horizontal')return(k.ArrowRight||k.KeyD?1:0)-(k.ArrowLeft||k.KeyA?1:0);if(a==='Vertical')return(k.ArrowDown||k.KeyS?1:0)-(k.ArrowUp||k.KeyW?1:0);return 0}},
    Draw:{clear:(cl='#0c0e1a')=>{x.fillStyle=cl;x.fillRect(0,0,c.width,c.height)},
    rect:(px,py,w,h,cl='#fff')=>{x.fillStyle=cl;x.fillRect(px,py,w,h)},
    circle:(px,py,r,cl='#fff')=>{x.fillStyle=cl;x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill()},
    text:(s,px,py,sz=20,cl='#fff')=>{x.fillStyle=cl;x.font=\`bold \${sz}px 'Inter',sans-serif\`;x.fillText(s,px,py)},
    line:(x1,y1,x2,y2,cl='#fff',w=1)=>{x.strokeStyle=cl;x.lineWidth=w;x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke()}}};
    let lt=0,fr=0,lf=0;const lp=ts=>{G.dt=Math.min((ts-lt)/1000,0.05);lt=ts;fr++;
    if(ts-lf>1000){window.parent.postMessage({type:'GF_FPS',fps:fr},'*');fr=0;lf=ts}
    G.update(G.dt);G.draw();requestAnimationFrame(lp)};
    setTimeout(()=>{G.init();requestAnimationFrame(lp)},50);
    const _l=console.log;console.log=(...a)=>{_l(...a);window.parent.postMessage({type:'GF_LOG',msg:a.join(' ')},'*')};
    window.onerror=e=>window.parent.postMessage({type:'GF_LOG',msg:'❌ ERROR: '+e},'*');
    return G})();
    try{${code}}catch(e){console.log("❌ COMPILE ERROR: "+e.message)}
  </script></body></html>`;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#08090c] text-slate-300 overflow-hidden select-none">
      {/* ══ TOP BAR ══ */}
      <header className="h-11 bg-gradient-to-r from-[#0c0d11] via-[#10111a] to-[#0c0d11] border-b border-white/[0.04] flex items-center justify-between px-3 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:shadow-purple-600/40 transition-shadow">
              <span className="text-white text-[10px] font-black">GF</span>
            </div>
            <span className="text-white font-black text-xs tracking-widest hidden md:inline group-hover:text-purple-400 transition-colors">STUDIO</span>
          </Link>
          <div className="h-4 w-px bg-white/[0.06]"></div>
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] px-3 py-1 rounded-lg border border-white/[0.05]">
            <span className="text-[9px] text-slate-600 font-bold">PROJECT</span>
            <span className="text-[11px] text-white font-bold ml-2">neon_game.gf</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} disabled={isSaving}
            className={`h-7 px-3 rounded-lg text-[10px] font-bold transition-all active:scale-95 flex items-center gap-1.5 ${saveStatus==="success"?"bg-emerald-500/10 text-emerald-400 border border-emerald-500/20":"bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white"}`}>
            {isSaving?"⏳":saveStatus==="success"?"✓ Saved":"💾 Save"}
          </button>
          {isRunning?(
            <button onClick={handleStop} className="h-7 px-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-bold hover:bg-rose-500/20 active:scale-95 transition-all">■ Stop</button>
          ):(
            <button onClick={handleRun} className="h-7 px-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold hover:bg-emerald-500/20 active:scale-95 transition-all">▶ Run</button>
          )}
          <button onClick={handleRun} className="h-7 px-4 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white rounded-lg text-[10px] font-bold hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-lg shadow-purple-600/10">🚀 Deploy</button>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─ LEFT: FILES ─ */}
        <aside className="w-48 bg-[#0a0b0e] border-r border-white/[0.04] flex flex-col shrink-0">
          <div className="p-2.5 border-b border-white/[0.04]"><span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Explorer</span></div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            <div className="text-[9px] font-bold text-slate-600 px-2.5 pt-2 pb-1 uppercase tracking-wider">📁 Source</div>
            {Object.keys(files).map(name=>(
              <button key={name} onClick={()=>switchFile(name)}
                className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${activeFile===name?"bg-purple-500/10 text-purple-300 border border-purple-500/15":"text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"}`}>
                <span className={activeFile===name?"text-purple-400":"text-slate-600"}>{name.endsWith('.js')?'📄':'⚙️'}</span>
                <span className="font-medium truncate">{name}</span>
              </button>
            ))}
            <div className="text-[9px] font-bold text-slate-600 px-2.5 pt-4 pb-1 uppercase tracking-wider">📁 Assets</div>
            {["sprites/","audio/","effects/"].map(n=>(
              <div key={n} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-600 cursor-default"><span>📂</span><span className="font-medium">{n}</span></div>
            ))}
          </div>
          <div className="p-3 border-t border-white/[0.04] bg-black/20 space-y-2">
            <div className="flex items-center justify-between"><span className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">FPS</span>
              <span className={`text-[10px] font-bold font-mono ${fps>=55?'text-emerald-400':fps>=30?'text-yellow-400':'text-rose-400'}`}>{isRunning?fps:'--'}</span></div>
            <div className="flex items-center justify-between"><span className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">Engine</span>
              <span className="text-[9px] text-emerald-500 font-bold">GF v1.0</span></div>
          </div>
        </aside>

        {/* ─ CENTER ─ */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* VIEWPORT */}
          <div ref={viewportRef} className={`relative bg-[#08090c] flex items-center justify-center overflow-hidden ${isFullscreen?'fixed inset-0 z-[999] bg-black':'flex-1'}`}>
            <div className="absolute inset-0 opacity-[0.012]" style={{backgroundImage:'radial-gradient(circle,#fff 1px,transparent 1px)',backgroundSize:'24px 24px'}}></div>
            {/* Overlay controls */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-xl px-2.5 py-1 rounded-lg border border-white/[0.06] pointer-events-auto">
                <div className={`w-1.5 h-1.5 rounded-full ${isRunning?'bg-emerald-400 animate-pulse':'bg-slate-700'}`}></div>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{isRunning?'Running':'Stopped'}</span>
              </div>
              <div className="flex gap-1.5 pointer-events-auto">
                {isRunning && <div className="bg-black/70 backdrop-blur-xl px-2.5 py-1 rounded-lg border border-white/[0.06] text-[9px] font-mono text-slate-500">{fps} FPS</div>}
                <button onClick={toggleFullscreen} className="bg-black/70 backdrop-blur-xl px-2.5 py-1 rounded-lg border border-white/[0.06] text-[9px] font-bold text-slate-400 hover:text-white transition-colors" title="Fullscreen">
                  {isFullscreen ? '⊡ Exit' : '⛶ Fullscreen'}
                </button>
                {isFullscreen && <button onClick={handleStop} className="bg-rose-600/80 px-2.5 py-1 rounded-lg text-[9px] font-bold text-white">■ Stop</button>}
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.06]" style={{width:isFullscreen?'100%':'min(100% - 32px, 800px)',height:isFullscreen?'100%':undefined,aspectRatio:isFullscreen?undefined:'4/3'}}>
              {isRunning?(
                <iframe key={runHash} title="gf-viewport" srcDoc={htmlTemplate} className="w-full h-full border-0" style={{display:'block'}} />
              ):(
                <div className="absolute inset-0 bg-[#0c0e1a] flex flex-col items-center justify-center cursor-pointer group" onClick={handleRun}>
                  <div className="relative"><div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl scale-150 group-hover:bg-purple-500/30 transition-all"></div>
                    <div className="relative w-16 h-16 bg-white/[0.04] rounded-2xl flex items-center justify-center border border-white/[0.08] group-hover:border-purple-500/30 group-hover:bg-purple-500/[0.06] transition-all duration-300 group-hover:scale-110">
                      <span className="text-2xl text-white/60 group-hover:text-purple-400 transition-colors ml-1">▶</span></div></div>
                  <p className="mt-5 text-slate-600 text-[10px] font-bold tracking-[0.15em] uppercase group-hover:text-slate-400 transition-colors">Click to Launch</p>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM: Code + Console */}
          <div className="h-[320px] flex border-t border-white/[0.04] bg-[#0a0b0e] shrink-0">
            <div className="flex-1 flex flex-col border-r border-white/[0.04] overflow-hidden">
              <div className="h-8 bg-[#0c0d10] flex items-center px-1 border-b border-white/[0.04] gap-0 shrink-0">
                {Object.keys(files).map(name=>(
                  <button key={name} onClick={()=>switchFile(name)}
                    className={`h-full px-3 text-[10px] font-medium flex items-center gap-1.5 transition-colors relative ${activeFile===name?"text-white bg-[#0a0b0e]":"text-slate-600 hover:text-slate-400"}`}>
                    <span className="text-[9px]">{name.endsWith('.js')?'📄':'⚙️'}</span>{name}
                    {activeFile===name&&<div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-t-full"></div>}
                  </button>
                ))}
              </div>
              <div className="flex-1">
                <Editor height="100%" defaultLanguage="javascript" theme="vs-dark" value={code} onChange={v=>setCode(v||"")} onMount={()=>setEditorReady(true)}
                  options={{minimap:{enabled:false},fontSize:13,fontFamily:"'JetBrains Mono','Fira Code',Consolas,monospace",fontLigatures:true,lineHeight:22,padding:{top:10,bottom:10},
                  scrollBeyondLastLine:false,renderLineHighlight:"gutter",cursorBlinking:"smooth",cursorSmoothCaretAnimation:"on",smoothScrolling:true,
                  bracketPairColorization:{enabled:true},guides:{bracketPairs:true,indentation:true},overviewRulerLanes:0,hideCursorInOverviewRuler:true,
                  scrollbar:{verticalSliderSize:4,horizontalSliderSize:4}}}/>
              </div>
            </div>
            {/* Console */}
            <div className="w-64 flex flex-col overflow-hidden">
              <div className="h-8 bg-[#0c0d10] flex items-center justify-between px-3 border-b border-white/[0.04] shrink-0">
                <div className="flex items-center gap-1.5"><span className="text-[9px]">📟</span><span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Console</span>
                  {logs.length>0&&<span className="bg-slate-800 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded-md">{logs.length}</span>}</div>
                <button onClick={()=>setLogs([])} className="text-[8px] text-slate-700 hover:text-slate-400 uppercase font-bold tracking-wider transition-colors">Clear</button>
              </div>
              <div className="flex-1 p-2 font-mono text-[10px] space-y-0.5 overflow-y-auto scrollbar-hide bg-black/20">
                {logs.map(log=>(
                  <div key={log.id} className={`flex gap-1.5 py-0.5 px-1.5 rounded ${log.type==="error"?"text-rose-400 bg-rose-500/[0.06]":log.type==="warn"?"text-amber-400 bg-amber-500/[0.04]":"text-slate-500"}`}>
                    <span className="opacity-25 shrink-0 text-[8px] mt-[1px]">{log.type==="error"?"❌":log.type==="warn"?"⚠️":"›"}</span>
                    <span className="leading-relaxed break-all">{log.text}</span>
                  </div>
                ))}
                {logs.length===0&&<div className="flex flex-col items-center justify-center h-full text-slate-800"><span className="text-xl mb-2 opacity-30">📟</span><span className="text-[9px] font-bold tracking-wider uppercase">No Output</span></div>}
                <div ref={logsEndRef}/>
              </div>
            </div>
          </div>
        </main>

        {/* ─ RIGHT: ASSETS PANEL ─ */}
        <aside className={`bg-[#0a0b0e] border-l border-white/[0.04] flex flex-col shrink-0 transition-all duration-300 ${showAssetPanel?'w-72':'w-10'}`}>
          <button onClick={()=>setShowAssetPanel(!showAssetPanel)}
            className="h-8 flex items-center justify-center border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors shrink-0"
            title={showAssetPanel?"Close Assets":"Open Assets"}>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.15em]">
              {showAssetPanel ? '🎨 Assets ✕' : '🎨'}
            </span>
          </button>

          {showAssetPanel && (
            <>
              {/* Category Filter */}
              <div className="p-2 border-b border-white/[0.04] flex flex-wrap gap-1">
                {ASSET_CATEGORIES.map(c=>(
                  <button key={c.key} onClick={()=>setAssetFilter(c.key)}
                    className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${assetFilter===c.key?'bg-purple-500/15 text-purple-400 border border-purple-500/20':'text-slate-600 hover:text-slate-400 border border-transparent'}`}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>

              {/* Asset List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-hide">
                {filteredAssets.map(asset=>(
                  <div key={asset.id} className="group bg-black/20 border border-white/[0.03] rounded-xl p-3 hover:border-purple-500/20 hover:bg-purple-500/[0.03] transition-all">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-lg">{asset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{asset.name}</p>
                        <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">{asset.cat}</p>
                      </div>
                    </div>
                    <button onClick={()=>insertAsset(asset)}
                      className="w-full py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider hover:bg-purple-500/20 active:scale-95 transition-all">
                      + Insert into Code
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-white/[0.04] bg-black/20">
                <p className="text-[9px] text-slate-600 text-center font-bold">{filteredAssets.length} assets available</p>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* ══ STATUS BAR ══ */}
      <footer className="h-5 bg-[#0c0d10] border-t border-white/[0.04] flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1"><div className={`w-1.5 h-1.5 rounded-full ${editorReady?'bg-emerald-500':'bg-amber-500 animate-pulse'}`}></div>
            <span className="text-[8px] text-slate-600 font-medium">{editorReady?'Ready':'Loading...'}</span></div>
          <span className="text-[8px] text-slate-700">JavaScript</span>
          <span className="text-[8px] text-slate-700">UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[8px] text-slate-700">GF Core v1.0</span>
          <span className="text-[8px] text-slate-700 font-mono">800×600</span>
        </div>
      </footer>
    </div>
  );
}
