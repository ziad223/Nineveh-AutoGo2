// import { Inter } from "next/font/google";
// import { headers } from "next/headers";
import { ToastContainer } from "react-toastify";
// import Footer from "@/components/shared/Footer";
import { NextIntlClientProvider } from "next-intl";
import Providers from "@/providers/providers";
import { notFound } from "next/navigation";
import { locales } from "../../navigation";
import { cookies } from "next/headers";
import React from "react";

import { getProfile } from "@/lib/serverActions";
import "react-photo-view/dist/react-photo-view.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getSettingsData } from "@/lib/serverActions";

// import 'leaflet/dist/leaflet.css';
// import Navbar from "@/components/shared/Navbar";

// const inter = Inter({
//   subsets: ["latin"],
//   display: 'swap',
//   preload: true
// });

// export const metadata: Metadata = {
//   title: "Real Estate",
//   description: "Your premier destination for real estate",
// };

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

  console.log("currentLocale", currentLocale);

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
  const settings = settingsData?.data || [];

  console.log(settings, "new wwsetting");
  const cookieStore = cookies();
  const userDataRaw = cookieStore.get("userDataInfo")?.value;
  const token = cookieStore.get("token")?.value;
const logo = settings.find((item) => item.key === "logo")?.value;

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
            logo = {logo}
          />
          {/* <WhatsApp locale={currentLocale}/> */}
          <div className="  ">{children}</div>
          <Footer settings={settings} locale={currentLocale} token={token} />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
