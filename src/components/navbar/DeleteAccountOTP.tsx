'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import apiServiceCall from '@/lib/apiServiceCall';
import { toast } from 'react-toastify';
import otpCode from '@/public/images/otp-code.png';
import { useLocale, useTranslations } from 'next-intl';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResendCode?: () => void;
  mobileNumber: string;
  token: string;
}

const DeleteAccountOTP: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onResendCode,
  mobileNumber,
  token,
}) => {
  const [countdown, setCountdown] = useState(105);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { handleSubmit, setValue, getValues } = useForm();
  const locale = useLocale();
  const t = useTranslations('DeleteAccountOTP');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0 && isOpen) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }

    return () => clearTimeout(timer);
  }, [countdown, isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const verifyMutation = useMutation({
    mutationFn: async (data: { mobile: string; otp: string }) => {
      const response = await apiServiceCall({
        url: 'user/delete-account',
        method: 'POST',
        body: {
          mobile: data.mobile,
          otp: data.otp,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response) {
        throw new Error('No response from server');
      }

      return response;
    },
    onSuccess: async (res) => {
      if (res?.status) {
        toast.success(res.message || t('successMessage'));
         fetch("/api/auth/logout", { method: "GET" });

        window.location.href = `/${locale}/login`;
      } else {
        toast.error(res?.message || t('errorMessage'));
      }
    },
    onError: (error: any) => {
      console.error('Verification error:', error);
      toast.error(error?.data?.message || t('verificationFailed'));
    },
  });

  const handleResendCode = () => {
    if (!canResend) return;

    if (onResendCode) {
      onResendCode();
    } else {
      toast.info(t('newCodeSent'));
    }

    setCountdown(105);
    setCanResend(false);
  };

  const onSubmit = () => {
    const code = Array.from({ length: 6 }, (_, i) => getValues(`digit${i}`)).join('');

    if (code.length !== 6) {
      toast.error(t('invalidCode'));
      return;
    }

    verifyMutation.mutate({
      mobile: mobileNumber.toString(),
      otp: code,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, '');
    if (!value && e.target.value !== '') return;

    setValue(`digit${index}`, value);

    if (value && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      handleSubmit(onSubmit)();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');

    if (pasteData.length === 6) {
      pasteData.split('').forEach((char, i) => {
        if (i < 6) {
          setValue(`digit${i}`, char);
          if (inputsRef.current[i]) {
            inputsRef.current[i]!.value = char;
          }
        }
      });
      inputsRef.current[5]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white lg:w-[477px] w-[95%] lg:h-[580px] rounded-lg shadow-lg max-w-md p-2 lg:p-6 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 w-[26px] h-[26px] rounded-full flex items-center justify-center border border-[#f5f5f5] text-gray-500 hover:text-gray-700 text-lg font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col gap-5 items-center justify-center mt-10">
          <Image src={otpCode} alt="OTP Code" width={91} height={188} priority />
          <h2 className="text-[#EB2302] font-bold text-[22px]">{t('verificationCode')}</h2>
          <p className="text-[#989898] text-base text-center">
            {t('verificationMessage')}
          </p>
          <h5 className="text-sm font-medium text-[#080C22]">{mobileNumber}</h5>

          <form onSubmit={handleSubmit(onSubmit)} dir="ltr" className="w-full">
            <div
              className="flex items-center justify-center gap-2 mt-5 flex-wrap"
              onPaste={handlePaste}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="one-time-code"
                  {...(i === 0 && { autoFocus: true })}
                  className="md:w-[53px] w-[48px] text-center text-2xl h-[65px] bg-[#f5f5f5] outline-none rounded-[15px] focus:ring-2 focus:ring-[#EB2302]"
                  ref={(el) => (inputsRef.current[i] = el)}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !e.currentTarget.value && i > 0) {
                      inputsRef.current[i - 1]?.focus();
                    }
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full h-[65px] mt-5 rounded-[15px] text-lg text-white cursor-pointer bg-[#EB2302] hover:bg-[#d02c00] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {verifyMutation.isPending ? t('verifying') : t('verifyButton')}
            </button>
          </form>

          <div className="flex flex-col gap-1 mt-4 text-center">
            {canResend ? (
              <button
                onClick={handleResendCode}
                className="text-[#EB2302] font-medium text-sm hover:underline"
              >
                {t('resendCode')}
              </button>
            ) : (
              <>
                <span className="text-[#989898] text-sm">{t('requestNewCode')}</span>
                <span className="text-sm font-medium text-[#EB2302]">
                  {formatTime(countdown)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountOTP;