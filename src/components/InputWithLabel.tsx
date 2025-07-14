"use client";

import { InputHTMLAttributes } from "react";

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function InputWithLabel({ label, ...props }: InputWithLabelProps) {
  return (
    <div className="flex flex-col gap-2   w-full">
      <label className="text-sm font-medium px-2 text-gray-700">{label}</label>
      <input
        {...props}
        className="flex items-center w-full px-4  py-3 bg-gray-100 outline-none rounded-xl"
      />
    </div>
  );
}
