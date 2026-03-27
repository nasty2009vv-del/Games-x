"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useLang } from "../../lib/lang";

interface GameDisplay {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  plays: string;
  rating: number;
  thumb: string;
  icon: string;
  desc: string;
  tags: string[];
}

export default function ExploreGames() {
  const { t, lang, dir } = useLang();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => setActiveToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const games: GameDisplay[] = [
    { id: "neon-dash", title: lang === "ar" ? "لمعة نيون" : "Neon Dash", author: "AbdallahDev", authorAvatar: "AD", plays: "145k", rating: 4.9, thumb: "from-purple-600 to-indigo-900", icon: "🏃", desc: "Fast-paced cyberpunk platformer with synthwave beats.", tags: ["Cyberpunk", "Platformer"] },
    { id: "starship-core", title: lang === "ar" ? "نجم الفضاء" : "Starship Core", author: "PixelNinja", authorAvatar: "PN", plays: "89k", rating: 4.7, thumb: "from-blue-600 to-cyan-900", icon: "🚀", desc: "Intense space combat simulator in deep orbit.", tags: ["Sci-Fi", "Shooter"] },
    { id: "fantasy-merge", title: lang === "ar" ? "دمج الأساطير" : "Fantasy Merge", author: "MagicStudio", authorAvatar: "MS", plays: "210k", rating: 4.8, thumb: "from-emerald-600 to-teal-900", icon: "🎴", desc: "A magical puzzle experience where creatures evolve.", tags: ["Puzzle", "Casual"] },
    { id: "retro-racing", title: lang === "ar" ? "سباق ريترو" : "Retro Racing", author: "SpeedDrift", authorAvatar: "SD", plays: "50k", rating: 4.5, thumb: "from-rose-600 to-red-900", icon: "🏎️", desc: "Classic 8-bit racing revitalized for modern systems.", tags: ["Racing", "Pixel Art"] },
    { id: "dungeon-clicker", title: lang === "ar" ? "نقرة الزنزانة" : "Dungeon Clicker", author: "IdleMaster", authorAvatar: "IM", plays: "1.2M", rating: 4.2, thumb: "from-amber-600 to-orange-900", icon: "🗝️", desc: "Infinite dungeon crawling with one-click combat.", tags: ["Idle", "RPG"] },
    { id: "space-mining", title: lang === "ar" ? "تعدين الفضاء" : "Space Mining", author: "AstroDev", authorAvatar: "AS", plays: "12k", rating: 4.9, thumb: "from-cyan-600 to-slate-900", icon: "💎", desc: "Resource management and mining in the asteroid belt.", tags: ["Simulation", "Sandbox"] },
  ];

  const creators = [
    { name: "AbdallahDev", avatar: "AD", games: 12, top: "Neon Dash" },
    { name: "PixelNinja", avatar: "PN", games: 8, top: "Starship Core" },
    { name: "MagicStudio", avatar: "MS", games: 24, top: "Fantasy Merge" },
    { name: "LogicWizard", avatar: "LW", games: 5, top: "Cyber Logic" },
  ];

  const filterTabs = [
    { key: "all", label: lang === 'ar' ? 'الكل' : 'All' },
    { key: "trending", label: t("explore.trending") },
    { key: "new", label: t("explore.new") },
    { key: "top", label: t("explore.top") },
    { key: "puzzle", label: t("explore.puzzle") },
    { key: "racing", label: t("explore.racing") },
    { key: "rpg", label: "RPG" },
  ];

  const filtered = useMemo(() => {
    return games.filter(g => {
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) || 
                           g.author.toLowerCase().includes(search.toLowerCase());
      
      const matchesCat = activeCategory === "all" || 
                         g.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase() || 
                                         tabToTag(activeCategory).toLowerCase() === t.toLowerCase());
      
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory, games]);

  // Helper to map tab keys to game tags for filtering
  function tabToTag(cat: string) {
    const maps: any = {
      "trending": "Cyberpunk",
      "new": "Sci-Fi",
      "top": "Puzzle",
      "puzzle": "Puzzle",
      "racing": "Racing",
      "rpg": "RPG"
    };
    return maps[cat] || cat;
  }

  const translateTag = (tag: string) => {
     const translations: any = {
       "Cyberpunk": lang === 'ar' ? "سايبربانك" : "Cyberpunk",
       "Platformer": lang === 'ar' ? "منصات" : "Platformer",
       "Sci-Fi": lang === 'ar' ? "خيال علمي" : "Sci-Fi",
       "Shooter": lang === 'ar' ? "تصويب" : "Shooter",
       "Puzzle": lang === 'ar' ? "ألغاز" : "Puzzle",
       "Casual": lang === 'ar' ? "كاجوال" : "Casual",
       "Racing": lang === 'ar' ? "سباق" : "Racing",
       "Pixel Art": lang === 'ar' ? "بكسل" : "Pixel Art",
       "Idle": lang === 'ar' ? "خمول" : "Idle",
       "RPG": lang === 'ar' ? "RPG" : "RPG",
       "Simulation": lang === 'ar' ? "محاكاة" : "Simulation",
       "Sandbox": lang === 'ar' ? "صندوق رمل" : "Sandbox",
     };
     return translations[tag] || tag;
  };

  const featured = games[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
      {/* 🚀 FEATURED HERO SECTION */}
      <section className="relative rounded-[4rem] overflow-hidden bg-slate-950 border border-white/[0.05] p-8 md:p-20 mb-20 group">
        <div className={`absolute inset-0 bg-gradient-to-br ${featured.thumb} opacity-20 blur-3xl scale-110`}></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className={`flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
               🔥 {lang === 'ar' ? 'لعبة الأسبوع' : 'GAME OF THE WEEK'}
             </div>
             <h2 className="text-5xl md:text-8xl font-black text-white mb-6 leading-none tracking-tighter">
                {featured.title}
             </h2>
             <p className="text-slate-400 text-lg md:text-xl font-light max-w-xl mb-10 leading-relaxed opacity-80">
                {featured.desc}
             </p>
             <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href={`/game/${featured.id}`} className="px-12 py-5 bg-white text-slate-950 font-black rounded-[2rem] hover:scale-[1.05] transition-all shadow-2xl shadow-white/10 active:scale-95 text-xl flex items-center gap-3">
                   ▶ {lang === 'ar' ? 'العب الآن' : 'Play Now'}
                </Link>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] backdrop-blur-xl">
                   <div className="flex flex-col text-center">
                      <span className="text-white font-black text-xl">{featured.plays}</span>
                      <span className="text-[9px] text-slate-500 uppercase font-black">Plays</span>
                   </div>
                   <div className="w-px h-8 bg-white/10 mx-2"></div>
                   <div className="flex flex-col text-center">
                      <span className="text-yellow-500 font-black text-xl">⭐ {featured.rating}</span>
                      <span className="text-[9px] text-slate-500 uppercase font-black">Rating</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="relative w-full lg:w-[480px] aspect-[4/3] rounded-[3.5rem] overflow-hidden shadow-3xl shadow-purple-600/20 border border-white/10 group-hover:scale-[1.02] transition-transform duration-700">
             <div className={`absolute inset-0 bg-gradient-to-br ${featured.thumb} flex items-center justify-center text-[180px]`}>
               {featured.icon}
             </div>
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
          </div>
        </div>
      </section>

      {/* 🌟 RISING CREATORS */}
      <section className="mb-24">
        <h3 className="text-2xl font-black text-white mb-8 px-2 flex items-center gap-3">
          <span className="text-3xl">🏅</span>
          {lang === 'ar' ? 'مبدعون صاعدون' : 'Rising Creators'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {creators.map((c, i) => (
            <Link href={`/profile/${c.name}`} key={i} className="bg-[#0c0d12] border border-white/[0.05] p-6 rounded-[2.5rem] flex items-center gap-5 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                {c.avatar}
              </div>
              <div>
                <h4 className="text-white font-black text-lg group-hover:text-purple-400 transition-colors uppercase tracking-tight">{c.name}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mt-1">
                   {c.games} {lang === 'ar' ? 'ألعاب' : 'Games'} • Top: {c.top}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🔍 SEARCH & FILTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 mask-fade">
          {filterTabs.map((tab) => (
            <button 
              key={tab.key}
              onClick={() => {
                setActiveCategory(tab.key);
                setSearch(""); // Clear search when switching categories
              }}
              className={`whitespace-nowrap px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${activeCategory === tab.key ? 'bg-white text-slate-950 border-white shadow-xl shadow-white/10' : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 hover:text-white border-white/[0.03]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-[400px]">
          <span className={`absolute ${lang === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-slate-600 text-lg`}>🔍</span>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("explore.search")}
            className={`w-full bg-[#0c0d12] border border-white/[0.08] rounded-[2rem] ${lang === 'ar' ? 'pr-16 pl-6 text-right' : 'pl-16 pr-6 text-left'} py-5 text-white focus:outline-none focus:border-purple-500/50 transition-all font-bold placeholder:text-slate-700 shadow-2xl`} 
          />
        </div>
      </div>

      {/* 🎮 GAMES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((game) => (
          <Link href={`/game/${game.id}`} key={game.id} className="group relative flex flex-col bg-[#0c0d12] border border-white/[0.05] rounded-[3.5rem] overflow-hidden hover:border-purple-500/40 transition-all duration-700 hover:-translate-y-3 hover:shadow-3xl hover:shadow-purple-500/10">
            <div className={`aspect-video w-full bg-gradient-to-br ${game.thumb} relative overflow-hidden flex items-center justify-center text-[100px]`}>
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
               <span className="group-hover:scale-125 transition-transform duration-700 relative z-20 drop-shadow-3xl">{game.icon}</span>
               
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-30">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-950 text-2xl shadow-white shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-500">▶</div>
               </div>
               
               <div className="absolute top-6 left-6 z-40 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl text-[9px] uppercase font-black text-white border border-white/10 tracking-widest">
                 {game.plays} PLAYS
               </div>
            </div>
            
            <div className={`p-8 flex-1 flex flex-col ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="flex justify-between items-start mb-4 gap-2">
                 <h3 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors leading-tight tracking-tight">{game.title}</h3>
                 <div className="flex items-center text-yellow-500 text-sm font-black bg-yellow-500/10 px-3 py-1 rounded-xl border border-yellow-500/20 shrink-0">⭐ {game.rating}</div>
              </div>
              
              <div className={`text-xs font-bold text-slate-500 flex items-center gap-3 mb-8 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                 <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center text-[10px] text-white font-black">{game.authorAvatar}</div>
                 <span className="uppercase tracking-widest">{game.author}</span>
              </div>
              
              <div className="mt-auto flex items-center justify-between gap-4">
                 <div className={`flex gap-2 flex-wrap ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    {game.tags.map(tg => (
                      <span key={tg} className="text-[10px] font-black tracking-[0.1em] uppercase text-purple-400 bg-purple-400/5 px-4 py-1.5 rounded-xl border border-purple-400/10">
                        {translateTag(tg)}
                      </span>
                    ))}
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* 📍 NO RESULTS */}
      {filtered.length === 0 && (
        <div className="py-32 text-center animate-in fade-in zoom-in duration-500">
           <span className="text-8xl block mb-6 grayscale opacity-20">👻</span>
           <h4 className="text-2xl font-black text-white opacity-40">{lang === 'ar' ? 'لم نجد أي ألعاب تطابق هذا التصنيف' : 'No games found for this category'}</h4>
           <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-8 text-purple-500 font-bold hover:underline underline-offset-4">{lang === 'ar' ? 'إعادة تعيين البحث' : 'Reset All Filters'}</button>
        </div>
      )}
      {/* 🥯 GLOBAL TOAST SYSTEM */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${activeToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
          <div className="bg-white text-slate-950 px-10 py-4 rounded-full font-black shadow-3xl shadow-white/20 flex items-center gap-4 border-t border-slate-100">
             <span className="text-xl">✨</span>
             {activeToast}
          </div>
      </div>
    </div>
  );
}

