"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";
import close from "@/public/images/close.png";
import tickrtSelled from "@/public/images/ticket-selled.png";

export default function PaymentStatusModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("PaymentStatusModal");
  const paymentStatus = searchParams.get("payment");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (paymentStatus === "failed" || paymentStatus === "success") {
      setShowModal(true);
    }
  }, [paymentStatus, pathname]);

  const handleClose = () => {
    setShowModal(false);

    router.replace(pathname);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full relative">
         <div className="absolute right-5 top-4 cursor-pointer" onClick={handleClose}>
                      <Image
                        src={close}
                        alt="close"
                       
                      />
                    </div>
                     <Image
                src={tickrtSelled}
                alt="tickrtSelled"
                className="mx-auto"
              />
        <h2 className="text-lg text-[#eb2302] font-bold mb-4">
          {paymentStatus === "success" ? t("successTitle") : t("title")}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {paymentStatus === "success"
            ? t("successDescription")
            : t("description")}
        </p>
        <button
          onClick={handleClose}
          className="bg-[#eb2302] text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          {t("ok")}
        </button>
      </div>
    </div>
  );
}
