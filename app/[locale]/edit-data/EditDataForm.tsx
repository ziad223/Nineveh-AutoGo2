// app/profile/EditDataForm.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import apiServiceCall from "@/lib/apiServiceCall";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import CustomSelect from "@/components/shared/reusableComponents/CustomSelect";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import InputComponent from "@/components/shared/reusableComponents/InputComponent";
import ChangePasswordModal from "./ChangePasswordModal";
import { FaChevronLeft } from "react-icons/fa";

type FormDataType = {
  name: string;
  company_name?: string;
  email: string;
  phone: string;
  city_id: string;
  commercial_register?: string;
  company_bio?: string;
  profile_image?: FileList;
};

const EditDataForm = ({
  token,
  role,
}: {
  token: string;
  role: string;
}) => {
  const { register, handleSubmit, setValue, control, watch } =
    useForm<FormDataType>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = useTranslations("profile");

  // مشاهدة ملف الصورة
  const profileImage = watch("profile_image");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiServiceCall({
          method: "get",
          url: "auth/me",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const userData = response?.data?.user;
        if (userData) {
          setValue("name", userData.name);
          setValue("email", userData.email);
          setValue("phone", userData.phone);
          setValue("city_id", userData.city?.toString() || "");
          
          if (userData.profile_image_url) {
            setPreviewImage(userData.profile_image_url);
          }

          if (role === "company") {
            setValue("company_name", userData.company_name);
            setValue("commercial_register", userData.commercial_register);
            setValue("company_bio", userData.company_bio);
          }
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error(
          error?.data?.message || t("fetchDataError") || "فشل في جلب البيانات"
        );
      }
    };

    fetchData();
  }, [setValue, token, role]);

  // معالجة اختيار الصورة
  useEffect(() => {
    if (profileImage && profileImage.length > 0) {
      const file = profileImage[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [profileImage]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: FormDataType) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("city_id", data.city_id);

      if (role === "company") {
        if (data.company_name)
          formData.append("company_name", data.company_name);
        if (data.commercial_register)
          formData.append("commercial_register", data.commercial_register);
        if (data.company_bio)
          formData.append("company_bio", data.company_bio);
      }

      if (data.profile_image?.[0]) {
        formData.append("profile_image", data.profile_image[0]);
      }

      const response = await apiServiceCall({
        method: "post",
        url: "auth/profile/update",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      toast.success(
        response?.message || t("updateSuccess") || "تم التحديث بنجاح"
      );
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(
        error?.data?.message || t("updateError") || "حدث خطأ أثناء التحديث"
      );
    }
  };

  const { data: citiesData } = useQuery({
    queryKey: ["cities"],
    queryFn: () => apiServiceCall({ url: "cities" }),
    select: (data) =>
      data?.data?.cities?.map((city: any) => ({
        value: city.id.toString(),
        label: city.title,
      })) || [],
  });

  const handlePasswordChangeSuccess = () => {
    toast.success(t("passwordChangeSuccess") || "تم تغيير كلمة المرور بنجاح");
  };

  return (
    <>
      <form className="mt-5 space-y-3 md:w-[60%] lg:w-[40%] w-full" onSubmit={handleSubmit(onSubmit)}>
        {role === 'customer' && 
          <InputComponent
            register={register}
            name="name"
            type="text"
            placeholder={t("name")}
            className="w-full"
          />
        }

        {role === "company" && (
          <>
            <InputComponent
              register={register}
              name="company_name"
              type="text"
              placeholder={t("companyName")}
            />

            {role === 'company' &&
              <InputComponent
                register={register}
                name="commercial_register"
                type="text"
                placeholder={t("commercialRegister")}
              />
            }

            {role === 'company' &&
              <textarea
                {...register("company_bio")}
                placeholder={t("companyBio")}
                className="w-full border outline-none rounded-lg p-3 bg-[#f5f5f5] md:h-[112px] h-[80px]"
              />
            }
          </>
        )}

        <InputComponent
          register={register}
          name="phone"
          placeholder={t("phone")}
          type="text"
        />

        <InputComponent
          register={register}
          name="email"
          type="email"
          placeholder={t("email")}
        />

        <CustomSelect
          name="city_id"
          control={control}
          options={citiesData || []}
          placeholder={t("city") || "المدينة"}
        />

        {/* Change Password Button */}
        <div className="pt-4">
          <div 
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-yellow-50 transition-all duration-300 group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-primary group-hover:text-yellow-700 transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">
                  {t("changePassword") || "تغيير كلمة المرور"}
                </h3>
                <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600">
                  {t("clickToChangePassword") || "انقر لتحديث كلمة المرور الخاصة بك"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaChevronLeft className="text-gray-400"/>
            </div>
          </div>
        </div>

        {/* Upload Image Box */}
        <div className="mt-6">
          <label className="block mb-3 text-gray-700 font-medium">
            {t("profileImage") || "صورة الملف الشخصي"}
          </label>
          
          <div className="relative">
            <input
              type="file"
              {...register("profile_image")}
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
            />
            
            <div 
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-yellow-50 transition-all duration-300"
            >
              {previewImage ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={previewImage}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 128px) 100vw, 128px"
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {t("clickToChangeImage") || "انقر لتغيير الصورة"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-10 w-10 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        {t("uploadImage") || "رفع صورة"}
                      </span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-gray-500" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t("recommendedSize") || "الحجم الموصى به: 500×500 بكسل"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-[65px] bg-primary rounded-[15px] mt-5 text-white hover:bg-primary-dark transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("save") || "حفظ التغييرات"}
        </button>
      </form>

      {/* Password Change Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        token={token}
        onSuccess={handlePasswordChangeSuccess}
      />
    </>
  );
};

export default EditDataForm;