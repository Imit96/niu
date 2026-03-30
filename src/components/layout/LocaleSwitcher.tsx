"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className="flex items-center gap-1 text-xs font-inter tracking-widest">
      {(["en", "fr"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink/20">|</span>}
          <button
            onClick={() => switchLocale(l)}
            disabled={isPending || l === locale}
            className={
              l === locale
                ? "text-ink font-semibold cursor-default"
                : "text-ink/40 hover:text-ink transition-colors cursor-pointer"
            }
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
