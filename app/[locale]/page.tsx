import About from "../../src/components/about-us";
import Header from "../../src/components/header";
import HowOrder from "../../src/components/how-order";
import LastestEvents from "../../src/components/latest-events";
import Sections from "../../src/components/sections";
import TechnicalSupport from "../../src/components/technical-support";
import { getHomeData  } from "../../src/lib/serverActions";
import { cookies } from "next/headers";
import Faq from "../../src/components/faq";
// import Packages from "../../src/components/packages";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function HomePage({ params }: LayoutProps) {
  const { locale } = await params;
    const cookieStore =  cookies();
    const token = cookieStore.get("token")?.value;
     
  const homeData = await getHomeData(locale);
  const sliders = homeData?.data?.sliders || [];
  const about_page = homeData?.data?.about_page || [];
  const categories = homeData?.data?.categories || [];
  const events = homeData?.data?.services || [];
  const faq_items = homeData?.data?.faq_items || [];
  const steps = homeData?.data?.service_flow || [];


  return (
    <div className="">
      {/* <Whatsapp whatsapp = {whatsapp}/> */}
   <Header sliders = {sliders}/>
   <About about_page = {about_page} />
   <Sections categories = {categories} />
   <LastestEvents locale = {locale} events = {events} />
   <HowOrder steps = {steps} />
   <Faq faq_items = {faq_items} />
   <TechnicalSupport/>
    </div>
  );
}
