'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import wallet from '@/public/images/wallet.png';
import sar from '@/public/images/redSar.png';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import apiServiceCall from '@/lib/apiServiceCall';
import { useLocale, useTranslations } from 'next-intl';

interface Bank {
  id: number;
  name: string;
  number: string;
  iban: string;
  bank_name: string;
}

interface Operation {
  id: number;
  status: string;
  content: string;
  created_at: string;
}

interface AccountBalanceProps {
  balance: number;
  bank: Bank;
  operations: Operation[];
  token: string;
}

interface FormValues {
  amount: string;
}

const AccountBalance: React.FC<AccountBalanceProps> = ({ balance, bank, operations, token }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const locale = useLocale();
  const t = useTranslations('wallet');

  return (
    <div className="mt-14 w-full lg:w-[50%]">
      <Image src={wallet} alt="wallet" width={159} height={121} className="mx-auto" />

      <div className="flex flex-col gap-2 items-center justify-center mt-5">
        <p className="text-sm font-medium text-[#707070]">{t('wallet_balance')}</p>
        <div className="flex items-center gap-2">
          <span className="text-[43px] text-[#EB2302] font-bold">{balance}</span>
          <Image src={sar} alt="sar" width={42.92} height={36} />
        </div>
      </div>

      <div className="bg-[#f5f5f6] mt-5 !w-full lg:w-[414px] p-5 rounded-[15px] flex items-center justify-between">
        <div>
          <h3>{bank.bank_name}</h3>
          <h2 className="my-1">{bank.name}</h2>
          <h4>{bank.number}</h4>
          <p className="text-xs text-gray-500 mt-1 break-all">
            {bank.iban?.slice(0, 5)} ************** {bank.iban?.slice(-2)}
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#EB2302] text-white mt-8 py-2 px-4 rounded-md w-full h-[62.67px]"
      >
        {t('withdraw_request')}
      </button>

      {operations?.length > 0 && (
        <div className="mt-10 lg:w-[414px] mx-auto">
          <h3 className="text-lg font-bold text-[#EB2302] mb-4">{t('wallet_history')}</h3>
          <ul className="flex flex-col gap-4">
            {operations.map((operation) => (
              <li key={operation.id} className="bg-white shadow p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#333]">
                    {operation.content}
                  </span>
                  <span className="text-xs text-gray-500">{operation.created_at}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <WithdrawModal onClose={() => setIsModalOpen(false)} token={token} locale={locale} />
      )}
    </div>
  );
};

interface ModalProps {
  onClose: () => void;
  token: string;
  locale: string;
}

const WithdrawModal: React.FC<ModalProps> = ({ onClose, token, locale }) => {
  const t = useTranslations('wallet');
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await apiServiceCall({
        url: 'user/wallet/withdrawal/amount',
        method: 'POST',
        body: { amount: data.amount },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale
        }
      });

      toast.success(response?.message || t('request_sent_successfully'));
      reset();
      onClose();
    } catch (error: any) {
      const errorMsg = error?.data?.message || t('request_error');
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] lg:w-[477px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>
        <h2 className="text-[22px] text-[#EB2302] font-extrabold mb-4 text-center">{t('withdraw_request')}</h2>
        <p className="text-gray-600 mb-6 text-center">
          {t('withdraw_instruction')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="my-5">
          <InputComponent
            register={register}
            name="amount"
            type="text"
            placeholder={t('amount_placeholder')}
          />

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="bg-[#EB2302] text-white px-6 py-2 rounded h-[62.5px] w-full"
            >
              {t('send_request')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountBalance;
