import React from "react";
import Image from "next/image";
import apiServiceCall from "@/lib/apiServiceCall";
import Container from "@/components/shared/container";

interface PageData {
  id: number;
  title: string;
  content: string;
  image: string;
}

const PageDetails = async ({
  params,
}: {
  params: { id: string; locale?: string };
}) => {
  const locale = params.locale || "ar";

  const response = await apiServiceCall({
    method: "get",
    url: `pages/${params.id}`,
    headers: {
      "Accept-Language": locale,
    },
  });

  const data: PageData = response?.data;

  return (
    <Container>
      <div className=" w-full rounded-2xl p-6 md:p-10 mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-[#EB2302]">
          {data.title}
        </h1>

        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="md:w-1/2 text-gray-800 text-lg">
            <div className="wrap-break-word whitespace-pre-line" dangerouslySetInnerHTML={{ __html: data.content }} />
          </div>

          <div className="relative w-full md:w-1/2 h-64 md:h-96 rounded-xl">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PageDetails;
