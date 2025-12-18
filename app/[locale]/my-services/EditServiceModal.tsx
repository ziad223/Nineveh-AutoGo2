"use client";

import { useTranslations } from "next-intl";

const EditServiceModal = ({ open, onClose, service }: any) => {
  const t = useTranslations("services");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">
          {t("editService")}
        </h2>

        <form className="space-y-4">
          <input
            defaultValue={service.title}
            placeholder={t("title")}
            className="w-full border rounded-lg px-4 py-2"
          />

          <textarea
            defaultValue={service.content}
            placeholder={t("description")}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            defaultValue={service.price}
            placeholder={t("price")}
            className="w-full border rounded-lg px-4 py-2"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg py-2"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="flex-1 bg-primary text-white rounded-lg py-2"
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;
