import Container from '@/components/shared/container';
import React from 'react';
import notification from '@/public/images/notification.png';
import Image from 'next/image';
import NotificationsData from './NotificationsData';
import apiServiceCall from '@/lib/apiServiceCall';
import { cookies } from "next/headers";
import { getTranslations } from 'next-intl/server';

interface LayoutProps {
  params: { locale: string };
}

const page = async ({ params }: LayoutProps) => {
  let notifications = [];
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'notifications' });

  try {
    const response = await apiServiceCall({
      method: 'get',
      url: 'notifications',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': locale,
      },
    });

    notifications = response?.data.notifications || [];

  } catch (error) {
    console.error('Error fetching notifications:', error);
  }

  return (
    <Container className='my-20 flex flex-col justify-center items-center gap-10'>
      <div className='text-center'>
        <h2 className='text-[#EB2302] font-extrabold text-[29px]'>{t('title')}</h2>
        <p className='text-lg text-[#989898] font-medium'>{t('description')}</p>
      </div>

      {notifications.length === 0 ? (
        <div className='mt-10 text-center'>
          <Image
            src={notification}
            alt='notification'
            width={196}
            height={181}
            className='mx-auto'
          />
          <h4 className='mt-3 text-base font-extrabold'>{t('emptyTitle')}</h4>
          <h5 className='mt-2 text-sm text-[#707070]'>
            {t('emptyDescription')}
          </h5>
        </div>
      ) : (
        <NotificationsData data={notifications} />
      )}
    </Container>
  );
};

export default page;
