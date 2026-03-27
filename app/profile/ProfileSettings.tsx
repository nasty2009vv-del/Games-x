"use client";

import React, { useState } from "react";
import { useLang } from "../../lib/lang";

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (data: any) => void;
  type: "settings" | "style";
}

export default function ProfileSettings({ isOpen, onClose, user, onUpdate, type }: ProfileSettingsProps) {
  const { lang, dir } = useLang();
  const [formData, setFormData] = useState({ ...user });

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#08090b] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_150px_rgba(139,92,246,0.2)] animate-in scale-in duration-500" dir={dir}>
         {/* 🫧 GLOWS */}
         <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] pointer-events-none" />
         
         {/* Sidebar - Navigation */}
         <aside className="w-full md:w-80 bg-white/5 border-b md:border-b-0 md:border-r border-white/10 p-10 flex flex-col items-center md:items-start">
            <div className="p-10 mb-8 rounded-[2.5rem] bg-gradient-to-tr from-purple-600 to-indigo-700 shadow-2xl scale-110 lg:scale-125">
               <span className="text-5xl">{type === "settings" ? "⚙️" : "✨"}</span>
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2">
               {type === "settings" ? (lang === 'ar' ? 'الإعدادات' : 'Settings') : (lang === 'ar' ? 'التخصيص' : 'Customize')}
            </h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
               {type === "settings" ? (lang === 'ar' ? 'إدارة حسابك الشخصي' : 'Manage your identity') : (lang === 'ar' ? 'اجعل ملفك مميزاً' : 'Express your style')}
            </p>
         </aside>

         {/* Main Content Area */}
         <main className="flex-1 p-10 md:p-16 space-y-10 overflow-y-auto max-h-[80vh]">
            {type === "settings" ? (
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'الاسم المعروض' : 'Display Name'}</label>
                     <input 
                       type="text" 
                       value={formData.username}
                       onChange={(e) => setFormData({...formData, username: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-purple-500 transition-all"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'السيرة الذاتية' : 'Biography'}</label>
                     <textarea 
                       rows={4}
                       value={formData.bio}
                       onChange={(e) => setFormData({...formData, bio: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-purple-500 transition-all resize-none"
                     />
                  </div>
               </div>
            ) : (
               <div className="space-y-12">
                  <div className="space-y-6">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'لون الصورة الرمزية' : 'Avatar Aura'}</label>
                     <div className="grid grid-cols-4 gap-4">
                        {["from-purple-600 to-blue-600", "from-rose-600 to-indigo-700", "from-emerald-500 to-teal-800", "from-amber-500 to-orange-700"].map((clr) => (
                          <button 
                            key={clr}
                            onClick={() => setFormData({...formData, avatarColor: `bg-gradient-to-tr ${clr}`})}
                            className={`h-16 rounded-2xl bg-gradient-to-tr ${clr} transition-all ${formData.avatarColor.includes(clr) ? 'ring-4 ring-white ring-offset-4 ring-offset-[#08090b] scale-105' : 'opacity-40 hover:opacity-100'}`}
                          />
                        ))}
                     </div>
                  </div>
                  <div className="space-y-6">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'نمط الغلاف' : 'Cover Texture'}</label>
                     <div className="grid grid-cols-2 gap-4">
                        {[
                          { key: "asfalt", css: "bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" },
                          { key: "carbon", css: "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" }
                        ].map((tex) => (
                          <button 
                            key={tex.key}
                            onClick={() => setFormData({...formData, coverImage: tex.css})}
                            className={`h-24 rounded-2xl bg-slate-800 border-2 transition-all overflow-hidden ${formData.coverImage === tex.css ? 'border-purple-500' : 'border-white/5 opacity-40 hover:opacity-100 italic font-black text-xs'}`}
                          >
                             <div className={`w-full h-full ${tex.css} flex items-center justify-center`}>{tex.key.toUpperCase()}</div>
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-8">
               <button onClick={handleSave} className="flex-1 px-8 py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95 text-lg">
                  {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
               </button>
               <button onClick={onClose} className="px-8 py-5 bg-slate-950 text-white font-black rounded-2xl border border-white/10 hover:bg-slate-900 transition-all text-lg">
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
               </button>
            </div>
         </main>
      </div>
    </div>
  );
}
