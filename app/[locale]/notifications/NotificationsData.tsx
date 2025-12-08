
import React from 'react';
import Image from 'next/image';
import newNotifications from '@/public/images/new-notifications.png';
import notifications from '@/public/images/notifications.png';

interface NotificationItem {
  id: string;
  data: {
    title: string;
    message: string;
    type: string;
    model_id: number;
  };
  is_read: boolean;
  created_at: string;
}

const NotificationsData = ({ data }: { data: NotificationItem[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
      {data.map((notification) => (
        <div key={notification.id} className="rounded-[18px] bg-gray-100  p-10 w-full">
          <div className="flex items-center gap-2 ">
            <Image
              src={notification.is_read ? notifications : newNotifications}
              alt="notification"
              width={40}
              height={40}
            />
            <div>
              <h2 className={`font-bold text-base ${notification.is_read ? 'text-[#080C22]' : 'text-[#EB2302]'}`}>
                {notification.data.title}
              </h2>
              <h3 className="text-[#919191] font-medium text-sm mt-1">{notification.created_at}</h3>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium">{notification.data.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationsData;
