import Link from "next/link";

export default function GameJamsPage() {
  const activeJams = [
    { 
      id: "global-cyber-jam", 
      title: "Global Cyber Jam 2026", 
      prize: "$5,000 + Pro Lifetime", 
      timeLeft: "3 days left",
      entries: 420,
      image: "bg-gradient-to-br from-purple-900 to-black",
      status: "Active"
    }
  ];

  const pastJams = [
    { id: "retro-revival", title: "Retro Revival Jam", winner: "@PixelMaster", date: "Jan 2026", image: "bg-rose-900/40" },
    { id: "ai-sandbox", title: "AI Sandbox Challenge", winner: "@NeuralDev", date: "Dec 2025", image: "bg-blue-900/40" },
    { id: "speed-build-3", title: "Speed Build v3", winner: "@DriftCoder", date: "Nov 2025", image: "bg-emerald-900/40" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800 p-8 md:p-16 mb-16 shadow-2xl flex flex-col md:flex-row items-center gap-12 group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 pointer-events-none"></div>
         <div className="relative z-10 flex-1 text-center md:text-right">
            <span className="inline-block px-4 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-purple-500/30">
              Community Events
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Push Your Limits In <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 to-pink-500 underline decoration-purple-500/30">Game Jams</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl ml-auto mb-10 leading-relaxed md:ml-0">
               Join themed game development competitions, win prizes, and build your reputation as the top creator on GameForge.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <button className="px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all shadow-xl active:scale-95">
                 Host a Jam
               </button>
               <button className="px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all">
                 Rules & Guidelines
               </button>
            </div>
         </div>
         <div className="relative z-10 w-full md:w-[400px] aspect-square rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-[0_0_100px_-20px_rgba(147,51,234,0.4)] animate-pulse flex items-center justify-center text-8xl transform group-hover:rotate-3 transition-transform duration-700">
           🏁
         </div>
      </div>

      {/* Featured Active Jam */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
             Currently Active Jams
           </h2>
        </div>
        
        {activeJams.map(jam => (
          <Link href={`/jams/${jam.id}`} key={jam.id} className="block group">
             <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-purple-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
                <div className={`col-span-1 md:col-span-1 h-48 md:h-auto ${jam.image} flex items-center justify-center text-6xl`}>🚀</div>
                <div className="col-span-1 md:col-span-3 p-8 flex flex-col md:flex-row justify-between gap-8">
                   <div className="flex-1">
                      <h3 className="text-3xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">{jam.title}</h3>
                      <p className="text-slate-400 mb-6 font-light">Create a game around the theme "CYBERNETIC EVOLUTION" using only 3 assets.</p>
                      <div className="flex flex-wrap gap-3">
                         <span className="bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800 text-sm font-bold text-slate-300">💰 {jam.prize}</span>
                         <span className="bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800 text-sm font-bold text-slate-300">👥 {jam.entries} Entries</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-center justify-center gap-4 shrink-0 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                      <div className="text-center">
                         <p className="text-rose-500 text-sm font-black uppercase tracking-widest">{jam.timeLeft}</p>
                         <p className="text-slate-500 text-xs mt-1">Submission Ends Mar 31</p>
                      </div>
                      <button className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 shadow-lg shadow-purple-600/20 active:scale-95 transition-all">
                        Enter Jam Now
                      </button>
                   </div>
                </div>
             </div>
          </Link>
        ))}
      </section>

      {/* Past Jams Grid */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8">Past Hall of Fame</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {pastJams.map(jam => (
             <div key={jam.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/40 transition-all group">
                <div className={`w-full h-32 rounded-2xl mb-6 ${jam.image} flex items-center justify-center text-4xl group-hover:scale-105 transition-transform`}>🏆</div>
                <h4 className="text-xl font-bold text-white mb-1">{jam.title}</h4>
                <p className="text-slate-500 text-sm mb-4">Completed: {jam.date}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                   <span className="text-xs text-slate-400">Winner: <span className="text-yellow-500 font-bold">{jam.winner}</span></span>
                   <button className="text-xs font-bold text-slate-300 hover:text-white underline underline-offset-4">Results</button>
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
