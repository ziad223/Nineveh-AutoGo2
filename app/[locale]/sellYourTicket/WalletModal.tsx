'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import wallet from '@/public/images/wallet.png';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import ConfirmationModal from './ConfirmationModal';
import apiServiceCall from '@/lib/apiServiceCall';
import { toast } from 'react-toastify';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

const schema = z.object({
  bank_name: z.string().min(1, 'اسم البنك مطلوب'),
  name: z.string().min(1, 'الاسم مطلوب'),
  number: z.string().min(1, 'رقم الحساب مطلوب'),
  iban: z.string().min(1, 'رقم الآيبان مطلوب'),
});

type FormValues = z.infer<typeof schema>;

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, token }) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const locale = useLocale();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    try {
      await apiServiceCall({
        url: 'user/wallet/withdrawal',
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': locale,
          'Content-Type': 'application/json',
        },
      });

      toast.success('تم إنشاء المحفظة بنجاح');
      reset();
      setIsConfirmationOpen(true);
      router.refresh()
    } catch (error: any) {
      toast.error(error?.data?.message || 'حدث خطأ أثناء إنشاء المحفظة');
    }
  };

  const handleCloseAttempt = () => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 lg:w-[477px] w-[95%] mx-auto shadow-xl relative">
          <div className="flex items-center justify-center gap-3 flex-col">
            <Image src={wallet} alt="wallet" width={88.19} height={74.4} className="mx-auto" />
            <h2 className="text-[#EB2302] font-extrabold text-[22px]">إنشاء المحفظة</h2>
            <p className="text-[#989898] font-medium text-base lg:w-[346px] text-center">
              سيتم إنشاء محفظة حسابك تلقائيا لاستقبال أموال بيع تذاكرك
            </p>

            {showWarning && (
              <div className="text-red-500 font-medium p-2 bg-red-100 rounded-md">
                يجب إنشاء المحفظة لاستكمال عملية بيع التذاكر
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-5">
              <h3 className="text-[#989898] mb-4 font-medium text-base lg:w-[346px] text-center">
                ادخل بيانات حسابك البنكي لربط محفظتك به
              </h3>

              <InputComponent
                register={register}
                name="bank_name"
                type="text"
                placeholder="اختر البنك"
                error={errors.bank_name?.message}
              />
              <InputComponent
                register={register}
                name="name"
                type="text"
                placeholder="أدخل اسم الشخص"
                error={errors.name?.message}
              />
              <InputComponent
                register={register}
                name="number"
                type="text"
                placeholder="أدخل رقم الحساب"
                error={errors.number?.message}
              />
              <InputComponent
                register={register}
                name="iban"
                type="text"
                placeholder="أدخل رقم الآيبان"
                error={errors.iban?.message}
              />

              <button
                type="submit"
                className="bg-[#EB2302] h-[63px] rounded-[15px] cursor-pointer w-full text-white mt-4"
              >
                تأكيد البيانات
              </button>
            </form>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default WalletModal;