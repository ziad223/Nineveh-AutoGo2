
"use client"
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'

const ConfirmWalletModal = ({onClose}:{onClose:()=>void}) => {
    const locale =useLocale()
    const router = useRouter()
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !z-[9999999] p-4">
        <div className="bg-white relative rounded-[15px] p-6 w-full max-w-md flex flex-col items-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
            aria-label="Close Modal"
          >
            &times;
          </button>
          <p className="mb-6 text-[#989898] font-medium text-base mt-10">
            {locale === "ar"?"لم تقم بربط محفظتك يرجي الربط اولا لاستخدام تلك الخدمه" :"You have not linked your wallet. Please link it first to use this service."}
          </p>
          <button
            onClick={()=>{
                router.push(`/${locale}/wallet`)
                onClose()
            }}
            className="px-4 py-2 bg-[#EB2302] mt-5  text-white rounded-md flex items-center gap-2 justify-center w-full h-[62px]"
          >
           {locale === "ar"?"انشاء محفظة" :"Create Wallet"}
          </button>
        </div>
      </div> 
  )
}

export default ConfirmWalletModal