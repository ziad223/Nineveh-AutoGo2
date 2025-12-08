"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiServiceCall from "@/lib/apiServiceCall";
import CustomSelect from "@/components/shared/reusableComponents/CustomSelect";
import InputComponent from "@/components/shared/reusableComponents/InputComponent";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof bankSchema>;

const AddBankButton: React.FC<{ token: string }> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("wallet");
  const router = useRouter()
  const bankSchema = z.object({
    bank_name: z.string().min(1, t("validations.bank_name_required")),
    number: z.string().min(1, t("validations.number_required")),
    iban: z.string().min(1, t("validations.iban_required")),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(bankSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) =>
      await apiServiceCall({
        url: "user/wallet/add-account",
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
      }),
    onSuccess: (res: any) => {
      toast.success(res?.message || t("success"));
      reset();
      setIsOpen(false);
       router.refresh()
    },
    onError: (error: any) => {
      console.log(error);
      const errorMsg =
        error?.response?.data?.message || error?.data?.message || t("error");

      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#EB2302] mx-auto mt-8 w-full sm:w-[414px] flex items-center justify-center gap-2 h-[54px] sm:h-[64px] rounded-[15px] text-white text-sm sm:text-base"
      >
        {t("add_button")}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full lg:w-[477px] text-center relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
              aria-label="Close Modal"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold text-[#EB2302] mb-4 mt-10">
              {t("add_account")}
            </h2>
            <p className="text-[#707070] mb-6 text-sm">
              {t("bankdescription")}
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 text-right"
            >
              <InputComponent
                register={register}
                name="bank_name"
                type="text"
                placeholder={t("bank_name")}
              />

              <InputComponent
                register={register}
                name="number"
                type="text"
                placeholder={t("number")}
              />
              {errors.number && (
                <p className="text-red-500 text-xs">{errors.number.message}</p>
              )}

              <InputComponent
                register={register}
                name="iban"
                type="text"
                placeholder={t("iban")}
              />
              {errors.iban && (
                <p className="text-red-500 text-xs">{errors.iban.message}</p>
              )}

              <div className="flex justify-between gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[#EB2302] text-white py-2 px-4 rounded-md w-full h-[62.67px]"
                >
                  {t("confirm")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBankButton;
