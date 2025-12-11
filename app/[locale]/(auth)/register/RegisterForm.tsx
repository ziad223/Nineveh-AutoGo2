'use client';

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { MdLockOutline } from "react-icons/md";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import Image from 'next/image';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import apiServiceCall from '@/lib/apiServiceCall';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import phone from '@/public/images/register-phone.png';
import email from '@/public/images/register-email.png';
import user from '@/public/images/register-user.png';
import location from '@/public/images/register-location.png';


// -------------------- SCHEMA ------------------------
const registerSchema = z.object({
  name: z.string().min(3, 'name_min_length'),
  phone: z.string().regex(/^05\d{8}$/, 'mobile_format'),
  email: z.string().email('invalid_email'),
  city: z.string({ required_error: 'city_required' }),
  password: z.string().min(6, 'password_min'),
  password_confirmation: z.string().min(6, 'password_confirm_min'),
  terms_accepted: z.literal(true, { errorMap: () => ({ message: 'terms_required' }) }),
  profile_image: z.any().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "passwords_not_match",
  path: ["password_confirmation"],
});


// -------------------- COMPONENT ------------------------
const RegisterForm: React.FC = () => {
  const t = useTranslations('RegisterPage');
  const locale = useLocale();
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors }, setValue } =
    useForm({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        name: '',
        phone: '',
        email: '',
        city: '',
        password: '',
        password_confirmation: '',
        terms_accepted: false,
        profile_image: '',
      },
    });


  // -------------------- IMAGE HANDLER ------------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profile_image', file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };


  // -------------------- MUTATION ------------------------
  const registerMutation = useMutation({
    mutationFn: (formData: FormData) =>
      apiServiceCall({
        url: 'auth/register',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept-Language': locale,
        },
      }),

    onSuccess: (res) => {
      toast.success(res.message || t('register_success'));

      // 🚀 REDIRECT TO LOGIN PAGE
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1500);
    },

    onError: (err: any) => {
      toast.error(err.data?.message || t('register_error'));
    },
  });


  // -------------------- SUBMIT ------------------------
  const onSubmit = (data: any) => {
    const formData = new FormData();

    formData.append("client_type", "customer");
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("city", data.city);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);
    formData.append("terms_accepted", data.terms_accepted ? "1" : "0");

    if (data.profile_image instanceof File) {
      formData.append("profile_image", data.profile_image);
    }

    registerMutation.mutate(formData);
  };


  // -------------------- UI ------------------------
  return (
    <>
      <ToastContainer />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto rounded-2xl grid lg:gap-6 gap-2 lg:grid-cols-2 grid-cols-1 mt-7 lg:mt-0"
      >

        {/* الاسم */}
        <div>
          <InputComponent
            register={register}
            name="name"
            type="text"
            placeholder={t('name_placeholder')}
            icon={<Image src={user} alt="" width={24} height={24} />}
          />
          {errors.name && <p className="text-sm text-red-600">{t(errors.name.message)}</p>}
        </div>

        {/* الموبايل */}
        <div>
          <InputComponent
            register={register}
            name="phone"
            type="text"
            placeholder={t('mobile_placeholder')}
            icon={<Image src={phone} alt="" width={24} height={24} />}
          />
          {errors.phone && <p className="text-sm text-red-600">{t(errors.phone.message)}</p>}
        </div>

        {/* الايميل */}
        <div>
          <InputComponent
            register={register}
            name="email"
            type="email"
            placeholder={t('email_placeholder')}
            icon={<Image src={email} alt="" width={24} height={24} />}
          />
          {errors.email && <p className="text-sm text-red-600">{t(errors.email.message)}</p>}
        </div>

        {/* المدينة */}
        <div>
          <CustomSelect
            name="city"
            control={control}
            options={[
              { value: '1', label: 'دبي' },
              { value: '2', label: 'أبوظبي' },
              { value: '3', label: 'الشارقة' },
              { value: '4', label: 'عجمان' },
              { value: '5', label: 'رأس الخيمة' },
              { value: '6', label: 'أم القيوين' },
              { value: '7', label: 'الفجيرة' },
            ]}
            placeholder={t('city_placeholder')}
            icon={<Image src={location} alt="" width={24} height={24} />}
          />
          {errors.city && <p className="text-sm text-red-600">{t(errors.city.message)}</p>}
        </div>

        {/* كلمة المرور */}
        <div>
          <InputComponent
            register={register}
            name="password"
            type="password"
            placeholder={t('enter_password_placeholder')}
            icon={<MdLockOutline className="text-3xl" />}
          />
          {errors.password && <p className="text-sm text-red-600">{t(errors.password.message)}</p>}
        </div>

        {/* تأكيد كلمة المرور */}
        <div>
          <InputComponent
            register={register}
            name="password_confirmation"
            type="password"
            placeholder={t('confirm_password_placeholder')}
            icon={<MdLockOutline className="text-3xl" />}
          />
          {errors.password_confirmation && (
            <p className="text-sm text-red-600">{t(errors.password_confirmation.message)}</p>
          )}
        </div>

        {/* رفع الصورة */}
        <div className="lg:col-span-2">
          <label
            htmlFor="profile_image"
            className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition relative overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="" className="object-cover w-full h-full rounded-xl" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-sm text-gray-400 text-center">
                  {t('click_to_upload')} <br /> {t('or_drag_image_here')}
                </p>
              </div>
            )}

            <input
              id="profile_image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {errors.profile_image && (
            <p className="text-sm text-red-600">{t(errors.profile_image.message)}</p>
          )}
        </div>

        {/* الشروط */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="terms_accepted"
            {...register('terms_accepted')}
            className="h-5 w-5 text-primary rounded focus:ring"
          />
          <label htmlFor="terms_accepted" className="text-sm text-gray-500">
            {t('terms_agree')} <a href="#" className="text-primary underline">{t('terms_link')}</a>
          </label>
        </div>

        {errors.terms_accepted && (
          <p className="text-sm text-red-600 lg:col-span-2">
            {t(errors.terms_accepted.message)}
          </p>
        )}

        {/* زر التسجيل */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="bg-primary w-full text-white py-3 rounded-xl font-bold transition duration-300 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? t('creating_account') : t('create_account')}
          </button>
        </div>

      </form>
    </>
  );
};

export default RegisterForm;
