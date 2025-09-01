"use client"
import React, { useState } from 'react';
import { Phone, Shield, ArrowRight } from 'lucide-react';
import useAuthStoreA from '@/app/store/AuthStore';
import { useRouter } from 'next/navigation';
interface InputWithLabelProps {
  label?: string;
  placeholder: string;
  type: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface FormData {
  name: string;
  phone: string;
  specialty: string;
}

// InputWithLabel Component (assuming this is your custom component)
const InputWithLabel: React.FC<InputWithLabelProps> = ({ label, placeholder, type, icon, value, onChange, required }) => {
  return (
    <div className="relative w-full">
      {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full py-3 pl-12 pr-4 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 hover:bg-white focus:bg-white"
        />
      </div>
    </div>
  );
};

function Page(): React.ReactElement {
  const router=useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    specialty: ''
  });
  const {sendOtp}=useAuthStoreA()
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    sendOtp(formData.phone)
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/sendcode")

      }, 3000);
    }, 2000);
  };

  const handleResend = (): void => {
    // Handle resend logic
    console.log('Resending verification code...');
  };

  return (
    <div className="flex items-center justify-center max-h-screen p-4">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute w-24 h-24 rounded-full -top-4 -left-4 bg-gradient-to-r from-teal-200 to-teal-200 opacity-20 animate-pulse"></div>
        <div className="absolute w-32 h-32 delay-1000 rounded-full -bottom-8 -right-8 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-15 animate-pulse"></div>
        
        {/* Main card */}
        <div className="relative items-center justify-center w-full max-w-md overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl">
          {/* Header with gradient background */}
          <div className="relative p-8 overflow-hidden text-center bg-gradient-to-r from-teal-500 via-teal-600 to-teal-400">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">Reset Password</h1>
              <p className="text-sm text-teal-50">Enter your phone number to receive a verification code</p>
            </div>
          </div>

          {/* Form content */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <InputWithLabel
                  label=""
                  placeholder="Enter your phone number..."
                  type="tel"
                  icon={<Phone size={18} />}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Shield size={12} />
                  Your phone number is secure and encrypted
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !formData.phone.trim()}
                className={`
                  w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold text-white 
                  transition-all duration-300 rounded-xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${
                    isSuccess 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                      : 'bg-gradient-to-r from-teal-500 to-teal-500 hover:from-teal-600 hover:to-teal-700'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                    Sending...
                  </>
                ) : isSuccess ? (
                  <>
                    <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    Code Sent Successfully!
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            {/* Additional info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the code?{' '}
                <button 
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-teal-600 transition-colors hover:text-teal-700 underline-offset-2 hover:underline"
                >
                  Resend in 60s
                </button>
              </p>
            </div>
          </div>

          {/* Success notification */}
          {isSuccess && (
            <div className="absolute px-4 py-2 text-white bg-green-500 rounded-lg shadow-lg top-4 left-4 right-4 animate-fade-in-down">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                Verification code sent to your phone!
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Page;