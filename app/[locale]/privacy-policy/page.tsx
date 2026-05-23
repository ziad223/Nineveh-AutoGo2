import React from "react";
import { getSettingsData } from "../../../src/lib/serverActions";
import Container from "../../../src/components/shared/container";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

const page = async ({ params }: LayoutProps) => {
  const { locale } = await params;

  const settingsResponse = await getSettingsData(locale);

  const privacyPolicy = settingsResponse?.data?.find(
    (item: any) => item.key === "privacy_policy"
  );

  return (
   <Container>
     <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>

      {privacyPolicy?.value ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: privacyPolicy.value }}
        />
      ) : (
        <p>لا توجد سياسة خصوصية حالياً</p>
      )}
    </div>
   </Container>
  );
};

export default page;
