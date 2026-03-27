import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GamePlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Try to find the game in the database
  const game = await prisma.game.findUnique({
    where: { id: id },
    include: { user: true }
  });

  // Handle game not found
  if (!game) {
    // If it's a mock ID from our list, show a placeholder
    const mockGames: Record<string, any> = {
      "starship-core": { title: "Starship Core", description: "Epic spaceship battles.", user: { username: "PixelNinja" } },
      "neon-dash": { title: "Neon Dash", description: "Fast-paced cyberpunk runner.", user: { username: "AbdallahDev" } }
    };

    if (mockGames[id]) {
      return (
        <div className="w-full max-w-6xl mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-black text-white mb-4 italic">{mockGames[id].title}</h1>
          <p className="text-slate-500 mb-8">This mock game is being migrated to the new database.</p>
          <Link href="/explore" className="text-purple-500 underline font-bold">Back to Explore</Link>
        </div>
      );
    }
    return notFound();
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 text-right md:text-left">
        <div className="flex-1 w-full" dir="rtl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 italic">
            {game.title}
          </h1>
          <div className="flex gap-4 items-center justify-start flex-wrap">
            <Link href={`/profile/${game.user?.username}`} className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
              @{game.user?.username || "Creator"}
            </Link>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">HTML5 ENGINE</span>
            <span className="text-yellow-400 text-sm font-black flex items-center gap-1">
              ⭐ {game.rating_avg.toFixed(1)} <span className="text-slate-500 font-normal">({game.plays_count} plays)</span>
            </span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 border border-slate-700 hover:border-purple-500 rounded-2xl text-slate-300 transition-all text-sm font-bold">
            🔖 Save
          </button>
          <button className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-tr from-purple-600 to-blue-600 shadow-xl shadow-purple-600/20 rounded-2xl text-white active:scale-95 font-black text-sm">
            💖 Support
          </button>
        </div>
      </div>

      {/* Actual Game Sandbox Wrapper */}
      <div className="w-full aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 relative group">
        <div className="absolute inset-0 z-10 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-950/20 transition-all duration-700">
           <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform">
             <span className="text-5xl ml-2 text-white drop-shadow-lg">▶</span>
           </div>
           <p className="mt-8 text-white text-lg font-black tracking-widest drop-shadow-2xl uppercase">Initialize Game Forge Sandbox</p>
        </div>

        <iframe 
          sandbox="allow-scripts allow-downloads" 
          title="Game Player"
          src="about:blank"
          className="w-full h-full border-0 opacity-0 group-active:opacity-100 transition-opacity"
        />

        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-lg px-4 py-1.5 rounded-full text-[10px] font-black font-mono text-emerald-400 border border-emerald-900/50 shadow-2xl tracking-[0.2em]">
          🛡️ SECURE ENVIRONMENT
        </div>
      </div>

      {/* Under Player Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        <div className="lg:col-span-2 space-y-12">
           <section className="bg-slate-900/30 p-8 md:p-12 rounded-[2.5rem] border border-slate-800/50 shadow-inner">
              <h2 className="text-2xl font-black text-white mb-6 border-b border-slate-800 pb-4 inline-block">About the Game</h2>
              <div className="text-slate-300 font-light leading-relaxed prose prose-invert max-w-none text-right" dir="rtl">
                {game.description || "No description provided for this game."}
              </div>
           </section>
        </div>
        
        {/* Sidebar Info */}
        <div className="space-y-8">
           <section className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50">
              <h3 className="uppercase text-xs font-black text-slate-500 tracking-widest mb-6">Live Statistics</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <span className="text-slate-400 text-sm">Plays</span>
                   <span className="text-white font-mono font-bold">{game.plays_count.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <span className="text-slate-400 text-sm">Status</span>
                   <span className="text-emerald-400 font-bold uppercase text-xs">{game.status}</span>
                 </div>
                 <div className="flex justify-between items-center py-3">
                   <span className="text-slate-400 text-sm">Engine</span>
                   <span className="text-purple-400 font-bold">GF Core v1.0</span>
                 </div>
              </div>
           </section>

           <section className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-900">
              <h3 className="uppercase text-xs font-black text-slate-500 tracking-widest mb-6">Metadata</h3>
              <div className="flex flex-wrap gap-2">
                 {(game.tags || "Game, Indie, Development").split(',').map(t => (
                   <span key={t} className="bg-slate-900 px-4 py-2 rounded-xl text-xs text-slate-400 font-bold hover:text-white cursor-pointer transition-colors border border-slate-800 hover:border-purple-600">
                     #{t.trim()}
                   </span>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
