export default function CreateGamePage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">Publish New Game</h1>
        <p className="text-slate-400">Upload your HTML5 game folder or publish directly from the GameForge Sandbox.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2 space-y-6 bg-slate-900/50 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Game Title</label>
            <input 
              type="text" 
              placeholder="e.g. Neon Dash: Cyber Space" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea 
              rows={4} 
              placeholder="Tell the community what your game is about..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Engine Version</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                <option>HTML5 / Custom JS</option>
                <option>GameForge Native Lua</option>
                <option>PixiJS Context</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Visibility Status</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                <option>Draft (Private)</option>
                <option>Published (Public)</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Upload HTML5 Zip File</label>
            <div className="border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-950 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                📂
              </div>
              <p className="text-slate-300 font-medium mb-1">Drag and drop your game .zip here</p>
              <p className="text-slate-500 text-sm">Must contain index.html at the root (Max size: 100MB)</p>
            </div>
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Thumbnail Image</h3>
            <div className="aspect-video w-full bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors relative group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">Change Cover</span>
               </div>
               <span className="text-4xl text-slate-700 group-hover:scale-110 transition-transform">🖼️</span>
               <p className="absolute bottom-4 text-xs text-slate-500">1280x720 recommended</p>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)] transition-all transform active:scale-95">
            🚀 Publish to GameForge
          </button>
        </div>
      </div>
    </div>
  );
}
