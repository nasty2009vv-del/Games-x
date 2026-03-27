"use client";

import Link from "next/link";
import { LangProvider, LangSwitcher, useLang } from "../lib/lang";

function NavBar() {
  const { t, dir } = useLang();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50" dir={dir}>
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-white shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow text-sm">
          GF
        </div>
        <span className="text-xl tracking-tight font-black bg-clip-text text-transparent bg-gradient-to-l from-white to-slate-400 group-hover:from-purple-400 group-hover:to-white transition-all">
          GameForge
        </span>
      </Link>
      <div className="flex items-center gap-5">
        <Link href="/explore" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t("nav.explore")}</Link>
        <Link href="/jams" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t("nav.jams")}</Link>
        <Link href="/assets" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t("nav.assets")}</Link>
        <Link href="/profile/demo-user" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t("nav.profile")}</Link>
        <div className="h-5 w-px bg-slate-800"></div>
        <LangSwitcher />
        <Link href="/auth/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t("nav.login")}</Link>
        <Link href="/editor" className="px-5 py-2 rounded-xl border border-purple-500/40 text-purple-400 text-sm font-bold hover:bg-purple-500/10 transition-all">
          {t("nav.editor")}
        </Link>
        <Link href="/create" className="px-5 py-2 rounded-xl bg-white text-slate-950 text-sm font-black hover:bg-slate-200 transition-all shadow-lg hover:shadow-white/20 active:scale-95">
          {t("nav.create")}
        </Link>
      </div>
    </nav>
  );
}

function FooterBar() {
  const { t, dir } = useLang();

  return (
    <footer className="w-full py-10 mt-auto border-t border-white/5 bg-slate-950 px-6" dir={dir}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-slate-500 text-sm font-bold">&copy; {new Date().getFullYear()} GameForge. {t("footer.copy")}</p>
        <div className="flex items-center gap-6 text-xs text-slate-600">
          <Link href="#" className="hover:text-slate-400 transition-colors">{t("footer.terms")}</Link>
          <Link href="#" className="hover:text-slate-400 transition-colors">{t("footer.privacy")}</Link>
          <Link href="#" className="hover:text-slate-400 transition-colors">{t("footer.contact")}</Link>
        </div>
      </div>
    </footer>
  );
}

function BodyWrapper({ children }: { children: React.ReactNode }) {
  const { dir } = useLang();

  return (
    <div className={`min-h-screen flex flex-col bg-[#050608] text-slate-100 font-sans selection:bg-purple-500/30 transition-all duration-500`} dir={dir}>
      <NavBar />
      <main className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-700">{children}</main>
      <FooterBar />
    </div>
  );
}

export default function ClientLayout({ children, initialLang }: { children: React.ReactNode, initialLang?: any }) {
  return (
    <LangProvider initialLang={initialLang}>
      <BodyWrapper>{children}</BodyWrapper>
    </LangProvider>
  );
}
