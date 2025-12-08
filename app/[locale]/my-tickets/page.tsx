import Image from 'next/image';
import { FaInfoCircle } from 'react-icons/fa'; 
import apiServiceCall from '@/lib/apiServiceCall';
import { cookies } from "next/headers";
import Container from "@/components/shared/container";
import { getTranslations } from 'next-intl/server';
import TicketControls from './TicketControls'
interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

const OrdersResalePage = async ({ params }: LayoutProps) => {
  const { locale } = await params;

  const t = await getTranslations('my-tickets');
 const cookieStore = await cookies();
  const token =    cookieStore.get("token")?.value
let tickets;
    const response = await apiServiceCall({
      url: "orders/resale",
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, 
        "Accept-Language": locale
      },
    });
          console.log(response?.data, 'frommmmmmmmm')
     tickets = response.data;


    if (tickets.length === 0) {
  return (
    <div className="text-center py-20">
      <p className="text-red-500 text-xl font-semibold">
      {t('noTickets')}
      </p>
    </div>
  );
}


    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">{t("myTickets")}</h1>
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets?.map((ticket: any) => (
              <div key={ticket?.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl">
                <Image
src={ticket?.order_resale_image || '/images/ticket-starr.svg'}
                  alt={'ticket name'}
                  width={500}
                  height={500}
                  className={`w-full h-[300px] object-cover ${ticket?.order_resale_image ? '' : '!w-[300px] !h-[300px] mx-auto'}`}
                />
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800">{ticket?.event?.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{ticket?.event?.date}</p>

                  <div className="mt-4 grid md:grid-cols-2 grid-cols-1 gap-x-8 gap-y-4">
                    <p className="lg:text-lg text-gray-500">
                      <span className="font-medium text-gray-700">{t("square")}:</span> {ticket?.ticket?.block_number}
                    </p>
                    <p className="text-lg text-gray-500">
                      <span className="font-medium text-gray-700">{t("ticketCategory")}:</span> {ticket?.ticket?.stand}
                    </p>
                    <p className="text-lg text-gray-500">
                      <span className="font-medium text-gray-700">{t("row")}:</span> {ticket?.ticket?.row_number}
                    </p>
                    <p className="text-lg text-gray-500">
                      <span className="font-medium text-gray-700">{t("seat")}:</span> {ticket?.ticket?.seat_number}
                    </p>
                  </div>

                  <p className="text-lg text-gray-500 mt-4">
                    <span className="font-medium text-gray-700">{t("price")}:</span> {ticket?.ticket?.price} <span>{t('sar')}</span>
                  </p>

                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-fullpx-5 bg-yellow-200 rounded-sm`}
                    >
                      {ticket?.order_status}
                    </span>
                  </div>
                   <TicketControls
  ticketId={ticket?.ticket?.id}
  ticketData={{
    seatNumber: ticket?.ticket?.seat_number,
    rowNumber: ticket?.ticket?.row_number,
    boxNumber: ticket?.ticket?.block_number,
    price: ticket?.ticket?.price,
    image: ticket?.order_resale_image || '/images/ticket-starr.svg',
     eventId: ticket?.event?.id || null,
    seatNumber: ticket?.ticket?.seat_number,
     stand_id : ticket?.ticket?.stand_id
  }}
  token = {token}
/>
                  <div className="mt-4 ">
               
                    <p className = 'text-red-500 text-xs'>{t("note")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    );

};

export default OrdersResalePage;
