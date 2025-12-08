import React from 'react'
import Container from './../../../src/components/shared/container/index';
import EditDataForm from './EditDataForm'
import { cookies } from "next/headers";

const page = () => {
    const cookieStore =  cookies();
    const token = cookieStore.get("token")?.value;
  return (
    <Container className = 'mt-10 min-h-screen'>
      <div className="flex flex-col gap-5 items-center justify-center ">
      <div className='text-center'>
       <h2 className='font-extrabold text-[29px] text-[#EB2302]'>تعديل بياناتي</h2>
       <h4 className='text-lg font-medium text-[#989898]'>يمكنك تعديل بيانات حسابك</h4>
      </div>
      <EditDataForm token = {token}/>
      </div>
    </Container>
  )
}

export default page
