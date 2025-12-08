'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import Image from 'next/image';
import loginPhone from '@/public/images/login-phone.png';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import OtpCode from './OtpCode';
import apiServiceCall from '@/lib/apiServiceCall';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useTranslations , useLocale } from 'next-intl';
import { MdLockOutline } from 'react-icons/md';

const loginSchema = z.object({
  mobile: z.string().regex(/^05\d{8}$/, 'mobile_invalid'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const t = useTranslations('Login');
  const locale = useLocale();
  const [mobile, setMobile] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => {
      let uuid = localStorage.getItem('uuid');
      let deviceToken = localStorage.getItem('device_token');
      
      if (!uuid) {
        uuid = uuidv4();
        localStorage.setItem('uuid', uuid);
      }
      
      if (!deviceToken) {
        deviceToken = uuidv4();
        localStorage.setItem('device_token', deviceToken);
      }

      return apiServiceCall({
        url: 'login',
        method: 'POST',
        body: {
          mobile: data.mobile,
          uuid,
          device_token: deviceToken,
          device_type: 'web'
        },
        headers : {
          "Accept-Language" : locale
        }
      });
    },
    onSuccess: (response) => {
      toast.success(t(response.message) || t('otp_sent'));
      setMobile(response.data?.mobile || mobile);
      
      const code = response.data?.code;
      if (code) {
        localStorage.setItem('code', JSON.stringify(code));
      }
    },
    onError: (error: any) => {
      if (error?.status === 302) {
        toast.success(t(error.data?.message) || t('otp_sent'));
        setIsModalOpen(true);
        setMobile(error.data?.data?.mobile || mobile);
        
        const code = error.data?.data?.code;
        if (code) {
          localStorage.setItem('code', JSON.stringify(code));
        }
      } else {
        toast.error(t(error.data?.message) || t('login_error'));
      }
    }
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <form className='flex flex-col w-full' onSubmit={handleSubmit(onSubmit)}>
        <ToastContainer />
        <div className="">
          <InputComponent
            register={register}
            name="mobile"
            type="text"
            placeholder={t('mobile_placeholder')}
            icon={<Image src={loginPhone} alt='loginPhone' width={24} height={24} />}
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-600">
              {t(errors.mobile.message || 'mobile_invalid')}
            </p>
          )}
        </div>
         <div className="mb-4">
          <InputComponent
            register={register}
            name="mobile"
            type="text"
            placeholder='أدخل كلمة المرور'
            icon={<MdLockOutline  className='text-3xl'/>}
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-600">
              {t(errors.mobile.message || 'mobile_invalid')}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className='bg-primary  w-full text-white py-3 rounded-lg font-bold transition duration-300 hover:bg-[#d02c00] disabled:opacity-70 disabled:cursor-not-allowed'
        >
          {loginMutation.isPending ? t('logging_in') : t('login')}
        </button>
      </form>

   
    </>
  );
};

export default LoginForm;