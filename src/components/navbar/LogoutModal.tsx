'use client';
import React from 'react';
import logout from '@/public/images/logout.png';
import Image from 'next/image';
import apiServiceCall from '@/lib/apiServiceCall';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, token }) => {
  const locale = useLocale();
  const t = useTranslations('Logout');

  const handleLogout = () => {
    apiServiceCall({
      url: 'user/logout',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res?.message) {
          toast.success(res.message);
        } else {
          toast.success(t('successMessage'));
        }

        return fetch("/api/auth/logout", { method: "GET" });
      })
      .then(() => {
        window.location.href = `/${locale}/login`;
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(t('failMessage'));
        }
        console.error("Logout failed:", error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !z-[9999999] p-4">
      <div className="bg-white relative rounded-[15px] p-6 w-full max-w-md flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
          aria-label="Close Modal"
        >
          &times;
        </button>
        <h2 className="text-[22px] font-extrabold mb-4 text-[#EB2302]">{t('title')}</h2>
        <p className="mb-6 text-[#989898] font-medium text-base">
          {t('description')}
        </p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#EB2302] mt-5 text-white rounded-md flex items-center gap-2 justify-center w-full h-[62px]"
        >
          <Image src={logout} alt="logout" />
          {t('confirm')}
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
