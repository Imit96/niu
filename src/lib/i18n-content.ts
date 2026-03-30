/**
 * Localise a content field: returns the French value when locale is "fr"
 * and frValue is non-empty, otherwise falls back to the English value.
 */
export function localise<T extends string | null | undefined>(
  enValue: T,
  frValue: T,
  locale: string
): T {
  return (locale === "fr" && frValue ? frValue : enValue) as T;
}
