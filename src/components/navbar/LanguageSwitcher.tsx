"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import lang from "@/public/images/lang.png";

const LanguageSelector: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isArabic = pathname.startsWith("/ar");
  const newLocale = isArabic ? "en" : "ar";

  const toggleLanguage = (e: React.MouseEvent) => {
    e.preventDefault();
    const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "");
    
    // Preserve query parameters
    const queryString = searchParams.toString();
    const queryPart = queryString ? `?${queryString}` : "";
    
    window.location.href = `/${newLocale}${pathWithoutLocale}${queryPart}`;
  };

  return (
    <a
      href="#"
      onClick={(e) => toggleLanguage(e)}
      className="flex items-center justify-center ] h-[41px] rounded-[21px]  gap-1 cursor-pointer"
    >
      <span className="text-[12px]">({isArabic ? "EN" : "AR"})</span>
      <Image
        src={lang}
        alt="return"
        className="returnn mr-1"
        width={26}
        height={26}
      />
    </a>
  );
};

export default LanguageSelector;
