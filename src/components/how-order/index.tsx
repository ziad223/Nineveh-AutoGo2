
import React from 'react';
import Image from 'next/image';
import Container from '../shared/container';
import { getTranslations } from 'next-intl/server';

interface StepItem {
  id: number;
  step_number: number;
  title: string;
  description: string;
  image: string;
}

interface HowOrderProps {
  steps: StepItem[];
}

const HowOrder: React.FC<HowOrderProps> = async ({ steps }) => {
  const t = await getTranslations('how');

  // ترتيب الخطوات حسب step_number
  const sortedSteps = steps.sort((a, b) => a.step_number - b.step_number);

  return (
    <div className="lg:my-14 my-5">
      <div className="text-center lg:w-[597px] mx-auto">
        <h2 className="lg:text-[29px] text-lg font-bold text-primary">
          {t('howOrderTitle')}
        </h2>
        <p className="lg:text-lg w-[90%] md:w-full text-sm text-[#989898] mt-1">
          {t('howOrderSubtitle')}
        </p>
      </div>

      <Container>
        <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sortedSteps.map((step) => (
            <div
              key={step.id}
              className="flex items-center flex-col justify-center gap-4 rounded-[18px] p-5 bg-[#f6f6f6]"
            >
              <div className="w-[49px] h-[55px] rounded-[18px] flex items-center justify-center text-[31px] font-bold bg-[#eaeaea] text-[#909090]">
                {step.step_number}
              </div>

              <div className="relative">
                <Image
                  src={step.image}
                  alt={step.title.replace(/<[^>]+>/g, '')} // إزالة وسوم HTML من alt
                  width={110}
                  height={110}
                  className="lg:w-full min-w-full max-w-full lg:h-[110px] h-[70px] rounded-lg"
                />
              </div>

              <div className="mx-auto text-center">
                <h2
                  className="lg:text-lg text-base font-bold text-[#080C22]"
                  dangerouslySetInnerHTML={{ __html: step.title }}
                />
                <p
                  className="text-sm text-[#989898] text-center mt-2"
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default HowOrder;
