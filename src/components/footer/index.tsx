"use client";

import React, { useEffect, useState } from "react";
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
} from "react-icons/fa6";
import Container from "../shared/container";

import apiServiceCall from "@/lib/apiServiceCall";
import { useTranslations } from "next-intl";

interface SettingItem {
  key: string;
  value: string;
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

  const socialIcons: Record<string, JSX.Element> = {
    facebook: <FaFacebookF />,
    instagram: <FaInstagram />,
    snapchat: <FaSnapchat />,
    whatsapp: <FaWhatsapp />,
    twitter: <FaXTwitter />,
    youtube: <FaYoutube />,
    linkedin: <FaLinkedin />,
  };

  return (
    <footer className="bg-[#f9f9f9] pt-12 pb-8 mt-10">
      <Container>
        {/* ===== Main Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ===== Logo & Description ===== */}
          <div className="lg:col-span-4 space-y-4">
            <Image
              src="/images/hero-2.webp"
              alt="Footer Logo"
              width={210}
              height={90}
              className="rounded-lg"
            />

            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              منصة متخصصة في خدمات السيارات المتنقلة، نوفر غسيل وتلميع وتعقيم
              احترافي أينما كنت لنجعل سيارتك نظيفة ولامعة كأنها جديدة.
            </p>

            <p className="text-xs md:text-sm text-gray-400">
              {t("copyright")}
            </p>
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
                      href={`/${locale}`}
                      className="text-xs md:text-sm hover:text-primary transition"
                    >
                      {title}
                    </Link>
                  </li>
                ))}

                {!token &&
                  ["login", "register"].map((key) => (
                    <li key={key} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      <Link
                        href={`/${locale}`}
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
            <div>
              <h3 className="text-primary font-bold text-sm md:text-lg mb-3">
                {t("followUs")}
              </h3>

              <div className="flex gap-3 flex-wrap">
                {settings
                  .filter(
                    (s) => s.type === "contacts" && socialIcons[s.key]
                  )
                  .map((s) => {
                    const link =
                      s.key === "whatsapp"
                        ? `https://wa.me/${s.value}`
                        : s.value;

                    return (
                      <a
                        key={s.key}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white transition"
                      >
                        {socialIcons[s.key]}
                      </a>
                    );
                  })}
              </div>
            </div>

          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
