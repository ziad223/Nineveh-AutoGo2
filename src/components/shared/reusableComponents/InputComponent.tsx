'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputComponentProps {
  register: UseFormRegister<any>;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error:string;
  className?: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  register,
  name,
  type = 'text',
  error,
  placeholder,
  icon,
  className = '',
}) => {
  return (
    <div className={`relative w-full mb-4 ${className}`}>
      {icon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`bg-[#f5f5f5] w-full md:h-[64px] h-[50px] ${icon ? 'pr-12' : 'pr-5'} pl-4 border rounded-xl outline-none placeholder:text-xs md:placeholder:text-lg transition placeholder:text-[#989898]`}
      />

      {error&& <p className='text-red-500'>{error}</p>}
    </div>
  );
};

export default InputComponent;
