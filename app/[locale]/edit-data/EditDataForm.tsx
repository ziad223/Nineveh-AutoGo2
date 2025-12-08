"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import apiServiceCall from "@/lib/apiServiceCall";
import InputComponent from "@/components/shared/reusableComponents/InputComponent";
import Image from "next/image";
import phone from "@/public/images/register-phone.png";
import email from "@/public/images/register-email.png";
import user from "@/public/images/register-user.png";
import location from "@/public/images/register-location.png";
import { useQuery } from "@tanstack/react-query";
import CustomSelect from "@/components/shared/reusableComponents/CustomSelect";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmMobile from "./ConfirmMobile";

type FormData = {
  name: string;
  email: string;
  phone: string;
  city_id: string;
};

const EditDataForm = ({ token }: { token: string }) => {
  const { register, handleSubmit, setValue, watch, control } =
    useForm<FormData>();
  const t = useTranslations("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [originalPhone, setOriginalPhone] = useState("");
  const [newUserProfileData, setNewUserProfileData] = useState<FormData | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiServiceCall({
        method: "get",
        url: "user/profile",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data?.user) {
        const user = response.data.user;
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("phone", user.mobile);
        setValue("city_id", user.city?.id?.toString() ?? "");
        setOriginalPhone(user.mobile);
      }
    };
    fetchData();
  }, [setValue, token]);

  const onSubmit = async (data: FormData) => {
    // Check if phone number was changed
    if (data.phone !== originalPhone) {
      setFormData(data);
      // setShowOtpModal(true);
      await submitFormData(data);
    } else {
      // If phone not changed, submit normally
      await submitFormData(data);
    }
  };

  const submitFormData = async (data: FormData) => {
    try {
      const response = await apiServiceCall({
        method: "post",
        url: "user/edite-profile",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          mobile: data.phone,
          city_id: data.city_id,
        }),
      });

      console.log("sadasdasdiouastgdui", response);

      const message =
        response?.data?.message || response?.message || "تم التعديل بنجاح";
      toast.success(message);
      console.log("تم التعديل بنجاح", response);

      if (response?.data?.new_mobile) {
        setNewUserProfileData(data);
        setShowOtpModal(true);
      }
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || "حدث خطأ أثناء التعديل";
      toast.error(message);
      console.error("خطأ في التعديل:", error);
    }
  };

  const handleOtpSuccess = async () => {
    if (formData) {
      await submitFormData(formData);
      setShowOtpModal(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData) return;

    try {
      await apiServiceCall({
        method: "post",
        url: "user/edite-profile",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.phone,
          city_id: formData.city_id,
        }),
      });
      toast.success("تم إرسال كود التحقق إلى رقم الهاتف الجديد");
    } catch (error) {
      toast.error("فشل في إرسال كود التحقق");
    }
  };

  const { data: citiesData, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: () => apiServiceCall({ url: "cities" }),
    select: (data) =>
      data?.data?.cities?.map((city: any) => ({
        value: city.id.toString(),
        label: city.title,
      })) || [],
  });

  return (
    <>
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <InputComponent
          register={register}
          name="name"
          type="text"
          icon={<Image src={user} alt="user" width={24} height={24} />}
          className="lg:w-[522px]"
        />
        <InputComponent
          register={register}
          name="phone"
          type="text"
          icon={<Image src={phone} alt="phone" width={24} height={24} />}
          className="lg:w-[522px]"
        />
        <InputComponent
          register={register}
          name="email"
          type="email"
          icon={<Image src={email} alt="email" width={24} height={24} />}
          className="lg:w-[522px]"
        />
        <div className="mb-1">
          <CustomSelect
            name="city_id"
            control={control}
            options={citiesData || []}
            className="!mt-0"
            icon={
              <Image src={location} alt="location" width={24} height={24} />
            }
          />
        </div>
        <button
          type="submit"
          className="w-full h-[65px] bg-[#EB2300] rounded-[15px] cursor-pointer mt-5 text-white"
        >
          حفظ التعديلات
        </button>
      </form>

      {showOtpModal && formData && (
        <ConfirmMobile
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          onResendCode={handleResendCode}
          newUserProfileData={newUserProfileData}
          mobileNumber={formData.phone}
          token={token}
        />
      )}
    </>
  );
};

export default EditDataForm;
