import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameForge - The Ultimate Cloud Game Engine",
  description: "Create, collaborate, and publish your games entirely in the browser using GameForge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30">
        <nav className="w-full flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
              GF
            </div>
            <span className="text-xl tracking-tight font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              GameForge
            </span>
          </div>
          <div className="flex gap-4 items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Explore Features</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Asset Store</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Jams</a>
            <div className="h-4 w-px bg-slate-800"></div>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</a>
            <button className="px-4 py-2 rounded-full bg-white text-slate-950 text-sm font-medium hover:bg-slate-200 transition-all shadow-lg hover:shadow-white/20 active:scale-95">
              Start Creating
            </button>
          </div>
        </nav>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="w-full py-8 mt-auto border-t border-white/5 bg-slate-950 px-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} GameForge. The ultimate platform for game devs.</p>
        </footer>
      </body>
    </html>
  );
}
