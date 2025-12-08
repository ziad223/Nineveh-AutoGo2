'use client';

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { MdLockOutline } from "react-icons/md";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import Image from 'next/image';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import OtpCode from '../login/OtpCode';
import apiServiceCall from '@/lib/apiServiceCall';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import phone from '@/public/images/register-phone.png';
import email from '@/public/images/register-email.png';
import user from '@/public/images/register-user.png';
import location from '@/public/images/register-location.png';

const registerSchema = z.object({
  name: z.string().min(3, 'name_min_length'),
  mobile: z.string().regex(/^05\d{8}$/, 'mobile_format'),
  email: z.string().email('invalid_email'),
  city_id: z.string({ required_error: 'city_required' }),
  accepted_terms: z.literal(true, { errorMap: () => ({ message: 'terms_required' }) }),
  profile_image: z.any().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const t = useTranslations('RegisterPage');
  const locale = useLocale();
  const [mobile, setMobile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors }, setValue } =
    useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: { name: '', mobile: '', email: '', city_id: undefined, accepted_terms: false, profile_image: '' },
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profile_image', file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      apiServiceCall({ url: 'client/signup', method: 'POST', body: data, headers: { 'Accept-Language': locale } }),
    onSuccess: (res) => { toast.success(res.message || t('otp_sent')); setIsModalOpen(true); },
    onError: (err: any) => { toast.error(err.data?.message || t('register_error')); },
  });

  const onSubmit = (data: RegisterFormData) => registerMutation.mutate(data);

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto rounded-2xl grid lg:gap-6 gap-2 lg:grid-cols-2 grid-cols-1 mt-7 lg:mt-0">

  {/* الاسم */}
  <div>
    <InputComponent
      register={register}
      name="name"
      type="text"
      placeholder={t('name_placeholder')}
      icon={<Image src={user} alt={t('name_icon_alt')} width={24} height={24} />}
      className="!mt-0"
    />
    {errors.name && <p className="text-sm text-red-600">{t(errors.name.message)}</p>}
  </div>

  {/* الموبايل */}
  <div>
    <InputComponent
      register={register}
      name="mobile"
      type="text"
      placeholder={t('mobile_placeholder')}
      icon={<Image src={phone} alt={t('mobile_icon_alt')} width={24} height={24} />}
      className="!mt-0"
    />
    {errors.mobile && <p className="text-sm text-red-600">{t(errors.mobile.message)}</p>}
  </div>

  {/* الايميل */}
  <div>
    <InputComponent
      register={register}
      name="email"
      type="email"
      placeholder={t('email_placeholder')}
      icon={<Image src={email} alt={t('email_icon_alt')} width={24} height={24} />}
      className="!mt-0"
    />
    {errors.email && <p className="text-sm text-red-600">{t(errors.email.message)}</p>}
  </div>

  {/* المدينة */}
  <div>
    <CustomSelect
      name="city_id"
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
      icon={<Image src={location} alt={t('city_icon_alt')} width={24} height={24} />}
    />
    {errors.city_id && <p className="text-sm text-red-600">{t(errors.city_id.message)}</p>}
  </div>

  {/* كلمة المرور */}
  <div>
    <InputComponent
      register={register}
      name="password"
      type="password"
      placeholder={t('enter_password_placeholder')}
      icon={<MdLockOutline className='text-3xl' />}
    />
    {errors.password && <p className="text-sm text-red-600">{t(errors.password.message)}</p>}
  </div>

  {/* تأكيد كلمة المرور */}
  <div>
    <InputComponent
      register={register}
      name="confirm_password"
      type="password"
      placeholder={t('confirm_password_placeholder')}
      icon={<MdLockOutline className='text-3xl' />}
    />
    {errors.confirm_password && <p className="text-sm text-red-600">{t(errors.confirm_password.message)}</p>}
  </div>

  {/* رفع الصورة - يأخذ كامل العمود */}
  <div className="lg:col-span-2">
    <label
      htmlFor="profile_image"
      className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition relative overflow-hidden"
    >
      {imagePreview ? (
        <img src={imagePreview} alt={t('image_preview_alt')} className="object-cover w-full h-full rounded-xl" />
      ) : (
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="text-sm text-gray-400 text-center">{t('click_to_upload')} <br /> {t('or_drag_image_here')}</p>
        </div>
      )}
      <input id="profile_image" type="file" accept="image/*" className="hidden" {...register('profile_image')} onChange={handleImageChange} />
    </label>
    {errors.profile_image && <p className="text-sm text-red-600">{t(errors.profile_image.message)}</p>}
  </div>

  {/* الشروط - كامل العمود */}
  <div className="lg:col-span-2 flex items-center gap-2">
    <input type="checkbox" id="accepted_terms" {...register('accepted_terms')} className="h-5 w-5 text-primary rounded focus:ring" />
    <label htmlFor="accepted_terms" className="text-sm text-gray-500">
      {t('terms_agree')} <a href="#" className="text-primary underline">{t('terms_link')}</a>
    </label>
  </div>
  {errors.accepted_terms && <p className="text-sm text-red-600 lg:col-span-2">{t(errors.accepted_terms.message)}</p>}

  {/* زرار التسجيل - كامل العمود */}
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


      {/* OTP MODAL */}
      <OtpCode isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mobileNumber={mobile} />
    </>
  );
};

export default RegisterForm;
