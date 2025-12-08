"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = params?.locale || "en"; // Default to Arabic if no locale found

  useEffect(() => {
    // Log the error to your error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">
          {locale === "ar" ? "حدث خطأ" : "Something went wrong"}
        </h1>
        <p className="text-gray-600">
          {locale === "ar"
            ? "عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى"
            : "Sorry, an error occurred. Please try again."}
        </p>
        <div className="space-x-4 rtl:space-x-reverse">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {locale === "ar" ? "حاول مرة أخرى" : "Try again"}
          </button>
          <Link
            // href={`/${locale}`}
            href="/"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition inline-block"
          >
            {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
