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
    title: {
      default: isAr
        ? "نينوى | منصة خدمات سيارات متنقلة"
        : "Nineveh | Car Services Platform",
      template: isAr ? "%s | نينوى" : "%s | Nineveh",
    },
    description: isAr
      ? "نينوى منصة متكاملة لتقديم خدمات السيارات المتنقلة بسهولة وسرعة في الإمارات. نوفر خدمات غسيل سيارات، صيانة، وتلميع أينما كنت."
      : "Nineveh is a comprehensive platform for mobile car services in the UAE. We provide car wash, maintenance, and detailing services wherever you are.",
    keywords: isAr 
      ? "نينوى, غسيل سيارات متنقل, صيانة سيارات, تلميع سيارات, خدمات سيارات الامارات, Nineveh, AutoGo" 
      : "Nineveh, Mobile car wash, car maintenance, car detailing, UAE car services, AutoGo",
    authors: [{ name: "Nineveh AutoGo" }],
    creator: "Nineveh AutoGo",
    publisher: "Nineveh AutoGo",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://ninevehautogo.com"),
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/en",
        "ar-AE": "/ar",
      },
    },
    openGraph: {
      title: isAr
        ? "نينوى | منصة خدمات سيارات متنقلة"
        : "Nineveh | Car Services Platform",
      description: isAr
        ? "نينوى منصة متكاملة لتقديم خدمات السيارات المتنقلة بسهولة وسرعة"
        : "Nineveh is a comprehensive platform for mobile car services",
      url: "https://ninevehautogo.com",
      siteName: "Nineveh AutoGo",
      locale: isAr ? "ar_AE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isAr
        ? "نينوى | منصة خدمات سيارات متنقلة"
        : "Nineveh | Car Services Platform",
      description: isAr
        ? "نينوى منصة متكاملة لتقديم خدمات السيارات المتنقلة بسهولة وسرعة"
        : "Nineveh is a comprehensive platform for mobile car services",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "-uRAJRVde8Ojd1vjq5SKDtx8q66xb4lezHxnhj9DCl8",
    },
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
      <body
        className={`min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}