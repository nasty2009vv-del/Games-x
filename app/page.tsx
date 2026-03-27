"use client";

import Link from "next/link";
import { useLang } from "../lib/lang";

export default function Home() {
  const { t, dir } = useLang();

  const features = [
    { title: t("feat.editor.title"), description: t("feat.editor.desc"), icon: "💻" },
    { title: t("feat.sandbox.title"), description: t("feat.sandbox.desc"), icon: "🔒" },
    { title: t("feat.publish.title"), description: t("feat.publish.desc"), icon: "🚀" },
  ];

  return (
    <div className="flex flex-col items-center flex-1 w-full relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-6xl px-6 py-24 md:py-32 lg:py-48 mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-black text-slate-300 mb-8 backdrop-blur-sm shadow-xl shadow-black tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {t("hero.badge")}
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.2]">
          {t("hero.title1")} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 via-pink-500 to-blue-500">
            {t("hero.title2")}
          </span>
        </h1>
        <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          {t("hero.desc")}
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/create" className="px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-tr from-purple-600 to-blue-600 shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] hover:shadow-[0_0_60px_-10px_rgba(147,51,234,0.6)] hover:scale-105 active:scale-95 transition-all text-lg">
            {t("hero.cta1")}
          </Link>
          <Link href="/explore" className="px-8 py-4 rounded-2xl font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-lg">
            {t("hero.cta2")}
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 w-full max-w-7xl px-6 py-24 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feat, i) => (
          <div key={i} className="group p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-purple-500/20">
              {feat.icon}
            </div>
            <h3 className="text-xl font-black text-slate-200 mb-3">{feat.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{feat.description}</p>
          </div>
        ))}
      </section>

      {/* Code Editor Mockup */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 mb-32 group perspective">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-4">{t("mockup.title")}</h2>
          <p className="text-slate-500 max-w-lg mx-auto">{t("mockup.desc")}</p>
        </div>
        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-[0_20px_80px_-20px_rgba(139,92,246,0.3)] bg-slate-950 flex flex-col transform group-hover:-translate-y-2 group-hover:shadow-[0_40px_100px_-20px_rgba(139,92,246,0.5)] transition-all duration-700 ease-out">
          <div className="flex items-center px-5 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto text-xs font-mono text-slate-500 flex items-center gap-2">
               <span className="text-purple-400">main.js</span> — {t("mockup.editor")}
            </div>
          </div>
          <div className="grid grid-cols-4 min-h-[400px]" dir="ltr">
            <div className="col-span-1 border-r border-slate-800 bg-slate-900/30 p-4">
              <div className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-4">{t("mockup.files")}</div>
              <div className="space-y-2 text-sm text-slate-400 font-mono">
                <div className="flex items-center gap-2 text-slate-200 px-2 py-1 bg-white/5 rounded-lg"><span className="text-purple-400">▶</span> main.js</div>
                <div className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1 cursor-pointer"><span>📄</span> player.js</div>
                <div className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1 cursor-pointer"><span>📄</span> enemy.js</div>
              </div>
            </div>
            <div className="col-span-3 p-6 bg-[#0c0e1a] font-mono text-sm leading-relaxed">
              <div className="text-purple-400">GF.init <span className="text-slate-300">= () =&gt; {"{"}</span></div>
              <div className="pr-6 text-slate-300">  console.<span className="text-blue-300">log</span>(<span className="text-green-300">"🚀 Engine Initialized!"</span>);</div>
              <div className="text-slate-300">{"};"}</div>
              <div className="mt-4 text-purple-400">GF.update <span className="text-slate-300">= (dt) =&gt; {"{"}</span></div>
              <div className="pr-6 text-slate-300">  player.x += GF.Input.<span className="text-blue-300">getAxis</span>(<span className="text-green-300">'Horizontal'</span>) * <span className="text-orange-300">300</span> * dt;</div>
              <div className="text-slate-300">{"};"}</div>
              <div className="mt-4 text-purple-400">GF.draw <span className="text-slate-300">= () =&gt; {"{"}</span></div>
              <div className="pr-6 text-slate-300">  GF.Draw.<span className="text-blue-300">circle</span>(player.x, player.y, <span className="text-orange-300">20</span>, <span className="text-green-300">'#a855f7'</span>);</div>
              <div className="text-slate-300">{"};"}</div>
              <div className="mt-8 animate-pulse text-slate-600 block">|</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 mb-32 text-center">
        <div className="p-16 rounded-[3rem] bg-gradient-to-br from-purple-600/10 via-slate-900/50 to-blue-600/10 border border-white/5 shadow-2xl">
          <h2 className="text-4xl font-black text-white mb-4">{t("cta.title")}</h2>
          <p className="text-slate-400 mb-10 max-w-lg mx-auto text-lg font-light">{t("cta.desc")}</p>
          <Link href="/auth/signup" className="px-10 py-5 rounded-2xl bg-white text-slate-950 font-black text-lg hover:bg-slate-200 shadow-xl shadow-white/10 active:scale-95 transition-all inline-block">
            {t("cta.btn")}
          </Link>
        </div>
      </section>
    </div>
  );
}
