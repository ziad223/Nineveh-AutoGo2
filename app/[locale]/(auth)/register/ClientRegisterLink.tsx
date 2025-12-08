'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const ClientRegisterLink = ({ locale }: { locale: string }) => {
  const t = useTranslations('navbar');

  return (
    <Link
      href={`/${locale}/login`}
      className='w-full flex items-center justify-center border border-primary  text-primary  py-3 rounded-xl font-bold transition duration-300 hover:bg-primary  hover:text-white mt-3'
    >
      {t('login')}
    </Link>
  );
};

export default ClientRegisterLink;
