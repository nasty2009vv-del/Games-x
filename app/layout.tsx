import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameForge — منصة تطوير الألعاب السحابية",
  description: "أنشئ، طوّر، وانشر ألعابك مباشرةً من المتصفح باستخدام محرك GameForge.",
};

import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLang = (cookieStore.get("gf-lang")?.value || "ar") as any;

  return (
    <html lang={initialLang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`} dir={initialLang === 'ar' ? 'rtl' : 'ltr'}>
      <body className="h-full overflow-x-hidden">
        <ClientLayout initialLang={initialLang}>{children}</ClientLayout>
      </body>
    </html>
  );
}
