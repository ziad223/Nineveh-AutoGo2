'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import Image from 'next/image';
import user from '@/public/images/register-user.png';
import email from '@/public/images/register-email.png';
import phone from '@/public/images/register-phone.png';
import location from '@/public/images/register-location.png';
import check from '@/public/images/register-check.png';
import { MdLockOutline } from 'react-icons/md';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiServiceCall from '@/lib/apiServiceCall';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ------------------------- Schema Validation ---------------------------
const companyRegisterSchema = z.object({
  company_name: z.string().min(3, "company_name_required"),
  email: z.string().email("email_invalid"),
  phone: z.string().regex(/^05\d{8}$/, "mobile_invalid"),
  city: z.string().min(1, "city_required"),
  commercial_register: z.string().min(3, "commercial_register_required"),
  company_bio: z.string().min(10, "company_bio_required"),
  password: z.string().min(6, "password_min"),
  password_confirmation: z.string().min(6, "confirm_password_min"),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: "terms_accepted_required",
  }),
  profile_image: z.any().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "passwords_not_match",
  path: ["password_confirmation"],
});

type CompanyRegisterFormData = z.infer<typeof companyRegisterSchema>;

const CompanyRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyRegisterFormData>({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues: {
      company_name: "",
      email: "",
      phone: "",
      city: "",
      commercial_register: "",
      company_bio: "",
      password: "",
      password_confirmation: "",
      terms_accepted: false,
    },
  });

  const cityOptions = [
    { value: '1', label: 'دبي' },
    { value: '2', label: 'أبوظبي' },
    { value: '3', label: 'الشارقة' },
    { value: '4', label: 'العين' },
    { value: '5', label: 'عجمان' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // عرض معاينة الصورة
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // تعيين قيمة الحقل
      setValue('profile_image', file);
    }
  };

  const onSubmit = async (data: CompanyRegisterFormData) => {
    setIsLoading(true);
    
    try {
      // إعداد FormData لأننا نرسل صورة
      const formData = new FormData();
      
      // إضافة جميع الحقول إلى FormData
      formData.append('client_type', 'company');
      formData.append('company_name', data.company_name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('city', data.city);
      formData.append('commercial_register', data.commercial_register);
      formData.append('company_bio', data.company_bio);
      formData.append('password', data.password);
      formData.append('password_confirmation', data.password_confirmation);
      formData.append('terms_accepted', 'true');
      
      // إضافة الصورة إذا كانت موجودة
      if (data.profile_image) {
        formData.append('profile_image', data.profile_image);
      }

      // إرسال البيانات إلى API
      const response = await apiServiceCall({
        url: 'auth/register',
        method: 'POST',
        body: formData,
        headers: {
          'Accept-Language': locale,
          "Content-Type": "multipart/form-data"
        },
      });

      if (response?.status_code === 200 || response?.status_code === 201) {
        toast.success(t('registration_success'));
        
        // إرسال التوكن إلى API route إذا كان موجوداً
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
                mobile: data.phone,
                userType: 'company'
              }),
            });
            
            if (!tokenResponse.ok) {
              console.error('Failed to store token');
            }
          } catch (tokenError) {
            console.error('Token storage error:', tokenError);
          }
        }

        // الانتقال إلى الصفحة الرئيسية بعد التسجيل الناجح
        setTimeout(() => {
          window.location.href = `/${locale}/login`;
        }, 2000);
      } else {
        toast.error(response?.message || t('registration_error'));
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error?.data?.message || t('registration_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const termsAccepted = watch('terms_accepted');

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto rounded-2xl grid lg:gap-6 gap-2 grid-cols-1 mt-7 lg:mt-0 lg:grid-cols-2"
      >
        {/* اسم الشركة */}
        <div>
          <InputComponent
            register={register}
            name="company_name"
            placeholder={t('company_name_placeholder')}
            type="text"
            icon={<Image src={user} alt={t('company_name_alt')} width={24} height={24} />}
          />
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-600">{t(errors.company_name.message)}</p>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <InputComponent
            register={register}
            name="email"
            placeholder={t('email_placeholder')}
            type="email"
            icon={<Image src={email} alt={t('email_alt')} width={24} height={24} />}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{t(errors.email.message)}</p>
          )}
        </div>

        {/* رقم الجوال */}
        <div>
          <InputComponent
            register={register}
            name="phone"
            placeholder={t('mobile_placeholder')}
            type="text"
            icon={<Image src={phone} alt={t('mobile_alt')} width={24} height={24} />}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{t(errors.phone.message)}</p>
          )}
        </div>

        {/* اختيار المدينة */}
        <div>
          <CustomSelect
            name="city"
            control={control}
            options={cityOptions}
            placeholder={t('city_placeholder')}
            icon={<Image src={location} alt={t('city_alt')} width={24} height={24} />}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{t(errors.city.message)}</p>
          )}
        </div>

        {/* رقم السجل التجاري */}
        <div>
          <InputComponent
            register={register}
            name="commercial_register"
            placeholder={t('commercial_register_placeholder')}
            type="text"
            icon={<Image src={check} alt={t('commercial_register_alt')} width={24} height={24} />}
          />
          {errors.commercial_register && (
            <p className="mt-1 text-sm text-red-600">{t(errors.commercial_register.message)}</p>
          )}
        </div>

        {/* نبذة عن الشركة */}
        <div>
          <InputComponent
            register={register}
            name="company_bio"
            placeholder={t('company_bio_placeholder')}
            type="text"
            icon={<Image src={user} alt={t('company_bio_alt')} width={24} height={24} />}
            isTextArea={true}
            rows={3}
          />
          {errors.company_bio && (
            <p className="mt-1 text-sm text-red-600">{t(errors.company_bio.message)}</p>
          )}
        </div>

        {/* كلمة المرور */}
        <div>
          <InputComponent
            register={register}
            name="password"
            type="password"
            placeholder={t('password_placeholder')}
            icon={<MdLockOutline className="text-3xl" />}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{t(errors.password.message)}</p>
          )}
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
            <p className="mt-1 text-sm text-red-600">{t(errors.password_confirmation.message)}</p>
          )}
        </div>

        {/* شعار الشركة - كامل العمود */}
        <div className="lg:col-span-2">
          <label
            htmlFor="profile_image"
            className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition relative overflow-hidden"
          >
            {selectedImage ? (
              <>
                <div className="absolute inset-0">
                  <Image
                    src={selectedImage}
                    alt="Preview"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="absolute bottom-2 bg-black/70 text-white text-sm px-3 py-1 rounded">
                  {t('change_image')}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 text-center">
                  <span className="font-semibold text-primary">{t('click_to_upload')}</span> {t('drag_or_click_here')}
                </p>
                <p className="text-xs text-gray-400 text-center">{t('image_size_format')}</p>
              </div>
            )}
            <input
              id="profile_image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          {errors.profile_image && (
            <p className="mt-1 text-sm text-red-600">{t(errors.profile_image.message)}</p>
          )}
        </div>

        {/* شروط الاستخدام */}
        <div className="lg:col-span-2">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms_accepted"
              {...register('terms_accepted')}
              className="mt-1 w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="terms_accepted" className="text-sm text-gray-700">
              {t('i_accept')}{' '}
              <a href={`/${locale}/terms`} className="text-primary hover:underline">
                {t('terms_and_conditions')}
              </a>{' '}
              {t('and')}{' '}
              <a href={`/${locale}/privacy`} className="text-primary hover:underline">
                {t('privacy_policy')}
              </a>
            </label>
          </div>
          {errors.terms_accepted && (
            <p className="mt-1 text-sm text-red-600">{t(errors.terms_accepted.message)}</p>
          )}
        </div>

        {/* زرار التسجيل - كامل العمود */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isLoading || !termsAccepted}
            className={`bg-primary text-white py-5 px-8 rounded-xl font-bold transition duration-300 w-full ${
              isLoading || !termsAccepted ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
          >
            {isLoading ? t('creating_account') : t('create_account_button')}
          </button>
        </div>
      </form>
    </>
  );
};

export default CompanyRegisterForm;