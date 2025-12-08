import Container from '@/components/shared/container';
import React from 'react';
import sellTiket from '@/public/images/sell-your-ticket.png';
import Image from 'next/image';
import { cookies } from "next/headers";
import SellYourTicketForm from './SellYourTicketForm';
import { getTranslations } from 'next-intl/server';

const page = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const t = await getTranslations("sell");

  return (
    <Container className='my-10'>
      <div className='text-center'>
        <Image src={sellTiket} alt='sellTiket' className='mx-auto' />
        <h2 className='font-bold text-[29px] text-[#EB2302] my-3'>
          {t('title')}
        </h2>
        <p className='text-lg text-[#989898]'>
          {t('description')}
        </p>
      </div>

    
      <SellYourTicketForm token={token} />
    </Container>
  );
};

export default page;
