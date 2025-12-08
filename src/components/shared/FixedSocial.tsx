"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import MainLink from "./main-link";
import React, { useEffect, useState } from "react";
import { log } from "console";

interface Settings {
  twitter: {
    value: string;
  };
  whatsapp: {
    value: string;
  };
  tiktok: {
    value: string;
  };
  snapchat: {
    value: string;
  };
  instagram: {
    value: string;
  };
}
function FixedSocial(params: any) {
  const [res, setRes] = useState<Settings | null>(null);
  let whatsappLink = "https://wa.me/+966";
  async function getData() {
    try {
      const res = await fetch("https://era.almasader.net/api/home", {
        headers: {
          "Accept-Language": "ar",
        },
      });
      const data = await res.json();
      setRes(data.data.settings);
    } catch (e) {
      // console.log("error", e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const myObject = {};

  for (let i = 0; i < params?.data?.socials?.length; i++) {
    /* @ts-ignore */
    myObject[params?.data?.socials[i]?.key] = params?.data?.socials[i]?.value;
  }

  return (
    <div className="fixed top-[40%] left-0 flex flex-col flex-wrap gap-4 px-2 py-3 md:px-3 md:py-5 rounded-r-2xl shadow-2xl bg-white z-[1000]">
      <a
        className="border border-primary rounded-full p-2 w-[30px] h-[30px] flex items-center justify-center group hover:bg-primary duration-300"
        /* @ts-ignore */
        href={whatsappLink + res?.whatsapp.value}
        target="_blank"
      >
        <Icon
          icon="basil:whatsapp-outline"
          className="text-primary group-hover:text-white duration-300"
        />
      </a>
      <a
        className="border border-primary rounded-full p-2 w-[30px] h-[30px] flex items-center justify-center group hover:bg-primary duration-300"
        /* @ts-ignore */
        href={res?.snapchat.value}
        target="_blank"
      >
        <Icon
          icon="ic:outline-snapchat"
          className="text-primary group-hover:text-white duration-300"
        />
      </a>
      {/* <MainLink
        className="border border-primary rounded-full p-2 w-[30px] h-[30px] flex items-center justify-center"
        
        href="/"
      >
        <Icon icon="hugeicons:instagram" className="text-primary group-hover:text-white duration-300" />
      </MainLink> */}
      <a
        className="border border-primary rounded-full p-2 w-[30px] h-[30px] flex items-center justify-center group hover:bg-primary duration-300"
        /* @ts-ignore */
        href={res?.twitter.value}
        target="_blank"
      >
        <Icon
          icon="pajamas:twitter"
          className="text-primary group-hover:text-white duration-300"
        />
      </a>
      <a
        className="border border-primary rounded-full p-2 w-[30px] h-[30px] flex items-center justify-center group hover:bg-primary duration-300"
        /* @ts-ignore */
        href={res?.tiktok.value}
        target="_blank"
      >
        <Icon
          icon="ph:tiktok-logo"
          className="text-primary group-hover:text-white duration-300"
        />
      </a>
    </div>
  );
}

export default FixedSocial;
