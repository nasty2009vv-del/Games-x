"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Lang = "ar" | "en";

interface LangContextType {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.explore": { ar: "استكشاف", en: "Explore" },
  "nav.jams": { ar: "المسابقات", en: "Game Jams" },
  "nav.assets": { ar: "متجر الأصول", en: "Asset Store" },
  "nav.profile": { ar: "ملفي", en: "Profile" },
  "nav.login": { ar: "تسجيل الدخول", en: "Sign In" },
  "nav.editor": { ar: "فتح المحرر", en: "Open Editor" },
  "nav.create": { ar: "ابدأ الإبداع", en: "Start Creating" },

  // Footer
  "footer.copy": { ar: "منصة صناعة الألعاب للمطورين العرب.", en: "The ultimate platform for game developers." },
  "footer.terms": { ar: "الشروط والأحكام", en: "Terms of Service" },
  "footer.privacy": { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  "footer.contact": { ar: "تواصل معنا", en: "Contact Us" },

  // Landing Page
  "hero.badge": { ar: "الإصدار التجريبي 1.0 قريباً جداً", en: "GameForge Beta 1.0 is shipping soon" },
  "hero.title1": { ar: "المحرك الأقوى", en: "The Ultimate Engine" },
  "hero.title2": { ar: "لصناعة ألعابك", en: "For Your Imagination" },
  "hero.desc": { ar: "أنشئ، طوّر، وانشر ألعابك مباشرةً من المتصفح. من محرر أكواد احترافي إلى بيئة تشغيل آمنة ومعزولة — كل ما تحتاجه في مكان واحد.", en: "Create, code, and publish games directly in your browser. From Monaco editor to a secure sandbox—all powered by GameForge." },
  "hero.cta1": { ar: "ابدأ التطوير مجاناً", en: "Start Developing Free" },
  "hero.cta2": { ar: "استكشف الألعاب", en: "Explore Published Games" },
  "feat.editor.title": { ar: "محرر أكواد احترافي", en: "Pro Code Editor" },
  "feat.editor.desc": { ar: "محرر Monaco المدمج مع التلوين التلقائي والإكمال الذكي لـ JavaScript. نفس تجربة VS Code، مباشرة في متصفحك.", en: "Built-in Monaco Editor with auto-complete for JS. The feel of VS Code, natively inside your browser." },
  "feat.sandbox.title": { ar: "بيئة تشغيل آمنة", en: "Secure Sandbox" },
  "feat.sandbox.desc": { ar: "ألعابك تعمل في وضع معزول (Sandbox) يمنع أي تأثير سلبي على النظام. أمان كامل بمعايير عالمية.", en: "Games execute safely in isolated WebWorkers and CSP-compliant iframes." },
  "feat.publish.title": { ar: "نشر بضغطة واحدة", en: "One-Click Publish" },
  "feat.publish.desc": { ar: "انشر لعبتك مباشرة على شبكة CDN عالمية فائقة السرعة. لعبتك تصل للعالم خلال ثوانٍ معدودة.", en: "Automatically package, bundle, and deploy to our high-performance global CDN in seconds." },
  "mockup.title": { ar: "شاهد المحرك أثناء العمل", en: "See the Engine in Action" },
  "mockup.desc": { ar: "اكتب الكود، شغّل اللعبة، وشاهد النتيجة فوراً — كل شيء من مكان واحد.", en: "Write code, run your game, and see results instantly—all from one place." },
  "mockup.files": { ar: "ملفات المشروع", en: "Project Files" },
  "mockup.editor": { ar: "محرر GameForge", en: "GameForge Editor" },
  "cta.title": { ar: "مستعد لبناء لعبتك الأولى؟", en: "Ready to build your first game?" },
  "cta.desc": { ar: "انضم لآلاف المطورين العرب الذين يصنعون ألعاباً رائعة كل يوم.", en: "Join thousands of developers who build amazing games every day." },
  "cta.btn": { ar: "أنشئ حسابك الآن — مجاناً", en: "Create Your Account — Free" },

  // Explore Page
  "explore.title": { ar: "اكتشف الألعاب", en: "Discover Games" },
  "explore.desc": { ar: "العب آلاف الألعاب المبنية بمحرك GameForge.", en: "Play thousands of games built with GameForge Engine." },
  "explore.search": { ar: "ابحث عن ألعاب، تصنيفات، أو مطورين...", en: "Search games, genres, or creators..." },
  "explore.trending": { ar: "🔥 الأكثر رواجاً", en: "🔥 Trending" },
  "explore.new": { ar: "✨ جديد ومميز", en: "✨ New & Notable" },
  "explore.top": { ar: "🏆 الأعلى تقييماً", en: "🏆 Top Rated" },
  "explore.multi": { ar: "⚔️ جماعي", en: "⚔️ Multiplayer" },
  "explore.puzzle": { ar: "🧩 ألغاز", en: "🧩 Puzzle" },
  "explore.racing": { ar: "🏎️ سباق", en: "🏎️ Racing" },
  "explore.rpg": { ar: "📜 RPG", en: "📜 RPG" },

  // Jams Page
  "jams.badge": { ar: "فعاليات المجتمع", en: "Community Events" },
  "jams.title1": { ar: "تحدَّ نفسك في", en: "Push Your Limits In" },
  "jams.title2": { ar: "مسابقات الألعاب", en: "Game Jams" },
  "jams.desc": { ar: "شارك في مسابقات تطوير الألعاب، اربح جوائز نقدية، وابنِ سمعتك كأفضل مبدع على GameForge.", en: "Join game development competitions, win prizes, and build your reputation on GameForge." },
  "jams.host": { ar: "استضف مسابقة", en: "Host a Jam" },
  "jams.rules": { ar: "القواعد والإرشادات", en: "Rules & Guidelines" },
  "jams.active": { ar: "المسابقات النشطة الآن", en: "Currently Active Jams" },
  "jams.join": { ar: "شارك الآن", en: "Enter Jam Now" },
  "jams.hall": { ar: "قاعة المشاهير", en: "Hall of Fame" },
  "jams.results": { ar: "النتائج", en: "Results" },
  "jams.winner": { ar: "الفائز:", en: "Winner:" },
  "jams.ended": { ar: "انتهت:", en: "Completed:" },
  "jams.participants": { ar: "مشارك", en: "Entries" },

  // Asset Store
  "assets.title": { ar: "متجر الأصول", en: "Asset Forge" },
  "assets.desc": { ar: "أصول عالية الجودة من صنع المجتمع لتسريع مشاريعك على GameForge.", en: "High-quality community-made assets to jumpstart your GameForge projects." },
  "assets.upload": { ar: "ارفع أصولك", en: "Upload Your Assets" },
  "assets.all": { ar: "الكل", en: "All" },
  "assets.sprites": { ar: "رسومات", en: "Sprites" },
  "assets.tilesets": { ar: "خرائط", en: "Tilesets" },
  "assets.audio": { ar: "أصوات", en: "Audio" },
  "assets.ui": { ar: "واجهات", en: "UI Kits" },
  "assets.fonts": { ar: "خطوط", en: "Fonts" },
  "assets.free": { ar: "مجاني", en: "Free" },
  "assets.download": { ar: "تحميل الأصول", en: "Download Assets" },
  "assets.buy": { ar: "شراء الحزمة", en: "Purchase Pack" },
  "assets.empty": { ar: "لا توجد أصول في هذا التصنيف.", en: "No assets found in this category." },
  "assets.support.title": { ar: "ندعم المبدعين المستقلين", en: "Supporting Independent Creators" },
  "assets.support.desc": { ar: "نأخذ 0% عمولة على مبيعات الأصول. كل قرش تربحه يذهب مباشرة لحسابك لتمويل مشروعك القادم.", en: "We take 0% commission on asset sales. Every cent goes straight to your pocket." },
  "assets.sell": { ar: "ابدأ البيع اليوم", en: "Start Selling Today" },

  // Auth Pages
  "auth.welcome": { ar: "مرحباً بعودتك إلى الاستوديو", en: "Welcome back to the studio" },
  "auth.email": { ar: "البريد الإلكتروني", en: "Email Address" },
  "auth.password": { ar: "كلمة المرور", en: "Password" },
  "auth.forgot": { ar: "نسيت كلمة المرور؟", en: "Forgot?" },
  "auth.signin": { ar: "تسجيل الدخول", en: "Sign In" },
  "auth.or": { ar: "أو تابع عبر", en: "Or continue with" },
  "auth.github": { ar: "حساب GitHub", en: "GitHub" },
  "auth.no_account": { ar: "ليس لديك حساب؟", en: "Don't have an account?" },
  "auth.create_account": { ar: "أنشئ حسابك الآن", en: "Create Studio Access" },
  "auth.join_title": { ar: "انضم للجيل القادم من صناع الألعاب", en: "Join the next generation of indie devs" },
  "auth.username": { ar: "اسم المستخدم", en: "Username" },
  "auth.signup_btn": { ar: "إنشاء حساب الاستوديو", en: "Create Studio Account" },
  "auth.or_join": { ar: "أو انضم عبر", en: "Or join with" },
  "auth.github_dev": { ar: "حساب GitHub للمطورين", en: "GitHub Developer Account" },
  "auth.has_account": { ar: "لديك حساب بالفعل؟", en: "Already a member?" },
  "auth.login_link": { ar: "تسجيل الدخول", en: "Studio Sign In" },
  "auth.agree": { ar: "أوافق على", en: "I agree to the" },
  "auth.terms": { ar: "الشروط والأحكام", en: "Terms of Service" },
  "auth.privacy": { ar: "سياسة الخصوصية", en: "Privacy Policy" },
};

const LangContext = createContext<LangContextType>({
  lang: "ar",
  dir: "rtl",
  setLang: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("gf-lang") as Lang | null;
    if (saved && (saved === "ar" || saved === "en")) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("gf-lang", newLang);
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
