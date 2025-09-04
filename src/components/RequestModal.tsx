"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { X, Upload, Camera, FileImage } from "lucide-react";

interface ImageUploadInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  onFileChange?: (file: File | null) => void;  // 👈 سمحنا بـ null
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

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  if (onFileChange) {
  onFileChange(null);
}
  };

  return (
    <div className={`flex flex-col w-full gap-2 ${containerClassName}`}>
      {label && <label className="px-2 text-sm font-semibold text-gray-700">{label}</label>}

      <div
        className={`relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:border-teal-500 cursor-pointer transition-all duration-300 group ${inputClassName}`}
        onClick={() => fileInputRef.current?.click()}
        style={{ height: "220px" }}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <Image
              src={preview}
              alt="Preview"
              unoptimized
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 transition-all duration-300 bg-opacity-0 group-hover:bg-opacity-20" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 hover:scale-100"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-2 left-2 right-2">
              <div className="px-3 py-2 transition-all duration-300 transform translate-y-2 bg-white rounded-lg opacity-0 bg-opacity-90 backdrop-blur-sm group-hover:opacity-100 group-hover:translate-y-0">
                <p className="text-xs font-medium text-gray-700">Click to change image</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10 text-gray-500 transition-colors duration-300 group-hover:text-teal-600">
            <div className="p-4 mb-3 transition-all duration-300 bg-gray-100 rounded-full group-hover:bg-teal-50">
              {icon || <Upload size={32} className="transition-transform duration-300 group-hover:scale-110" />}
            </div>
            <p className="mb-1 text-sm font-medium">
              {props.placeholder || "Click to upload image"}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
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

// Main Modal Component
interface RequestModalProps {
  patientId: number | null;
  onClose: () => void;
}

export default function RequestModal({ patientId, onClose }: RequestModalProps) {
  const [xray, setXray] = useState<File | null>(null);
  const [realImage, setRealImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{xray?: string, realImage?: string}>({});

  const handleUpload = async (file: File, type: "x-ray" | "real-image") => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("patient_id", String(patientId || 1)); // استخدم 1 كقيمة افتراضية للاختبار
    formData.append("type", type);
    formData.append("image", file);

    const res = await fetch("http://127.0.0.1:8000/api/radiology-uploadImage", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',

      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload " + type);
    }
    return await res.json();
  };

  const validateFiles = () => {
    const newErrors: {xray?: string, realImage?: string} = {};
    
    if (!xray) {
      newErrors.xray = "X-Ray image is required";
    }
    if (!realImage) {
      newErrors.realImage = "Real image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFiles()) {
      return;
    }
    
    // Debug: Check files before submission
    console.log("Files before submission:", {
      xray: xray?.name,
      xraySize: xray?.size,
      realImage: realImage?.name, 
      realImageSize: realImage?.size,
      patientId: patientId
    });
    
    try {
      setLoading(true);
      setErrors({});
      
      // إرسال كل صورة بطلب منفصل
      console.log("Uploading X-Ray...");
      await handleUpload(xray!, "x-ray");
      
      console.log("Uploading Real Image...");
      await handleUpload(realImage!, "real-image");
      
      alert("Request created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error uploading images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl overflow-hidden duration-300 transform bg-white shadow-2xl rounded-2xl animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="relative flex items-center justify-between px-8 py-6 bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-white">Add New Request</h2>
            <p className="text-sm text-teal-100">Upload X-Ray and Real Images for Analysis</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-all duration-200 rounded-xl hover:bg-white hover:bg-opacity-20 group"
          >
            <X className="text-white transition-transform duration-200 group-hover:rotate-90" size={24} />
          </button>
          
          <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 bg-white rounded-full opacity-5"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 -translate-x-10 translate-y-10 bg-white rounded-full opacity-5"></div>
        </div>

        <div className="p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <ImageUploadInput
                label="X-Ray Image"
                placeholder="Upload X-Ray image"
                icon={<FileImage size={32} />}
                onFileChange={(file) => {
                  setXray(file);
                  if (file && errors.xray) {
                    setErrors(prev => ({...prev, xray: undefined}));
                  }
                }}
                error={errors.xray}
                containerClassName="h-full"
              />
            </div>

            <div className="space-y-2">
              <ImageUploadInput
                label="Real Image"
                placeholder="Upload real image"
                icon={<Camera size={32} />}
                onFileChange={(file) => {
                  setRealImage(file);
                  if (file && errors.realImage) {
                    setErrors(prev => ({...prev, realImage: undefined}));
                  }
                }}
                error={errors.realImage}
                containerClassName="h-full"
              />
            </div>
          </div>

          <div className="p-4 mt-8 border border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Upload className="text-teal-600" size={20} />
              </div>
              <div>
                <h4 className="mb-1 font-semibold text-gray-800">Upload Guidelines</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Supported formats: PNG, JPG, GIF</li>
                  <li>• Maximum file size: 10MB per image</li>
                  <li>• Ensure images are clear and well-lit</li>
                  <li>• Both X-Ray and Real images are required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">
            Patient ID: <span className="font-medium text-gray-700">#{patientId}</span>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 font-semibold text-gray-600 transition-all duration-200 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !xray || !realImage}
              className="flex items-center gap-2 px-8 py-3 font-semibold text-white transition-all duration-200 transform shadow-lg rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Save Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}