'use client'
import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import img from '@/public/images/technical-support.png'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import apiServiceCall from '@/lib/apiServiceCall'
import { toast } from 'react-toastify'
import CustomSelect from '../../../src/components/shared/reusableComponents/CustomSelect'
import Container from '../shared/container'
import InputComponent from '../shared/reusableComponents/InputComponent'
import { useTranslations } from 'next-intl' 
import FileUploadField from '../shared/reusableComponents/FileUploadField'

const createContactFormSchema = (t: any) => z.object({
  fullName: z.string().min(3, t('validation.fullName')),
  phone: z.string().min(10, t('validation.phone')),
  email: z.string().email(t('validation.email')),
  messageType: z.string().min(1, t('validation.messageType')),
  message: z.string().min(10, t('validation.message'))
})

type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>
type FileWithPreview = {
  file: File;
  id: string;
  preview: string;
  isImage: boolean;
};
const TechnicalSupport = () => {
  const t = useTranslations('technicalSupport')

  const messageTypes = [
    { value: "Inquiry", label: t('messageTypes.inquiry') },
    { value: "Suggestion", label: t('messageTypes.suggestion') },
    { value: "Complaint", label: t('messageTypes.complaint') },
  ]

  const { 
    register, 
    control, 
    getValues,
    setValue,
    handleSubmit, 
    watch,
    formState: { errors },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(createContactFormSchema(t))
  })
const watchedFiles = watch("files") || [];
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ContactFormValues) => 
      apiServiceCall({
        url: 'contact-us/store',
        method: 'POST',
        body: data,
        headers:{
          'Content-Type': 'multipart/form-data',
          
        }
      }),
  onSuccess: () => {
  toast.success(t('form.success'), {
    position: 'top-right',
    autoClose: 5000,
    rtl: true
  });

  reset({
    fullName: "",
    phone: "",
    email: "",
    messageType: "",  
    message: "",
  });
},

    onError: (error: any) => {
      toast.error(error.data?.message || t('form.error'), {
        position: 'top-right',
        autoClose: 5000,
        rtl: true
      })
    }
  })

  const onSubmit = (data: ContactFormValues) => {
  const form = new FormData();

  // Append file if exists
  if (watchedFiles?.length > 0) {
    form.append("file", watchedFiles[0].file);
  }

  // Append other fields
  form.append("name", data.fullName);
  form.append("phone", data.phone);
  form.append("type", data.messageType);
  form.append("message_content", data.message);
  form.append("email", data.email);

  // Send FormData
  mutate(form);
};
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;

      const filesWithPreview: FileWithPreview[] = Array.from(
        e.target.files
      ).map((file) => {
        const isImage = file.type.startsWith("image/");
        return {
          file,
          id: `${file.name}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 11)}`,
          preview: isImage ? URL.createObjectURL(file) : "",
          isImage,
        };
      });

      const currentFiles = getValues("files") || [];
      setValue("files", [...currentFiles, ...filesWithPreview]);
      e.target.value = ""; // allow re-upload same file
    },
    [getValues, setValue]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      const currentFiles = getValues("files") || [];
      const fileToRemove = currentFiles.find((f) => f.id === fileId);
      if (fileToRemove?.isImage && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      setValue(
        "files",
        currentFiles.filter((f) => f.id !== fileId)
      );
    },
    [getValues, setValue]
  );
  return (
    <Container>
      <div className="flex flex-col lg:flex-row justify-between w-full gap-10 my-5 lg:my-10">
        <div>
          <div>
            <h2 className='font-extrabold text-primary   lg:text-[29px] text-lg'>{t('title')}</h2>
            <p className='text-[#989898]  lg:text-lg text-sm mt-4'>
              {t('description')}
            </p>
          </div>
          <Image 
            src={img} 
            alt='technical-support' 
            width={445.64} 
            height={399.53} 
            className='object-contain mt-5 lg:mt-10 lg:w-[445.64px] w-[70%] mx-auto lg:mx-0' 
          />
        </div>
        
        <div className='lg:w-1/2 w-full'>
          <form  className="space-y-5 w-full">
            <InputComponent
              register={register}
              name="fullName"
              type="text"
              placeholder={t('form.fullName')}
              error={errors.fullName?.message}
            />
            
            <InputComponent
              register={register}
              name="phone"
              type="text"
              placeholder={t('form.phone')}
              error={errors.phone?.message}
            />
            
            <InputComponent
              register={register}
              name="email"
              type="email"
              placeholder={t('form.email')}
            />

           
            <CustomSelect
              control={control}
              name="messageType"
              placeholder={t('form.messageType')}
              options={messageTypes}
              className="w-full text-right flex-row-reverse"
            />
            
            <div>
              <textarea 
                {...register('message')}
                placeholder={t('form.message')}
                className='bg-[#f5f5f5] p-5 h-[186px] text-xs md:text-lg rounded-[15px] outline-none w-full px-5'
              />
              {errors.message?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-primary text-white py-4  text-sm rounded-[15px] font-bold lg:text-lg disabled:opacity-70"
            >
              {isPending ? t('form.submitting') : t('form.submit')}
            </button>
          </form>
        </div>
      </div>
    </Container>
  )
}

export default TechnicalSupport