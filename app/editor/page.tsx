"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { saveGame } from "../../lib/actions";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function GameForgeEditor() {
  const [isRunning, setIsRunning] = useState(false);
  const [runHash, setRunHash] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [logs, setLogs] = useState<{ id: number; text: string; type: "info" | "warn" | "error" }[]>([]);
  const [activeFile, setActiveFile] = useState("main.js");
  const [showAssets, setShowAssets] = useState(false);
  const [fps, setFps] = useState(0);
  const [editorReady, setEditorReady] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const files: Record<string, string> = {
    "main.js": `// ============================================
//   🎮 GameForge Engine — Project Template
//   Engine Version: GF Core v1.0
// ============================================

// -- Setup your player entity --
let player = {
  x: 400, y: 300, 
  vx: 0, vy: 0,
  size: 18, 
  color: '#a855f7',
  trail: []
};

let stars = [];
let score = 0;
let time = 0;

// -- Called once when engine boots --
GF.init = () => {
  console.log("🚀 Engine Initialized!");
  console.log("🎮 Use Arrow Keys / WASD to move");
  console.log("⭐ Collect the glowing orbs!");
  
  // Generate stars
  for (let i = 0; i < 8; i++) {
    stars.push({
      x: Math.random() * 780 + 10,
      y: Math.random() * 580 + 10,
      pulse: Math.random() * Math.PI * 2
    });
  }
};

// -- Called every frame (60fps) --
GF.update = (dt) => {
  time += dt;
  
  // Smooth acceleration
  const accel = 800;
  const friction = 0.92;
  
  player.vx += GF.Input.getAxis('Horizontal') * accel * dt;
  player.vy += GF.Input.getAxis('Vertical') * accel * dt;
  
  player.vx *= friction;
  player.vy *= friction;
  
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  
  // Bounce off walls
  if (player.x < player.size) { player.x = player.size; player.vx *= -0.6; }
  if (player.x > 800 - player.size) { player.x = 800 - player.size; player.vx *= -0.6; }
  if (player.y < player.size) { player.y = player.size; player.vy *= -0.6; }
  if (player.y > 600 - player.size) { player.y = 600 - player.size; player.vy *= -0.6; }

  // Trail effect
  player.trail.push({ x: player.x, y: player.y, life: 1 });
  player.trail = player.trail.filter(t => { t.life -= dt * 3; return t.life > 0; });
  
  // Star collection
  stars.forEach((s, i) => {
    s.pulse += dt * 3;
    const dist = Math.hypot(player.x - s.x, player.y - s.y);
    if (dist < 30) {
      score += 100;
      console.log("⭐ +100 points! Score: " + score);
      stars[i] = {
        x: Math.random() * 780 + 10,
        y: Math.random() * 580 + 10,
        pulse: 0
      };
    }
  });
};

// -- Called every frame after update --
GF.draw = () => {
  GF.Draw.clear('#0c0e1a');
  
  // Atmospheric grid
  for (let x = 0; x < 800; x += 40) {
    GF.Draw.rect(x, 0, 1, 600, 'rgba(100,120,255,0.03)');
  }
  for (let y = 0; y < 600; y += 40) {
    GF.Draw.rect(0, y, 800, 1, 'rgba(100,120,255,0.03)');
  }
  
  // Draw trail
  player.trail.forEach(t => {
    const alpha = t.life * 0.4;
    GF.Draw.circle(t.x, t.y, player.size * t.life, \`rgba(168, 85, 247, \${alpha})\`);
  });
  
  // Draw stars (collectibles)
  stars.forEach(s => {
    const glow = Math.sin(s.pulse) * 4 + 8;
    GF.Draw.circle(s.x, s.y, glow + 4, 'rgba(250, 204, 21, 0.15)');
    GF.Draw.circle(s.x, s.y, glow, '#facc15');
  });
  
  // Draw player glow
  GF.Draw.circle(player.x, player.y, player.size + 12, 'rgba(168, 85, 247, 0.15)');
  GF.Draw.circle(player.x, player.y, player.size + 6, 'rgba(168, 85, 247, 0.25)');
  GF.Draw.circle(player.x, player.y, player.size, player.color);
  GF.Draw.circle(player.x - 4, player.y - 4, 6, 'rgba(255,255,255,0.3)');

  // HUD
  GF.Draw.text("SCORE: " + score, 24, 36, 18, '#a855f7');
  GF.Draw.text("TIME: " + time.toFixed(1) + "s", 680, 36, 14, '#64748b');
};`,
    "config.gf": `{
  "engine": "GF Core v1.0",
  "canvas": { "width": 800, "height": 600 },
  "physics": { "gravity": 0, "friction": 0.92 },
  "rendering": { "antiAlias": true, "fps": 60 }
}`
  };

  const [code, setCode] = useState(files["main.js"]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "GF_LOG") {
        const isError = e.data.msg.includes("ERROR");
        const isWarn = e.data.msg.includes("WARN");
        setLogs((prev) => [
          ...prev.slice(-50),
          { id: Date.now() + Math.random(), text: e.data.msg, type: isError ? "error" : isWarn ? "warn" : "info" },
        ]);
      }
      if (e.data?.type === "GF_FPS") setFps(e.data.fps);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleRunGame = useCallback(() => {
    setRunHash(Date.now());
    setIsRunning(true);
    setLogs([{ id: 0, text: "--- ENGINE REBOOT ---", type: "info" }]);
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    setLogs((prev) => [...prev, { id: Date.now(), text: "--- ENGINE HALTED ---", type: "warn" }]);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    const result = await saveGame("demo", { code, title: "my_platformer" });
    setSaveStatus(result.success ? "success" : "error");
    if (result.success) setTimeout(() => setSaveStatus("idle"), 3000);
    setIsSaving(false);
  };

  const switchFile = (name: string) => {
    setActiveFile(name);
    setCode(files[name]);
  };

  const htmlTemplate = `<!DOCTYPE html><html><head><style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #0c0e1a; display: flex; justify-content: center; align-items: center; }
    canvas { image-rendering: pixelated; }
  </style></head><body>
  <canvas id="gameCanvas" width="800" height="600"></canvas>
  <script>
    window.GF = (() => {
      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const keys = {};
      window.addEventListener('keydown', e => { keys[e.code] = true; e.preventDefault(); });
      window.addEventListener('keyup', e => { keys[e.code] = false; });

      const GF = {
        canvas, ctx, dt: 0,
        init: () => {}, update: () => {}, draw: () => {},
        Input: {
          isDown: (c) => !!keys[c],
          getAxis: (a) => {
            if (a === 'Horizontal') return (keys['ArrowRight']||keys['KeyD']?1:0)-(keys['ArrowLeft']||keys['KeyA']?1:0);
            if (a === 'Vertical') return (keys['ArrowDown']||keys['KeyS']?1:0)-(keys['ArrowUp']||keys['KeyW']?1:0);
            return 0;
          }
        },
        Draw: {
          clear: (c='#0c0e1a') => { ctx.fillStyle=c; ctx.fillRect(0,0,canvas.width,canvas.height); },
          rect: (x,y,w,h,c='#fff') => { ctx.fillStyle=c; ctx.fillRect(x,y,w,h); },
          circle: (x,y,r,c='#fff') => { ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); },
          text: (s,x,y,sz=20,c='#fff') => { ctx.fillStyle=c; ctx.font=\`bold \${sz}px 'Inter',sans-serif\`; ctx.fillText(s,x,y); },
          line: (x1,y1,x2,y2,c='#fff',w=1) => { ctx.strokeStyle=c; ctx.lineWidth=w; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
        }
      };

      let lastTime=0, frames=0, lastFps=0;
      const loop = (ts) => {
        GF.dt = Math.min((ts-lastTime)/1000, 0.05);
        lastTime = ts;
        frames++;
        if(ts-lastFps>1000){ window.parent.postMessage({type:'GF_FPS',fps:frames},'*'); frames=0; lastFps=ts; }
        GF.update(GF.dt);
        GF.draw();
        requestAnimationFrame(loop);
      };
      setTimeout(() => { GF.init(); requestAnimationFrame(loop); }, 50);

      const _log = console.log;
      console.log = (...a) => { _log(...a); window.parent.postMessage({type:'GF_LOG',msg:a.join(' ')},'*'); };
      window.onerror = (e) => window.parent.postMessage({type:'GF_LOG',msg:'❌ ERROR: '+e},'*');
      return GF;
    })();
    try { ${code} } catch(e) { console.log("❌ COMPILE ERROR: " + e.message); }
  </script></body></html>`;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#08090c] text-slate-300 overflow-hidden select-none">
      
      {/* ═══════════ TOP BAR ═══════════ */}
      <header className="h-12 bg-gradient-to-r from-[#0c0d11] via-[#10111a] to-[#0c0d11] border-b border-white/[0.04] flex items-center justify-between px-4 shrink-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:shadow-purple-600/40 transition-shadow">
              <span className="text-white text-xs font-black">GF</span>
            </div>
            <span className="text-white font-black text-sm tracking-wider hidden md:inline group-hover:text-purple-400 transition-colors">STUDIO</span>
          </Link>
          
          <div className="h-5 w-px bg-white/[0.06]"></div>
          
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] px-3 py-1 rounded-lg border border-white/[0.05]">
            <span className="text-[10px] text-slate-600 font-bold">PROJECT</span>
            <span className="text-xs text-white font-bold ml-2">neon_dash.gf</span>
            <span className="text-[9px] text-slate-700 ml-2 font-mono">v1.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`h-8 px-4 rounded-lg text-[11px] font-bold transition-all active:scale-95 flex items-center gap-2 ${
              saveStatus === "success" 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            {isSaving ? "⏳" : saveStatus === "success" ? "✓ Saved" : "💾 Save"}
          </button>

          {isRunning ? (
            <button onClick={handleStop} className="h-8 px-5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[11px] font-bold hover:bg-rose-500/20 active:scale-95 transition-all flex items-center gap-2">
              ■ Stop
            </button>
          ) : (
            <button onClick={handleRunGame} className="h-8 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[11px] font-bold hover:bg-emerald-500/20 active:scale-95 transition-all flex items-center gap-2">
              ▶ Run
            </button>
          )}

          <button onClick={handleRunGame} className="h-8 px-5 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white rounded-lg text-[11px] font-bold hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-lg shadow-purple-600/10 flex items-center gap-2">
            🚀 Deploy
          </button>
        </div>
      </header>

      {/* ═══════════ MAIN WORKSPACE ═══════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── LEFT: FILE EXPLORER ─── */}
        <aside className="w-56 bg-[#0a0b0e] border-r border-white/[0.04] flex flex-col shrink-0">
          <div className="p-3 border-b border-white/[0.04]">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Explorer</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <div className="text-[10px] font-bold text-slate-600 px-3 pt-3 pb-1.5 uppercase tracking-wider">📁 Source</div>
            {Object.keys(files).map((name) => (
              <button 
                key={name} 
                onClick={() => switchFile(name)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                  activeFile === name 
                    ? "bg-purple-500/10 text-purple-300 border border-purple-500/15 shadow-sm" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                }`}
              >
                <span className={activeFile === name ? "text-purple-400" : "text-slate-600"}>
                  {name.endsWith('.js') ? '📄' : '⚙️'}
                </span>
                <span className="font-medium truncate">{name}</span>
              </button>
            ))}
            
            <div className="text-[10px] font-bold text-slate-600 px-3 pt-6 pb-1.5 uppercase tracking-wider">📁 Assets</div>
            {["sprites/", "audio/", "shaders/"].map((name) => (
              <div key={name} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-600 cursor-default">
                <span>📂</span>
                <span className="font-medium">{name}</span>
                <span className="ml-auto text-[9px] text-slate-800 italic">empty</span>
              </div>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="p-4 border-t border-white/[0.04] bg-black/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Engine</span>
              <span className="text-[10px] text-emerald-500 font-bold">GF v1.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Canvas</span>
              <span className="text-[10px] text-slate-500 font-mono">800×600</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">FPS</span>
              <span className={`text-[10px] font-bold font-mono ${fps >= 55 ? 'text-emerald-400' : fps >= 30 ? 'text-yellow-400' : 'text-rose-400'}`}>{isRunning ? fps : '--'}</span>
            </div>
          </div>
        </aside>

        {/* ─── CENTER MAIN ─── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* VIEWPORT: Game Canvas */}
          <div className="flex-1 relative bg-[#08090c] flex items-center justify-center overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>

            {/* Status Bar Overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/[0.06] pointer-events-auto">
                <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`}></div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{isRunning ? 'Running' : 'Stopped'}</span>
              </div>
              {isRunning && (
                <div className="flex gap-2">
                  <div className="bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/[0.06] text-[10px] font-mono text-slate-500">
                    {fps} FPS
                  </div>
                  <div className="bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/[0.06] text-[10px] font-mono text-slate-500">
                    800 × 600
                  </div>
                </div>
              )}
            </div>

            {/* The Game Canvas */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.06]" style={{width: 'min(100% - 48px, 800px)', aspectRatio: '4/3'}}>
              {isRunning ? (
                <iframe
                  key={runHash}
                  title="gf-viewport"
                  srcDoc={htmlTemplate}
                  className="w-full h-full border-0"
                  style={{display: 'block'}}
                />
              ) : (
                <div className="absolute inset-0 bg-[#0c0e1a] flex flex-col items-center justify-center cursor-pointer group" onClick={handleRunGame}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl scale-150 group-hover:bg-purple-500/30 transition-all"></div>
                    <div className="relative w-20 h-20 bg-white/[0.04] rounded-2xl flex items-center justify-center border border-white/[0.08] group-hover:border-purple-500/30 group-hover:bg-purple-500/[0.06] transition-all duration-300 group-hover:scale-105">
                      <span className="text-3xl text-white/60 group-hover:text-purple-400 transition-colors ml-1">▶</span>
                    </div>
                  </div>
                  <p className="mt-6 text-slate-600 text-xs font-bold tracking-[0.15em] uppercase group-hover:text-slate-400 transition-colors">Click to Launch</p>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM PANEL: Editor + Console */}
          <div className="h-[340px] flex border-t border-white/[0.04] bg-[#0a0b0e] shrink-0">
            
            {/* Code Editor */}
            <div className="flex-1 flex flex-col border-r border-white/[0.04] overflow-hidden">
              {/* Tab Bar */}
              <div className="h-9 bg-[#0c0d10] flex items-center px-1 border-b border-white/[0.04] gap-0.5 shrink-0">
                {Object.keys(files).map((name) => (
                  <button
                    key={name}
                    onClick={() => switchFile(name)}
                    className={`h-full px-4 text-[11px] font-medium flex items-center gap-2 transition-colors relative ${
                      activeFile === name
                        ? "text-white bg-[#0a0b0e]"
                        : "text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    <span className="text-[10px]">{name.endsWith('.js') ? '📄' : '⚙️'}</span>
                    {name}
                    {activeFile === name && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-t-full"></div>}
                  </button>
                ))}
              </div>

              {/* Monaco Code Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  onMount={() => setEditorReady(true)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                    fontLigatures: true,
                    lineHeight: 22,
                    padding: { top: 12, bottom: 12 },
                    scrollBeyondLastLine: false,
                    renderLineHighlight: "gutter",
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    smoothScrolling: true,
                    bracketPairColorization: { enabled: true },
                    guides: { bracketPairs: true, indentation: true },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    scrollbar: { verticalSliderSize: 4, horizontalSliderSize: 4 },
                  }}
                />
              </div>
            </div>

            {/* Console */}
            <div className="w-72 flex flex-col overflow-hidden">
              <div className="h-9 bg-[#0c0d10] flex items-center justify-between px-4 border-b border-white/[0.04] shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px]">📟</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Console</span>
                  {logs.length > 0 && (
                    <span className="bg-slate-800 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md ml-1">{logs.length}</span>
                  )}
                </div>
                <button onClick={() => setLogs([])} className="text-[9px] text-slate-700 hover:text-slate-400 uppercase font-bold tracking-wider transition-colors">
                  Clear
                </button>
              </div>
              <div className="flex-1 p-3 font-mono text-[11px] space-y-1 overflow-y-auto scrollbar-hide bg-black/20">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex gap-2 py-0.5 px-2 rounded-md ${
                      log.type === "error" ? "text-rose-400 bg-rose-500/[0.06]" : 
                      log.type === "warn" ? "text-amber-400 bg-amber-500/[0.04]" : 
                      "text-slate-500"
                    }`}
                  >
                    <span className="opacity-25 shrink-0 text-[9px] mt-[2px]">
                      {log.type === "error" ? "❌" : log.type === "warn" ? "⚠️" : "›"}
                    </span>
                    <span className="leading-relaxed break-all">{log.text}</span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-800">
                    <span className="text-2xl mb-3 opacity-30">📟</span>
                    <span className="text-[10px] font-bold tracking-wider uppercase">No Output</span>
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        </main>

        {/* ─── RIGHT: INSPECTOR ─── */}
        <aside className="w-60 bg-[#0a0b0e] border-l border-white/[0.04] flex flex-col shrink-0">
          <div className="p-3 border-b border-white/[0.04]">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Inspector</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">

            {/* Transform */}
            <section>
              <div className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[7px] text-blue-400">T</div>
                Transform
              </div>
              <div className="space-y-1.5">
                {[{ l: "Position X", v: "400", c: "text-rose-400" },{ l: "Position Y", v: "300", c: "text-emerald-400" },{ l: "Rotation", v: "0°", c: "text-blue-400" }].map((p) => (
                  <div key={p.l} className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2 border border-white/[0.03]">
                    <span className="text-[10px] text-slate-600 font-medium">{p.l}</span>
                    <span className={`text-[11px] font-bold font-mono ${p.c}`}>{p.v}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Appearance */}
            <section>
              <div className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[7px] text-purple-400">A</div>
                Appearance
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2 border border-white/[0.03]">
                  <span className="text-[10px] text-slate-600 font-medium">Size</span>
                  <span className="text-[11px] font-bold font-mono text-slate-400">18px</span>
                </div>
                <div className="flex items-center gap-3 bg-black/20 rounded-lg px-3 py-2 border border-white/[0.03]">
                  <span className="text-[10px] text-slate-600 font-medium">Color</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-purple-500 border border-white/10 shadow-inner"></div>
                    <span className="text-[10px] font-mono text-slate-500">#A855F7</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Physics */}
            <section>
              <div className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[7px] text-amber-400">P</div>
                Physics
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2 border border-white/[0.03]">
                  <span className="text-[10px] text-slate-600 font-medium">Gravity</span>
                  <span className="text-[11px] font-bold font-mono text-slate-500">0</span>
                </div>
                <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2 border border-white/[0.03]">
                  <span className="text-[10px] text-slate-600 font-medium">Friction</span>
                  <span className="text-[11px] font-bold font-mono text-slate-500">0.92</span>
                </div>
                <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2 border border-white/[0.03]">
                  <span className="text-[10px] text-slate-600 font-medium">Bounce</span>
                  <span className="text-[11px] font-bold font-mono text-emerald-400">ON</span>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/[0.04] space-y-2">
            <Link href="/assets" className="block w-full text-center py-2.5 bg-purple-500/[0.08] text-purple-400 border border-purple-500/15 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-purple-500/15 transition-colors">
              Import Assets
            </Link>
            <button className="w-full py-2.5 bg-rose-500/[0.06] text-rose-500/60 border border-rose-500/10 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
              Reset Project
            </button>
          </div>
        </aside>
      </div>

      {/* ═══════════ STATUS BAR ═══════════ */}
      <footer className="h-6 bg-[#0c0d10] border-t border-white/[0.04] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${editorReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
            <span className="text-[9px] text-slate-600 font-medium">{editorReady ? 'Editor Ready' : 'Loading...'}</span>
          </div>
          <span className="text-[9px] text-slate-700">JavaScript</span>
          <span className="text-[9px] text-slate-700">UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] text-slate-700">GF Core v1.0</span>
          <span className="text-[9px] text-slate-700 font-mono">Ln 1, Col 1</span>
        </div>
      </footer>
    </div>
  );
}
