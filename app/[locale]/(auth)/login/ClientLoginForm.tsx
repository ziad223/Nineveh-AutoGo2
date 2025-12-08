'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import { MdEmail, MdLockOutline } from 'react-icons/md';

const ClientLoginForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('Client login:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full">
      <InputComponent
        register={register}
        name="email"
        placeholder="البريد الإلكتروني"
        type="email"
        icon={<MdEmail className="text-2xl" />}
      />

      <InputComponent
        register={register}
        name="password"
        placeholder="كلمة المرور"
        type="password"
        icon={<MdLockOutline className="text-2xl" />}
      />

      <button
        type="submit"
        className="bg-primary text-white py-3 rounded-xl font-bold transition duration-300 w-full"
      >
        تسجيل الدخول
      </button>
    </form>
  );
};

export default ClientLoginForm;
