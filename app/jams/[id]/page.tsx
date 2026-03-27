import Link from "next/link";

export default async function JamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const jam = {
    id: id,
    title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    theme: "CYBERNETIC EVOLUTION",
    prize: "$5,000 + Pro Lifetime Subscription",
    timeLeft: "3 Days, 4 Hours",
    description: "The Global Cyber Jam is our flagship event focusing on high-performance web games with futuristic aesthetics. This year, we challenge you to build an experience that evolves visually as the player progresses.",
    constraintsCount: 3,
    rules: [
      "Must be built using the GameForge Editor",
      "Maximum of 3 external sprite assets",
      "Theme must be strictly followed",
      "No pre-made templates allowed"
    ],
    prizesDetails: [
      { rank: "1st Place", value: "$3,000 Cash + GameForge Pro Lifetime" },
      { rank: "2nd Place", value: "$1,500 Cash + Featured for 1 month" },
      { rank: "3rd Place", value: "$500 Cash + Exclusive Badge" }
    ]
  };

  return (
    <div className="w-full bg-[#0a0b10] min-h-screen">
      {/* Top Banner & Hero Section */}
      <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black z-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
        
        {/* Animated Glow Elements */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/20 blur-[120px] rounded-full"></div>

        <div className="relative z-20 text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/20 text-rose-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            LIVE EVENT
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            {jam.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300">
             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 font-mono text-sm">
                <span className="text-slate-500">ENDS IN:</span> <span className="text-purple-400 font-bold">{jam.timeLeft}</span>
             </div>
             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 font-mono text-sm">
                <span className="text-slate-500">PRIZE POOL:</span> <span className="text-emerald-400 font-bold">$5,000+</span>
             </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Info & Description */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Main Description */}
          <section className="bg-slate-900/40 p-8 md:p-12 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[60px] rounded-full"></div>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
              <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
              The Challenge
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed font-light mb-8">
              {jam.description}
            </p>
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800/50">
               <div className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Selected Theme</div>
               <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 italic">
                 "{jam.theme}"
               </div>
            </div>
          </section>

          {/* Rules & Constraints */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-900 h-full">
                <h3 className="text-xl font-bold text-white mb-6">Participation Rules</h3>
                <ul className="space-y-4">
                  {jam.rules.map((rule, i) => (
                    <li key={i} className="flex gap-4 items-start text-slate-400 group">
                      <span className="w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0 border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors">{i+1}</span>
                      <span className="text-sm font-light leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
             </div>
             <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-900 h-full">
                <h3 className="text-xl font-bold text-white mb-6">Prizes & Rewards</h3>
                <div className="space-y-6">
                   {jam.prizesDetails.map((p, i) => (
                     <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">{p.rank}</span>
                        <span className="text-white font-bold">{p.value}</span>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Actions & Sidebar */}
        <div className="space-y-8">
          
          {/* Join Sidebar */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(147,51,234,0.4)] sticky top-24">
             <h3 className="text-2xl font-black text-white mb-2 leading-tight">Ready to Invent?</h3>
             <p className="text-purple-100/70 text-sm mb-10 font-light">Join 420 other developers in this event.</p>
             
             <div className="space-y-4">
                <Link href="/create" className="block w-full text-center py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                  Join Event Now
                </Link>
                <button className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md">
                  Browse Entries
                </button>
             </div>

             <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex -space-x-3 mb-4">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-purple-600 bg-slate-900 flex items-center justify-center overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+100}`} alt="avatar" />
                     </div>
                   ))}
                   <div className="w-10 h-10 rounded-full border-2 border-purple-600 bg-slate-950 flex items-center justify-center text-[10px] text-white font-black">+415</div>
                </div>
                <p className="text-xs text-purple-200/50 italic underline decoration-purple-200/10">Follow the community live on Discord</p>
             </div>
          </div>

          <div className="p-8 bg-slate-900/30 rounded-[2rem] border border-slate-800">
             <div className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Event Sponsor</div>
             <div className="text-2xl font-black text-slate-300 tracking-tighter italic">
               TECH<span className="text-purple-500">CORE</span> SYSTEMS
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
