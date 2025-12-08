
import React from 'react';
import Image from 'next/image';
import Container from '@/components/shared/container';
import { getTranslations } from 'next-intl/server';
import bgLeft from '@/public/images/bg-left.png';
import bgRight from '@/public/images/bg-right.png';
import ClientRegisterLink from './ClientRegisterLink';
import RegisterForm from './RegisterForm';
import CompanyRegisterForm from './CompanyRegisterForm'; // هننشئه لاحقًا
import { useTranslations } from 'next-intl';
import RegisterTabs from './RegisterTabs';

interface LayoutProps {
  params: { locale: string };
}

const Page = async ({ params }: LayoutProps) => {
  const { locale } = params;
  const t = await getTranslations('RegisterPage');
  return <RegisterPage locale={locale} t={t} />;
};

export default Page;

const RegisterPage = ({ locale, t }: { locale: string; t: any }) => {

  return (
    <div className="relative">
      <div className="absolute top-20 hidden md:block left-0">
        <Image src={bgLeft} alt="bgLeft" />
      </div>
      <div className="absolute top-20 hidden md:block right-0">
        <Image src={bgRight} alt="bgRight" />
      </div>

      <div>
        <div className="flex flex-col items-center justify-center min-h-screen py-10">
          <h2 className="font-bold text-[28px] text-primary  mb-2">
            {t('register_title')}
          </h2>
          <h3 className="text-sm text-[#888] mb-8">
            {t('register_subtitle')}
          </h3>

         <RegisterTabs/>

          <div className="w-full max-w-md mx-auto  rounded-2xl p-6">
           

            <div className="mt-10 text-center">
              <h4 className="text-[#989898] text-sm">{t('existing_account')}</h4>
              <ClientRegisterLink locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
