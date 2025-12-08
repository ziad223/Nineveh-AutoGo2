
import React from 'react';
import Image from 'next/image';
import Container from '../shared/container';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface EventItem {
  id: number;
  category: string;
  title: string;
  content: string;
  price?: string;
  phone?: string;
  feature_preview?: string[];
  image: string;
}

interface LastestEventsProps {
  events: EventItem[];
  locale : string
}

const LastestEvents: React.FC<LastestEventsProps> = async ({ events , locale }) => {
  const t = await getTranslations('lastestEvents');

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">{t('noEventsAvailable')}</p>
      </div>
    );
  }

  return (
    <div className="my-5 lg:my-10">
      <div className="text-center">
        <h2 className="lg:text-[29px] text-lg font-bold text-primary">
          {t('latestEventsTitle')}
        </h2>
        <p className="lg:text-lg text-sm text-[#989898] mt-2">
          {t('latestEventsSubtitle')}
        </p>
      </div>

      <Container className="mt-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="lg:min-h-[350px] pb-4 bg-[#f7f7f7] rounded-[18px] relative transition duration-300 flex flex-col"
            >
              {/* Category badge */}
              <div className="w-max h-[45px] text-sm text-[18px] py-2 px-3 font-bold absolute top-0 z-20 flex flex-col items-center justify-center gap-0 right-0 rounded-tr-[18px] rounded-sm bg-[#D4D4D4] text-black">
                {event.category}
              </div>

              {/* Image */}
              <div className="relative w-full h-[300px] rounded-[18px] overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
              </div>

              {/* Content */}
              <div className="px-5 mt-3 flex flex-col flex-1">
                <p className="lg:text-[14px] text-sm font-medium text-[#080C22] lg:leading-[30px] line-clamp-2">
                  {event.title}
                </p>

                <div className='flex items-center justify-between w-full'>
                   <p className="md:text-sm text-xs font-medium text-[#848484] line-clamp-3 my-4">
                  {event.content.replace(/<\/?p>/g, '').slice(0 , 20)}
                </p>
                <span className='text-xs'>{event.price} ر.س</span>
                </div>

                <Link
                  href={`/${locale}/service/${event.id}`}
                  className="flex items-center px-3 justify-center lg:mt-auto cursor-pointer font-bold text-sm h-[54px] w-full rounded-[15px] transition duration-300 bg-transparent border border-gray-300 text-black hover:bg-primary hover:text-white"
                  aria-label={`Book now for ${event.title}`}
                >
                  {t('bookNow')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default LastestEvents;
