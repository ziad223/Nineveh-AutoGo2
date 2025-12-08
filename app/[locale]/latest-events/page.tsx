import LastestEvents from "@/components/latest-events";
import { getEventsData } from "@/lib/serverActions";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function page({ params, searchParams }: LayoutProps) {
  const { locale } = await params;

  const keyword = await searchParams.keyword;

  const eventsData = await getEventsData(locale, keyword);
  console.log("getEventsData");

  const events = eventsData?.data?.events || [];

  return (
    <div className="">
      <LastestEvents events={events} locale={locale} />
    </div>
  );
}
