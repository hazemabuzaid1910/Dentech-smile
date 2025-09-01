"use client";

import React from 'react';

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  stylecc?: string;
  containerClassName?: string;
  inputContainerClassName?: string;
  inputClassName?: string;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  stylecc,
  label,
  icon,
  error,
  containerClassName = '',
  inputContainerClassName = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full  ${containerClassName}`}>
      <label className="px-2 text-sm font-semibold text-gray-700">{label}</label>
      <div className={`relative ${inputContainerClassName}`}>
        <div className={`flex items-center justify-center ${stylecc} px-4 transition-all duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus-within:border-teal-500 focus-within:bg-white`}>
          {icon && (
            <div className="mr-3 text-gray-400">
              {icon}
            </div>
          )}
          <input
            {...props}
            className={`w-full items-center justify-center flex py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 ${inputClassName}`}
          />
        </div>
        {error && (
          <p className="px-2 mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
      
    </div>
  );
};

export default InputWithLabel;
