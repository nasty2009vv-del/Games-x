"use client";

import React, { useState } from "react";
import { createGame } from "../../lib/actions";
import { useRouter } from "next/navigation";

export default function CreateGamePage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("يرجى إدخال اسم اللعبة أولاً!");

    setIsPending(true);
    const result = await createGame({
      title: formData.title,
      description: formData.description,
      status: formData.status
    });

    if (result.success) {
      alert("تم نشر اللعبة بنجاح! سيتم توجيهك الآن...");
      router.push(`/game/${result.game?.id}`);
    } else {
      alert("حدث خطأ أثناء النشر. يرجى المحاولة مرة أخرى.");
    }
    setIsPending(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12" dir="rtl">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-2">نشر لعبة جديدة</h1>
        <p className="text-slate-400">قم برفع ملفات لعبتك أو استيرادها مباشرة من محطة تطوير GameForge.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
        {/* Main Form Area */}
        <div className="md:col-span-2 space-y-6 bg-slate-900/50 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3">اسم اللعبة</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="مثال: رحلة في الفضاء، بطل المنصات، إلخ..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-sans"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3">وصف اللعبة</label>
            <textarea 
              rows={5} 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="اشرح للاعبين عن ماذا تتحدث لعبتك وكيفية لعبها..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">إصدار المحرك</label>
              <select className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer">
                <option>GameForge Core v1 (JS)</option>
                <option>Legacy HTML5 Canvas</option>
                <option>Custom Engine API</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">حالة الرؤية</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
              >
                <option value="draft">مسودة (Draft)</option>
                <option value="published">منشورة (Public)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 relative">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
             <label className="block text-sm font-bold text-slate-300 mb-4 pt-6">رفع حزمة اللعبة (HTML5 / ZIP)</label>
             <div className="group border-2 border-dashed border-slate-700 hover:border-purple-500/50 bg-slate-950 hover:bg-slate-900/50 rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-4xl mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  📦
                </div>
                <p className="text-slate-300 font-bold text-lg mb-2">اسحب وأسقط الملف هنا</p>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed">تأكد من وجود ملف index.html في المجلد الرئيسي للحفاظ على التوافق.</p>
             </div>
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-8 flex flex-col h-full">
          <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">غلاف اللعبة (Thumbnail)</h3>
            <div className="aspect-video w-full bg-slate-950 border-2 border-slate-800 hover:border-purple-500/50 rounded-3xl flex items-center justify-center cursor-pointer transition-all relative group overflow-hidden shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-bottom p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white bg-purple-600 px-3 py-1 rounded-full font-bold shadow-lg">تغيير الصورة</span>
               </div>
               <span className="text-5xl opacity-20 filter grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">🖼️</span>
               <p className="absolute bottom-6 text-xs text-slate-500 font-mono">1280 × 720</p>
            </div>
          </div>

          <div className="p-8 bg-purple-900/10 rounded-[2.5rem] border border-purple-500/20">
             <h4 className="text-purple-400 font-black mb-4 uppercase text-xs tracking-widest">مساعدة سريعة</h4>
             <p className="text-slate-400 text-sm leading-relaxed">
               تذكر أن تملأ كل الحقول بمعلومات دقيقة لتسهيل عثور اللاعبين على لعبتك في صفحة "الاستكشاف". الألعاب ذات الأغلفة الجميلة تحصل على تفاعل أكبر بـ 5 أضعاف!
             </p>
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-5 rounded-3xl shadow-[0_20px_40px_-10px_rgba(147,51,234,0.5)] transition-all transform active:scale-95 text-lg mt-auto flex items-center justify-center gap-3 disabled:opacity-50`}
          >
            {isPending ? "جارِ النشر..." : "🚀 نشر اللعبة فوراً"}
          </button>
        </div>
      </form>
    </div>
  );
}
