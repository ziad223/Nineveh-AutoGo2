import type { Metadata } from "next";
import localFont from "next/font/local";

import "../src/globals.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import 'aos/dist/aos.css' 
import { headers } from "next/headers";
import { routing } from "../routing";
// import Footer from "@/components/shared/Footer";

// const montserratArabic = localFont({
//   src: "../public/assets/fonts/Montserrat-Arabic-Regular.ttf",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Real Estate",
//   description: "Your premier destination for real estate",
// };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current locale from headers
  const headersList = await headers();
  const currentLocale =
    headersList.get("x-next-intl-locale") || routing.defaultLocale;

  return (
    <html
      lang={currentLocale}
      dir={currentLocale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <title> منصة خدمات سيارات متنقلة</title>
      </head>
      <body
        className={`min-h-screen `}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
