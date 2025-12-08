'use client';
import React from 'react';
import Image from 'next/image';
import checkIcon from '@/public/images/correct-wallet.png';
import { useTranslation } from 'next-i18next';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('wallet'); 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl text-center relative">
        <Image src={checkIcon} alt="confirmed" width={93} height={74.28} className="mx-auto mb-4" />
        <h2 className="text-[#EB2302] font-bold text-[22px] mb-2">
          {t('confirmation.title')} {/* هنا سيتم استبدال النص بناءً على اللغة */}
        </h2>
        <p className="text-[#707070] text-sm mb-6">
          {t('confirmation.message')} {/* نص الرسالة المترجمة */}
        </p>
        <button
          onClick={onClose}
          className="bg-[#EB2302] text-white px-5 py-3 rounded-[12px] w-full"
        >
          {t('confirmation.button')} {/* نص الزر المترجم */}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
