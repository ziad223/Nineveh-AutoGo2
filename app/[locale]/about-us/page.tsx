import About from "@/components/about-us";
import HowOrder from "@/components/how-order";
import TechnicalSupport from "@/components/technical-support";
import { getHomeData } from "../../../src/lib/serverActions";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function page({ params }: LayoutProps) {
  const { locale } = await params;
  
     const homeData = await getHomeData(locale);
       const about_page = homeData?.data?.about_page || [];
       const steps = homeData?.data?.service_flow || [];
   


  return (
    <div className="">
   <About about_page = {about_page}  />
   <HowOrder steps = {steps}/>
   <TechnicalSupport/>
    </div>
  );
}
