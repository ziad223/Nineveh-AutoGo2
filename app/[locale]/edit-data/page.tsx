import React from "react";
import Container from "../../../src/components/shared/container";
import EditDataForm from "./EditDataForm";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const t = await getTranslations("profile");

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
const userDataString = cookieStore.get("userDataInfo")?.value;
const userData = userDataString
  ? JSON.parse(userDataString)
  : null;
const role = userData?.client_type
  return (
    <Container className="mt-10 min-h-screen">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="text-center">
          <h2 className="font-extrabold text-[29px] text-primary">
            {t("editTitle")}
          </h2>

          <h4 className="text-lg font-medium text-[#989898]">
            {t("editSubtitle")}
          </h4>
        </div>

        <EditDataForm token={token} role = {role} />
      </div>
    </Container>
  );
};

export default page;
