'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import apiServiceCall from '@/lib/apiServiceCall';

type StepItem = {
  id: number;
  sort: number;
  title: string;
  content: string;
  image: string;
};

const SalesSteps = () => {
  const t = useTranslations('how');

  const [steps, setSteps] = useState<StepItem[]>([]);
  const [loading, setLoading] = useState(true); // Optional

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await apiServiceCall({ url: 'home' });
        setSteps(response?.data?.sales_steps || []);
      } catch (error) {
        console.error("Failed to fetch sales steps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSteps();
  }, []);

  return (
    <div className='lg:my-14 my-5'>
      <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <p className="text-center col-span-full">Loading...</p>
        ) : (
          steps.map((card) => (
            <div
              key={card.id}
              className="group flex items-center flex-col justify-center lg:gap-7 gap-4 rounded-[18px] lg:p-10 p-5 transition bg-[#f6f6f6] hover:bg-[#fef0ed]"
            >
              <div className="w-[49px] h-[55px] rounded-[18px] flex items-center justify-center text-[31px] font-bold bg-[#eaeaea] text-[#909090] group-hover:bg-[#fcd7d1] group-hover:text-[#EB2302]">
                {card.sort}
              </div>

              <div className="group relative">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={110}
                  height={110}
                  className="grayscale transition lg:w-[110px] lg:h-[110px] w-[70px] h-[70px]"
                  style={{ transition: 'filter 0.3s' }}
                />
              </div>

              <div className='mx-auto text-center'>
                <h2 className="lg:text-[24px] text-base font-bold text-[#080C22] group-hover:text-[#080C22]">
                  {card.title}
                </h2>
                <p className='text-sm text-[#989898] text-center mt-2'>
                  {card.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SalesSteps;
