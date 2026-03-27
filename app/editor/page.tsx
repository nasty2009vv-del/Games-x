"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { saveGame } from "../../lib/actions";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function GameForgeEditor() {
  const [activeTab, setActiveTab] = useState("code");
  const [isRunning, setIsRunning] = useState(false);
  const [runHash, setRunHash] = useState(0);
  const [selectedNode, setSelectedNode] = useState("Player");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [logs, setLogs] = useState<{ id: number, text: string, type: 'info' | 'error' }[]>([]);
  
  const [code, setCode] = useState(`// GameForge Engine Core v1.0
// Welcome to the Developer Studio!

let player = { x: 400, y: 300, size: 20, color: '#a855f7' };

GF.init = () => {
  console.log("Game Engine Initialized Successfully!");
  console.log("Controls: Arrow Keys or WASD to move.");
}

GF.update = (dt) => {
  // Move based on input axes
  player.x += GF.Input.getAxis('Horizontal') * 300 * dt;
  player.y += GF.Input.getAxis('Vertical') * 300 * dt;
  
  // Boundary check
  if(player.x < 0) player.x = 0;
  if(player.x > GF.canvas.width) player.x = GF.canvas.width;
}

GF.draw = () => {
  // Clear with a nice midnight color
  GF.Draw.clear('#0f172a');
  
  // Background Pattern
  for(let i=0; i<GF.canvas.width; i+=100) {
    GF.Draw.rect(i, 0, 1, GF.canvas.height, '#ffffff10');
  }

  // Draw Shadow
  GF.Draw.circle(player.x + 5, player.y + 5, player.size, '#00000050');

  // Draw Player
  GF.Draw.circle(player.x, player.y, player.size, player.color);
  
  // HUD
  GF.Draw.text("X: " + Math.floor(player.x), 20, 40, 16, '#94a3b8');
  GF.Draw.text("Y: " + Math.floor(player.y), 20, 70, 16, '#94a3b8');
}`);

  // Listen for logs from Sandbox
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'GF_LOG') {
        setLogs(prev => [...prev.slice(-19), { id: Date.now(), text: e.data.msg, type: 'info' }]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRunGame = () => {
    setRunHash(Date.now());
    setIsRunning(true);
    setLogs([{ id: 0, text: '--- RESTARTING ENGINE ---', type: 'info' }]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    const result = await saveGame("demo", { code, title: "my_platformer" });
    if (result.success) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
    }
    setIsSaving(false);
  };

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>body { margin: 0; overflow: hidden; background: #0f172a; display: flex; justify-content: center; align-items: center; height: 100vh; }</style>
      </head>
      <body>
        <canvas id="gameCanvas" width="800" height="600" style="max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 0 100px rgba(0,0,0,0.8);"></canvas>
        <script>
          /** GameForge Core Engine v1.0 **/
          window.GF = (() => {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            const keys = {};
            window.addEventListener('keydown', (e) => keys[e.code] = true);
            window.addEventListener('keyup', (e) => keys[e.code] = false);

            const GF = {
              canvas, ctx, dt: 0,
              init: () => {}, update: () => {}, draw: () => {},
              Input: {
                isDown: (code) => !!keys[code],
                getAxis: (axis) => {
                  if (axis === 'Horizontal') return (keys['ArrowRight'] || keys['KeyD'] ? 1 : 0) - (keys['ArrowLeft'] || keys['KeyA'] ? 1 : 0);
                  if (axis === 'Vertical') return (keys['ArrowDown'] || keys['KeyS'] ? 1 : 0) - (keys['ArrowUp'] || keys['KeyW'] ? 1 : 0);
                  return 0;
                }
              },
              Draw: {
                clear: (color = '#1a1b26') => { ctx.fillStyle = color; ctx.fillRect(0, 0, canvas.width, canvas.height); },
                rect: (x, y, w, h, color = '#fff') => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); },
                circle: (x, y, r, color = '#fff') => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); },
                text: (str, x, y, size = 20, color = '#fff') => { ctx.fillStyle = color; ctx.font = \`bold \${size}px sans-serif\`; ctx.fillText(str, x, y); }
              }
            };

            let lastTime = 0;
            const loop = (timestamp) => {
              GF.dt = (timestamp - lastTime) / 1000;
              lastTime = timestamp;
              if (GF.dt < 0.1) { GF.update(GF.dt); GF.draw(); }
              requestAnimationFrame(loop);
            };
            setTimeout(() => { GF.init(); requestAnimationFrame(loop); }, 100);

            // Log Capture
            console.log = (...args) => { window.parent.postMessage({ type: 'GF_LOG', msg: args.join(' ') }, '*'); };
            window.onerror = (e) => { window.parent.postMessage({ type: 'GF_LOG', msg: 'ERROR: ' + e }, '*'); };
            return GF;
          })();

          try {
            ${code}
          } catch(err) {
            console.log("COMPILER ERROR: " + err.message);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d0d0f] text-slate-300 font-sans overflow-hidden" dir="rtl">
      {/* Premium Studio Header */}
      <div className="h-14 bg-slate-950 border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-xl text-white tracking-widest hover:text-purple-400 transition-colors italic">
            GF-STUDIO
          </Link>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-mono">PROJECT:</span>
            <span className="text-white text-xs font-black bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">my_neon_game . GF</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
           onClick={handleSave} 
           className={`px-6 py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-2 ${saveStatus === 'success' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-white border border-slate-700 hover:bg-slate-800'}`}
          >
            {isSaving ? "SAVING..." : saveStatus === 'success' ? "SAVED ✓" : "SAVE PROJECT"}
          </button>
          
          <button onClick={handleRunGame} className="px-8 py-2 bg-white text-slate-950 font-black rounded-xl hover:scale-105 active:scale-95 transition-all text-xs shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
            LAUNCH ENGINE ▶
          </button>
          
          <button className="px-8 py-2 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black rounded-xl hover:scale-105 active:scale-95 transition-all text-xs shadow-[0_0_30px_-5px_rgba(147,51,234,0.4)]">
            PUBLISH CLOUD 🚀
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" dir="ltr">
        
        {/* IDE Sidebar: Scene & Layers */}
        <div className="w-64 bg-[#0a0b0d] border-r border-white/5 flex flex-col shrink-0">
          <div className="text-[10px] font-black text-slate-600 p-4 border-b border-white/5 uppercase tracking-[0.2em] bg-black/20">
            Engine Tree
          </div>
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
             {[
               {id: 'Scene', icon: '🌍', col: 'text-white'},
               {id: 'Camera', icon: '🎥', col: 'text-blue-400'},
               {id: 'Player', icon: '👤', col: 'text-purple-400'},
               {id: 'Map: Level1', icon: '🗺️', col: 'text-emerald-400'},
               {id: 'BGM: Neon', icon: '🎵', col: 'text-rose-400'}
             ].map(item => (
               <div key={item.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${item.id === 'Player' ? 'bg-purple-600/10 text-white border border-purple-500/20 shadow-lg' : 'hover:bg-white/5 text-slate-500'}`}>
                 <span className={item.col}>{item.icon}</span>
                 <span className="text-sm font-bold">{item.id}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Center Canvas & Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
           
           {/* Top: LIVE ENGINE CANVAS */}
           <div className="flex-1 relative p-6 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
             <div className="flex items-center justify-between mb-4 bg-black/60 backdrop-blur-xl px-6 py-2 rounded-2xl border border-white/5 shadow-2xl">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-white tracking-widest uppercase italic">GameForge Render Pool v1.0</span>
               </div>
               <div className="text-[10px] font-mono text-slate-500 tracking-tighter uppercase font-bold">Res: 800x600 | 60 FPS</div>
             </div>

             <div className="flex-1 relative rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border-4 border-slate-900 bg-black group">
                {isRunning ? (
                   <iframe 
                      key={runHash}
                      title="engine-render"
                      srcDoc={htmlTemplate}
                      className="w-full h-full border-0"
                   />
                ) : (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-[4px] cursor-pointer group" onClick={handleRunGame}>
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-2xl">
                        <span className="text-4xl text-white">▶</span>
                      </div>
                      <p className="mt-8 text-white text-sm font-black tracking-[0.3em] uppercase italic opacity-60">Ready to Boot Engine</p>
                   </div>
                )}
             </div>
           </div>

           {/* Bottom: MONACO & CONSOLE */}
           <div className="h-[400px] flex border-t border-white/5 bg-[#0a0a0c]">
              <div className="flex-1 border-r border-white/5 flex flex-col overflow-hidden">
                 <div className="h-10 bg-black/40 flex items-center px-6 gap-6 border-b border-white/5">
                   <div className="flex items-center gap-2 text-purple-400 font-bold text-xs border-b-2 border-purple-500 h-full px-2">
                     <span>📄</span> main.js
                   </div>
                   <div className="text-slate-600 font-bold text-xs hover:text-slate-400 transition-colors cursor-pointer px-2">
                     <span>⚙️</span> engine.config
                   </div>
                 </div>
                 <div className="flex-1 relative">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={code}
                      onChange={(val) => setCode(val || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', Consolas, monospace",
                        lineHeight: 24,
                        padding: { top: 16 }
                      }}
                    />
                 </div>
              </div>
              
              {/* Console Window */}
              <div className="w-80 flex flex-col overflow-hidden bg-black/40">
                 <div className="h-10 flex items-center px-6 border-b border-white/5 bg-black/60 shadow-inner">
                    <span className="text-[10px] font-black text-rose-500 tracking-[0.2em] uppercase">Engine Output Log</span>
                    <button onClick={() => setLogs([])} className="ml-auto text-[10px] text-slate-500 hover:text-white uppercase font-bold">Clear</button>
                 </div>
                 <div className="flex-1 p-4 font-mono text-[11px] space-y-2 overflow-y-auto scrollbar-hide">
                    {logs.map(log => (
                       <div key={log.id} className={`flex gap-3 ${log.text.includes('ERROR') ? 'text-rose-400 bg-rose-500/5 p-1 px-2 rounded-lg' : 'text-emerald-400'}`}>
                          <span className="opacity-30">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                          <span className="font-bold flex-1">{log.text}</span>
                       </div>
                    ))}
                    {logs.length === 0 && <div className="text-slate-700 italic text-center pt-20">Awaiting Log Data...</div>}
                 </div>
              </div>
           </div>
        </div>

        {/* Property Inspector */}
        <div className="w-72 bg-[#0a0b0d] border-l border-white/5 flex flex-col shrink-0">
          <div className="text-[10px] font-black text-slate-600 p-4 border-b border-white/5 uppercase tracking-[0.2em] bg-black/20">
            Inspector: {selectedNode}
          </div>
          <div className="p-6 space-y-8 overflow-y-auto flex-1 text-right" dir="rtl">
             <div className="space-y-4">
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الموضع (Position)</label>
                   <div className="grid grid-cols-2 gap-2">
                     <div className="bg-black/40 border border-white/5 rounded-xl p-2 text-center text-xs text-white shadow-inner">X: <span className="text-purple-400 font-bold">400</span></div>
                     <div className="bg-black/40 border border-white/5 rounded-xl p-2 text-center text-xs text-white shadow-inner">Y: <span className="text-purple-400 font-bold">300</span></div>
                   </div>
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الحجم (Scale)</label>
                   <div className="bg-black/40 border border-white/5 rounded-xl p-2 text-center text-xs text-white shadow-inner flex justify-between px-4">
                     <span>Radius:</span> <span className="text-blue-400 font-bold">20px</span>
                   </div>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">اللون (Shader)</label>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500 border-2 border-white/20 shadow-xl"></div>
                      <span className="text-xs font-mono text-slate-400">#A855F7</span>
                   </div>
                </div>
             </div>

             <div className="pt-8 border-t border-white/5">
                <button className="w-full py-3 bg-red-600/10 text-red-500 rounded-2xl border border-red-500/20 text-xs font-black shadow-lg hover:bg-red-600/20 transition-all">
                  DELETE ENTITY 🗑️
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
