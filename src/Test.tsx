"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import CustomSelect from './components/shared/reusableComponents/CustomSelect'
import { Link } from 'lucide-react'


function Test() {
  const {control} = useForm()
  return (
    <div>
      <Link href={{ pathname: '/', query: { scrollTo: 'about' } }}>Features</Link>
<CustomSelect control={control} options={[{value:"amr", label:'amr'}]} label='amory' placeholder='select amr' />

    </div>
  )
}

export default Test