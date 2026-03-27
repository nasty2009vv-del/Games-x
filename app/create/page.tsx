"use client";

import React, { useState, useEffect, useRef } from "react";
import { createGame } from "../../lib/actions";
import { useRouter } from "next/navigation";
import { useLang } from "../../lib/lang";

export default function CreateGamePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { lang, t, dir } = useLang();
  const [isPending, setIsPending] = useState(false);
  const [engineOpen, setEngineOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [engine, setEngine] = useState("GameForge Core v1.0 (JS)");
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [thumbnailEmoji, setThumbnailEmoji] = useState("🕹️");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    tags: ""
  });

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => setActiveToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const engines = ["GameForge Core v1.0 (JS)", "Matrix Canvas 3D", "Forge Node.js Stream"];
  const statuses = [
    { id: "draft", label: lang === 'ar' ? 'مسودة خاصة' : 'Private Blueprint' },
    { id: "published", label: lang === 'ar' ? 'منشور للجميع' : 'Public Launch' }
  ];

  const handleFileDrop = () => {
    fileInputRef.current?.click();
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasFile(true);
      setFileName(file.name);
      setSelectedFile(file);
      setActiveToast(lang === 'ar' ? `تم اختيار: ${file.name}` : `Selected: ${file.name}`);
    }
  };

  const handleThumbPick = () => {
    const icons = ["🚀", "🐉", "⚔️", "👾", "🏰", "🧶"];
    setThumbnailEmoji(icons[Math.floor(Math.random() * icons.length)]);
    setActiveToast(lang === 'ar' ? "تم تحديث أيقونة الغلاف ✨" : "Thumbnail icon updated ✨");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return setActiveToast(lang === 'ar' ? "يرجى إدخال اسم اللعبة أولاً!" : "Please enter the title first!");
    if (!hasFile) return setActiveToast(lang === 'ar' ? "يرجى اختيار ملف اللعبة للرفع!" : "Please pick a game file to upload!");

    setIsPending(true);

    // 🚀 NEW: Read file content for small text-based games
    let fileContent = "";
    if (selectedFile) {
       try {
         fileContent = await selectedFile.text();
       } catch (err) {
         console.error("Read err:", err);
       }
    }

    const result = await createGame({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      packageName: fileName,
      fileContent: fileContent // ✨ Passing the actual code!
    });

    if (result.success) {
      setActiveToast(lang === 'ar' ? "تم الإطلاق بنجاح! جاري التوجيه..." : "Launch success! Redirecting...");
      setTimeout(() => router.push(`/game/${result.game?.id}`), 1500);
    } else {
      setActiveToast(lang === 'ar' ? "خطأ في الاتصال بالسيرفر." : "Server connection error.");
    }
    setIsPending(false);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 py-12 md:py-24 px-6 relative overflow-hidden" dir={dir}>
      {/* 🪄 BACKGROUND ATMOSPHERE */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className={`mb-16 md:mb-24 ${lang === 'ar' ? 'text-right' : 'text-left'} animate-in fade-in slide-in-from-top-10 duration-700`}>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-4">
            {lang === 'ar' ? 'ابدأ رحلة الإبداع' : 'Start Your Legacy'}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-bold uppercase tracking-[0.2em]">
            {lang === 'ar' ? 'حول أفكارك إلى تجارب حقيقية يلعبها الملايين' : 'Turn thoughts into experiences played by millions'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className={`grid grid-cols-1 lg:grid-cols-12 gap-12 ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
           {/* ✍️ EDITOR PANEL */}
           <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <section className={`bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] p-10 md:p-16 rounded-[4rem] shadow-3xl relative ${(engineOpen || statusOpen) ? 'z-[200]' : 'z-10'}`}>
                 <h2 className="text-2xl font-black text-white mb-10 border-b border-white/5 pb-6">
                    {lang === 'ar' ? 'أساسيات اللعبة' : 'Game DNA'}
                 </h2>
                 
                 <div className="space-y-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                          {lang === 'ar' ? 'عنوان اللعبة الفريد' : 'Unique Game Title'}
                       </label>
                       <input 
                         type="text" 
                         required
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         placeholder={lang === 'ar' ? 'مثال: ستار شيب كور' : 'e.g. Starship Core'}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl font-black text-white focus:outline-none focus:border-purple-500 transition-all font-sans italic"
                       />
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                          {lang === 'ar' ? 'القصة والوصف' : 'Legacy & Gameplay'}
                       </label>
                       <textarea 
                         rows={5}
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                         placeholder={lang === 'ar' ? 'ما هي التجربة التي سيعيشها اللاعب؟' : 'What experience are you building?'}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg font-bold text-white focus:outline-none focus:border-purple-500 transition-all resize-none font-sans"
                       />
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 relative ${(engineOpen || statusOpen) ? 'z-[100]' : 'z-50'}`}>
                       <div className="space-y-4 relative">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                             {lang === 'ar' ? 'المحرك البرمجي' : 'Core Engine'}
                          </label>
                          <div className="relative">
                             <button 
                               type="button"
                               onClick={() => { setEngineOpen(!engineOpen); setStatusOpen(false); }}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black text-left flex items-center justify-between hover:bg-white/10 transition-all border-white/20"
                             >
                                {engine}
                                <span className={`transition-transform duration-300 ${engineOpen ? 'rotate-180 text-purple-500' : ''}`}>▼</span>
                             </button>
                             {engineOpen && (
                               <div className="absolute top-full left-0 right-0 mt-3 bg-[#0d0e12] border border-white/20 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200 z-[100] backdrop-blur-3xl">
                                  {engines.map(e => (
                                    <button 
                                      key={e}
                                      type="button"
                                      onClick={() => { setEngine(e); setEngineOpen(false); }}
                                      className="w-full p-5 text-left font-black hover:bg-purple-600/20 transition-all text-slate-300 hover:text-white border-b border-white/5 last:border-0"
                                    >
                                       {e}
                                    </button>
                                  ))}
                               </div>
                             )}
                          </div>
                       </div>
                       <div className="space-y-4 relative">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">
                             {lang === 'ar' ? 'حالة النشر' : 'Visibility'}
                          </label>
                          <div className="relative">
                             <button 
                               type="button"
                               onClick={() => { setStatusOpen(!statusOpen); setEngineOpen(false); }}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black text-left flex items-center justify-between hover:bg-white/10 transition-all border-white/20"
                             >
                                {statuses.find(s => s.id === formData.status)?.label}
                                <span className={`transition-transform duration-300 ${statusOpen ? 'rotate-180 text-purple-500' : ''}`}>▼</span>
                             </button>
                             {statusOpen && (
                               <div className="absolute top-full left-0 right-0 mt-3 bg-[#0d0e12] border border-white/20 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200 z-[100] backdrop-blur-3xl">
                                  {statuses.map(s => (
                                    <button 
                                      key={s.id}
                                      type="button"
                                      onClick={() => { setFormData({...formData, status: s.id}); setStatusOpen(false); }}
                                      className="w-full p-5 text-left font-black hover:bg-purple-600/20 transition-all text-slate-300 hover:text-white border-b border-white/5 last:border-0"
                                    >
                                       {s.label}
                                    </button>
                                  ))}
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </section>

              {/* Package Upload */}
              <section 
                onClick={handleFileDrop}
                className={`bg-slate-900 border p-12 rounded-[4rem] text-center group cursor-pointer transition-all relative overflow-hidden ${hasFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 hover:border-purple-500/40'}`}
              >
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={onFileChange} 
                   className="hidden" 
                   accept=".zip,.html,.js"
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 space-y-6">
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] mx-auto flex items-center justify-center text-5xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all">
                       {hasFile ? '✅' : '📦'}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white mb-2">
                          {hasFile ? fileName : (lang === 'ar' ? 'رفع حزمة اللعبة' : 'Drop Game Package')}
                       </h3>
                       <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">
                          {hasFile ? (lang === 'ar' ? 'تم اختيار الملف بنجاح' : 'File selected successfully') : (lang === 'ar' ? 'يدعم ملفات ZIP أو HTML5 مباشرة' : 'Supports ZIP or HTML5 Source')}
                       </p>
                    </div>
                 </div>
              </section>
           </div>

           {/* 👁️ PREVIEW & CTA PANEL */}
           <div className="lg:col-span-4 space-y-12">
              <div className="sticky top-24 space-y-8 animate-in fade-in slide-in-from-right-10 duration-1000">
                 {/* 🖥️ REAL-TIME CARD PREVIEW */}
                 <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest italic ml-4">{lang === 'ar' ? 'معاينة في الاستكشاف' : 'Explore Card Preview'}</h3>
                    <div 
                      onClick={handleThumbPick}
                      className="bg-[#0b0c0e] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl hover:border-purple-500/50 transition-all p-3 group cursor-pointer"
                    >
                       <div className="aspect-video bg-gradient-to-tr from-purple-800 to-slate-900 rounded-[2.5rem] flex items-center justify-center text-7xl transform group-hover:scale-[1.02] transition-transform">
                          {thumbnailEmoji}
                       </div>
                       <div className="p-8 space-y-4">
                          <h4 className="text-2xl font-black text-white italic tracking-tighter">{formData.title || (lang === 'ar' ? 'اسم لعبتك' : 'Game Title')}</h4>
                          <div className="flex justify-between items-center pt-6 border-t border-white/5">
                             <span className="text-[10px] font-black text-slate-500 tracking-widest">0 EXPOSURE</span>
                             <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-4 py-1.5 rounded-full border border-emerald-500/20">{lang === 'ar' ? 'متاح الآن' : 'LIVE NOW'}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* CTA */}
                 <button 
                   type="submit"
                   disabled={isPending}
                   className="w-full bg-white text-slate-950 px-12 py-8 rounded-[2.5rem] font-black text-2xl shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                 >
                    {isPending ? (lang === 'ar' ? 'جاري الإطلاق...' : 'Launching...') : (lang === 'ar' ? 'إطلاق الإبداع 🚀' : 'Launch Experience 🚀')}
                 </button>

                 <div className="p-10 bg-purple-600/5 border border-purple-500/10 rounded-[3rem] space-y-4">
                    <p className="text-2xl font-black text-purple-400 italic">PRO TIP ✨</p>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                       {lang === 'ar' ? 'الألعاب التي تحتوي على وصف دقيق وأسماء جذابة تحصل على تفاعل أكبر بـ 5 أضعاف في صفحة الاستكشاف العالمية!' : 'Games with clear descriptions and catchy titles get 5x more exposure on the Global Explore page!'}
                    </p>
                 </div>
              </div>
           </div>
        </form>
      </div>

      {/* 🥯 GLOBAL TOAST SYSTEM */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[500] transition-all duration-500 transform ${activeToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
          <div className="bg-white text-slate-950 px-10 py-4 rounded-full font-black shadow-3xl shadow-white/20 flex items-center gap-4 border-t border-slate-100 whitespace-nowrap">
             <span className="text-xl">✨</span>
             {activeToast}
          </div>
      </div>
    </div>
  );
}
