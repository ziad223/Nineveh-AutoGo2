"use client";

import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useTranslations } from "next-intl";
import EditServiceModal from "./EditServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";

const ServicesActions = ({ service }: { service: any }) => {
  const t = useTranslations("services");
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setOpenEdit(true)}
          className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary rounded-lg py-2 text-sm hover:bg-primary hover:text-white transition"
        >
          <FiEdit />
          {t("edit")}
        </button>

        <button
          onClick={() => setOpenDelete(true)}
          className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-500 rounded-lg py-2 text-sm hover:bg-red-500 hover:text-white transition"
        >
          <FiTrash2 />
          {t("delete")}
        </button>
      </div>

      <EditServiceModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        service={service}
      />

      <DeleteServiceModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        serviceId={service.id}
      />
    </>
  );
};

export default ServicesActions;
