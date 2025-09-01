"use client"
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import useAuthStore from '@/app/store/AuthStore';
import { useRouter } from 'next/navigation';
interface FormData {
  nationalNumber: string;
  password: string;
}


const EnhancedInput: React.FC<{
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  error?: string;
}> = ({ type, placeholder, value, onChange, icon, rightIcon, onRightIconClick, error }) => {
  return (
    <div className="space-y-1">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors pointer-events-none group-focus-within:text-teal-500">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
          }`}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
          >
            {rightIcon}
          </button>
        )}
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

function SignIn(): React.ReactElement {

  const { signIn, error } = useAuthStore();
  const router = useRouter();
  const token=localStorage.getItem('token')
  console.log(token)
  const [openEye, setOpenEye] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    nationalNumber: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    
    const errors: Partial<FormData> = {};
    
    if (!formData.nationalNumber.trim()) {
      errors.nationalNumber = 'National number is required';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      await signIn(formData.nationalNumber, formData.password);
      setLoginSuccess(true);
          setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = (): void => {
    setOpenEye(!openEye);
  };


  return (
    <div className="flex items-center justify-center max-h-screen p-4 ">
      <div className="relative">
        <div className="absolute w-32 h-32 rounded-full -top-6 -left-6 bg-gradient-to-r from-teal-200 to-blue-200 opacity-20 animate-pulse"></div>
        <div className="absolute w-40 h-40 delay-1000 rounded-full -bottom-10 -right-10 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-15 animate-pulse"></div>
        
        <div className="relative w-full max-w-md overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl">
          <div className="relative p-8 overflow-hidden text-center bg-gradient-to-r from-teal-500 via-teal-600 to-teal-600">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="mb-2 text-3xl font-bold text-white">Welcome Back</h1>
              <p className="text-sm text-teal-50">Sign in to your account to continue</p>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <EnhancedInput
                  type="text"
                  placeholder="Enter your national number..."
                  value={formData.nationalNumber}
                  onChange={(e) => handleInputChange('nationalNumber', e.target.value)}
                  icon={<User size={18} />}
                  error={formErrors.nationalNumber}
                />

                <EnhancedInput
                  type={openEye ? 'text' : 'password'}
                  placeholder="Enter your password..."
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  icon={<Lock size={18} />}
                  rightIcon={openEye ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconClick={handleTogglePassword}
                  error={formErrors.password}
                />
              </div>

              <div className="text-right">
                <Link
                 href="/forgetpassword"
                  className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || loginSuccess}
                className={`
                  w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold text-white 
                  transition-all duration-300 rounded-xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${
                    loginSuccess 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                    Signing In...
                  </>
                ) : loginSuccess ? (
                  <>
                    <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    Welcome Back!
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {loginSuccess && (
            <div className="absolute px-4 py-2 text-white bg-green-500 rounded-lg shadow-lg top-4 left-4 right-4 animate-fade-in-down">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                Login successful! Redirecting...
              </div>
            </div>
          )}

          {error && (
            <div className="absolute px-4 py-2 text-white bg-red-500 rounded-lg shadow-lg top-4 left-4 right-4">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {error}
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

export default SignIn;