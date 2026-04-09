export type Locale = "zh" | "en" | "ja";

export const localeNames: Record<Locale, string> = {
  zh: "中文",
  en: "English",
  ja: "日本語",
};

type TranslationKeys = typeof import("./zh").default;

const modules = import.meta.glob<{ default: TranslationKeys }>(
  "./*.ts",
  { eager: true }
);

const translations: Record<string, TranslationKeys> = {};
for (const [path, mod] of Object.entries(modules)) {
  const locale = path.replace("./", "").replace(".ts", "");
  if (locale === "zh" || locale === "en" || locale === "ja") {
    translations[locale] = mod.default;
  }
}

export function t(locale: Locale, key: keyof TranslationKeys): string {
  return translations[locale]?.[key] ?? translations.zh?.[key] ?? key;
}
