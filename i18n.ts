import {getRequestConfig} from 'next-intl/server';
import { routing } from './routing';

 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

// import {notFound} from 'next/navigation';
// import {getRequestConfig} from 'next-intl/server';

// export const locales = ['en', 'ar'] as const;
// export const defaultLocale = 'ar' as const;

// export default getRequestConfig(async (param) => {
//   const locale = await param?.locale;

//   // Validate that the incoming `locale` parameter is valid
//   if (!locales.includes(locale as any)) notFound();

//   return {
//     locale,
//     messages: (await import(`./messages/${locale}.json`)).default,
//     timeZone: 'Asia/Dubai'
//   };
// });
