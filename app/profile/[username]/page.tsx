import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import { getDictionary } from "../../../lib/lang-server";
import { cookies } from "next/headers";
import ProfileContent from "../ProfileContent";

export default async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  // Get language from cookies (Server Side)
  const cookieStore = await cookies();
  const lang = (cookieStore.get("gf-lang")?.value || "ar") as "ar" | "en";
  const t = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Try to find the user in the database
  const dbUser = await prisma.user.findFirst({
    where: { username: username },
    include: { games: true }
  });

  // Mock data if DB user doesn't exist (for demo purposes)
  const user = dbUser ? {
    username: dbUser.username,
    role: dbUser.role || (lang === 'ar' ? "مهندس ألعاب" : "Game Architect"),
    bio: dbUser.bio || (lang === 'ar' ? "أصنع عوالم رقمية بكسل تلو الآخر." : "Crafting digital worlds one pixel at a time."),
    joinDate: dbUser.createdAt.toLocaleDateString(),
    followers: "12.4k",
    following: "450",
    gamesCount: dbUser.games.length,
    totalPlays: dbUser.games.reduce((acc: any, game: any) => acc + (game.plays_count || 0), 0).toLocaleString('en-US'),
    avatarColor: "bg-gradient-to-tr from-purple-600 to-blue-600",
    coverImage: "bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]",
    games: dbUser.games.map(g => ({ ...g, icon: "🎮", thumbnail: "bg-purple-600/40" })),
    achievements: lang === 'ar' ? ["عضو مؤسس", "فائز في مسابقة", "مطور محترف"] : ["Early Bird", "Jam Winner", "Pro Dev"]
  } : {
    username: username,
    role: lang === 'ar' ? "مهندس ألعاب أول" : "Senior Game Architect",
    bio: lang === 'ar' ? "مبدع صاحب رؤية متخصص في الشيدرز عالية الجودة والتوليد الإجرائي. المطور الرئيسي لسلسلة 'Neon Dash'. مرحبًا بكم في الاستوديو الخاص بي." : "Visionary creator specializing in high-fidelity shaders and procedural generation. Lead developer of the 'Neon Dash' series. Welcome to my creative studio.",
    joinDate: lang === 'ar' ? "انضم في مارس 2023" : "Joined March 2023",
    followers: "42.8k",
    following: "128",
    gamesCount: 14,
    totalPlays: "5.2M",
    avatarColor: "bg-gradient-to-tr from-rose-600 to-indigo-700",
    coverImage: "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]",
    games: [
      { id: "neon-dash", title: lang === 'ar' ? "نيون داش برو" : "Neon Dash Pro", plays_count: 2450000, rating_avg: 4.9, thumbnail: "bg-purple-600/40", status: "published", icon: "🏃" },
      { id: "starship", title: lang === 'ar' ? "نجم الفضاء" : "Starship Core", plays_count: 1200000, rating_avg: 4.8, thumbnail: "bg-blue-600/40", status: "published", icon: "🚀" },
      { id: "new-rpg", title: lang === 'ar' ? "مشروع الأثير" : "Project: Aether", plays_count: 0, rating_avg: 0, thumbnail: "bg-slate-800/20", status: "draft", icon: "🗡️" },
    ],
    achievements: lang === 'ar' ? ["المؤسس التاريخي", "محترف برمجة", "نجم المجتمع"] : ["Legacy Founder", "Master Script", "Community Star"]
  };

  const socialLinks = [
    { icon: "🌐", label: lang === 'ar' ? "الموقع" : "Website", url: "https://gameforge.ai" },
    { icon: "🐦", label: lang === 'ar' ? "تويتر" : "Twitter", url: "https://twitter.com" },
    { icon: "📁", label: lang === 'ar' ? "جيت هاب" : "GitHub", url: `https://github.com/${username}` },
    { icon: "💬", label: lang === 'ar' ? "ديسكورد" : "Discord", url: "https://discord.com" },
  ];

  // Ensure no functions or complex objects are passed to the client component
  // Use JSON serialization to clean the data
  const safeUser = JSON.parse(JSON.stringify(user));
  const safeSocialLinks = JSON.parse(JSON.stringify(socialLinks));

  return (
    <ProfileContent 
      user={safeUser}
      socialLinks={safeSocialLinks}
    />
  );
}

