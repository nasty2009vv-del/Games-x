"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function GameForgeEditor() {
  const [activeTab, setActiveTab] = useState("code");
  
  const luaCode = `-- player.lua
function onUpdate(dt)
  if Input.isDown("right") then
    player.velocity.x = 250
  end
  
  if Input.isPressed("jump") then
    player.velocity.y = -400
  end
end`;

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] text-slate-300 font-sans shadow-xl overflow-hidden" dir="rtl">
      {/* Top Bar */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg text-white tracking-wide hover:text-purple-400 transition-colors">
            GameForge Editor
          </Link>
          <span className="text-slate-500 text-sm font-mono">my_platformer.gf</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 rounded bg-transparent border border-slate-600 hover:bg-slate-700 text-white text-sm transition-colors">
            حفظ
          </button>
          <button className="px-4 py-1.5 rounded bg-transparent border border-slate-600 hover:bg-slate-700 text-white text-sm transition-colors">
            استيراد
          </button>
          <button className="px-5 py-1.5 rounded bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-bold text-sm flex items-center gap-2 transition-colors">
            <span>تشغيل</span>
            <span className="text-emerald-400">▶</span>
          </button>
          <button className="px-5 py-1.5 rounded bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all">
            <span>نشر</span>
            <span>🚀</span>
          </button>
        </div>
      </div>

      {/* Main Editing Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Scene Tree */}
        <div className="w-64 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 p-3 uppercase tracking-wider border-b border-[#3e3e42]">
            شجرة المشهد
          </div>
          <div className="p-2 space-y-1 text-sm">
            <div className="flex items-center gap-2 bg-[#094771] text-white p-1.5 rounded cursor-pointer">
              <span>🌍</span> <span>Main Scene</span>
            </div>
            <div className="flex items-center gap-2 hover:bg-[#2a2d2e] p-1.5 rounded cursor-pointer pr-6">
              <span className="text-purple-400">👤</span> <span>Player</span>
            </div>
            <div className="flex items-center gap-2 hover:bg-[#2a2d2e] p-1.5 rounded cursor-pointer pr-6">
              <span className="text-orange-400">📦</span> <span>Sprite</span>
            </div>
            <div className="flex items-center gap-2 hover:bg-[#2a2d2e] p-1.5 rounded cursor-pointer pr-6">
              <span className="text-red-400">💥</span> <span>Collider</span>
            </div>
            <div className="flex items-center gap-2 hover:bg-[#2a2d2e] p-1.5 rounded cursor-pointer pr-2">
              <span className="text-slate-400">🗺️</span> <span>Tilemap</span>
            </div>
            <div className="flex items-center gap-2 hover:bg-[#2a2d2e] p-1.5 rounded cursor-pointer pr-2">
              <span className="text-blue-400">🎵</span> <span>AudioManager</span>
            </div>
            <div className="flex items-center gap-2 hover:bg-[#2a2d2e] p-1.5 rounded cursor-pointer pr-2">
              <span className="text-yellow-400">💡</span> <span>Light2D</span>
            </div>
          </div>
        </div>

        {/* Center Canvas & Code Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
           
           {/* Top Half: Visual Scene Editor (Mockup) */}
           <div className="h-1/2 min-h-[300px] border-b border-[#3e3e42] p-4 relative overflow-hidden flex flex-col">
             <div className="text-xs text-slate-500 mb-2 font-mono">مشهد اللعبة — 600x800</div>
             <div className="flex-1 bg-[#1a1b26] rounded-lg border border-[#3e3e42] relative flex items-center justify-center overflow-hidden shadow-inner">
                {/* Visual Fake Elements */}
                <div className="absolute top-[30%] left-[30%] w-32 h-20 border border-blue-500 bg-blue-500/10 flex items-start p-1 text-xs text-blue-400 font-mono">
                  Player
                </div>
                <div className="absolute bottom-[20%] left-[20%] w-64 h-8 border border-emerald-500 bg-emerald-500/10 flex items-center px-2 text-xs text-emerald-400 font-mono">
                  Ground Tile
                </div>
                <div className="absolute top-[40%] right-[20%] w-24 h-24 border border-orange-500 bg-orange-500/10 flex items-start p-1 text-xs text-orange-400 font-mono">
                  Enemy
                </div>
             </div>
           </div>

           {/* Bottom Half: Interactive Panels */}
           <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
              <div className="flex border-b border-[#3e3e42] bg-[#2d2d2d] px-2 pt-2 gap-1 text-sm shrink-0">
                 <button onClick={() => setActiveTab('code')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'code' ? 'bg-[#1e1e1e] text-white border-t-2 border-purple-500 rounded-t-lg' : 'text-slate-400 hover:text-white hover:bg-[#333]'}`}>
                   <span>📝</span> كود
                 </button>
                 <button onClick={() => setActiveTab('assets')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'assets' ? 'bg-[#1e1e1e] text-white border-t-2 border-purple-500 rounded-t-lg' : 'text-slate-400 hover:text-white hover:bg-[#333]'}`}>
                   <span>📦</span> أصول
                 </button>
                 <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#1e1e1e] text-white border-t-2 border-purple-500 rounded-t-lg' : 'text-slate-400 hover:text-white hover:bg-[#333]'}`}>
                   <span>⚙️</span> إعدادات
                 </button>
                 <div className="w-px h-6 bg-[#444] my-auto mx-2"></div>
                 <button className="px-4 py-2 text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-2">
                   <span>🐛</span> Console
                 </button>
              </div>

              {/* Monaco Editor Container */}
              <div className="flex-1 relative bg-[#1e1e1e] w-full h-full" dir="ltr">
                 {activeTab === 'code' ? (
                   <Editor
                     height="100%"
                     defaultLanguage="lua"
                     theme="vs-dark"
                     value={luaCode}
                     options={{
                       minimap: { enabled: false },
                       fontSize: 14,
                       fontFamily: 'Consolas, monospace',
                       lineHeight: 24,
                       scrollBeyondLastLine: false,
                       roundedSelection: false,
                       padding: { top: 16 }
                     }}
                   />
                 ) : (
                   <div className="flex items-center justify-center h-full text-slate-500 p-8 text-center" dir="rtl">
                      هذا القسم يتيح استعراض {activeTab === 'assets' ? 'ملفات الموسيقى والصور (Assets)' : 'إعدادات المحرك'}.<br/>(قيد التطوير)
                   </div>
                 )}
              </div>
           </div>

        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-72 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 p-3 uppercase tracking-wider border-b border-[#3e3e42]">
            خصائص: PLAYER
          </div>
          
          <div className="p-4 space-y-4 text-sm font-sans">
            <div className="flex items-center justify-between group">
              <span className="text-slate-400">الموضع X</span>
              <input type="text" defaultValue="128" className="w-20 bg-[#3c3c3c] border border-transparent focus:border-purple-500 text-white px-2 py-1 outline-none text-left font-mono text-xs rounded" />
            </div>
            <div className="flex items-center justify-between group">
              <span className="text-slate-400">الموضع Y</span>
              <input type="text" defaultValue="200" className="w-20 bg-[#3c3c3c] border border-transparent focus:border-purple-500 text-white px-2 py-1 outline-none text-left font-mono text-xs rounded" />
            </div>
            <div className="flex items-center justify-between group">
              <span className="text-slate-400">السرعة</span>
              <input type="text" defaultValue="250" className="w-20 bg-[#3c3c3c] border border-transparent focus:border-purple-500 text-white px-2 py-1 outline-none text-left font-mono text-xs rounded" />
            </div>
            
            <hr className="border-[#3e3e42]" />

            <div className="flex items-center justify-between group">
              <span className="text-slate-400">قوة القفز</span>
              <input type="text" defaultValue="-400" className="w-20 bg-[#3c3c3c] border border-transparent focus:border-purple-500 text-white px-2 py-1 outline-none text-left font-mono text-xs rounded" />
            </div>
            <div className="flex items-center justify-between group">
              <span className="text-slate-400">الكتلة</span>
              <input type="text" defaultValue="1.0" className="w-20 bg-[#3c3c3c] border border-transparent focus:border-purple-500 text-white px-2 py-1 outline-none text-left font-mono text-xs rounded" />
            </div>
            <div className="flex items-center justify-between group">
              <span className="text-slate-400">الجاذبية</span>
              <input type="text" defaultValue="980" className="w-20 bg-[#3c3c3c] border border-transparent focus:border-purple-500 text-white px-2 py-1 outline-none text-left font-mono text-xs rounded" />
            </div>

            <hr className="border-[#3e3e42]" />

            <div className="flex items-center justify-between group">
              <span className="text-slate-400">الصورة</span>
              <button className="text-blue-400 hover:text-blue-300 hover:underline font-mono text-xs">player.png</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
