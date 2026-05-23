import HowOrder from "@/components/how-order";
import { getHomeData  } from "@/lib/serverActions";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function page({ params }: LayoutProps) {
  const { locale } = await params;
  
     
  const homeData = await getHomeData(locale);

       const steps = homeData?.data?.service_flow || [];


  return (
    <div className="">
   <HowOrder steps = {steps}/>
    </div>
  );
}
