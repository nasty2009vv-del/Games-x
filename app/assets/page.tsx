"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AssetStorePage() {
  const [filter, setFilter] = useState("All");

  const assetCategories = ["All", "Sprites", "Tilesets", "Audio", "UI Kits", "Fonts"];
  
  const assets = [
    { id: 1, name: "Cyberpunk City Tiles", type: "Tilesets", price: "Free", author: "@NeonPixel", size: "2.4 MB", thumb: "bg-purple-900/40", icon: "🏙️" },
    { id: 2, name: "Retro UI Pack", type: "UI Kits", price: "$4.99", author: "@UIKing", size: "1.2 MB", thumb: "bg-blue-900/40", icon: "💎" },
    { id: 3, name: "8-Bit SFX Pack", type: "Audio", price: "Free", author: "@SoundWave", size: "15 MB", thumb: "bg-rose-900/40", icon: "🔊" },
    { id: 4, name: "Character Sprites: Hero", type: "Sprites", price: "Free", author: "@AnimaDev", size: "800 KB", thumb: "bg-emerald-900/40", icon: "🏃" },
    { id: 5, name: "Sci-Fi Ambient Loops", type: "Audio", price: "$2.50", author: "@SynthLord", size: "42 MB", thumb: "bg-orange-900/40", icon: "🎹" },
    { id: 6, name: "Pixel Space Font", type: "Fonts", price: "Free", author: "@TypeMaster", size: "120 KB", thumb: "bg-slate-800/40", icon: "Aa" },
  ];

  const filteredAssets = filter === "All" ? assets : assets.filter(a => a.type === filter);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Asset Forge</h1>
           <p className="text-slate-400 font-light max-w-lg">High-quality community-made assets to jumpstart your GameForge projects.</p>
        </div>
        <button className="px-8 py-3 bg-gradient-to-tr from-purple-600 to-blue-600 text-white font-bold rounded-2xl hover:scale-[1.02] shadow-xl shadow-purple-600/20 active:scale-95 transition-all">
          Upload Your Assets
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
         {assetCategories.map(cat => (
           <button 
             key={cat}
             onClick={() => setFilter(cat)}
             className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${filter === cat ? 'bg-white text-slate-950 border-white shadow-lg' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'}`}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map(asset => (
           <div key={asset.id} className="group bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className={`aspect-square w-full ${asset.thumb} flex items-center justify-center text-7xl relative`}>
                 {asset.icon}
                 <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
                    {asset.type}
                 </div>
              </div>
              <div className="p-6">
                 <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-purple-400 transition-colors truncate">{asset.name}</h3>
                    <span className={`text-xs font-black ${asset.price === 'Free' ? 'text-emerald-400' : 'text-blue-400'}`}>{asset.price}</span>
                 </div>
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-slate-800"></div>
                       <span className="text-xs text-slate-500 font-medium">{asset.author}</span>
                       <span className="text-[10px] text-slate-700 ml-auto">{asset.size}</span>
                    </div>
                    <button className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-bold border border-slate-700 hover:bg-white hover:text-slate-950 transition-all active:scale-95">
                       {asset.price === 'Free' ? 'Download Assets' : 'Purchase Pack'}
                    </button>
                 </div>
              </div>
           </div>
        ))}

        {filteredAssets.length === 0 && (
           <div className="col-span-full py-32 text-center">
              <span className="text-6xl mb-6 block">🔎</span>
              <p className="text-slate-500 font-bold">No assets found in this category.</p>
           </div>
        )}
      </div>

      {/* Support Banner */}
      <div className="mt-20 p-12 rounded-[3rem] bg-gradient-to-r from-slate-950 to-purple-950 border border-slate-800 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-10"></div>
         <h2 className="text-3xl font-black text-white mb-4 relative z-10">Supporting Independent Creators</h2>
         <p className="text-slate-400 max-w-xl mx-auto mb-8 relative z-10 font-light">
           We take 0% commission on asset sales. Every cent you earn goes straight to your pocket to fund your next big game project.
         </p>
         <button className="relative z-10 px-10 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/30">
           Start Selling Today
         </button>
      </div>
    </div>
  );
}
