import React from 'react';
import Container from '@/components/shared/container';
import wallet from '@/public/images/wallet-page.png';
import Image from 'next/image';
import AddBankButton from './AddBankButton';
import AccountBalance from './AccountBalance';
import apiServiceCall from '@/lib/apiServiceCall';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';

const page = async () => {
  const token = cookies().get('token')?.value;

  const t = await getTranslations('wallet'); 

  const walletResponse = await apiServiceCall({
    url: 'user/wallet/balance',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { balance, bank, operations } = walletResponse.data;
  const hasBankAccount = !!bank;

  return (
    <Container>
      <div className="flex my-20 items-center justify-center min-h-screen flex-col gap-5 px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-bold text-[24px] sm:text-[29px] text-[#EB2302]">{t('title')}</h2>
          <p className="text-[#989898] font-medium text-base sm:text-lg">
            {t('description')}
          </p>
        </div>

        {hasBankAccount ? (
          <AccountBalance
            balance={balance}
            bank={bank}
            operations={operations}
            token={token}
          />
        ) : (
          <div className="mt-10 sm:mt-20 flex flex-col items-center gap-2  justify-center w-full">
            <Image src={wallet} alt="wallet" className="w-[180px] sm:w-auto h-auto" />
            <div className="mt-5 text-center w-full">
              <h2 className="font-extrabold text-[#080C22] text-base sm:text-lg">{t('noBankTitle')}</h2>
              <h3 className="mt-2 text-[#707070] text-sm font-medium max-w-[273px] mx-auto px-2">
                {t('noBankDescription')}
              </h3>
              <AddBankButton token={token} />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default page;
