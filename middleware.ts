import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'ar',
});

// List of fully public static routes
const staticPublicRoutes = [
  '/', '/ar', '/en',
  '/ar/login', '/en/login',
  '/ar/register', '/en/register',
  '/ar/about', '/en/about',
];

// Regex patterns for dynamic public routes
const dynamicPublicPatterns = [
  /^\/(ar|en)\/pages\/[^/]+$/,         
  /^\/(ar|en)\/services\/[^/]+$/,      
  /^\/(ar|en)\/investment-opportunities\/[^/]+$/,      
  /^\/(ar|en)\/blog\/[^/]+$/,          
  /^\/(ar|en)\/contact$/,              
];

const protectedRoutes = [
  /^\/(ar|en)\/orders/,
  /^\/(ar|en)\/wallet/,
  /^\/(ar|en)\/my-tickets/,
  /^\/(ar|en)\/edit-data/,
  /^\/(ar|en)\/notifications/,
  /^\/(ar|en)\/orders/,
  /^\/(ar|en)\/sales/,
  /^\/(ar|en)\/reports/,

];

const isPublicPath = (pathname: string): boolean => {
  return (
    staticPublicRoutes.includes(pathname) ||
    dynamicPublicPatterns.some((pattern) => pattern.test(pathname))
  );
};

const isProtectedPath = (pathname: string): boolean => {
  return protectedRoutes.some((pattern) => pattern.test(pathname));
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const intlResponse = intlMiddleware(request);

  const isStaticAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/icons');

  if (isStaticAsset || isPublicPath(pathname)) {
    return intlResponse;
  }

  const token = request.cookies.get('token')?.value;

  if (isProtectedPath(pathname) && !token) {
    const locale = pathname.split('/')[1] || 'ar';
    const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search); 
    return NextResponse.redirect(
      new URL(`/${locale}/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return intlResponse;
}

// Apply middleware to all localized routes
export const config = {
  matcher: ['/', '/(ar|en)/:path*'],
};
