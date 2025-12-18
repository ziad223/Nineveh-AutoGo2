import React from "react";
import Image from "next/image";
import { getMyServices } from "../../../src/lib/serverActions";
import { getTranslations } from "next-intl/server";
import ServicesActions from "./ServicesActions";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

const page = async ({ params }: LayoutProps) => {
  const { locale } = await params;
  const t = await getTranslations("services");

  const servicesResponse = await getMyServices(locale);
  const services = servicesResponse?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 text-center">
        {t("publishedServices")}
      </h1>

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

                <div className="text-primary font-bold">
                  {service.price} {t("currency")}
                </div>

                {/* Actions */}
                <ServicesActions service={service} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
