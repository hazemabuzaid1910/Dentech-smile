"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

interface ImageUploadInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  onFileChange?: (file: File) => void;    
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  icon,
  error,
  containerClassName = "",
  inputClassName = "",
  onFileChange,
  ...props
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (onFileChange) {
        onFileChange(file);
      }
    }

    if (props.onChange) props.onChange(e);
  };

  return (
    <div className={`flex flex-col w-full gap-2 ${containerClassName}`}>
      {label && <label className="px-2 text-sm font-semibold text-gray-700">{label}</label>}

      <div
        className={`relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:border-teal-500 cursor-pointer transition-all duration-200 ${inputClassName}`}
        onClick={() => fileInputRef.current?.click()}
        style={{ height: "200px" }} // تأكد من وجود ارتفاع للصورة عند استخدام fill
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            unoptimized
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10 text-sm text-gray-400">
            {icon && <div className="mb-2">{icon}</div>}
            {props.placeholder || "Click to upload image"}
          </div>
        )}

        <input
          {...props}
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="px-2 mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploadInput;
