"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

import { redirect } from "next/navigation";
import Link from "next/link";

interface SearchModalProps {
  lang: string;
  isOpen: boolean;
  onClose: () => void;
}

function SearchModal({ lang, onClose }: SearchModalProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [searchType, setSearchType] = useState("stores");

  const handelSearch = () => {
    onClose();
    redirect(`/${lang}/latest-events?keyword=${ref.current?.value}`);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-[#A5978A]">
            {/* Use Icon component as a safer alternative to Image with SVG */}
            <Image
              src={"/images/search.svg"}
              alt="Login"
              width={100}
              height={100}
            />
          </div>

          <h3 className="text-2xl font-bold text-center mb-2 text-[#EB2302]">
            {lang === "en" ? "Search" : "البحث"}
          </h3>

          <input
            type="text"
            placeholder={
              lang === "en" ? "Search for events." : "ابحث عن الفاعليات"
            }
            className="text-sm text-center text-gray-600 mb-6 w-full border border-gray-300 outline-none rounded-full p-2"
            ref={ref}
          />

          <div className="flex gap-4 w-full">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 py-2 px-4  text-[#A5978A] rounded-full hover:bg-gray-100 transition-colors"
            >
              {lang === "en" ? "Cancel" : "إلغاء"}
            </button>

            <button
              type="button"
              onClick={() => handelSearch()}
              className="flex-1 py-2 px-4 bg-[#EB2302] flex items-center justify-center gap-2 text-white rounded-full hover:bg-[#EB2302]/80 transition-colors"
            >
              {lang === "en" ? "search" : "بحث"}
            </button>
          </div>

          <Link href={`/${lang}/latest-events`} onClick={() => onClose()} className="text-center bg-[#EB2302] mt-3 py-2 px-4 rounded-full text-white w-full">
            {lang === "en" ? "All Events" : "كل الفاعليات"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
