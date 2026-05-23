import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export const errorsHandling = (
  error: { data: any; status: number } | any,
  lang: string,
  client?: boolean
) => {

  const path =
    typeof window !== "undefined"
      ? window.location.pathname
      : "/";

  // 🚫 لو الصفحة الرئيسية → لا تعيد التوجيه نهائيًا
  if (path === `/${lang}` || path === `/${lang}/`) {
    console.warn("Prevented redirect loop on home page");
    return; // تجاهل الـ error
  }

  // -------------------------
  // 401 → redirect للصفحة الرئيسية
  // -------------------------
  if (error.status === 401) {
    if (client) {
      window.location.href = `/${lang}`;
    } else {
      // redirect(`/${lang}`);
    }
    return;
  }

  // -------------------------
  // رسائل login first
  // -------------------------
  if (client) {
    if (
      error.message === "الرجاء تسجيل الدخول أولاً" ||
      error.message === "please login first"
    ) {
      window.location.href = `/${lang}`;
    } else {
      toast.error(error?.message || error?.data?.message);
    }
  } else {
    throw error;
  }
};
