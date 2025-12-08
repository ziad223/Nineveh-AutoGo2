'use client';

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useTranslations } from "next-intl";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import Container from "../shared/container";
import { useLocale } from "next-intl";

type Category = {
  id: number;
  name: string;
  description: string;  // HTML string
  image: string;
};

type SectionsProps = {
  categories: Category[];
};

const Sections: React.FC<SectionsProps> = ({ categories }) => {
  const t = useTranslations("sections");
  const locale = useLocale();

  if (!categories || categories.length === 0) return null;

  return (
    <div className="my-5 lg:my-10">
      {/* Title & description */}
      <div className="text-center">
        <h2 className="text-primary font-extrabold text-lg lg:text-[29px]">
          {t("title")}
        </h2>
        <p className="text-sm lg:text-lg text-[#989898] mt-2">{t("description")}</p>
      </div>

      <Container className="mt-7">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="sectionSwiper md:!pb-14 !pb-14"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <Link
                href={`/${locale}/category/${category.id}`}
                className="bg-[#f4f4f4] rounded-[18px] p-5 flex flex-col items-center justify-center gap-5"
              >
                <div className="lg:w-[152px] lg:h-[152px] w-[80px] h-[80px] mx-auto rounded-full bg-[#fff] flex items-center justify-center">
                  <Image
                    src={category.image || "/images/logo.png"}
                    alt={category.name}
                    className="md:w-[105px] md:h-[105px] w-[50px] h-[50px] object-cover rounded-full"
                    width={105}
                    height={105}
                  />
                </div>
                <h2 className="w-full text-center font-bold md:text-base text-xs">
                  {category.name}
                </h2>

                {/* لو حابب تعرض الوصف HTML */}
                {/* <p
                  className="text-center text-sm text-gray-500"
                  dangerouslySetInnerHTML={{ __html: category.description }}
                /> */}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
};

export default Sections;
