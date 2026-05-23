import { getHomeData  } from "@/lib/serverActions";
import Faq from "../../../src/components/faq";
interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function page({ params }: LayoutProps) {
  const { locale } = await params;
  
     
  const homeData = await getHomeData(locale);

  const faq_items = homeData?.data?.faq_items || [];


  return (
    <div className="">
   <Faq faq_items = {faq_items} />
    </div>
  );
}
