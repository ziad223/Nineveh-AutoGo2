import Image from "next/image";
import Container from "../../../../src/components/shared/container";
import HowOrder from "@/components/how-order";

export default function ServiceDetailsPage({ params }: any) {
  const { id, locale } = params;

  const service = {
    title: "عنوان الخدمة",
    description:
      "وصف احترافي للخدمة يوضح التفاصيل الأساسية بطريقة جذابة ومريحة للقراءة. يتم عرض الميزات، خطوات العمل، والقيمة المقدمة للعميل.",
    coverImage: "/images/hero-1.webp", // صورة الهيرو
    sideImage: "/images/hero-2.webp",  // صورة السكشن الجانبي
    features: [
      "خدمة عالية الجودة",
      "دعم فني مستمر",
      "تسليم سريع ومنتظم",
      "أسعار تنافسية",
    ],
    steps: [
      "التواصل معنا وشرح متطلباتك",
      "تحليل الخدمة وتحديد ما تحتاجه",
      "بدء التنفيذ والمتابعة المستمرة",
      "التسليم النهائي والتأكد من رضاك",
    ],
  };

  return (
    <div>
        <div className="w-full mb-10 ">
       <Container>
      <section className="relative rounded-xl w-full h-[60vh]  mt-7 text-white flex items-center">
        <Image
          src={service.coverImage}
          alt={service.title}
          fill
          className="object-cover rounded-[20px] "
        />
        <div className="relative  mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{service.title}</h1>
          <p className="text-white/90 max-w-2xl text-lg">
            نقدم لك خدمة مميزة بجودة عالية وتجربة احترافية تضمن لك أفضل النتائج.
          </p>
        </div>
      </section>
     </Container>
     <Container>
      <section className="py-16 bg-white">
        <div className=" mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-4">عن الخدمة</h2>
            <p className="text-gray-600 leading-relaxed">{service.description}</p>

            {/* FEATURES */}
            <div className="mt-10">
              <h3 className="text-2xl font-semibold mb-4">مميزات الخدمة</h3>
              <ul className="space-y-3">
                {service.features.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="w-3 h-3 rounded-full bg-primary mt-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SIDE IMAGE */}
          <div className="relative h-[350px] rounded-2xl overflow-hidden shadow-md">
            <Image
              src={service.sideImage}
              alt="Service side"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
      </Container>
     <HowOrder/>
     <Container>
      <section className="py-16 bg-gray-100 text-black text-center rounded-xl mt-10">
        <div className=" mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">جاهز تبدأ معنا؟</h2>
          <p className="max-w-2xl mx-auto  mb-6">
            تواصل معنا الآن واحصل على استشارة مجانية خاصة بخدمتك.
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-xl font-semibold shadow hover:bg-gray-200 transition">
            احجز معنا
          </button>
        </div>
      </section>
</Container>
    </div>
    </div>
  );
}
