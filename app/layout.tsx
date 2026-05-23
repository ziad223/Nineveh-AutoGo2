import type { Metadata } from "next";
import localFont from "next/font/local";

import "../src/globals.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import 'aos/dist/aos.css';

// const montserratArabic = localFont({
//   src: "../public/assets/fonts/Montserrat-Arabic-Regular.ttf",
//   display: "swap",
// });

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isAr = params.locale === "ar";
   
  return {
    title: isAr
      ? "نينوى | منصة خدمات سيارات متنقلة"
      : "Nineveh |  Car Services Platform",

    description: isAr
      ? "نينوى منصة متكاملة لتقديم خدمات السيارات المتنقلة بسهولة وسرعة"
      : "Nineveh is a comprehensive platform for mobile car services",
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // الحصول على الـ locale من params مباشرة
  const { locale: currentLocale } = params;
  const isAr = currentLocale === "ar";

  return (
    <html
      lang={currentLocale}
      dir={currentLocale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <title>{isAr ? "منصة خدمات سيارات متنقلة" : "Mobile Car Services Platform"}</title>
      </head>
      <body
        className={`min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}