"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaSnapchat,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa6";
import Container from "../shared/container";
import apiServiceCall from "@/lib/apiServiceCall";
import { useTranslations } from "next-intl";

interface SettingItem {
  id: number;
  key: string;
  value: string | null;
  type: string;
}

interface StaticPage {
  id: number;
  title: string;
}

interface Props {
  settings: SettingItem[];
  locale: string;
  token?: string;
}

const Footer: React.FC<Props> = ({ settings, locale, token }) => {
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const t = useTranslations("footer");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await apiServiceCall({
          method: "get",
          url: "pages/static-pages",
          headers: {
            "Accept-Language": locale,
          },
        });

        if (res?.status) {
          setStaticPages(res.data);
        }
      } catch (error) {
        // silent
      }
    };

    fetchPages();
  }, [locale]);

  // الحصول على اللوجو بناءً على اللغة
  const logoUrl = useMemo(() => {
    const logoKey =  "logo_ar" ;
    const logoSetting = settings.find(s => s.key === logoKey);
    return logoSetting?.value || "/images/default-logo.png"; // صورة افتراضية
  }, [settings, locale]);

  // فلترة وسائل التواصل الاجتماعي التي لها قيم
  const activeSocialMedia = useMemo(() => {
    const socialIconsMap: Record<string, { icon: JSX.Element, type: string }> = {
      social_facebook: { icon: <FaFacebookF />, type: "URL" },
      social_twitter: { icon: <FaXTwitter />, type: "URL" },
      social_instagram: { icon: <FaInstagram />, type: "URL" },
      social_snapchat: { icon: <FaSnapchat />, type: "URL" },
      social_tiktok: { icon: <FaTiktok />, type: "URL" },
      social_whatsapp: { icon: <FaWhatsapp />, type: "URL" },
      social_youtube: { icon: <FaYoutube />, type: "URL" },
      social_linkedin: { icon: <FaLinkedin />, type: "URL" },
    };

    return settings
      .filter(s => s.key.startsWith('social_') && s.value !== null && socialIconsMap[s.key])
      .map(s => ({
        ...s,
        icon: socialIconsMap[s.key].icon
      }));
  }, [settings]);

  // الحصول على نصوص سياسة الخصوصية والشروط إذا كانت متوفرة
  const hasPrivacyPolicy = useMemo(() => 
    settings.some(s => s.key === "privacy_policy" && s.value !== null), 
  [settings]);

  const hasTermsConditions = useMemo(() => 
    settings.some(s => s.key === "terms_conditions" && s.value !== null), 
  [settings]);

  return (
    <footer className="bg-[#f9f9f9] pt-12 pb-8 mt-10">
      <Container>
        {/* ===== Main Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ===== Logo & Description ===== */}
          <div className="lg:col-span-4 space-y-4">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="Footer Logo"
                width={100}
                height={100}
                className="rounded-lg"
                onError={(e) => {
                  // عند فشل تحميل الصورة، استخدم صورة افتراضية
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-logo.png";
                }}
              />
            )}

            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              منصة متخصصة في خدمات السيارات المتنقلة، نوفر غسيل وتلميع وتعقيم
              احترافي أينما كنت لنجعل سيارتك نظيفة ولامعة كأنها جديدة.
            </p>

            {/* <p className="text-xs md:text-sm text-gray-400">
              {t("copyright")}
            </p> */}
          </div>

          {/* ===== Quick Links ===== */}
          <div className="lg:col-span-5">
            <h3 className="text-primary font-bold text-sm md:text-lg mb-4">
              {t("quickLinks")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {[
                  { key: "aboutUs", href: `/${locale}` },
                  { key: "categories", href: `/${locale}` },
                  { key: "events", href: `/${locale}` },
                  { key: "howToOrder", href: `/${locale}` },
                  { key: "support", href: `/${locale}` },
                ].map(({ key, href }) => (
                  <li key={key} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    <Link
                      href={href}
                      className="text-xs md:text-sm hover:text-primary transition"
                    >
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-3">
                {staticPages.map(({ id, title }) => (
                  <li key={id} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    <Link
                      href={`/${locale}/page/${id}`}
                      className="text-xs md:text-sm hover:text-primary transition"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
                
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    <Link 
                      href={`/${locale}/privacy-policy`}
                      className="text-xs md:text-sm hover:text-primary transition"
                    >
                      {t("privacy_policy")}
                    </Link>
                  </li>
                
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    <Link 
                      href={`/${locale}/terms`}
                      className="text-xs md:text-sm hover:text-primary transition"
                    >
                      {t("terms_conditions")}
                    </Link>
                  </li>
                
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  <Link 
                    href={`/${locale}/faq`}
                    className="text-xs md:text-sm hover:text-primary transition"
                  >
                    {t("faq")}
                  </Link>
                </li>
                
                {!token &&
                  ["login", "register"].map((key) => (
                    <li key={key} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      <Link
                        href={`/${locale}/${key === 'login' ? 'auth/login' : 'auth/register'}`}
                        className="text-xs md:text-sm hover:text-primary transition"
                      >
                        {t(key)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* ===== Social & Payments ===== */}
          <div className="lg:col-span-3 space-y-6">
            {activeSocialMedia.length > 0 && (
              <div>
                <h3 className="text-primary font-bold text-sm md:text-lg mb-3">
                  {t("followUs")}
                </h3>

                <div className="flex gap-3 flex-wrap">
                  {activeSocialMedia.map((social) => (
                    <a
                      key={social.id}
                      href={social.value!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white transition"
                      title={social.key.replace('social_', '')}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                 <p className="text-xs md:text-sm mt-5 text-gray-400">
              {t("copyright")}
            </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;