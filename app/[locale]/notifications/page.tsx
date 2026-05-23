// app/[locale]/notifications/page.tsx
import Container from '@/components/shared/container';
import React from 'react';
import notification from '@/public/images/notification.png';
import Image from 'next/image';
import NotificationsData from './NotificationsData';
import apiServiceCall from '../../../src/lib/apiServiceCall';
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

    // تأكد من الحصول على البيانات بشكل صحيح
    notifications = response?.data?.notifications?.data || [];

  } catch (error) {
    console.error('Error fetching notifications:', error);
  }

  return (
    <Container className='my-20'>
      <div className='text-center mb-10'>
        <h2 className='text-primary font-extrabold text-2xl mb-2'>{t('title')}</h2>
        <p className='text-gray-600'>{t('description')}</p>
      </div>

      {notifications.length === 0 ? (
        <div className='text-center py-10'>
          <Image
            src={notification}
            alt='notification'
            width={150}
            height={150}
            className='mx-auto mb-4'
          />
          <h4 className='text-lg font-bold mb-2'>{t('emptyTitle')}</h4>
          <p className='text-gray-500'>
            {t('emptyDescription')}
          </p>
        </div>
      ) : (
        <NotificationsData data={notifications} token = {token} />
      )}
    </Container>
  );
};

export default page;