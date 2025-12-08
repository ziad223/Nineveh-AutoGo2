  'use client'
  import React, { useState, useEffect } from 'react';
  import ReactDOM from 'react-dom';
  import { useForm } from "react-hook-form";
  import { useMutation } from "@tanstack/react-query";
  import { toast } from "react-toastify";
  import { useTranslations } from "next-intl";
  import apiServiceCall from "@/lib/apiServiceCall";
  import CustomSelectTicket from '../../../src/components/shared/reusableComponents/CustomSelectTicket';
import { useRouter } from "next/navigation";
  type Ticket = {
    seatNumber: string | number;
    rowNumber: string | number;
    boxNumber: string | number;
    price: string | number;
    image?: string;
    stand_id?: string | number;
    block_number?: string | number;
  };

  type EditTicketModalProps = {
    ticketId: number;
    ticketData: Ticket; 
    onClose: () => void;
    token : string;
    eventId : string;
  };

  const EditTicketModal = ({ ticketId, ticketData, onClose , token , eventId }: EditTicketModalProps) => {
    console.log(ticketData)
    const [previewImage, setPreviewImage] = useState(ticketData.image || '');
    const [ticketImage, setTicketImage] = useState<File | null>(null);
    const [stands, setStands] = useState<{id:number; name:string}[]>([]);
  console.log(ticketData)
    const t = useTranslations('EditTicketModal');
  const router = useRouter();

    const { register, handleSubmit, setValue, control } = useForm({
      defaultValues: {
        seat_number: ticketData.seatNumber,
        row_number: ticketData.rowNumber,
        block_number: ticketData.boxNumber,
        price: ticketData.price,
        ticketStand: {label:ticketData?.ticketStand,value:ticketData?.stand_id},
        stand_id: ticketData.stand_id ? ticketData.stand_id.toString() : ""
      }
    });
    console.log(ticketData, 'cccccccccccccccccc')
useEffect(() => {
  const fetchStands = async () => {
    try {
      const res = await apiServiceCall({
        url: `stands/event/${eventId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      setStands(res?.data?.stands || []);
    } catch (error) {
      console.error("Error fetching stands:", error);
    }
  };

  if (eventId) {
    fetchStands();
  }
}, [eventId, token]);

    useEffect(() => {
      setPreviewImage(ticketData.image || '');
      setValue('seat_number', ticketData.seatNumber);
      setValue('row_number', ticketData.rowNumber);
      setValue('block_number', ticketData.boxNumber);
      setValue('price', ticketData.price);
      setValue('stand_id', ticketData.stand_id ? ticketData.stand_id.toString() : ""); 
    }, [ticketData, ticketId, setValue]);

    const mutation = useMutation({
      mutationFn: async (data: FormData) => {
        return apiServiceCall({
          url: `tickets/${ticketId}`,
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      },
      onSuccess: (res: any) => {
        toast.success(res?.data?.message || t('success'));
        onClose();
        router.refresh();
      },
      onError: (err: any) => {
        toast.error(err?.data?.message || t('error'));
      }
    });

    const onSubmit = (formData: any) => {
      const data = new FormData();
      data.append("_method", "PUT"); 
      data.append("stand_id", formData.stand_id); 
      data.append("row_number", formData.row_number);
      data.append("seat_number", formData.seat_number);
      data.append("price", formData.price);
      data.append("block_number", formData.block_number);
      if (ticketImage) data.append("image", ticketImage);
      mutation.mutate(data);
    };

    if (typeof window === "undefined") return null;

    return ReactDOM.createPortal(
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 lg:w-[60%] w-[95%] max-w-2xl">
          <h2 className="text-lg font-semibold text-green-600">{t('title')}</h2>
          <p className="text-sm text-gray-600 mt-2">{t('subtitle', { ticketId })}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">{t('seatNumber')}</label>
              <input
                type="text"
                {...register("seat_number")}
                className="w-full mt-1 p-2 outline-none border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">{t('rowNumber')}</label>
              <input
                type="text"
                {...register("row_number")}
                className="w-full mt-1 p-2 outline-none border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">{t('blockNumber')}</label>
              <input
                type="text"
                {...register("block_number")}
                className="w-full mt-1 p-2 outline-none border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">{t('price')}</label>
              <input
                type="text"
                {...register("price")}
                className="w-full mt-1 p-2 outline-none border border-gray-300 rounded-md"
              />
            </div>

           <div className="col-span-1">
  <label className="block text-sm text-gray-700">{t("stand")}</label>
  <CustomSelectTicket
    name="stand_id"
    control={control}
    options={stands.map((stand) => ({
      value: stand.id.toString(),
      label: stand.title, 
    }))}
    placeholder={t("standPlaceholder")}
    // defaultValue={  ticketData?.ticketStand  }
  />
</div>

            <div className="col-span-2">
              <input
                type="file"
                accept="image/*"
                id={`ticket-image-${ticketId}`}
                className="hidden"
                onChange={(e) => {
                  setTicketImage(e.target.files ? e.target.files[0] : null);
                  if (e.target.files && e.target.files[0]) {
                    setPreviewImage(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
              <label htmlFor={`ticket-image-${ticketId}`} className="cursor-pointer">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={t('ticketImage')}
                    className="mt-1 w-full h-40 object-cover rounded-md border"
                  />
                ) : (
                  <div className="mt-1 w-full h-40 flex items-center justify-center border rounded-md bg-gray-100 text-gray-400">
                    {t('chooseImage')}
                  </div>
                )}
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
                onClick={onClose}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? t('loading') : t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>,
      document.body
    );
  };

  export default EditTicketModal;
