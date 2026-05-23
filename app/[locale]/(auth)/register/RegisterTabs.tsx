'use client';

import React, { useState } from 'react';
import ClientRegisterForm from './ClientRegisterForm';
import CompanyRegisterForm from './CompanyRegisterForm';
import Container from '@/components/shared/container';
import { useTranslations } from 'next-intl';

const RegisterTabs = () => {
  const [activeTab, setActiveTab] = useState<'client' | 'company'>('client');
  const t = useTranslations('RegisterPage')
  return (
      <div>
           <div className="w-full  mx-auto text-center">
      <div className="flex mx-5  max-w-md md:mx-auto bg-gray-100 rounded-xl overflow-hidden md:mb-8">
        <button
          onClick={() => setActiveTab('client')}
          className={`w-1/2 py-3 font-bold transition-all duration-300 ${
            activeTab === 'client'
              ? 'bg-primary  text-white'
              : 'text-gray-600 hover:text-primary '
          }`}
        >
           {t('register_as_client')}
          </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`w-1/2 py-3 font-bold transition-all duration-300 ${
            activeTab === 'company'
              ? 'bg-primary  text-white'
              : 'text-gray-600 hover:text-primary '
          }`}
        >
           {t('register_as_company')}
        </button>
      </div>
     <Container >
      <div className="transition-all duration-300">
        {activeTab === 'client' ? <ClientRegisterForm /> : <CompanyRegisterForm />}
      </div>
      </Container>
    </div>
      </div>
  );
};

export default RegisterTabs;
