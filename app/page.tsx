import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center flex-1 w-full relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-6xl px-6 py-24 md:py-32 lg:py-48 mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300 mb-8 backdrop-blur-sm shadow-xl shadow-black">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          GameForge Beta 1.0 is shipping soon
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          The Ultimate Engine <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            For Your Imagination
          </span>
        </h1>
        <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Create, code, and publish games directly in your browser. From Monaco editor to a visual scene builder—all powered by a secure sandbox execution environment.
        </p>

        <div className="flex items-center gap-4">
          <button className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-tr from-purple-600 to-blue-600 shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] hover:shadow-[0_0_60px_-10px_rgba(147,51,234,0.6)] hover:scale-105 active:scale-95 transition-all">
            Start Developing Free
          </button>
          <button className="px-8 py-4 rounded-xl font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            Explore Documentation
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 w-full max-w-7xl px-6 py-24 mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Pro Code Editor",
            description: "Built-in Monaco Editor with auto-complete for Lua and JS. The feel of VS Code, natively inside your browser.",
            icon: "💻"
          },
          {
            title: "Secure Sandbox",
            description: "Games execute safely in isolated WebWorkers and Content-Security-Policy compliant iframes.",
            icon: "🔒"
          },
          {
            title: "One-Click Publish",
            description: "Automatically package, bundle, and deploy to our high-performance global CDN in seconds.",
            icon: "🚀"
          }
        ].map((feat, i) => (
          <div key={i} className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-purple-500/20">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">{feat.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {feat.description}
            </p>
          </div>
        ))}
      </section>

      {/* Fake Editor Mockup */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 mb-32 group perspective">
        <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-[0_20px_80px_-20px_rgba(139,92,246,0.3)] bg-slate-950 flex flex-col transform group-hover:-translate-y-2 group-hover:shadow-[0_40px_100px_-20px_rgba(139,92,246,0.5)] transition-all duration-700 ease-out">
          <div className="flex items-center px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto text-xs font-mono text-slate-500 flex items-center gap-2">
               <span className="text-purple-400">player.lua</span> - GameForge Editor
            </div>
          </div>
          <div className="grid grid-cols-4 min-h-[400px]">
            <div className="col-span-1 border-r border-slate-800 bg-slate-900/30 p-4">
              <div className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-4">Project Files</div>
              <div className="space-y-2 text-sm text-slate-400 font-mono">
                <div className="flex items-center gap-2 text-slate-200 px-2 py-1 bg-white/5 rounded"><span className="text-amber-400">▶</span> main.lua</div>
                <div className="flex items-center gap-2 hover:bg-white/5 rounded px-2 py-1 cursor-pointer"><span>📄</span> player.lua</div>
                <div className="flex items-center gap-2 hover:bg-white/5 rounded px-2 py-1 cursor-pointer"><span>📄</span> enemy.lua</div>
              </div>
            </div>
            <div className="col-span-3 p-6 bg-[#1a1b26] font-mono text-sm leading-relaxed">
              <div className="text-purple-400">function <span className="text-blue-400">onUpdate</span><span className="text-slate-300">(dt)</span></div>
              <div className="pl-6 text-pink-400">if <span className="text-slate-300">Input.</span><span className="text-blue-300">isDown</span><span className="text-slate-300">(</span><span className="text-green-300">"right"</span><span className="text-slate-300">)</span> then</div>
              <div className="pl-12 text-slate-300">player.velocity.x <span className="text-pink-400">=</span> <span className="text-orange-300">250</span></div>
              <div className="pl-6 text-pink-400">end</div>
              <div className="pl-6 mt-4 text-pink-400">if <span className="text-slate-300">Input.</span><span className="text-blue-300">isPressed</span><span className="text-slate-300">(</span><span className="text-green-300">"jump"</span><span className="text-slate-300">)</span> then</div>
              <div className="pl-12 text-slate-300">player.velocity.y <span className="text-pink-400">=</span> <span className="text-orange-300">-400</span></div>
              <div className="pl-6 text-pink-400">end</div>
              <div className="text-purple-400 mt-2">end</div>
              
              <div className="mt-8 animate-pulse text-slate-600 block">|</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
