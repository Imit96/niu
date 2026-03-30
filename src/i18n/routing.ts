import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  // English URLs stay clean (/shop), French gets prefix (/fr/shop)
  localePrefix: "as-needed",
});
