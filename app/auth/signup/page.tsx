"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0b10] relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black text-white hover:text-purple-400 transition-colors">GameForge</Link>
          <p className="text-slate-500 mt-2 font-light italic">Join the next generation of indie devs</p>
        </div>

        <form className="space-y-5 text-right" dir="rtl">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">اسم المستخدم (Username)</label>
            <input 
              type="text" 
              placeholder="e.g. AbdallahDev"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-all font-mono text-sm"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">البريد الإلكتروني (Email)</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-all font-mono text-sm"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">كلمة المرور (Password)</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-all font-mono text-sm"
              dir="ltr"
            />
          </div>

          <div className="flex items-center gap-3 py-2">
             <input type="checkbox" className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-purple-600" />
             <span className="text-xs text-slate-500">I agree to the <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link></span>
          </div>

          <button className="w-full bg-white text-slate-950 font-black py-4 rounded-xl shadow-xl hover:bg-slate-200 active:scale-95 transition-all text-lg mb-4">
            Create Studio Account
          </button>
        </form>

        <div className="relative my-8">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
           <div className="relative flex justify-center text-xs uppercase font-bold text-slate-600"><span className="bg-slate-950 px-4">أو انضم عبر</span></div>
        </div>

        <button className="w-full bg-slate-900 border border-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all mb-8">
           <span className="text-lg">GitHub Developer Account</span>
        </button>

        <div className="text-center text-sm">
           <span className="text-slate-500">Already a member? </span>
           <Link href="/auth/login" className="text-purple-500 font-bold hover:text-purple-400 underline underline-offset-4">Studio Sign In</Link>
        </div>
      </div>
    </div>
  );
}
