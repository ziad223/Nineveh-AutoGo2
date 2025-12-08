'use client'
import React from 'react';
import ReactDOM from 'react-dom';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslations } from 'next-intl';
import apiServiceCall from "@/lib/apiServiceCall";
import {useRouter} from 'next/navigation'
type CancelTicketModalProps = {
  ticketId: number;
  onClose: () => void;
  token: string;
};

const CancelTicketModal = ({ ticketId, onClose, token }: CancelTicketModalProps) => {
  const router = useRouter()
  if (typeof window === 'undefined') return null;

  const t = useTranslations('CancelTicketModal');

  const mutation = useMutation({
    mutationFn: async () => {
      return apiServiceCall({
        url: `tickets/${ticketId}/cancel`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success(t('success'));
      onClose();
      router.refresh();
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || t('error'));
    }
  });

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-red-600">{t('title')}</h2>
        <p className="text-sm text-gray-600 mt-2">
          {t('confirmation', { ticketId })}
        </p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
            onClick={onClose}
          >
            {t('close')}
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? t('loading') : t('confirm')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CancelTicketModal;
