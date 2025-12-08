
import Reports from "@/components/reports/Reports";
import TechnicalSupport from "@/components/technical-support";
import { cookies } from "next/headers";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function HomePage({ params }: LayoutProps) {
  const { locale } = await params;
   
     
  const cookieStore =  cookies();
    const token = cookieStore.get("token")?.value;
 

  return (
    <div className="">
     
   <Reports token={token} />
    </div>
  );
}
