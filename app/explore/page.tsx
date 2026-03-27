"use client";

import Link from "next/link";
import { useLang } from "../../lib/lang";

interface GameDisplay {
  id: string;
  title: string;
  author: string;
  plays: string;
  rating: number;
  thumb: string;
  tags: string[];
}

export default function ExploreGames() {
  const { t, lang } = useLang();

  const games: GameDisplay[] = [
    { id: "neon-dash", title: lang === "ar" ? "لمعة نيون" : "Neon Dash", author: "AbdallahDev", plays: "145k", rating: 4.9, thumb: "bg-purple-600", tags: lang === "ar" ? ["سايبربانك", "منصات"] : ["Cyberpunk", "Platformer"] },
    { id: "starship-core", title: lang === "ar" ? "نجم الفضاء" : "Starship Core", author: "PixelNinja", plays: "89k", rating: 4.7, thumb: "bg-blue-600", tags: lang === "ar" ? ["خيال علمي", "تصويب"] : ["Sci-Fi", "Shooter"] },
    { id: "fantasy-merge", title: lang === "ar" ? "دمج الأساطير" : "Fantasy Merge", author: "MagicStudio", plays: "210k", rating: 4.8, thumb: "bg-emerald-600", tags: lang === "ar" ? ["ألغاز", "كاجوال"] : ["Puzzle", "Casual"] },
    { id: "retro-racing", title: lang === "ar" ? "سباق ريترو" : "Retro Racing", author: "SpeedDrift", plays: "50k", rating: 4.5, thumb: "bg-rose-600", tags: lang === "ar" ? ["سباق", "بكسل"] : ["Racing", "Pixel Art"] },
    { id: "dungeon-clicker", title: lang === "ar" ? "نقرة الزنزانة" : "Dungeon Clicker", author: "IdleMaster", plays: "1.2M", rating: 4.2, thumb: "bg-amber-600", tags: lang === "ar" ? ["خمول", "RPG"] : ["Idle", "RPG"] },
    { id: "space-mining", title: lang === "ar" ? "تعدين الفضاء" : "Space Mining", author: "AstroDev", plays: "12k", rating: 4.9, thumb: "bg-cyan-600", tags: lang === "ar" ? ["محاكاة", "صندوق رمل"] : ["Simulation", "Sandbox"] },
  ];

  const filterTabs = [t("explore.trending"), t("explore.new"), t("explore.top"), t("explore.multi"), t("explore.puzzle"), t("explore.racing"), t("explore.rpg")];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{t("explore.title")}</h1>
          <p className="text-slate-400 font-light">{t("explore.desc")}</p>
        </div>
        <div className="relative w-full md:w-96">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input type="text" placeholder={t("explore.search")}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-bold placeholder:text-slate-600 shadow-inner text-sm" dir="ltr" />
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {filterTabs.map((tab, i) => (
          <button key={i}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-black transition-all ${i === 0 ? 'bg-white text-slate-950 shadow-lg shadow-white/10' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game, idx) => (
          <Link href={`/game/${game.id}`} key={idx} className="group flex flex-col bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:bg-slate-800/60 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 active:scale-[0.98]">
            <div className={`aspect-video w-full ${game.thumb} relative overflow-hidden`}>
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center justify-center w-12 h-12 bg-white rounded-full text-purple-600 shadow-xl mx-auto transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">▶</span>
               </div>
               <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase font-black text-white border border-white/10">GameForge</div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2 gap-2">
                 <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors line-clamp-1">{game.title}</h3>
                 <div className="flex items-center text-yellow-500 text-sm font-black bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/20 shrink-0">⭐ {game.rating}</div>
              </div>
              <div className="text-sm font-bold text-slate-400 flex items-center gap-2 mb-4">
                 <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 inline-block border border-white/10 shadow-lg" />
                 {game.author}
              </div>
              <div className="mt-auto flex items-center justify-between">
                 <div className="flex gap-2 flex-wrap">
                    {game.tags.slice(0, 2).map(tg => (
                      <span key={tg} className="text-[10px] font-black tracking-wider text-slate-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{tg}</span>
                    ))}
                 </div>
                 <span className="text-xs font-black text-slate-500 flex items-center gap-1">▶ {game.plays}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
