"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "../../lib/lang";

export default function GameJamsPage() {
  const { t, lang, dir } = useLang();
  const [timeLeft, setTimeLeft] = useState({ d: 2, h: 14, m: 45, s: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        if (prev.d > 0) return { ...prev, d: prev.d - 1, h: 23, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeJams = [
    { 
      id: "global-cyber-jam", 
      title: lang === "ar" ? "مسابقة السايبر العالمية 2026" : "Global Cyber Jam 2026", 
      prize: "$5,000", 
      timeLeft: lang === "ar" ? "نشط الآن" : "Active Now",
      entries: 1240,
      theme: lang === "ar" ? "التطور السيبراني" : "Cybernetic Evolution",
      image: "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-fuchsia-700 via-purple-600 to-indigo-900",
      icon: "⚡"
    },
    { 
      id: "indie-speed-4", 
      title: lang === "ar" ? "تحدي المبدعين السريع" : "Indie Speed Challenge", 
      prize: "$1,200", 
      timeLeft: lang === "ar" ? "يبدأ قريباً" : "Starting Soon",
      entries: 85,
      theme: lang === "ar" ? "الهروب اللانهائي" : "Infinite Escape",
      image: "bg-gradient-to-tr from-emerald-600 to-teal-900",
      icon: "🛶"
    }
  ];

  const stats = [
    { label: lang === "ar" ? "إجمالي الجوائز" : "Total Prizes", value: "$420,000+", icon: "💰" },
    { label: lang === "ar" ? "مشاريع مقدمة" : "Games Submitted", value: "12,450", icon: "🎮" },
    { label: lang === "ar" ? "مطورين نشطين" : "Active Devs", value: "85k", icon: "👥" },
  ];

  const pastJams = [
    { id: "retro-revival", title: lang === "ar" ? "إحياء الريترو" : "Retro Revival Jam", winner: "@PixelMaster", date: "Jan 2026", image: "bg-rose-950/40", icon: "📼" },
    { id: "ai-sandbox", title: lang === "ar" ? "تحدي الذكاء الاصطناعي" : "AI Sandbox Challenge", winner: "@NeuralDev", date: "Dec 2025", image: "bg-blue-950/40", icon: "🧠" },
    { id: "speed-build-3", title: lang === "ar" ? "بناء سريع v3" : "Speed Build v3", winner: "@DriftCoder", date: "Nov 2025", image: "bg-emerald-950/40", icon: "🕹️" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
      {/* 🌌 CINEMATIC HERO */}
      <div className="relative rounded-[3.5rem] overflow-hidden bg-slate-950 border border-white/[0.05] p-8 md:p-20 mb-20 shadow-3xl group">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-blue-950/10 opacity-50"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] translate-y-1/2 -translate-x-1/2 rounded-full"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className={`flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
               <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
               {t("jams.badge")}
             </div>
             <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
               {lang === 'ar' ? <>أثبت مهارتك <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 underline decoration-purple-500/30 underline-offset-8">في المنافسة</span></> : (
                 <>{t("jams.title1")} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t("jams.title2")}</span></>
               )}
             </h1>
             <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl mb-12 leading-relaxed opacity-80">
                {t("jams.desc")}
             </p>
             
             <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                <Link href="/create" className="px-12 py-5 bg-white text-slate-950 font-black rounded-[2rem] hover:scale-[1.05] transition-all shadow-2xl shadow-white/10 active:scale-95 text-lg">
                  {t("jams.host")}
                </Link>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] backdrop-blur-xl" dir="ltr">
                   <div className="text-center border-r border-white/10 pr-4">
                      <span className="block text-white font-black text-xl leading-none">{timeLeft.d}</span>
                      <span className="text-[9px] text-slate-500 uppercase font-black">Days</span>
                   </div>
                   <div className="text-center border-r border-white/10 pr-4">
                      <span className="block text-white font-black text-xl leading-none">{timeLeft.h}</span>
                      <span className="text-[9px] text-slate-500 uppercase font-black">Hrs</span>
                   </div>
                   <div className="text-center border-r border-white/10 pr-4">
                      <span className="block text-white font-black text-xl leading-none">{timeLeft.m}</span>
                      <span className="text-[9px] text-slate-500 uppercase font-black">Mins</span>
                   </div>
                   <div className="text-center">
                      <span className="block text-rose-500 font-black text-xl leading-none animate-pulse">{timeLeft.s}</span>
                      <span className="text-[9px] text-slate-500 uppercase font-black">Secs</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="relative w-full lg:w-[460px] aspect-square">
             <div className="absolute inset-0 bg-white/5 border border-white/5 rounded-[4rem] rotate-6 group-hover:rotate-12 transition-transform duration-700"></div>
             <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-700 rounded-[4rem] shadow-3xl shadow-purple-600/30 flex items-center justify-center text-[180px] z-10">
               {activeJams[0].icon}
             </div>
          </div>
        </div>
      </div>

      {/* 📊 STATS COUNTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {stats.map((s, i) => (
          <div key={i} className="bg-slate-900/20 border border-white/[0.03] p-10 rounded-[3rem] text-center hover:border-white/10 transition-colors">
            <span className="text-4xl block mb-4">{s.icon}</span>
            <span className="block text-4xl font-black text-white mb-2 tracking-tighter">{s.value}</span>
            <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">{s.label}</span>
          </div>
        ))}
      </div>

      {/* 🔥 ACTIVE JAMS */}
      <section className="mb-32">
        <div className="flex items-center justify-between mb-12">
           <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
              <h2 className="text-3xl font-black text-white mb-2">{t("jams.active")}</h2>
              <p className="text-slate-500 text-sm">{lang === 'ar' ? 'مسابقات جارية الآن، لا تضيع الفرصة!' : 'Live events. Dont miss your chance to shine.'}</p>
           </div>
           <Link href="/explore" className="text-slate-400 hover:text-white text-sm font-bold flex items-center gap-2">
             {lang === 'ar' ? 'عرض الأرشيف' : 'View Archive'} <span>{lang === 'ar' ? '←' : '→'}</span>
           </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-10">
          {activeJams.map(jam => (
            <Link href={`/editor`} key={jam.id} className="group relative bg-[#0c0d12] border border-white/[0.05] rounded-[3rem] overflow-hidden hover:border-purple-500/40 transition-all duration-700 hover:shadow-3xl hover:shadow-purple-500/10 block">
               <div className="flex flex-col lg:flex-row">
                  <div className={`w-full lg:w-[400px] h-64 lg:h-auto ${jam.image} flex items-center justify-center text-8xl relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <span className="group-hover:scale-125 transition-transform duration-700">{jam.icon}</span>
                  </div>
                  <div className={`flex-1 p-8 md:p-12 flex flex-col justify-between ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                     <div>
                        <div className="flex items-center justify-between mb-4">
                           <span className="bg-rose-500/10 text-rose-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-rose-500/30">
                              {jam.timeLeft}
                           </span>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                             ID: {jam.id}
                           </span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-4 group-hover:text-purple-400 transition-colors leading-tight">{jam.title}</h3>
                        <p className="text-slate-400 text-lg mb-8 font-light max-w-2xl leading-relaxed">
                          {lang === 'ar' ? `التحدي في هذه النسخة يركز على "${jam.theme}". هل أنت مستعد للابداع؟` : `The theme for this jam is "${jam.theme}". Are you ready to innovate?`}
                        </p>
                     </div>
                     <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-white/[0.05]">
                        <div className="flex flex-wrap gap-8">
                           <div className="flex flex-col gap-1 text-center lg:text-start">
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Prize Pool</span>
                              <span className="text-2xl font-black text-emerald-400">{jam.prize}</span>
                           </div>
                           <div className="flex flex-col gap-1 text-center lg:text-start">
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Participants</span>
                              <span className="text-2xl font-black text-white">{jam.entries}</span>
                           </div>
                        </div>
                        <div className="px-12 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 hover:scale-[1.05] transition-all shadow-xl shadow-purple-600/20 active:scale-95">
                           {t("jams.join")}
                        </div>
                     </div>
                  </div>
               </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🏆 HALL OF FAME */}
      <section className="relative p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-slate-900 to-[#08090c] border border-white/5 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{t("jams.hall")}</h2>
              <p className="text-slate-500 text-lg font-light max-w-xl mx-auto">{lang === 'ar' ? 'نحتفل بأبطال المحرك الذين صنعوا التاريخ.' : 'Celebrating the legends who made history on GameForge.'}</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pastJams.map(jam => (
                <div key={jam.id} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] hover:bg-black/60 transition-all group/card">
                   <div className={`w-full aspect-video rounded-3xl mb-8 ${jam.image} flex items-center justify-center text-6xl group-hover/card:scale-105 transition-transform duration-500 shadow-2xl shadow-black`}>
                     {jam.icon}
                   </div>
                   <h4 className={`text-xl font-black text-white mb-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{jam.title}</h4>
                   <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 p-0.5">
                            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[10px]">👑</div>
                         </div>
                         <span className="text-[11px] text-white font-black">{jam.winner}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{jam.date}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}

