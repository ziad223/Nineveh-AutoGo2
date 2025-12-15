import React from 'react'
import SellYourService from './SellYourServiceForm'
import { cookies } from "next/headers";

const page = () => {
      const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <div>
        <SellYourService token = {token}/>
    </div>
  )
}

export default page