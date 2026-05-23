'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Container from '../shared/container';

type SliderItem = {
  id: number;
  title: string;           // HTML string
  description: string;     // HTML string
  image: string;
  sort_order: number;
};

type HeaderProps = {
  sliders: SliderItem[];
};

const Header: React.FC<HeaderProps> = ({ sliders }) => {
  return (
    <Container className="mt-5 lg:mt-10">
      <div className="relative w-full lg:h-[500px] h-[250px] rounded-[20px] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="w-full h-full"
        >
          {sliders?.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full lg:min-h-[500px]  overflow-hidden flex items-center justify-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="object-fill w-full h-full"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Title & Description */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                  <h2
                    className="text-xl lg:text-4xl text-primary font-extrabold mb-3"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />

                  <p
                    className="text-sm lg:text-lg max-w-[600px] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: slide.description }}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  );
};

export default Header;
