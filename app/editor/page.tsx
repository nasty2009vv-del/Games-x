"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { saveGame } from "../../lib/actions";

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function GameForgeEditor() {
  const [activeTab, setActiveTab] = useState("code");
  const [isRunning, setIsRunning] = useState(false);
  const [runHash, setRunHash] = useState(0);
  const [selectedNode, setSelectedNode] = useState("Player");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  
  const [code, setCode] = useState(`// GameForge Canvas API v1.0
// Write your game logic here!

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 300, y: 200, speed: 250, size: 30, color: '#a855f7' };
let enemy = { x: 500, y: 100, speed: 100, size: 20, color: '#f97316' };
let lastTime = 0;

function update(dt) {
  // Simple enemy bounce AI
  enemy.y += enemy.speed * dt;
  if(enemy.y > canvas.height - enemy.size || enemy.y < enemy.size) enemy.speed *= -1;
}

function draw() {
  // Clear scene
  ctx.fillStyle = '#1a1b26';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw ground
  ctx.fillStyle = '#10b981';
  ctx.fillRect(100, 500, 600, 40);
  
  // Draw Enemy
  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x - enemy.size, enemy.y - enemy.size, enemy.size*2, enemy.size*2);

  // Draw Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - player.size, player.y - player.size, player.size*2, player.size*2);
}

function gameLoop(timestamp) {
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  if(dt < 0.1) update(dt);
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
window.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowRight') player.x += 10;
  if(e.key === 'ArrowLeft') player.x -= 10;
  if(e.key === 'ArrowUp') player.y -= 30;
});

requestAnimationFrame(gameLoop);
`);

  const handleRunGame = () => {
    setRunHash(Date.now());
    setIsRunning(true);
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

  const sceneNodes = [
    { id: "Main Scene", icon: "🌍", color: "text-white" },
    { id: "Player", icon: "👤", color: "text-purple-400" },
    { id: "Enemy", icon: "👹", color: "text-orange-400" },
    { id: "Ground", icon: "🟩", color: "text-emerald-400" },
    { id: "Collider", icon: "💥", color: "text-red-400" },
  ];

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>body { margin: 0; overflow: hidden; background: #1a1b26; display: flex; justify-content: center; align-items: center; height: 100vh; }</style>
      </head>
      <body>
        <canvas id="gameCanvas" width="800" height="600" style="max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 0 50px rgba(0,0,0,0.5);"></canvas>
        <script>
          try {
            ${code}
          } catch(e) {
            document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">Syntax Error: ' + e.message + '</div>';
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] text-slate-300 font-sans shadow-xl overflow-hidden" dir="rtl">
      {/* Top Bar */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between px-4 shrink-0 shadow-md relative z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg text-white tracking-wide hover:text-purple-400 transition-colors">
            GameForge Editor
          </Link>
          <span className="text-slate-500 text-sm font-mono flex items-center gap-2">
            main_level.js <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded border border-blue-500/30">JS Engine</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            disabled={isSaving}
            onClick={handleSave}
            className={`px-4 py-1.5 rounded bg-transparent border border-slate-600 hover:bg-slate-700 text-white text-sm transition-colors active:scale-95 disabled:opacity-50 flex items-center gap-2`}
          >
            {saveStatus === "saving" ? "جارِ الحفظ..." : saveStatus === "success" ? "تم الحفظ ✓" : "حفظ"}
          </button>
          <button onClick={handleRunGame} className="px-6 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
            <span>تشغيل المعاينة</span>
            <span className="">▶</span>
          </button>
          <button className="px-6 py-1.5 rounded bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95">
            <span>نشر اللعبة</span>
            <span>🚀</span>
          </button>
        </div>
      </div>

      {/* Main Editing Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Scene Tree */}
        <div className="w-64 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 p-3 uppercase tracking-wider border-b border-[#3e3e42] bg-[#1e1e1e]/50">
            شجرة المشهد (Scene Tree)
          </div>
          <div className="p-2 space-y-1 text-sm">
            {sceneNodes.map(node => (
              <div 
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedNode === node.id ? 'bg-[#094771] text-white border border-blue-500/30 shadow-inner' : 'hover:bg-[#2a2d2e]'} ${node.id !== "Main Scene" ? 'pr-6' : ''}`}
              >
                <span className={node.color}>{node.icon}</span> 
                <span className="font-medium">{node.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas & Code Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
           
           {/* Top Half: Visual Scene Editor / ACTUAL CANVAS RUNNER */}
           <div className="h-1/2 min-h-[300px] border-b border-[#3e3e42] p-4 relative overflow-hidden flex flex-col bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
             <div className="flex justify-between items-center mb-2">
               <div className="text-xs text-slate-400 font-mono bg-black/50 px-2 py-1 rounded backdrop-blur border border-slate-700">شاشة العرض المباشر — 800x600</div>
               {isRunning && <div className="text-emerald-400 text-xs font-bold animate-pulse bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-800">● LIVE RUNNING</div>}
             </div>
             
             <div className="flex-1 rounded-xl border border-[#3e3e42] relative flex items-center justify-center overflow-hidden shadow-2xl bg-black">
                {isRunning ? (
                   <iframe 
                     key={runHash}
                     title="game-preview"
                     className="w-full h-full border-0 bg-transparent"
                     sandbox="allow-scripts allow-same-origin"
                     srcDoc={htmlTemplate}
                   />
                ) : (
                   <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900/50 backdrop-blur-sm cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={handleRunGame}>
                     <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-4 shadow-2xl hover:scale-110 transition-transform hover:shadow-emerald-500/20">
                       ▶️
                     </div>
                     <p className="text-slate-400 text-lg font-bold">انقر للتشغيل في البيئة المعزولة (Sandbox)</p>
                   </div>
                )}
             </div>
           </div>

           {/* Bottom Half: Interactive Panels */}
           <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
              <div className="flex border-b border-[#3e3e42] bg-[#2d2d2d] px-2 pt-2 gap-1 text-sm shrink-0">
                 <button onClick={() => setActiveTab('code')} className={`px-5 py-2.5 flex items-center gap-2 font-medium transition-colors ${activeTab === 'code' ? 'bg-[#1e1e1e] text-white border-t-[3px] border-purple-500 rounded-t-md' : 'text-slate-400 hover:text-white hover:bg-[#333]'}`}>
                   <span>📝</span> كود <span className="text-[10px] bg-slate-700 px-1.5 rounded ml-1 text-slate-300">main_level.js</span>
                 </button>
                 <button onClick={() => setActiveTab('assets')} className={`px-5 py-2.5 flex items-center gap-2 font-medium transition-colors ${activeTab === 'assets' ? 'bg-[#1e1e1e] text-white border-t-[3px] border-purple-500 rounded-t-md' : 'text-slate-400 hover:text-white hover:bg-[#333]'}`}>
                   <span>📦</span> أصول
                 </button>
                 <button onClick={() => setActiveTab('settings')} className={`px-5 py-2.5 flex items-center gap-2 font-medium transition-colors ${activeTab === 'settings' ? 'bg-[#1e1e1e] text-white border-t-[3px] border-purple-500 rounded-t-md' : 'text-slate-400 hover:text-white hover:bg-[#333]'}`}>
                   <span>⚙️</span> إعدادات
                 </button>
                 <div className="w-px h-6 bg-[#444] my-auto mx-2 text-transparent">|</div>
                 <button className="px-4 py-2 text-emerald-500 hover:text-emerald-400 font-mono flex items-center gap-2 border border-transparent hover:border-emerald-500/30 rounded">
                   <span>🐛</span> Output Console
                 </button>
              </div>

              {/* Monaco Editor Container */}
              <div className="flex-1 relative bg-[#1e1e1e] w-full h-full" dir="ltr">
                 {activeTab === 'code' ? (
                   <Editor
                     height="100%"
                     defaultLanguage="javascript"
                     theme="vs-dark"
                     value={code}
                     onChange={(val) => setCode(val || "")}
                     options={{
                       minimap: { enabled: false },
                       fontSize: 15,
                       fontFamily: "'JetBrains Mono', Consolas, monospace",
                       lineHeight: 26,
                       scrollBeyondLastLine: false,
                       roundedSelection: true,
                       padding: { top: 20 },
                       smoothScrolling: true,
                       cursorBlinking: "smooth"
                     }}
                   />
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center" dir="rtl">
                      <span className="text-6xl mb-4 opacity-20">🚧</span>
                      <p className="text-lg">هذا القسم يتيح استعراض {activeTab === 'assets' ? 'ملفات الموسيقى والصورك (Assets)' : 'إعدادات المحرك'}.</p>
                      <p className="text-sm mt-2 opacity-50">(سيتم برمجتها في التحديث القادم)</p>
                   </div>
                 )}
              </div>
           </div>

        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-[300px] bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 p-3 uppercase tracking-wider border-b border-[#3e3e42] bg-[#1e1e1e]/50 flex justify-between items-center">
            <span>خصائص: {selectedNode}</span>
            <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-white">متصل</span>
          </div>
          
          <div className="p-5 space-y-5 text-sm font-sans">
            <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#3e3e42] shadow-inner space-y-4">
              <div className="flex items-center justify-between group">
                <span className="text-slate-400 font-medium">الموضع X</span>
                <input type="number" defaultValue={selectedNode === "Player" ? 300 : selectedNode === "Enemy" ? 500 : 0} className="w-24 bg-[#3c3c3c] border border-[#555] focus:border-purple-500 text-white px-2 py-1.5 outline-none text-left font-mono text-sm rounded shadow-inner" />
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-slate-400 font-medium">الموضع Y</span>
                <input type="number" defaultValue={selectedNode === "Player" ? 200 : selectedNode === "Enemy" ? 100 : 0} className="w-24 bg-[#3c3c3c] border border-[#555] focus:border-purple-500 text-white px-2 py-1.5 outline-none text-left font-mono text-sm rounded shadow-inner" />
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-slate-400 font-medium">السرعة</span>
                <input type="number" defaultValue={selectedNode === "Player" ? 250 : selectedNode === "Enemy" ? 100 : 0} className="w-24 bg-[#3c3c3c] border border-[#555] focus:border-purple-500 text-white px-2 py-1.5 outline-none text-left font-mono text-sm rounded shadow-inner" />
              </div>
            </div>
            
            <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#3e3e42] shadow-inner space-y-4">
              <div className="flex items-center justify-between group">
                <span className="text-slate-400 font-medium">اللون / المظهر</span>
                <input type="color" defaultValue={selectedNode === "Player" ? "#a855f7" : selectedNode === "Enemy" ? "#f97316" : "#ffffff"} className="w-24 h-8 bg-[#3c3c3c] border border-[#555] rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-slate-400 font-medium">الجاذبية</span>
                <input type="number" defaultValue="980" className="w-24 bg-[#3c3c3c] border border-[#555] focus:border-purple-500 text-white px-2 py-1.5 outline-none text-left font-mono text-sm rounded shadow-inner" />
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-slate-400 font-medium">الصورة المرتبطة</span>
                <button className="w-24 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-xs text-white px-2 py-1.5 rounded truncate font-mono transition-colors">
                  {selectedNode.toLowerCase()}.png
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
