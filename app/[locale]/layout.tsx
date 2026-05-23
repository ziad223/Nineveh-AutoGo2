import { ToastContainer } from "react-toastify";
import { NextIntlClientProvider } from "next-intl";
import Providers from "@/providers/providers";
import { notFound } from "next/navigation";
import { locales } from "../../navigation";
import { cookies } from "next/headers";
import React from "react";

import "react-photo-view/dist/react-photo-view.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getSettingsData } from "@/lib/serverActions";
import { getNotificaionsCount } from "../../src/lib/serverActions";


export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string | any }>;
}) {
  const resolvedParams = await (params instanceof Promise
    ? params
    : Promise.resolve(params));
  const { locale: currentLocale } = resolvedParams;


  if (!locales.includes(currentLocale as any)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${currentLocale}.json`)).default;
  } catch (error) {
    notFound();
  }

  let profileData;
  // if(token){
  //   profileData = await getProfile(currentLocale)
  // }

  const settingsData = await getSettingsData(currentLocale);
  const notificationsResponse = await getNotificaionsCount(currentLocale);
  const notificationsUnReadCount = notificationsResponse?.data?.unread_count
  const settings = settingsData?.data || [];

  const cookieStore = cookies();
  const userDataString = cookieStore.get("userDataInfo")?.value;
  const userData = userDataString
    ? JSON.parse(userDataString)
    : null;
  const role = userData?.client_type
  const token = cookieStore.get("token")?.value;
  const isAr = currentLocale === "ar";

  const logoAr = settings.find((item) => item.key === "logo_ar")?.value;
  const logoEn = settings.find((item) => item.key === "logo_en")?.value;

  const logo = isAr
    ? logoAr || logoEn
    : logoEn || logoAr;
  return (
    <NextIntlClientProvider
      locale={currentLocale || "en"}
      messages={messages}
      timeZone="Asia/Dubai"
    >
      <ToastContainer position="bottom-right" />
      <Providers locale={currentLocale || "en"}>
        <div
          dir={currentLocale === "ar" ? "rtl" : "ltr"}
          lang={currentLocale}
          className="min-h-screen overflow-hidden bg-white"
        >
          <Navbar
            bank_account={settings?.find((item: any) => item.key === "bankAccount")}
            token={token}
            logo={logo}
            role={role}
            notificationsUnReadCount={notificationsUnReadCount}
          />
          {/* <WhatsApp locale={currentLocale}/> */}
          <div className="  ">{children}</div>
          <Footer settings={settings} locale={currentLocale} token={token} />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
