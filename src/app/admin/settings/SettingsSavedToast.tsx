"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export function SettingsSavedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("saved") === "1") {
      toast.success("Settings saved successfully.");
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null;
}
