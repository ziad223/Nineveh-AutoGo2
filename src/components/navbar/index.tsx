"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import navUser from "@/public/images/nav-user.png";
import LanguageSelector from "./LanguageSwitcher";
import { CiMenuFries } from "react-icons/ci";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Container from "../shared/container";
import ticket from "@/public/images/ticket.png";
import userr from "@/public/images/login-user.png";
import { FaChevronDown, FaRegUser } from "react-icons/fa6";
import UserDropdown from "./UserDropdown";
import apiServiceCall from "@/lib/apiServiceCall";
import ConfirmWalletModal from "./ConfirmWalletModal";

interface NavbarProps {
  token?: string;
  bank_account: boolean;
  logo: string;
}

const Navbar = ({ token, bank_account, logo }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [name, setName] = useState<string | undefined>("");
  const locale = useLocale();
  const t = useTranslations("navbar");

  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const response = await apiServiceCall({
          method: "get",
          url: "user/profile",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response?.data?.user?.name) {
          setName(response.data.user.name);
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

  const renderUserSection = (isMobile = false) => {
    if (isAuthenticated) {
      return (
        <div className="hidden lg:flex items-center gap-2 relative">
          <Link
            href={`/${locale}/sellYourTicket`}
            className="h-[54px] rounded-[15px] flex items-center justify-center gap-2 text-sm bg-primary text-[#fff] font-bold px-2"
          >
            <Image src={ticket} alt="ticket" className="inline-block mr-2" />
            <span className="text-xs">{t("sellTicket")}</span>
          </Link>

          <div className="relative">
            <button
              className="h-[54px] gap-3 flex items-center justify-center duration-300 transition text-sm rounded-[15px] bg-transparent border border-primary/40 text-primary font-bold px-3"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <Image
                src={userr}
                width={19.5}
                height={25.84}
                alt="user"
                className="inline-block mr-2"
              />
              <div>
                <h4 className="text-[12px] text-[#ADADAD]">{t("welcome")}</h4>
                <h2 className="text-[12px] text-[#080C22]">{name}</h2>
              </div>
              <FaChevronDown className="text-[#B9B9B9]" />
            </button>
            <UserDropdown
              onWalletClick={() => setWalletModalOpen(true)}
              isOpen={dropdownOpen}
              locale={locale}
              token={token}
              onClose={() => setDropdownOpen(false)}
              name={name}
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
          {/* <Image
            src={logo}
            className="!w-[98px] min-h-[40px] lg:min-w-[150px] xl:min-w-[191px]"
            alt="logo"
            width={191.93}
            height={80}
          /> */}
          <span className="text-primary text-2xl">اللوجو</span>
        </Link>

        <div className="flex items-center gap-3 lg:hidden">
          {isAuthenticated ? (
            <>
              <Link
                href={`/${locale}/sellYourTicket`}
                onClick={() => setMenuOpen(false)}
                className="flex rounded-[15px] items-center justify-center gap-1 text-sm bg-primary text-[#fff] font-bold px-2 !py-3"
              >
                <Image src={ticket} alt="ticket" className="inline-block mr-2" />
                <span className="text-[10px] lg:text-lg">{t("sellTicket")}</span>
              </Link>

              <div className="relative">
                <button onClick={handleMobileDropdownToggle}>
                  <Image src={userr} alt="USERR" width={20} height={20} />
                </button>

                {mobileDropdownOpen && (
                  <UserDropdown
                    onWalletClick={() => setWalletModalOpen(true)}
                    isOpen={mobileDropdownOpen}
                    locale={locale}
                    token={token}
                    onClose={() => setMobileDropdownOpen(false)}
                    isMobile={true}
                    name={name}
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
            <Link href={`/${locale}/about-us`} className="text-sm hover:text-primary transition duration-300">
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
