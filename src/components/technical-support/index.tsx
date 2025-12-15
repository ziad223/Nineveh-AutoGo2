'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import apiServiceCall from '@/lib/apiServiceCall'
import { toast } from 'react-toastify'
import Container from '../shared/container'
import InputComponent from '../shared/reusableComponents/InputComponent'
import CustomSelect from '../../../src/components/shared/reusableComponents/CustomSelect'
import { useTranslations } from 'next-intl'
import { MdContactSupport } from "react-icons/md";

const createContactFormSchema = (t: any) => z.object({
  fullName: z.string().min(3, t('validation.fullName')),
  phone: z.string().min(10, t('validation.phone')),
  email: z.string().email(t('validation.email')),
  messageType: z.string().min(1, t('validation.messageType')),
  message: z.string().min(10, t('validation.message'))
})

type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>

const TechnicalSupport = () => {
  const t = useTranslations('technicalSupport')

  const messageTypes = [
    { value: 'inquiry', label: t('messageTypes.inquiry') },
    { value: 'suggestion', label: t('messageTypes.suggestion') },
    { value: 'complaint', label: t('messageTypes.complaint') },
  ]

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(createContactFormSchema(t))
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      apiServiceCall({
        url: 'support/messages',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      toast.success(t('form.success'), { position: 'top-right', autoClose: 5000, rtl: true })
      reset()
    },
    onError: (error: any) => {
      toast.error(error.data?.message || t('form.error'), { position: 'top-right', autoClose: 5000, rtl: true })
    }
  })

  const onSubmit = (data: ContactFormValues) => {
    const form = new FormData()
    form.append('full_name', data.fullName)
    form.append('phone', data.phone)
    form.append('email', data.email)
    form.append('message_type', data.messageType.toLowerCase())
    form.append('message', data.message)
    mutate(form)
  }

  return (
    <Container>
      <div className="flex flex-col lg:flex-row justify-between w-full gap-10 my-5 lg:my-10">
        {/* Right Side: Title & Description */}
        <div className="lg:w-1/2 w-full flex flex-col  text-start">
          <h2 className='font-extrabold text-primary lg:text-[29px] text-lg'>{t('title')}</h2>
          <p className='text-[#989898] lg:text-lg text-sm mt-4'>{t('description')}</p>
          <MdContactSupport size = {40} className='text-primary lg:w-[300px] lg:h-[300px] w-[150px] h-[150px]  mt-10'/>
        </div>

        {/* Left Side: Form */}
        <div className='lg:w-1/2 w-full'>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            <InputComponent register={register} name="fullName" type="text" placeholder={t('form.fullName')} error={errors.fullName?.message} />
            <InputComponent register={register} name="phone" type="text" placeholder={t('form.phone')} error={errors.phone?.message} />
            <InputComponent register={register} name="email" type="email" placeholder={t('form.email')} error={errors.email?.message} />

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
              {errors.message?.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <button type="submit" disabled={isPending} className="w-full bg-primary text-white py-4 text-sm rounded-[15px] font-bold lg:text-lg disabled:opacity-70">
              {isPending ? t('form.submitting') : t('form.submit')}
            </button>
          </form>
        </div>
      </div>
    </Container>
  )
}

export default TechnicalSupport
