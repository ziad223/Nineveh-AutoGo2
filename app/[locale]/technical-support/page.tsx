import TechnicalSupport from "../../../src/components/technical-support";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function page({ params }: LayoutProps) {
  const { locale } = await params;
  
     



  return (
    <div className="">
   <TechnicalSupport/>
    </div>
  );
}
