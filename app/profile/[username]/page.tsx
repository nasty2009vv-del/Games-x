import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  // Try to find the user in the database
  const dbUser = await prisma.user.findFirst({
    where: { username: username }, // In a real app we might use 'email' or a unique user handle
    include: { games: true }
  });

  // Handle user not found (mock for demo-user)
  const user = dbUser ? {
    username: dbUser.username,
    role: dbUser.role || "Developer",
    bio: dbUser.bio || "This developer hasn't set a bio yet.",
    joinDate: dbUser.createdAt.toLocaleDateString(),
    followers: 0,
    following: 0,
    gamesCount: dbUser.games.length,
    totalPlays: dbUser.games.reduce((acc, game) => acc + game.plays_count, 0).toLocaleString(),
    avatarColor: "bg-gradient-to-tr from-purple-500 to-indigo-500",
    games: dbUser.games
  } : {
    username: username,
    role: "Dev",
    bio: "Indie Game Developer passionate about Cyberpunk and Pixel Art. Welcome to my studio!",
    joinDate: "March 2023",
    followers: 1240,
    following: 45,
    gamesCount: 8,
    totalPlays: "2.1M",
    avatarColor: "bg-gradient-to-tr from-rose-500 to-orange-400",
    games: [
      { id: "neon-dash", title: "Project: Neon", plays_count: 1000000, rating_avg: 4.9, thumbnail: "bg-pink-600/30", status: "published" },
      { id: "beta-game", title: "Untitled RPG", plays_count: 0, rating_avg: 0, thumbnail: "bg-blue-600/10", status: "draft" },
    ]
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Profile Header Block */}
      <div className="relative rounded-[3rem] overflow-hidden mb-16 border border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
         {/* Cover Banner */}
         <div className="h-56 md:h-72 w-full bg-gradient-to-br from-slate-950 via-purple-900/10 to-slate-950 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
            <div className="absolute bottom-6 right-6 bg-white/5 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white border border-white/10 uppercase">
              Pro Studio Member
            </div>
         </div>

         {/* Profile Card Info */}
         <div className="bg-slate-950 px-8 pb-10 pt-0 relative flex flex-col md:flex-row gap-8 md:items-end -mt-20 md:-mt-24">
            {/* Avatar */}
            <div className={`w-36 h-36 md:w-48 md:h-48 ${user.avatarColor} p-1.5 rounded-[2.5rem] shadow-2xl relative z-20 flex-shrink-0 mt-4 md:mt-0 transition-transform hover:scale-105 duration-500`}>
              <div className="w-full h-full bg-slate-900 rounded-[2rem] flex items-center justify-center border-4 border-slate-950 overflow-hidden relative">
                <span className="text-6xl font-black text-white drop-shadow-2xl">{user.username.charAt(0).toUpperCase()}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
            
            <div className="flex-1 pb-4">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" dir="rtl">
                  <div className="text-right">
                    <h1 className="text-4xl font-black text-white flex items-center gap-4 justify-end">
                      <span className="bg-purple-500/10 text-purple-400 text-xs px-3 py-1 rounded-full border border-purple-500/20 uppercase tracking-widest font-black">
                        {user.role}
                      </span>
                      @{user.username}
                    </h1>
                    <p className="text-slate-400 font-light mt-4 max-w-xl leading-relaxed text-lg">{user.bio}</p>
                  </div>
                  <div className="flex gap-4 shrink-0 justify-end">
                    <button className="px-10 py-4 rounded-2xl bg-white text-slate-950 font-black hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95">
                      Follow
                    </button>
                    <button className="px-6 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-all border border-slate-700 active:scale-95">
                      Donate
                    </button>
                  </div>
               </div>
            </div>
         </div>
         
         {/* Stats Bar */}
         <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-slate-800/50 bg-slate-900/20 backdrop-blur-xl">
            {[
              { label: "Followers", value: user.followers },
              { label: "Following", value: user.following },
              { label: "Developed Games", value: user.gamesCount },
              { label: "Total Views", value: user.totalPlays }
            ].map((stat, i) => (
              <div key={i} className="p-6 md:p-8 text-center border-r last:border-0 border-slate-800/30 group hover:bg-white/5 transition-colors">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                 <p className="text-2xl md:text-3xl font-black text-white group-hover:text-purple-400 transition-colors">{stat.value}</p>
              </div>
            ))}
         </div>
      </div>

      {/* Published Games Tabs */}
      <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
        <span className="w-1.5 h-10 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></span>
        Portfolio ({user.gamesCount})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {user.games.map((game: any, i: number) => (
           <Link href={`/game/${game.id}`} key={i} className={`group flex flex-col p-5 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 block ${game.status === 'published' ? 'bg-slate-900/40 border-slate-800 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10' : 'bg-slate-950 border-dashed border-slate-900 opacity-60'}`}>
              <div className={`w-full aspect-video rounded-3xl mb-6 relative overflow-hidden ${game.thumbnail || 'bg-slate-800'}`}>
                {game.status !== 'published' && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="text-[10px] font-black font-mono text-white px-4 py-1.5 bg-black/80 rounded-full border border-white/10 uppercase tracking-widest">In Development</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors truncate italic">
                {game.title}
              </h3>
              <div className="flex justify-between items-center mt-4">
                 <span className="text-xs font-black text-slate-500 tracking-widest uppercase italic">
                   {game.plays_count.toLocaleString()} Views
                 </span>
                 {game.status === 'published' && (
                    <span className="text-emerald-400 text-xs font-black bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20">
                      LIVE
                    </span>
                 )}
              </div>
           </Link>
        ))}
      </div>
    </div>
  );
}
