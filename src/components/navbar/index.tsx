"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import navUser from "@/public/images/nav-user.png";
import LanguageSelector from "./LanguageSwitcher";
import { CiMenuFries } from "react-icons/ci";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Container from "../shared/container";
import ticket from "@/public/images/ticket.png";
import { FaChevronDown, FaRegUser } from "react-icons/fa6";
import UserDropdown from "./UserDropdown";
import apiServiceCall from "@/lib/apiServiceCall";
import ConfirmWalletModal from "./ConfirmWalletModal";

interface NavbarProps {
  token?: string;
  bank_account: boolean;
  logo: string;
  role : string;
  notificationsUnReadCount : string;
}

const Navbar = ({ token,  logo , role , notificationsUnReadCount }: NavbarProps) => {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [name, setName] = useState<string | undefined>("");
const [profileImage, setProfileImage] = useState<string>("");
  const locale = useLocale();
  const t = useTranslations("navbar");

  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const response = await apiServiceCall({
          method: "GET",
          url: "auth/me",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response?.data?.user?.name) {
          setName(response?.data?.user?.name);
          setProfileImage(response?.data?.user?.profile_image_url);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    if (menuOpen && mobileDropdownOpen) {
      setMobileDropdownOpen(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (mobileDropdownOpen && menuOpen) {
      setMenuOpen(false);
    }
  }, [mobileDropdownOpen]);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleMobileDropdownToggle = useCallback(() => {
    setMobileDropdownOpen((prev) => !prev);
  }, []);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
  if (!logo) return;

  let link: HTMLLinkElement | null =
    document.querySelector("link[rel~='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = logo;
}, [logo]);


  const renderUserSection = (isMobile = false) => {
    if (isAuthenticated) {
      return (
        <div className="hidden lg:flex items-center gap-2 relative">
          {role === 'company' && 
           <Link
            href={`/${locale}/sell-your-service`}
            className="h-[54px] rounded-[15px] flex items-center justify-center gap-2 text-sm bg-primary text-[#fff] font-bold px-2"
          >
            <Image src={ticket} alt="ticket" className="md:inline-block hidden mr-2  " />
            <span className="text-xs">{t("sellTicket")}</span>
          </Link>
            }
         

          <div className="relative">
            <button
              className="h-[54px] gap-3 flex items-center justify-center duration-300 transition text-sm rounded-[15px] bg-transparent border border-primary/40 text-primary font-bold px-3"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <Image
          src={profileImage || navUser}
                width={25}
                height={25.84}
                alt="user"
                className="inline-block mr-2 max-w-[40px] max-h-[40px]"
              />
              <div>
                <h4 className="text-[12px] text-[#ADADAD]">{t("welcome")}</h4>
                <h2 className="text-[12px] text-[#080C22]">{name}</h2>
              </div>
              <FaChevronDown className="text-[#B9B9B9]" />
            </button>
              

            <UserDropdown
            notificationsUnReadCount = {notificationsUnReadCount}
              onWalletClick={() => setWalletModalOpen(true)}
              isOpen={dropdownOpen}
              locale={locale}
              token={token}
              onClose={() => setDropdownOpen(false)}
              name={name}
              role = {role}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href={`/${locale}/register`}
            className="h-[54px] flex items-center justify-center hover:bg-primary hover:text-white duration-300 transition text-sm rounded-[15px] bg-transparent border border-primary text-primary font-bold px-5"
          >
            {t("newAccount")}
          </Link>
          <Link
            href={`/${locale}/login`}
            className="h-[54px] rounded-[15px] flex items-center justify-center gap-2 text-sm bg-primary text-foreground font-bold px-5"
          >
            <FaRegUser />
            {t("login")}
          </Link>
        </div>
      );
    }
  };

  return (
    <Container>
      <div className="h-[82px] lg:h-[120px] rounded-[18px] mt-4 lg:mt-8 custom-shadow flex items-center justify-between px-4 relative">
        <Link href={`/${locale}`} onClick={() => setMenuOpen(false)}>
          <Image
            src={logo}
            className=" h-[50px] w-[50px] lg:min-h-[80px] lg:min-w-[80px] "
            alt="logo"
            width={80}
            height={80}
          />
        </Link>

        <div className="flex items-center gap-3 lg:hidden">
          {isAuthenticated ? (
            <>
              {role === 'company' && 
              <Link
                href={`/${locale}/sell-your-service`}
                onClick={() => setMenuOpen(false)}
                className="flex rounded-[15px] items-center justify-center gap-1 text-sm bg-primary text-[#fff] font-bold px-2 !py-3"
              >
                <Image src={ticket} alt="ticket" className="md:inline-block hidden mr-2" />
                <span className="text-[10px] lg:text-lg">{t("sellTicket")}</span>
              </Link>
               }

              <div className="relative">
                <button onClick={handleMobileDropdownToggle}>
                  <Image src={profileImage} alt="profileImage" width={20} height={20} className="min-w-[30px] min-h-[30px]" />
                </button>

                {mobileDropdownOpen && (
                  <UserDropdown
                  notificationsUnReadCount = {notificationsUnReadCount}
                    onWalletClick={() => setWalletModalOpen(true)}
                    isOpen={mobileDropdownOpen}
                    locale={locale}
                    token={token}
                    onClose={() => setMobileDropdownOpen(false)}
                    isMobile={true}
                    name={name}
                    role = {role}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href={`/${locale}/login`}
                className="h-[40px] flex items-center justify-center text-sm bg-primary text-[#fff] font-bold px-5 rounded-[15px]"
              >
                {t("login")}
              </Link>
            </div>
          )}

          <button
            onClick={handleMenuToggle}
            className="text-3xl text-primary focus:outline-none"
          >
            <CiMenuFries size={24} />
          </button>
        </div>

        <ul className="hidden lg:flex items-center gap-6 text-sm text-[#000]">
          <li>
            <Link href={`/${locale}`} className="text-sm hover:text-primary transition duration-300">
              {t("home")}
            </Link>
          </li>
           <li>
            <Link href={`/${locale}/about-us`} className="text-sm hover:text-primary transition duration-300">
              {t("aboutUs")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/categories`} className="text-sm hover:text-primary transition duration-300">
              {t("categories")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/latest-events`} className="text-sm hover:text-primary transition duration-300">
              {t("latestEvents")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/how-order`} className="text-sm hover:text-primary transition duration-300">
              {t("howToOrder")}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/technical-support`} className="text-sm hover:text-primary transition duration-300">
              {t("support")}
            </Link>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-5">
          {renderUserSection()}
          <LanguageSelector />
        </div>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md p-4 w-full flex flex-col gap-4 z-50 lg:hidden"
          >
            <ul className="flex flex-col gap-3 text-sm text-[#000]">
              <li>
                <Link href={`/${locale}/about-us`} onClick={() => setMenuOpen(false)}>
                  {t("home")}
                </Link>
              </li>
               <li>
                <Link href={`/${locale}/about-us`} onClick={() => setMenuOpen(false)}>
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories`} onClick={() => setMenuOpen(false)}>
                  {t("categories")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/latest-events`} onClick={() => setMenuOpen(false)}>
                  {t("latestEvents")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/how-order`} onClick={() => setMenuOpen(false)}>
                  {t("howToOrder")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/technical-support`}
                  onClick={() => setMenuOpen(false)}
                >
                  {t("support")}
                </Link>
              </li>

              {!isAuthenticated && (
                <div className="flex flex-col gap-3">
                  <Link
                    href={`/${locale}/register`}
                    onClick={() => setMenuOpen(false)}
                    className="h-[54px] flex items-center justify-center hover:bg-primary hover:text-white duration-300 transition text-sm rounded-[15px] bg-transparent border border-primary text-primary font-bold px-5"
                  >
                    {t("newAccount")}
                  </Link>
                  <Link
                    href={`/${locale}`}
                    onClick={() => setMenuOpen(false)}
                    className="h-[54px] rounded-[15px] flex items-center justify-center gap-2 text-sm bg-primary text-[#fff] font-bold px-5"
                  >
                    <Image src={navUser} alt="user" className="inline-block mr-2" />
                    {t("login")}
                  </Link>
                </div>
              )}
            </ul>

            <div className="flex justify-center">
              <LanguageSelector />
            </div>
          </div>
        )}
      </div>

      {showWalletModal && <ConfirmWalletModal onClose={() => setShowWalletModal(false)} />}
      {walletModalOpen && <ConfirmWalletModal onClose={() => setWalletModalOpen(false)} />}
    </Container>
  );
};

export default Navbar;
