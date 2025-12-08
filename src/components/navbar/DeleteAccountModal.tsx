'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import img from '@/public/images/remove-account.png';
import apiServiceCall from '@/lib/apiServiceCall';
import { toast } from 'react-toastify';
import DeleteAccountOTP from './DeleteAccountOTP';
import { useTranslations } from 'next-intl';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  token: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  token,
}) => {
  const t = useTranslations('DeleteAccount');
  const [mobile, setMobile] = useState<string>('');
  const [showOTPModal, setShowOTPModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiServiceCall({
          method: 'get',
          url: 'user/profile',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userMobile = response?.data?.user?.mobile;
        if (userMobile) {
          setMobile(userMobile);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.data?.message ||
            error?.data?.message ||
            error?.data?.data?.message ||
            t('fetchError')
        );
      }
    };

    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen, token, t]);

  const handleDelete = async () => {
    try {
      const response = await apiServiceCall({
        method: 'post',
        url: 'user/delete-account/resend-code',
        body: JSON.stringify({ mobile }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const status = response?.status;
      const message = response?.message;

      if (status) {
        toast.success(message || t('codeSent'));
        setShowOTPModal(true);
      } else {
        toast.error(message || t('actionFailed'));
      }
    } catch (error: any) {
      const status = error?.response?.status || error?.status;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.data?.message ||
        t('deleteError');

      toast.error(message || t('unexpectedError'));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[90%] lg:w-[477px] relative text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
            aria-label="Close Modal"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold text-[#EB2302] mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 mb-6">{t('description')}</p>
          <div className="flex flex-col justify-center gap-4">
            <button
              onClick={handleDelete}
              className="bg-[#EB2302] flex items-center justify-center gap-2 h-[63.5px] text-white px-4 py-2 rounded"
            >
              <Image src={img} alt={t('removeAlt')} />
              {t('deleteButton')}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 h-[63.4px] text-gray-800 px-4 py-2 rounded"
            >
              {t('cancelButton')}
            </button>
          </div>
        </div>
      </div>

      {showOTPModal && (
        <DeleteAccountOTP
          token={token}
          mobileNumber={mobile}
          onClose={() => setShowOTPModal(false)}
        />
      )}
    </>
  );
};

export default DeleteAccountModal;
