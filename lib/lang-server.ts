import { translations, Lang } from "./translations";

export async function getDictionary(lang: string = "en") {
  const safeLang = (lang === "ar" || lang === "en" ? lang : "en") as Lang;
  
  return (key: string) => {
    return translations[key]?.[safeLang] || key;
  };
}
