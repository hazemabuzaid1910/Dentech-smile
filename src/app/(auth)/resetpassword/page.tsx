"use client"
import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Phone, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import useAuthStore from '@/app/store/AuthStore';
// Types
interface FormData {
  password: string;
  phone: string;
  confirmpassword: string;
}



// Mock router (replace with your actual router)
const useRouter = () => ({
  push: (path: string) => console.log('Navigating to:', path)
});

// Enhanced Input Component
const InputWithLabel: React.FC<{
  label?: string;
  placeholder: string;
  type: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}> = ({ label, placeholder, type, icon, value, onChange, required, error }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors pointer-events-none group-focus-within:text-teal-500">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
          }`}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-500">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
};

// Password Input Component
const PasswordInput: React.FC<{
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  error?: string;
  strength?: number;
}> = ({ placeholder, value, onChange, showPassword, onTogglePassword, error }) => {
  return (
    <div className="space-y-2">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors pointer-events-none group-focus-within:text-teal-500">
          <Lock size={18} />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
          }`}
          required
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
     
      
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-500">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
};

function ResetPassword(): React.ReactElement {
  const {  token,resetpassowrd } = useAuthStore();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState<FormData>({
    password: '',
    phone: '',
    confirmpassword: ''
  });

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };



  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    console.log(formData.phone, password, confirmPassword)
    try {
      await resetpassowrd(formData.phone, password, confirmPassword);
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = (): void => {
    router.push('/signin');
  };

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [router, token]);


  return (
    <div className="flex items-center justify-center max-h-screen p-4 ">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute w-32 h-32 rounded-full -top-3 -left-6 bg-gradient-to-r from-teal-200 to-blue-200 opacity-20 animate-pulse"></div>
        <div className="absolute w-40 h-40 delay-1000 rounded-full -bottom-2 -right-10 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-15 animate-pulse"></div>
        
        {/* Main card */}
        <div className="relative w-full max-w-lg overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl">
          {/* Header with gradient background */}
          <div className="relative p-8 overflow-hidden text-center bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="mb-2 text-3xl font-bold text-white">Reset Password</h1>
              <p className="text-sm text-teal-50">Create a new secure password for your account</p>
            </div>
          </div>

          {/* Form content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Phone Number */}
              <InputWithLabel
                placeholder="Enter your phone number..."
                type="tel"
                icon={<Phone size={18} />}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                error={errors.phone}
              />

              <PasswordInput
                placeholder="Enter new password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                error={errors.password}
                
              />

              {/* Confirm Password */}
              <PasswordInput
                placeholder="Confirm new password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword}
              />

             

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 transition-colors border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:text-gray-700"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || isSuccess}
                  className={`
                    flex-1 flex items-center justify-center gap-3 px-6 py-3 font-semibold text-white 
                    transition-all duration-300 rounded-xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    ${
                      isSuccess 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      Resetting...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle size={18} />
                      Password Reset!
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Success notification */}
          {isSuccess && (
            <div className="absolute px-4 py-2 text-white bg-green-500 rounded-lg shadow-lg top-4 left-4 right-4 animate-fade-in-down">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} />
                Password reset successfully! Redirecting to login...
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

export default ResetPassword;