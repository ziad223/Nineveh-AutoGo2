import React from "react";
import Image from "next/image";
import { getMyServices } from "../../../src/lib/serverActions";
import { getTranslations } from "next-intl/server";
import ServicesActions from "./ServicesActions";
import { FaWhatsapp } from "react-icons/fa";
import { cookies } from "next/headers";
import Link from "next/link";
import { Plus } from "lucide-react";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

const page = async ({ params }: LayoutProps) => {
  const { locale } = await params;
  const t = await getTranslations("services");
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const servicesResponse = await getMyServices(locale);
  const services = servicesResponse?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* العنوان وزر الإضافة - justify-between */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* العنوان على اليسار */}
        <h1 className="text-2xl font-bold text-center sm:text-left">
          {t("publishedServices")}
        </h1>

        <Link
          href={`/${locale}/sell-your-service`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md self-center"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm sm:text-base">
            {t("addNewService")}
          </span>
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-center text-gray-500">
          {t("noServices")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5 space-y-3">
                <span className="text-xs bg-yellow-100 text-primary px-3 py-1 rounded-full">
                  {service.category}
                </span>

                <h2 className="text-lg font-semibold">
                  {service.title}
                </h2>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {service.content}
                </p>

                {/* الميزات */}
                {service.feature_preview && service.feature_preview.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-gray-600 text-sm">
                    {service.feature_preview.map((feature: string, idx: number) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                )}

                <div className="text-primary font-bold">
                  {service.price} {t("currency")}
                </div>

                <div className="text-sm text-gray-600 space-y-1 pt-2 border-t">
                  {/* رقم التليفون */}
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{service.phone || "لا يوجد"}</span>
                  </div>

                  {/* رقم الموبايل */}
                  <div className="flex items-center gap-1">
                    <FaWhatsapp />
                    <span>{service.mobile || "لا يوجد"}</span>
                  </div>
                </div>

                {/* Actions */}
                <ServicesActions service={service} token={token} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;