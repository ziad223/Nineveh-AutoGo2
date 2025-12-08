"use client";
import CustomSelect from "@/components/shared/reusableComponents/CustomSelect";
import { useForm } from "react-hook-form";
import upload from "@/public/images/ticket-upload.png";
import Image from "next/image";
import InputComponent from "@/components/shared/reusableComponents/InputComponent";
import tickrtSelled from "@/public/images/ticket-selled.png";
import close from "@/public/images/close.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiServiceCall from "@/lib/apiServiceCall";
import { useEffect, useState } from "react";
import { errorsHandling } from "@/lib/helper";
import Link from "next/link";
import SalesSteps from './SalesSteps';
import { FaInfoCircle } from 'react-icons/fa'; 
interface SelectTypes {
  value: string;
  label: string;
}

interface Ticket {
  stand_id: string;
  row_number: string;
  seat_number: string;
  price: string;
  image?: File | string;
  block_number : string
}

interface TicketFormValues {
  event_id: string;
  ticketCount: string;
  // adjacent: string;
  // adjacentSeats?: string;
  terms: boolean;
  tickets: Ticket[];
}

const SellYourTicketForm = ({ token }: { token: string }) => {
  const t = useTranslations("sellYourTicket");
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [standsData, setStandsData] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingStands, setIsLoadingStands] = useState(false);

  const locale = useLocale();

  // TODO: check if send success or not
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<TicketFormValues>({
    defaultValues: {
      ticketCount: "1",
      tickets: Array(10).fill({
        stand_id: "",
        row_number: "",
        seat_number: "",
        price: "",
        block_number : "",
        image: undefined,
      }),
      terms: false,
    },
  });

  const selectedEventId = watch("event_id");
  const ticketCount = parseInt(watch("ticketCount")) || 2;
  const ticketsWatch = watch("tickets");
  const isTermsChecked = watch("terms");

  // Fetch events
  const { data: events = [], isLoading: eventsLoading } = useQuery<
    SelectTypes[]
  >({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await apiServiceCall({
        url: "events",
        method: "GET",
      });
      return response.data.events.map((event: any) => ({
        value: event.id.toString(),
        label: event.title,
      }));
    },
    onError: () => {
      toast.error(t("errors.fetchEventsFailed"));
    },
  });

  useEffect(() => {
    const fetchStands = async () => {
      if (!selectedEventId) {
        setStandsData([]);
        return;
      }

      setIsLoadingStands(true);
      try {
        const response = await apiServiceCall({
          url: `stands/event/${selectedEventId}`,
          method: "GET",
        });

        if (response.status && response.data?.stands) {
          const formattedStands = response.data.stands.map((stand: any) => ({
            value: stand.id.toString(),
            label: stand.title,
          }));
          setStandsData(formattedStands);
        }
      } catch (error) {
        console.error("Failed to fetch stands:", error);
        toast.error(t("errors.fetchStandsFailed"));
        setStandsData([]);
      } finally {
        setIsLoadingStands(false);
      }
    };

    fetchStands();
  }, [selectedEventId]);

  // Submit tickets mutation
  const submitTicketsMutation = useMutation({
    mutationFn: async (data: TicketFormValues) => {
      const formData = new FormData();
      formData.append("event_id", data.event_id);
      // formData.append("adjacent", data.adjacent);

      // if (data.adjacentSeats) {
      //   formData.append("adjacentSeats", data.adjacentSeats);
      // }

      data.tickets.slice(0, ticketCount).forEach((ticket, index) => {
        formData.append(`tickets[${index}][stand_id]`, ticket.stand_id);
        formData.append(`tickets[${index}][row_number]`, ticket.row_number);
        formData.append(`tickets[${index}][seat_number]`, ticket.seat_number);
        formData.append(`tickets[${index}][price]`, ticket.price);
        formData.append(`tickets[${index}][block_number]`, ticket.block_number);

        if (ticket.image instanceof File) {
          formData.append(`tickets[${index}][image]`, ticket.image);
        }
      });

      return apiServiceCall({
        url: "tickets",
        method: "post",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      setIsFirstModalOpen(true);
      toast.success(t("success.ticketSubmitted"));
      reset();
      setValue("event_id", null);
    },
    onError: (error) => {
      // toast.error(error?.data?.message||error?.message?.error || t("errors.submitFailed"));
      errorsHandling(error, locale, true);
    },
  });

  const ticketNumbers = Array.from({ length: 10 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`,
  }));

  const onSubmit = (data: TicketFormValues) => {
    submitTicketsMutation.mutate(data);
  };

  const handleFileChange = (index: number, file: File | null) => {
    if (file) {
      setValue(`tickets.${index}.image`, file, {
        shouldDirty: true,
        shouldTouch: true,
      });
    } else {
      setValue(`tickets.${index}.image`, undefined, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const renderPreview = (img?: File | string) => {
    if (!img) {
      return <Image src={upload} alt="upload" width={40} height={40} />;
    }
    return typeof img === "string" ? (
      <img
        src={img}
        alt="ticket"
        className="w-full h-full object-cover rounded-[15px]"
      />
    ) : (
      <img
        src={URL.createObjectURL(img)}
        alt="ticket"
        className="w-full h-full object-cover rounded-[15px]"
      />
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ToastContainer />
        <div className="grid grid-cols-1 lg:grid-cols-4 mt-10 gap-5">
          <CustomSelect
            name="event_id"
            options={events}
            placeholder={t("selectEvent")}
            className="!mt-0"
            control={control}
            isLoading={eventsLoading}
          />

          <CustomSelect
            name="ticketCount"
            label={t("selectTicketCountLabel")}
            options={ticketNumbers}
            placeholder="2"
            className="!mt-0"
            control={control}
          />
        </div>

        {[...Array(ticketCount)].map((_, index) => (
          <div key={index} className="mt-10 border-t pt-5">
            <h2 className="text-[#EB2302] font-bold text-sm mb-5">
              {t("ticketInfoTitle", { number: index + 1 })}
            </h2>

            <div className="flex items-center gap-5">
              <label className="w-[118px] h-[104px] rounded-[15px] cursor-pointer bg-[#f5f5f5] flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    handleFileChange(index, file || null);
                  }}
                  className="hidden"
                />
                {renderPreview(
                  ticketsWatch?.[index]?.image as File | string | undefined
                )}
              </label>
              <div>
                <h2 className="text-base font-bold text-[#080C22]">
                  {t("ticketImage")}
                </h2>
                <h4 className="text-sm font-medium text-[#6A6A6A] mt-1">
                  {t("ticketImageDescription")}
                </h4>
              </div>
            </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mt-5 gap-5">
  <div className="col-span-1 md:col-span-2">
    <CustomSelect
      name={`tickets.${index}.stand_id`}
      options={standsData}
      placeholder={t("selectStand")}
      className="!mt-0"
      control={control}
      isLoading={isLoadingStands}
      isDisabled={!selectedEventId || isLoadingStands}
    />
  </div>

  <InputComponent
    register={register}
    name={`tickets.${index}.block_number`}
    type="text"
    placeholder={t("block_numberEnter")}
  />

  <InputComponent
    register={register}
    name={`tickets.${index}.row_number`}
    type="text"
    placeholder={t("enterRowNumber")}
  />

  <InputComponent
    register={register}
    name={`tickets.${index}.seat_number`}
    type="text"
    placeholder={t("enterSeatNumber")}
  />

  <p className="text-red-500 text-xs md:col-span-2 lg:col-span-5">{t("seatNote")}</p>

  <InputComponent
    register={register}
    name={`tickets.${index}.price`}
    type="text"
    placeholder={t("enterTicketPrice")}
  />
</div>



          </div>
        ))}
   <div className='my-10'>
        <SalesSteps />
      </div>
        <div className="mt-6">
          <input
            type="checkbox"
            id="terms"
            {...register("terms")}
            className="sr-only"
          />

          <div className="flex items-center justify-between w-fit">
            <button
              type="button"
              onClick={() =>
                setValue("terms", !isTermsChecked, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              aria-pressed={isTermsChecked}
              className={`w-6 h-6 rounded-full rtl:ml-2 ltr:mr-2 flex items-center justify-center transition-colors duration-200 ${
                isTermsChecked ? "bg-[#EB2302]" : "bg-[#DADADA]"
              }`}
            >
              <svg
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 3.5L3.5 6L9 1"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* {isTermsChecked && (
                <svg
                  width="10"
                  height="7"
                  viewBox="0 0 10 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 3.5L3.5 6L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )} */}

             

            </button>
            <label
              htmlFor="terms"
              className={`text-sm flex items-center gap-2 ${
                isTermsChecked ? "text-[#080C22]" : "text-[#989898]"
              }`}
            >
              <span>{t("agreeText")}</span>
              <Link
                href={`/${locale}/pages/${3}`}
                className="text-[#EB2302] underline hover:text-[#d02c00] font-bold"
              >
                {t("termsAndConditions")}
              </Link>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isTermsChecked || submitTicketsMutation.isPending}
          className={`lg:w-[413px] h-[64px] rounded-[15px] mt-5 text-white w-full ${
            !isTermsChecked || submitTicketsMutation.isPending
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#EB2302] hover:bg-[#d02c00]"
          }`}
        >
          {submitTicketsMutation.isPending
            ? t("submitting")
            : t("submitButton")}
        </button>
      </form>

      {isFirstModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-[18px] shadow-lg w-[90%] max-w-md text-center relative">
            <div className="absolute right-5 top-4 cursor-pointer">
              <Image
                src={close}
                alt="close"
                onClick={() => {
                  setIsFirstModalOpen(false);
                  setIsSecondModalOpen(true);
                }}
              />
            </div>

            <div className="w-[80%] mx-auto">
              <Image
                src={tickrtSelled}
                alt="tickrtSelled"
                className="mx-auto"
              />
              <h2 className="text-[22px] font-bold text-[#EB2302] mb-4">
                {t("successModal.title")}
              </h2>
              <p className="text-sm text-[#6A6A6A] mb-3 font-medium">
                {t("successModal.message")}
              </p>
              <button
                onClick={() => {
                  setIsFirstModalOpen(false);
                  setIsSecondModalOpen(true);
                }}
                className="bg-[#EB2302] text-white font-bold px-5 h-[64px] rounded-[10px] w-full mt-5"
              >
                {t("common.ok")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellYourTicketForm;
