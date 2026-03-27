export default async function GamePlayerPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch game details from the database using params.id
  // This is a mockup of the Game Player page

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Game Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-4xl font-black text-white capitalize mb-1">
            Neon Dash : The Sandbox Demo
          </h1>
          <div className="flex gap-4 items-center">
            <span className="text-slate-400 font-medium">By @AbdallahDev</span>
            <span className="text-sm bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">HTML5</span>
            <span className="text-yellow-400 text-sm font-semibold flex items-center gap-1">
              ⭐ 4.9 <span className="text-slate-500 font-normal">(1.2k ratings)</span>
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-purple-500 rounded-xl text-slate-300 hover:text-white transition-all text-sm font-medium">
            🔖 Save List
          </button>
          <button className="px-4 py-2 bg-gradient-to-tr from-rose-500 to-pink-500 shadow-lg shadow-pink-500/20 rounded-xl text-white transition-transform active:scale-95 font-bold text-sm">
            💖 Support Creator
          </button>
        </div>
      </div>

      {/* The Actual Sandbox Iframe wrapper - The core of the tech recommendation */}
      <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] border border-slate-800 relative group">
        <div className="absolute inset-0 z-10 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900/10 transition-all duration-500">
           <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] animate-pulse">
             <span className="text-5xl ml-2">▶</span>
           </div>
           <p className="mt-6 text-white text-lg font-bold tracking-widest drop-shadow-md uppercase">Click to Initialize Engine</p>
        </div>

        {/* Dummy Iframe for presentation */}
        <iframe 
          sandbox="allow-scripts allow-downloads" 
          title="Game Sandbox"
          src="about:blank"
          className="w-full h-full border-0 pointer-events-none"
        />

        {/* Sandbox UI Overlay badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-emerald-400 border border-emerald-900 shadow-md">
          🛡️ Secure Context WebWorker
        </div>
      </div>

      {/* Under Player Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="md:col-span-2 space-y-8">
           <section className="bg-slate-900/30 p-8 rounded-3xl border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">About the Game</h2>
              <div className="text-slate-300 font-light leading-relaxed prose prose-invert max-w-none">
                <p>Welcome to Neon Dash! A fast-paced cyberpunk platformer built entirely with HTML5 and PixiJS. You are a rogue AI escaping a mega-corporation database.</p>
                <p>Controls:</p>
                <ul className="list-disc pl-5 mt-2 text-slate-400">
                  <li><strong>Arrow Keys / WASD</strong> - Move</li>
                  <li><strong>Space</strong> - Jump</li>
                  <li><strong>Shift</strong> - Dash</li>
                </ul>
              </div>
           </section>
        </div>
        
        {/* Sidebar Info */}
        <div className="space-y-6">
           <section className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800">
              <h3 className="uppercase text-xs font-bold text-slate-500 tracking-wider mb-4">Game Stats</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                   <span className="text-slate-400">Total Plays</span>
                   <span className="text-white font-mono font-medium">145,290</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                   <span className="text-slate-400">Published Date</span>
                   <span className="text-white font-mono font-medium">Oct 14, 2023</span>
                 </div>
                 <div className="flex justify-between items-center py-2">
                   <span className="text-slate-400">Engine</span>
                   <span className="text-purple-400 font-medium">PixiJS v7 + Custom Lua</span>
                 </div>
              </div>
           </section>

           <section className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
              <h3 className="uppercase text-xs font-bold text-slate-400 tracking-wider mb-4 border-b border-slate-700 pb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                 {['Platformer', 'Cyberpunk', 'Pixel Art', 'Action', 'Indie'].map(t => (
                   <span key={t} className="bg-slate-950 px-3 py-1 rounded-full text-xs text-slate-300 font-medium hover:text-white cursor-pointer transition-colors border border-slate-800 hover:border-purple-600">
                     #{t}
                   </span>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
