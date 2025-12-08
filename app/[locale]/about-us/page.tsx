import About from "@/components/about-us";
import HowOrder from "@/components/how-order";
import TechnicalSupport from "@/components/technical-support";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function page({ params }: LayoutProps) {
  const { locale } = await params;
  
     



  return (
    <div className="">
   <About  />
   <HowOrder/>
   <TechnicalSupport/>
    </div>
  );
}
