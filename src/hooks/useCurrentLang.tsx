"use client";
import { usePathname } from "next/navigation";

const useCurrentLang = () => {
  const pathname = usePathname();
  const lang: "en" | "ar" = pathname.split("/")[1] as "en" | "ar";

  return { lang };
};

export default useCurrentLang;
