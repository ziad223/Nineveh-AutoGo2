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
import pay1 from "@/public/images/pay-1.png";
import pay2 from "@/public/images/pay-2.png";
import pay3 from "@/public/images/pay-3.png";
import pay4 from "@/public/images/pay-4.png";
import pay5 from "@/public/images/pay-5.png";
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

        if (res.status) {
          setStaticPages(res.data);
        }
      } catch (error) {
        // console.error("Failed to fetch static pages:", error);
      }
    };

    fetchPages();
  }, []);

  const getValue = (key: string) =>
    settings.find((s) => s.key === key)?.value || "";

  const socialKeys: { [key: string]: JSX.Element } = {
    facebook: <FaFacebookF />,
    instagram: <FaInstagram />,
    snapchat: <FaSnapchat />,
    whatsapp: <FaWhatsapp />,
    twitter: <FaXTwitter />,
    youtube: <FaYoutube />,
    linkedin: <FaLinkedin />,
  };

  return (
    <div className="bg-[#f9f9f9] py-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <Image
              src='/images/hero-2.webp'
              alt="footer logo"
              className="rounded-lg"
              width={209}
              height={87}
            />
           <p className="md:text-sm text-xs font-medium lg:mt-4 mt-1">
  منصة متخصصة في خدمات السيارات المتنقلة، نوفر غسيل وتلميع وتعقيم احترافي أينما كنت 
  لنجعل سيارتك نظيفة ولامعة كأنها جديدة.
</p>

            <h4 className="lg:mt-4 mt-1 md:text-sm text-xs font-medium text-[#8B8B8B]">
              {t("copyright")}
            </h4>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-primary font-bold lg:text-lg text-sm mb-3 mt-5 lg:mt-0">
              {t("quickLinks")}
            </h2>
            <div className="flex flex-wrap md:flex-nowrap md:flex-row">
              <ul className="flex flex-col gap-3 flex-1">
                {[
                  { key: "aboutUs", href: `/${locale}` },
                  { key: "categories", href: `/${locale}` },
                  { key: "events", href: `/${locale}` },
                  { key: "howToOrder", href: `/${locale}` },
                  { key: "support", href: `/${locale}` },
                ].map(({ key, href }) => (
                  <li key={key} className="flex items-center gap-3">
                    <div className="w-[14px] h-[14px] bg-[#D9D9D9] rounded-full"></div>
                    <Link
                      href={href}
                      className="hover:text-primary text-xs md:text-lg transition"
                    >
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="flex flex-col gap-3 flex-1">
                {staticPages.map(({ id, title }) => (
                  <li key={id} className="flex items-center gap-3">
                    <div className="w-[14px] h-[14px] bg-[#D9D9D9] rounded-full"></div>
                    <Link
                    href={`/${locale}`}
                      className="hover:text-primary transition text-xs md:text-lg"
                    >
                      {title}
                    </Link>
                  </li>
                ))}

                {!token &&
                  [
                    { key: "login", href: `/${locale}` },
                    { key: "register", href: `/${locale}` },
                  ].map(({ key, href }) => (
                    <li key={key} className="flex items-center gap-3">
                      <div className="w-[14px] h-[14px] bg-[#D9D9D9] rounded-full"></div>
                      <Link
                        href={href}
                        className="hover:text-primary transition text-xs md:text-lg"
                      >
                        {t(key)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-primary font-bold lg:text-lg text-sm mb-3 mt-5 lg:mt-0">
              {t("followUs")}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              {settings
                .filter((s) => s.type === "contacts" && socialKeys[s.key])
                .map((s) => {
                  const finalLink =
                    s.key === "whatsapp" ? `https://wa.me/${s.value}` : s.value;
                  return (
                    <a
                      key={s.key}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[38px] h-[38px] cursor-pointer rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white duration-300"
                    >
                      {socialKeys[s.key]}
                    </a>
                  );
                })}
            </div>

            <h2 className="text-primary font-bold lg:text-lg text-sm mb-3 mt-5">
              {t("paymentMethods")}
            </h2>
            <div className="flex items-center gap-3">
              <Image src={pay1} alt="pay1" />
              <Image src={pay2} alt="pay2" />
              <Image src={pay3} alt="pay3" />
              <Image src={pay4} alt="pay4" />
              <Image src={pay5} alt="pay5" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
