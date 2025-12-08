
import Image from "next/image";
import Link from "next/link";
import Container from "../../../../src/components/shared/container";

const category = {
  id: "washing",
  title: "خدمات الغسيل",
  image: "/images/hero-1.webp",
  description:
    "نقدم لك مجموعة من خدمات غسيل السيارات الداخلية والخارجية باستخدام أفضل المواد الآمنة.",
  services: [
    {
      id: "wash-external",
      title: "غسيل خارجي",
      image: "/images/hero-2.webp",
      shortDesc: "غسيل خارجي شامل مع مواد عالية الجودة.",
    },
    {
      id: "wash-internal",
      title: "غسيل داخلي",
      image: "/images/hero-3.webp",
      shortDesc: "تنظيف داخلي شامل وتعقيم كامل.",
    },
    {
      id: "wash-full",
      title: "غسيل كامل",
      image: "/images/hero-4.webp",
      shortDesc: "غسيل داخلي وخارجي شامل.",
    },
  ],
};

export default function CategoryPage() {
  return (
    <Container>
       <div className="pb-12">

      <div className="relative w-full h-[260px] md:h-[380px] overflow-hidden rounded-xl mt-10">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold">{category.title}</h1>
          <p className="text-sm md:text-lg mt-4 max-w-2xl">{category.description}</p>
        </div>
      </div>

<div className="px-5 mt-10 flex justify-between gap-10">
  <div className="w-full h-[240px] md:h-[300px] rounded-xl overflow-hidden shadow">
    <Image
      src={category.image}
      alt={category.title}
      width={900}
      height={600}
      className="object-cover w-full h-full"
    />
  </div>

 <div>
   <h2 className="text-3xl font-bold mt-6">{category.title}</h2>

  <p className="text-gray-700 mt-4 leading-relaxed text-lg">
    {category.description}
  </p>
 </div>
</div>


      <div className="container mx-auto px-5 mt-12">

        <h2 className="text-2xl font-bold mb-6">الخدمات المتاحة في هذا القسم</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">

          {category.services.map((service) => (
            <Link
              href={`/services/${service.id}`}
              key={service.id}
              className="lg:min-h-[350px] pb-4 bg-[#f7f7f7] rounded-[18px] relative transition duration-300 flex flex-col hover:shadow-md"
            >
              {/* شارة القسم */}
              <div className="w-max h-[40px] text-sm text-[15px] py-2 px-3 font-bold absolute top-0 z-20 flex items-center justify-center gap-0 right-0 rounded-tr-[18px] rounded-sm bg-[#D4D4D4] text-black">
                خدمة
              </div>

              {/* صورة الخدمة */}
              <div className="relative w-full h-[260px] rounded-[18px] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* المحتوى */}
              <div className="px-5">
                <p className="text-[15px] font-medium text-[#080C22] mt-4 line-clamp-2">
                  {service.title}
                </p>

                <p className="text-sm text-[#848484] mt-3 line-clamp-2">
                  {service.shortDesc}
                </p>

                <button
                  className="flex items-center justify-center mt-5 font-bold text-sm h-[50px] w-full rounded-[15px] transition duration-300 bg-transparent border border-gray-300 text-black hover:bg-primary hover:text-white"
                >
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
