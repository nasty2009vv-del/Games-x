"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { translations, Lang } from "./translations";

interface LangContextType {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "ar",
  dir: "rtl",
  setLang: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children, initialLang = "ar" }: { children: React.ReactNode, initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    const saved = localStorage.getItem("gf-lang") as Lang | null;
    if (saved && (saved === "ar" || saved === "en") && saved !== initialLang) {
      setLangState(saved);
    }
  }, [initialLang]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("gf-lang", newLang);
    // Set a cookie so the server knows the language
    document.cookie = `gf-lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    // Refresh to apply server-side changes if necessary
    window.location.reload();
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  const t = (key: string) => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LangContext.Provider value={{ lang, dir, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs font-bold hover:bg-white/[0.08] transition-all active:scale-95 group"
      title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
    >
      <span className={`transition-all ${lang === "ar" ? "text-purple-400" : "text-slate-500"}`}>ع</span>
      <div className="relative w-8 h-4 bg-slate-800 rounded-full">
        <div className={`absolute top-0.5 w-3 h-3 bg-purple-500 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/30 ${lang === "ar" ? "right-0.5" : "left-0.5"}`}></div>
      </div>
      <span className={`transition-all ${lang === "en" ? "text-purple-400" : "text-slate-500"}`}>EN</span>
    </button>
  );
}
