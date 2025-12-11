'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from "next/navigation";
import Image from "next/image";
import loginPhone from '@/public/images/login-phone.png';
import { MdLockOutline } from "react-icons/md";
import apiServiceCall from '@/lib/apiServiceCall';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';

// ------------------------- Schema ---------------------------
const loginSchema = z.object({
  phone: z.string().regex(/^05\d{8}$/, "mobile_invalid"),
  password: z.string().min(3, "password_invalid"),
  client_type: z.enum(["customer", "company"], {
    message: "client_type_required",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ------------------------- نوع الاستجابة ---------------------------
interface LoginResponse {
  status_code: number;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      company_name: string | null;
      company_bio: string | null;
      commercial_register: string | null;
      email: string;
      client_type: string;
      phone: string;
      city: string;
      email_verified_at: string | null;
      status: number;
      terms_accepted_at: string;
      deleted_at: string | null;
      created_at: string;
      updated_at: string;
      profile_image_url: string;
    };
    token: string;
    token_type: string;
  };
}

// ------------------------- Component ---------------------------
const LoginForm: React.FC = () => {
  const t = useTranslations("Login");
  const locale = useLocale();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
      client_type: "",
    },
  });

  // ------------------------- Mutation ---------------------------
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) =>
      apiServiceCall({
        url: "auth/login",
        method: "POST",
        body: {
          phone: data.phone,
          password: data.password,
          client_type: data.client_type,
        },
        headers: {
          "Accept-Language": locale,
        },
      }),

    onSuccess: async (res: unknown) => {
      // Type assertion
      const response = res as LoginResponse;
      
      if (response?.status_code === 200) {
        toast.success(t("login_success"));
        
        // إرسال التوكن وبيانات المستخدم إلى API route
        if (response.data?.token) {
          try {
            const tokenResponse = await fetch('/api/auth/set-token', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept-Language': locale 
              },
              body: JSON.stringify({
                token: response.data.token,
                userId: response.data.user?.id,
                userDataInfo: response.data.user,
                mobile: response.data.user?.phone,
                userType: response.data.user?.client_type || 'customer'
              }),
            });
            
            if (!tokenResponse.ok) {
              throw new Error('Failed to store token');
            }

            // الانتقال إلى الصفحة الرئيسية
            setTimeout(() => {
              window.location.href = `/${locale}`;
            }, 1200);

          } catch (error) {
            console.error('Error storing token:', error);
            toast.error(t("session_save_error"));
          }
        } else {
          // إذا لم يكن هناك token
          toast.error(t("no_token_received"));
        }
      } else {
        toast.error(response?.message || t("login_error"));
      }
    },

    onError: (err: any) => {
      toast.error(err.data?.message || t("login_error"));
    },
  });

  // ------------------------- Submit ---------------------------
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <ToastContainer />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full "
      >
        {/* Phone */}
        <InputComponent
          register={register}
          name="phone"
          type="text"
          placeholder={t("mobile_placeholder")}
          icon={<Image src={loginPhone} alt="loginPhone" width={24} height={24} />}
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{t(errors.phone.message)}</p>
        )}

        {/* Password */}
        <InputComponent
          register={register}
          name="password"
          type="password"
          placeholder={t("password_placeholder")}
          icon={<MdLockOutline className="text-2xl" />}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{t(errors.password.message)}</p>
        )}

        {/* Client Type */}
        <CustomSelect
          name="client_type"
          control={control}
          placeholder={t("select_client_type")}
          options={[
            { value: "customer", label: t("customer") },
            { value: "company", label: t("company") },
          ]}
        />
        {errors.client_type && (
          <p className="text-sm text-red-600">{t(errors.client_type.message)}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="bg-primary w-full mt-5 text-white py-3 rounded-lg font-bold hover:bg-primary/80 disabled:opacity-70"
        >
          {loginMutation.isPending ? t("logging_in") : t("login")}
        </button>
      </form>
    </>
  );
};

export default LoginForm;