import Sections from "@/components/sections";
import { getHomeData  } from "@/lib/serverActions";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function page({ params }: LayoutProps) {
  const { locale } = await params;
  
     
  const homeData = await getHomeData(locale);

  const categories = homeData?.data?.categories || [];


  return (
    <div className="">
   <Sections categories = {categories}/>
    </div>
  );
}
