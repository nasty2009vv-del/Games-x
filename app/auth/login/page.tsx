"use client";

import React from "react";
import Link from "next/link";
import { useLang } from "../../../lib/lang";

export default function LoginPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0b10] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black text-white hover:text-purple-400 transition-colors">GameForge</Link>
          <p className="text-slate-500 mt-3 font-light">{t("auth.welcome")}</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-black text-slate-400 mb-2">{t("auth.email")}</label>
            <input type="email" placeholder="name@example.com" dir="ltr"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-all font-mono text-sm text-left" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-black text-slate-400">{t("auth.password")}</label>
              <Link href="#" className="text-xs text-purple-500 hover:text-purple-400 font-black">{t("auth.forgot")}</Link>
            </div>
            <input type="password" placeholder="••••••••" dir="ltr"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-all font-mono text-sm text-left" />
          </div>
          <button className="w-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-xl shadow-purple-600/10 active:scale-95 transition-all text-lg">
            {t("auth.signin")}
          </button>
        </form>

        <div className="relative my-8">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
           <div className="relative flex justify-center text-xs font-black text-slate-600"><span className="bg-slate-950 px-4">{t("auth.or")}</span></div>
        </div>

        <button className="w-full bg-slate-900 border border-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all mb-8">
           <span className="text-lg">{t("auth.github")}</span>
        </button>

        <div className="text-center text-sm">
           <span className="text-slate-500">{t("auth.no_account")} </span>
           <Link href="/auth/signup" className="text-purple-500 font-black hover:text-purple-400 underline underline-offset-4">{t("auth.create_account")}</Link>
        </div>
      </div>
    </div>
  );
}
