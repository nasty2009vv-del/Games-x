import Link from "next/link";

export default function UserProfile({ params }: { params: { username: string } }) {
  // Mock data for the user profile
  const user = {
    username: params.username,
    role: "Dev",
    bio: "Indie Game Developer passionate about Cyberpunk and Pixel Art. Welcome to my studio!",
    joinDate: "March 2023",
    followers: 1240,
    following: 45,
    gamesCount: 8,
    totalPlays: "2.1M",
    avatarColor: "bg-gradient-to-tr from-rose-500 to-orange-400"
  };

  const games = [
    { id: "demo-id", title: "Project: Neon", plays: "1M+", rating: 4.9, thumb: "bg-pink-600/30", isPublished: true },
    { id: "beta-game", title: "Untitled RPG", plays: "-", rating: 0, thumb: "bg-blue-600/10", isPublished: false },
    { id: "jam-entry", title: "Global Jam Winner 23", plays: "500k", rating: 4.8, thumb: "bg-emerald-600/30", isPublished: true },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Profile Header Block */}
      <div className="relative rounded-3xl overflow-hidden mb-12 border border-slate-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
         {/* Cover Banner */}
         <div className="h-48 md:h-64 w-full bg-gradient-to-r from-slate-900 via-purple-900/30 to-slate-900 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-white border border-white/10">
              Pro Studio Member
            </div>
         </div>

         {/* Profile Card Info */}
         <div className="bg-slate-950 px-8 pb-8 pt-0 relative flex flex-col md:flex-row gap-6 md:items-end -mt-16 md:-mt-20">
            {/* Avatar */}
            <div className={`w-32 h-32 md:w-40 md:h-40 ${user.avatarColor} p-1 rounded-2xl shadow-2xl relative z-10 flex-shrink-0 mt-4 md:mt-0`}>
              <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center border-4 border-slate-950 overflow-hidden">
                <span className="text-5xl font-bold text-white drop-shadow-md">{user.username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            
            <div className="flex-1 pb-2">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2">
                      @{user.username}
                      <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">
                        {user.role}
                      </span>
                    </h1>
                    <p className="text-slate-400 font-light mt-2 max-w-xl leading-relaxed">{user.bio}</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button className="px-6 py-2.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors shadow-lg active:scale-95">
                      Follow
                    </button>
                    <button className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
                      Donate
                    </button>
                  </div>
               </div>
            </div>
         </div>
         
         {/* Stats Bar */}
         <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-800 bg-slate-900/50">
            {[
              { label: "Followers", value: user.followers },
              { label: "Following", value: user.following },
              { label: "Published Games", value: user.gamesCount },
              { label: "Total Asset Plays", value: user.totalPlays }
            ].map((stat, i) => (
              <div key={i} className="p-4 md:p-6 text-center border-r last:border-0 border-slate-800/50">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                 <p className="text-xl md:text-2xl font-black text-white">{stat.value}</p>
              </div>
            ))}
         </div>
      </div>

      {/* Published Games Tabs */}
      <h2 className="text-2xl font-bold text-white mb-6 px-2 border-b border-slate-800 pb-4 inline-block">Portfolio ({games.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, i) => (
           <Link href={`/game/${game.id}`} key={i} className={`p-4 rounded-3xl border transition-all duration-300 group hover:-translate-y-1 block ${game.isPublished ? 'bg-slate-900 border-slate-800 hover:border-slate-600' : 'bg-slate-950 border-dashed border-slate-800 opacity-60'}`}>
              <div className={`w-full aspect-video rounded-2xl mb-4 relative overflow-hidden ${game.thumb}`}>
                {!game.isPublished && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xs font-bold font-mono text-white px-3 py-1 bg-black/80 rounded-full border border-white/10 uppercase">Draft Mode</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{game.title}</h3>
              <div className="flex justify-between items-center mt-3">
                 <span className="text-sm font-medium text-slate-400">▶ {game.plays}</span>
                 {game.isPublished && (
                   <span className="text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                     ⭐ {game.rating}
                   </span>
                 )}
              </div>
           </Link>
        ))}
      </div>
    </div>
  );
}
