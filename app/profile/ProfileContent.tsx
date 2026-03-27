"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "../../lib/lang";
import ChatWindow from "./ChatWindow";
import ProfileSettings from "./ProfileSettings";
import { toggleFollow, updateUserProfile } from "../../lib/actions";

interface ProfileContentProps {
  user: any;
  socialLinks: any[];
}

export default function ProfileContent({ user, socialLinks }: ProfileContentProps) {
  const { lang, t, dir } = useLang();
  const [internalUser, setInternalUser] = useState(user);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => setActiveToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const handleUpdateProfile = async (updatedData: any) => {
    setInternalUser({ ...internalUser, ...updatedData });
    const res = await updateUserProfile(user.username, updatedData);
    if (res.success) {
      setActiveToast(lang === 'ar' ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!');
    } else {
      setActiveToast(lang === 'ar' ? 'فشل التحديث، يرجى المحاولة لاحقاً.' : 'Update failed, please try again.');
    }
  };

  const handleFollow = async () => {
    const res = await toggleFollow("current-session-user", internalUser.username);
    
    if (res.success) {
      setIsFollowing(res.following as boolean);
      setActiveToast(
        res.following 
          ? (lang === 'ar' ? `تمت متابعة @${internalUser.username} بنجاح!` : `Following @${internalUser.username} successfully!`)
          : (lang === 'ar' ? `تم إلغاء متابعة @${internalUser.username}` : `Unfollowed @${internalUser.username}`)
      );
    } else {
      setIsFollowing(!isFollowing);
      setActiveToast(lang === 'ar' ? 'تم الحفظ في قائمتك المفضلة (كضيف)' : 'Saved to your favorites (as Guest)');
    }
  };

  const handleMessage = () => {
    setIsChatOpen(true);
  };

  const handleStatClick = (stat: string) => {
    setActiveToast(lang === 'ar' ? `تفاصيل ${stat} ستتوفر قريباً.` : `Details for ${stat} will be available soon.`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 space-y-24" dir={dir}>
      {/* 🌌 CINEMATIC PROFILE HEADER */}
      <section className="relative rounded-[4rem] overflow-hidden bg-slate-950 border border-white/[0.05] shadow-3xl">
         {/* Banner Area */}
         <div className={`h-64 md:h-96 w-full ${internalUser.coverImage} bg-slate-900 relative`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-blue-900/40 opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            <div className={`absolute top-8 ${lang === 'ar' ? 'left-8' : 'right-8'} flex gap-3`}>
               <button onClick={() => setIsStyleOpen(true)} className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all active:scale-95 shadow-2xl">✨</button>
               <button onClick={() => setIsSettingsOpen(true)} className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all active:scale-95 shadow-2xl">⚙️</button>
            </div>
         </div>

         {/* Identity Zone */}
         <div className="relative px-8 md:px-16 pb-16">
            <div className={`flex flex-col md:flex-row items-end gap-10 -mt-24 md:-mt-32 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
               {/* Avatar Container */}
               <div className={`relative w-48 h-48 md:w-64 md:h-64 ${internalUser.avatarColor} p-2 rounded-[3.5rem] shadow-3xl group cursor-pointer hover:rotate-2 transition-transform`}>
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[4rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative w-full h-full bg-[#08090c] rounded-[3rem] border-8 border-slate-950 overflow-hidden flex items-center justify-center text-8xl shadow-inner-lg">
                     {internalUser.username.charAt(0).toUpperCase()}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>
                  <div className={`absolute -bottom-2 ${lang === 'ar' ? '-left-2' : '-right-2'} w-12 h-12 bg-emerald-500 border-8 border-slate-950 rounded-full shadow-2xl animate-pulse`}></div>
               </div>

               {/* Bio & CTA */}
               <div className="flex-1 space-y-6 pb-2">
                  <div className={`flex flex-wrap items-center gap-4 ${lang === 'ar' ? 'justify-end' : ''}`}>
                     <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">@{internalUser.username}</h1>
                     <div className="px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        {lang === 'ar' ? 'مطور محترف' : 'PRO BUILDER'}
                     </div>
                  </div>
                  <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl leading-relaxed opacity-90 mx-auto md:mx-0">{internalUser.bio}</p>
                  
                  <div className={`flex flex-wrap gap-4 pt-4 ${lang === 'ar' ? 'justify-end' : ''}`}>
                     <button 
                       onClick={handleFollow}
                       className={`px-10 py-5 font-black rounded-3xl transition-all shadow-3xl active:scale-95 text-xl flex items-center gap-3 ${isFollowing ? 'bg-slate-800 text-white border border-white/10' : 'bg-white text-slate-950 shadow-white/10 hover:scale-105'}`}
                     >
                        {isFollowing ? '✓' : ''} {isFollowing ? (lang === 'ar' ? 'متابع' : 'Following') : (lang === 'ar' ? 'متابعة المبدع' : 'Follow Creator')}
                     </button>
                     <button 
                       onClick={handleMessage}
                       className="px-10 py-5 bg-slate-900/50 backdrop-blur-3xl text-white font-black rounded-3xl border border-white/5 hover:bg-slate-800 transition-all active:scale-95 text-xl"
                     >
                        {lang === 'ar' ? 'مراسلة' : 'Message'}
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Stats Floor */}
         <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#08090c]/80 backdrop-blur-3xl border-t border-white/[0.05]">
            {[
              { label: lang === 'ar' ? 'متابعون' : "Followers", value: user.followers, icon: "👥" },
              { label: lang === 'ar' ? 'نتابعهم' : "Following", value: user.following, icon: "🗺️" },
              { label: lang === 'ar' ? 'مشاريع' : "Total Projects", value: user.gamesCount, icon: "🕹️" },
              { label: lang === 'ar' ? 'إجمالي المشاهدات' : "Total Exposure", value: user.totalPlays, icon: "📈" }
            ].map((s, i) => (
              <div 
                key={i} 
                onClick={() => handleStatClick(s.label)}
                className={`p-8 md:p-12 text-center group hover:bg-white/[0.02] transition-colors cursor-pointer ${lang === 'ar' ? 'border-l last:border-l-0 border-white/[0.03]' : 'border-r last:border-r-0 border-white/[0.03]'}`}
              >
                 <span className="text-2xl block mb-4 grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">{s.icon}</span>
                 <p className="text-3xl md:text-4xl font-black text-white tracking-tighter group-hover:text-purple-400 transition-colors">{s.value}</p>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">{s.label}</p>
              </div>
            ))}
         </div>
      </section>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
         {/* 🛠️ LEFT SIDEBAR */}
         <aside className="lg:col-span-4 space-y-12">
            {/* Achievements Card */}
            <div className="bg-[#0c0d12] border border-white/[0.05] p-10 rounded-[3rem] shadow-2xl">
               <h4 className={`text-xl font-black text-white mb-8 border-b border-white/[0.05] pb-6 flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  {lang === 'ar' ? 'الإنجازات والأوسمة' : 'Legacy & Badges'}
                  <span onClick={() => alert("Achievements leaderboard coming soon")} className="text-[10px] text-slate-500 tracking-widest font-black opacity-50 cursor-pointer hover:text-white transition-colors">{lang === 'ar' ? 'عرض الكل' : 'VIEW ALL'}</span>
               </h4>
               <div className="space-y-6">
                  {user.achievements.map((ach: string, i: number) => (
                    <div key={i} className={`flex items-center gap-5 p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/5 transition-colors cursor-help group ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                       <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg ring-4 ring-amber-400/10 group-hover:scale-110 transition-transform">🏆</div>
                       <div>
                          <p className="text-white font-black text-sm">{ach}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">{lang === 'ar' ? 'تم الحصول في أكتوبر 2024' : 'Acquired Oct 2024'}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Connectivity Card */}
            <div className="bg-[#0c0d12] border border-white/[0.05] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
               <h4 className={`text-xl font-black text-white mb-8 border-b border-white/[0.05] pb-6 ${lang === 'ar' ? 'text-right' : ''}`}>
                 {lang === 'ar' ? 'التواجد الرقمي' : 'Connectivity'}
               </h4>
               <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((link: any, i: number) => (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" key={i} className={`flex items-center gap-3 p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/10 transition-all font-bold text-slate-400 hover:text-white ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                      <span className="text-xl">{link.icon}</span>
                      <span className="text-xs uppercase tracking-widest">{link.label}</span>
                    </a>
                  ))}
               </div>
            </div>
         </aside>

         {/* 🎮 MAIN CONTENT - PORTFOLIO */}
         <main className="lg:col-span-8 space-y-12">
            <div className={`flex items-center justify-between mb-8 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
               <h3 className={`text-3xl font-black text-white flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <span className="w-1.5 h-10 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></span>
                  {lang === 'ar' ? `تجارب مطورة (${user.gamesCount})` : `Crafted Experiences (${user.gamesCount})`}
               </h3>
               <div className="flex gap-2">
                 <button onClick={() => alert("Grid view active")} className="bg-white/10 p-3 rounded-xl border border-white/10 shadow-xl shadow-white/5">▦</button>
                 <button onClick={() => alert("List view coming soon")} className="bg-white/5 p-3 rounded-xl border border-white/5 opacity-50 hover:opacity-100 transition-opacity">☰</button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {user.games.map((game: any, i: number) => (
                  <Link href={`/game/${game.id}`} key={i} className="group relative bg-[#0c0d12] border border-white/[0.05] rounded-[3.5rem] overflow-hidden hover:border-purple-500/40 transition-all duration-700 hover:-translate-y-3 hover:shadow-3xl hover:shadow-purple-500/10 block">
                     <div className={`aspect-video w-full ${game.thumbnail} relative overflow-hidden flex items-center justify-center text-8xl`}>
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                        <span className="group-hover:scale-125 transition-transform duration-700 relative z-20">{(game as any).icon || "🎮"}</span>
                        
                        {game.status !== 'published' && (
                           <div className={`absolute top-6 ${lang === 'ar' ? 'right-6' : 'left-6'} z-40 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-[9px] uppercase font-black text-white border border-white/10 tracking-widest`}>
                             {lang === 'ar' ? 'قيد التطوير' : 'UNDER DEVELOPMENT'}
                           </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-30">
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-950 text-2xl shadow-white shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-500">▶</div>
                        </div>
                     </div>
                     
                     <div className={`p-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div className={`flex justify-between items-start mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                           <h4 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors tracking-tight italic">
                              {game.title}
                           </h4>
                           <div className="text-yellow-500 text-sm font-black bg-yellow-500/10 px-3 py-1 rounded-xl border border-yellow-500/20">⭐ {game.rating_avg || 0}</div>
                        </div>
                        <div className={`flex justify-between items-center pt-6 border-t border-white/[0.05] ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                           <span className="text-xs font-black text-slate-500 tracking-[0.2em] uppercase">
                              {Number(game.plays_count || 0).toLocaleString('en-US')} {lang === 'ar' ? 'مشاهدة' : 'EXPOSURE'}
                           </span>
                           <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border ${game.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                              {game.status === 'published' ? (lang === 'ar' ? 'متاح الآن' : 'LIVE NOW') : (lang === 'ar' ? 'مسودة' : 'BLUEPRINT')}
                           </span>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </main>
      </div>

      {/* 🥯 CHAT SYSTEM */}
      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        recipient={{ username: internalUser.username, avatar: "bg-purple-600" }} 
      />

      {/* 🥯 CONFIGURATION SYSTEM */}
      <ProfileSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={internalUser}
        onUpdate={handleUpdateProfile}
        type="settings"
      />
      <ProfileSettings 
        isOpen={isStyleOpen}
        onClose={() => setIsStyleOpen(false)}
        user={internalUser}
        onUpdate={handleUpdateProfile}
        type="style"
      />

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
