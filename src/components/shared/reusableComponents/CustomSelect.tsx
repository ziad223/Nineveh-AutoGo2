'use client';
import * as React from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectTypes = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  name: string;
  control: any;
  placeholder?: string;
  label?: string;
  options: SelectTypes[];
  className?: string;
  icon?: React.ReactNode;
  defaultValue?: string; // 
}

export default function CustomSelect({
  name,
  control,
  placeholder,
  label,
  options,
  className,
  icon,
  defaultValue, // 
}: CustomSelectProps) {
  return (
    <div className={`relative w-full lg:mb-4 mb-0 ${className ?? ""}`}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue} // لضمان التهيئة داخل RHF
        render={({ field }) => (
          <>
            {label && (
              <span className="absolute right-4 top-[6px] text-xs text-gray-500 z-20">
                {label}
              </span>
            )}

            {icon && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                {icon}
              </div>
            )}

            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                className={`
                  btn-select bg-[#f5f5f5] w-full md:h-[64px] h-[50px]  ${icon ? 'pr-12' : 'pr-5' }  pl-4 border rounded-xl
                  outline-none transition placeholder:text-[#989898]  text-xs md:text-lg
                  text-right relative
                `}
              >
                <SelectValue placeholder={placeholder ?? "اختر..."} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        )}
      />
    </div>
  );
}
