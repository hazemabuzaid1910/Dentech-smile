"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Phone, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import useAuthStore from '@/app/store/AuthStore';
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
  phone: string;
  verificationCode: string[];
}

// InputWithLabel Component
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

// Verification Code Input Component
const VerificationCodeInput: React.FC<{
  code: string[];
  onChange: (code: string[]) => void;
}> = ({ code, onChange }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string): void => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    onChange(newCode);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent): void => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.replace(/\D/g, '').split('').slice(0, 4);
    
    const newCode = [...code];
    pasteArray.forEach((digit, index) => {
      if (index < 3) newCode[index] = digit;
    });
    onChange(newCode);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pasteArray.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-3">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={code[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 text-lg font-bold text-center transition-all duration-200 border-2 border-gray-200 h-14 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 hover:bg-white focus:bg-white"
        />
      ))}
    </div>
  );
};

function Page(): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    verificationCode: ['', '', '', '',]
  });
  const router=useRouter()
  const{verifyOtp}=useAuthStore()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCodeChange = (code: string[]): void => {
    setFormData(prev => ({
      ...prev,
      verificationCode: code
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData.phone,formData.verificationCode.join(''))
    verifyOtp(formData.phone,formData.verificationCode.join(''))

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/resetpassword")
      }, 3000);
    }, 2000);
  };

  const handleResend = (): void => {
    setCountdown(60);
    setCanResend(false);
    // Handle resend logic here
    console.log('Resending verification code...');
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const isCodeComplete = formData.verificationCode.every(digit => digit !== '');
  const isFormValid = formData.phone.trim() !== '' && isCodeComplete;

  return (
    <div className="flex items-center justify-center max-h-screen p-4">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute w-24 h-24 rounded-full -top-4 -left-4 bg-gradient-to-r from-teal-200 to-blue-200 opacity-20 animate-pulse"></div>
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
              <h1 className="mb-2 text-2xl font-bold text-white">Verify Your Phone</h1>
              <p className="text-sm text-teal-50">Enter your phone number and the 6-digit verification code</p>
            </div>
          </div>

          {/* Form content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Phone Number Input */}
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

              {/* Verification Code Input */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="mb-2 text-sm font-medium text-gray-700">Enter Verification Code</h3>
                  <p className="text-xs text-gray-500">We sent a 4-digit code to your phone</p>
                </div>
                
                <VerificationCodeInput
                  code={formData.verificationCode}
                  onChange={handleCodeChange}
                />

                {/* Resend Code */}
                <div className="text-center">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 underline-offset-2 hover:underline"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Resend code in <span className="font-medium text-teal-600">{countdown}s</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid}
                className={`
                  w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold text-white 
                  transition-all duration-300 rounded-xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${
                    isSuccess 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                    Verifying...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle size={18} />
                    Verification Successful!
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success notification */}
          {isSuccess && (
            <div className="absolute px-4 py-2 text-white bg-green-500 rounded-lg shadow-lg top-4 left-4 right-4 animate-fade-in-down">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} />
                Phone number verified successfully!
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