import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GameForge Editor",
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  // To simulate a full screen desktop app, we won't wrap this with the global Navbar footer
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1e1e1e] text-slate-300 font-sans">
      {children}
    </div>
  );
}
