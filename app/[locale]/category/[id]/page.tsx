// app/categories/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import Container from "../../../../src/components/shared/container";
import { getSingleCategory } from "../../../../src/lib/serverActions";

interface Service {
  id: number;
  category: string;
  title: string;
  content: string;
  price: string;
  phone: string;
  feature_preview: string[];
  image: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface CategoryResponse {
  category: Category;
  services: Service[];
}

interface Props {
  params: { id: string };
  searchParams?: { lang?: string };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const lang = searchParams?.lang || "ar";
  const respone: CategoryResponse = await getSingleCategory(lang, params.id);
  const category = respone.data.category;
  const services = respone.data.services;

  return (
    <Container>
      <div className="pb-12">
        <div className="relative w-full h-[260px] md:h-[380px] overflow-hidden rounded-xl mt-10">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover brightness-75"
          />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <h1 className="text-3xl md:text-5xl font-extrabold">{category.name}</h1>
            <p
              className="text-sm md:text-lg mt-4 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          </div>
        </div>

        <div className="px-5 mt-10 flex flex-col md:flex-row justify-between gap-10">
          <div className="w-full md:w-1/2 h-[240px] md:h-[300px] rounded-xl overflow-hidden shadow">
            <Image
              src={category.image}
              alt={category.name}
              width={900}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mt-6">{category.name}</h2>
            <p
              className="text-gray-700 mt-4 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          </div>
        </div>

        <div className="container mx-auto px-5 mt-12">
          <h2 className="text-2xl font-bold mb-6">الخدمات المتاحة في هذا القسم</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
            {services.map((service) => (
              <Link
                href={`/${lang}/service/${service.id}`}
                key={service.id}
                className="lg:min-h-[350px] pb-4 bg-[#f7f7f7] rounded-[18px] relative transition duration-300 flex flex-col hover:shadow-md"
              >
               
                <div className="relative w-full h-[260px] rounded-[18px] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="px-5 ">
                  <div className="flex items-center justify-between">
                    <div>
                    <p className="text-[15px] font-medium text-[#080C22] mt-4 line-clamp-2">
                    {service.title}
                  </p>

                  <p className="text-sm text-[#848484] mt-3 line-clamp-2">
                    {service.content.replace(/<\/?p>/g, "")} {/* إزالة الوسوم */}
                  </p>
                  </div>
                  <span>{service.price}</span>
                  </div>

                  <button className="flex items-center justify-center mt-5 font-bold text-sm h-[50px] w-full rounded-[15px] transition duration-300 bg-transparent border border-gray-300 text-black hover:bg-primary hover:text-white">
                    عرض التفاصيل
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
