import Link from "next/link";

export default function ExploreGames() {
  const games = [
    { id: "demo-id", title: "Neon Dash", author: "AbdallahDev", plays: "145k", rating: 4.9, thumb: "bg-purple-600", tags: ["Cyberpunk", "Platformer"] },
    { id: "starship-core", title: "Starship Core", author: "PixelNinja", plays: "89k", rating: 4.7, thumb: "bg-blue-600", tags: ["Sci-Fi", "Shooter"] },
    { id: "fantasy-merge", title: "Fantasy Merge", author: "MagicStudio", plays: "210k", rating: 4.8, thumb: "bg-emerald-600", tags: ["Puzzle", "Casual"] },
    { id: "retro-racing", title: "Retro Racing", author: "SpeedDrift", plays: "50k", rating: 4.5, thumb: "bg-rose-600", tags: ["Racing", "Pixel Art"] },
    { id: "dungeon-clicker", title: "Dungeon Clicker", author: "IdleMaster", plays: "1.2M", rating: 4.2, thumb: "bg-amber-600", tags: ["Idle", "RPG"] },
    { id: "space-mining", title: "Space Mining", author: "AstroDev", plays: "12k", rating: 4.9, thumb: "bg-cyan-600", tags: ["Simulation", "Sandbox"] },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Discover Games</h1>
          <p className="text-slate-400">Play thousands of games built natively with GameForge Engine.</p>
        </div>
        <div className="relative w-full md:w-96">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input 
            type="text" 
            placeholder="Search games, genres, or creators..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-12 pr-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder:text-slate-600 shadow-inner"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['🔥 Trending', '✨ New & Notable', '🏆 Top Rated', '⚔️ Multiplayer', '🧩 Puzzle', '🏎️ Racing', '📜 RPG'].map((tab, i) => (
          <button 
            key={i} 
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              i === 0 ? 'bg-white text-slate-950 shadow-md shadow-white/10' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {games.map((game, idx) => (
          <Link href={`/game/${game.id}`} key={idx} className="group flex flex-col bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:bg-slate-800/60 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 active:scale-[0.98]">
            {/* Thumbnail Placeholder */}
            <div className={`aspect-video w-full ${game.thumb} relative overflow-hidden`}>
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center justify-center w-12 h-12 bg-white rounded-full text-purple-600 shadow-xl mx-auto transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                     ▶
                  </span>
               </div>
               {/* Engine Badge */}
               <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase font-bold text-white border border-white/10">
                 GameForge
               </div>
            </div>
            
            {/* Metadata */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{game.title}</h3>
                 <div className="flex items-center text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                   ⭐ {game.rating}
                 </div>
              </div>
              <div className="text-sm font-medium text-slate-400 flex items-center gap-1.5 mb-4">
                 <span className="w-5 h-5 rounded-full bg-slate-700 inline-block border border-slate-600" />
                 {game.author}
              </div>
              <div className="mt-auto flex items-center justify-between">
                 <div className="flex gap-2">
                   {game.tags.slice(0, 2).map(t => (
                     <span key={t} className="text-[11px] font-bold tracking-wider uppercase text-slate-500 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                       {t}
                     </span>
                   ))}
                 </div>
                 <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                   ▶ {game.plays}
                 </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
