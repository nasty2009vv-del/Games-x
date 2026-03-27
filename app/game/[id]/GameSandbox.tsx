"use client";

import React, { useState, useEffect } from "react";

interface Props {
  packageName?: string | null;
  gameTitle: string;
  htmlContent?: string | null;
}

export default function GameSandbox({ packageName, gameTitle, htmlContent }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (isPlaying && loadingStep < 100) {
      const interval = setInterval(() => {
        setLoadingStep(prev => prev + Math.floor(Math.random() * 20) + 10);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying, loadingStep]);

  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (loadingStep >= 100 && !htmlContent) {
      const handleKeyDown = (e: KeyboardEvent) => {
        const speed = 5;
        setPos(prev => {
          if (e.key === 'ArrowUp') return { ...prev, y: Math.max(10, prev.y - speed) };
          if (e.key === 'ArrowDown') return { ...prev, y: Math.min(90, prev.y + speed) };
          if (e.key === 'ArrowLeft') return { ...prev, x: Math.max(10, prev.x - speed) };
          if (e.key === 'ArrowRight') return { ...prev, x: Math.min(90, prev.x + speed) };
          return prev;
        });
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [loadingStep, htmlContent]);

  if (!isPlaying) {
    return (
      <div
        onClick={() => setIsPlaying(true)}
        className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer hover:bg-slate-950/40 transition-all duration-700 active:scale-[0.98]"
      >
        <div className="relative group">
          <div className="absolute -inset-8 bg-purple-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full animate-pulse" />
          <div className="w-28 h-28 bg-white/10 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/30 shadow-[0_0_50px_rgba(168,85,247,0.3)] group-hover:scale-110 group-hover:bg-white transition-all duration-500">
            <span className="text-6xl ml-2 text-white group-hover:text-slate-950 transition-colors">▶</span>
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-white text-2xl font-black tracking-[0.3em] uppercase drop-shadow-2xl">Initialize {gameTitle}</p>
          <p className="text-slate-500 text-xs font-bold mt-2 tracking-widest uppercase italic">Secure GameForge Environment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#020305] flex flex-col items-center justify-center overflow-hidden">
      {loadingStep < 100 ? (
        <div className="w-full max-w-md space-y-12 animate-in fade-in duration-1000">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-purple-400 tracking-widest uppercase italic">Staging {packageName || 'assets'}...</span>
              <span className="text-2xl font-black text-white italic">{Math.min(loadingStep, 100)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(loadingStep, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 p-6 bg-white/[0.03] rounded-3xl border border-white/5">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl animate-spin-slow">📦</div>
            <div className="space-y-1">
              <p className="text-white font-black text-sm italic truncate max-w-[200px]">{packageName || "system_core.bundle"}</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Environment Ready</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative flex flex-col">
          {/* ✨ RENDER ACTUAL USER CODE WITH GAME SHELL ✨ */}
          {htmlContent ? (
            <div className="w-full h-full relative overflow-hidden bg-black">
               {/* 📺 CRT / SCANLINE OVERLAY EFFECT */}
               <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-10" />
               
               <iframe 
                 srcDoc={`
                   <!DOCTYPE html>
                   <html>
                     <head>
                       <style>
                         body, html { 
                           margin: 0; padding: 0; width: 100%; height: 100%; 
                           overflow: hidden; background: #000; color: #fff;
                           font-family: sans-serif;
                         }
                         canvas { display: block; max-width: 100%; max-height: 100%; margin: auto; }
                       </style>
                     </head>
                     <body>
                       ${htmlContent}
                     </body>
                   </html>
                 `}
                 className="w-full h-full border-0"
                 title="Game Sandbox Experience"
                 sandbox="allow-scripts allow-modals allow-pointer-lock"
               />
            </div>
          ) : (
            <div className="w-full h-full relative p-12 flex flex-col items-center justify-center">
              {/* ✨ INTERACTIVE MOCK GAME WORLD */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a0b14_0%,_#020305_100%)] opacity-50" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

              <div className="relative z-10 w-full max-w-4xl h-full flex flex-col bg-black/40 rounded-[3rem] border border-white/5 p-8 shadow-inner overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2 h-3 items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <span className="text-[10px] text-slate-500 font-black ml-4 tracking-tighter italic">GF_RECON_CLIENT_v1.0.4 - {packageName}</span>
                  </div>
                  <div className="px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest animate-pulse">
                    Live Engine Active
                  </div>
                </div>

                {/* 🕹️ PLAYABLE OBJECT */}
                <div className="flex-1 bg-slate-900/20 rounded-[2.5rem] border border-white/5 relative shadow-inner overflow-hidden cursor-none">
                  <div
                    className="absolute transition-all duration-100 ease-out z-20 pointer-events-none"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-10 bg-purple-600/30 blur-2xl rounded-full" />
                      <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-white/20 rotate-12">
                        🚀
                      </div>
                    </div>
                  </div>

                  {/* Grid Effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>
              </div>

              <button
                onClick={() => { setIsPlaying(false); setLoadingStep(0); }}
                className="mt-8 px-10 py-4 bg-white/5 hover:bg-white text-slate-500 hover:text-slate-950 font-black rounded-2xl transition-all shadow-2xl text-xs uppercase tracking-widest border border-white/10"
              >
                Reset Sandbox
              </button>
            </div>
          )}

          {/* Overlay Button to Back to Profile/Reset if needed */}
          {htmlContent && (
            <button
              onClick={() => { setIsPlaying(false); setLoadingStep(0); }}
              className="absolute top-6 right-6 z-50 px-4 py-2 bg-black/50 backdrop-blur-xl text-white text-[10px] font-black rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
            >
              RESET SESSION
            </button>
          )}
        </div>
      )}
    </div>
  );
}
