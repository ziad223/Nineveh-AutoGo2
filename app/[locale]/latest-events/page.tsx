import LastestEvents from "@/components/latest-events";
import { getEventsData } from "@/lib/serverActions";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function page({ params, searchParams }: LayoutProps) {
  const { locale } = await params;

  const keyword = await searchParams.keyword;

  const eventsData = await getEventsData(locale, keyword);

  const events = eventsData?.data || [];

  return (
    <div className="">
      <LastestEvents events={events} locale={locale} isHomePage={false}  />
    </div>
  );
}
