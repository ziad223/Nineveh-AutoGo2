// app/[locale]/service/[id]/page.tsx
import Image from "next/image";
import Container from "../../../../src/components/shared/container";
import { getSingleService } from "../../../../src/lib/serverActions";
import { getTranslations } from 'next-intl/server';
import { FaPhone, FaWhatsapp } from "react-icons/fa6";
interface ServiceResponse {
  id: number;
  category: { id: number; name: string };
  title: string;
  content: string;
  price: string;
  phone: string;
  features: string[];
  gallery: string[];
}

interface Props {
  params: { id: string; locale?: string };
  searchParams?: { lang?: string };
}



export default async function ServiceDetailsPage({
  params,
  searchParams,
}: Props) {
  const lang = searchParams?.lang || "ar";
  const t = await getTranslations('serviceDetails')
  const response: { data: ServiceResponse } =
    await getSingleService(lang, params.id);

  const service = response.data;
 console.log('qqqqqqq' , service)

  const coverImage =
    service.gallery?.[0] || "/images/hero-1.webp";

  return (
    <div className="w-full mb-10">
      {/* Hero Section */}
      <Container>
        <section className="relative rounded-xl w-full h-[60vh] mt-7 text-white flex items-center overflow-hidden">
          <Image
            src={coverImage}
            alt={service.title}
            fill
            className="object-cover rounded-[20px]"
          />

          <div className="absolute inset-0 bg-black/40 rounded-[20px]" />

          <div className="relative mx-auto text-center px-6 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {service.title}
            </h1>

            <div
              className="text-white/90 text-lg"
              dangerouslySetInnerHTML={{
                __html: service.content || "",
              }}
            />
          </div>
        </section>
      </Container>

      {/* Service Details */}
      <Container>
        <section className="py-16 bg-white">
          <div className="grid md:grid-cols-2 gap-10 items-start">
           <div className="flex flex-col h-full justify-between">
  {/* محتوى الخدمة */}
  <div>
    <h2 className="text-3xl font-bold mb-4">{t("aboutService")}</h2>

    <div
      className="text-gray-600 leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: service.content || "",
      }}
    />

    {service.features?.length > 0 && (
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">{t("features")}</h3>
        <ul className="space-y-3">
          {service.features.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-gray-700"
            >
              <span className="w-3 h-3 rounded-full bg-primary mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>

  <div className="mt-6 flex flex-col sm:flex-row gap-4">
    <a
      href={`https://wa.me/${service.phone.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition hover:scale-105"
    >
      <FaWhatsapp className="text-2xl" />
  <span className="text-sm">{t("contactWhatsapp")}</span>
    </a>

    <a
      href={`tel:${service.phone.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition hover:scale-105"
    >
      <FaPhone className="text-2xl" />
  <span className="text-sm">{t("contactPhone")}</span>
    </a>
  </div>
</div>


            <div className="relative h-[350px] rounded-2xl overflow-hidden shadow-md">
              <Image
                src={coverImage}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </Container>

      {/* <HowOrder steps={steps} /> */}

     
    </div>
  );
}
