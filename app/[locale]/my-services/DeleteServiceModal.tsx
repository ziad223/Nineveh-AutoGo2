"use client";

import { useTranslations } from "next-intl";

const DeleteServiceModal = ({ open, onClose, serviceId }: any) => {
  const t = useTranslations("services");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 text-center">
        <h2 className="text-lg font-bold mb-3 text-red-600">
          {t("deleteService")}
        </h2>

        <p className="text-gray-600 mb-6">
          {t("deleteConfirm")}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2"
          >
            {t("cancel")}
          </button>

          <button
            className="flex-1 bg-red-500 text-white rounded-lg py-2"
          >
            {t("confirmDelete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteServiceModal;
