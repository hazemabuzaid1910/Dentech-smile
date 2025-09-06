"use client"
import React, { useEffect, useState } from 'react';
import InputWithLabel from "@/components/InputWithLabel";
import { X, Eye, EyeOff, User, Phone, Briefcase, Lock, Check, Trash2, Edit, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import useAdminStore from '../app/store/AdminStore';
import { FaUserAlt } from "react-icons/fa";

interface UserData {
  name: string;
  phone_number: string;
  national_number: string;
  role_id: string;
  password: string;
  password_confirmation: string;
}
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />;

  return (
    <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-right duration-300">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md`}>
        {icon}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 ml-2 rounded hover:bg-white hover:bg-opacity-20"
        >
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
}

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
}

function SuccessDialog({ isOpen, onClose, userData }: SuccessDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-[55] flex items-center justify-center p-4">
      <div className="w-full max-w-md duration-300 transform bg-white shadow-2xl rounded-2xl animate-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Operation Successful!</h3>
          <p className="mb-4 text-gray-600">User data has been saved successfully</p>
          
          {userData && (
            <div className="p-4 mb-6 text-left rounded-lg bg-gray-50">
              <p className="text-sm text-gray-700"><strong>Name:</strong> {userData.name}</p>
              <p className="text-sm text-gray-700"><strong>Phone:</strong> {userData.phone_number}</p>
              <p className="text-sm text-gray-700"><strong>National Number:</strong> {userData.national_number}</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 font-semibold text-white transition-colors bg-green-500 rounded-xl hover:bg-green-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportCard({
  icon,
  text1,
  color,
  title,
  role
}: {
  icon: React.ReactNode;
  color: string;
  text1: string;
  title: string;
  role: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast states
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successUserData, setSuccessUserData] = useState<UserData | null>(null);

  const { addUser } = useAdminStore();

  const [userData, setUserData] = useState<UserData | null>(null);

  const [formData, setFormData] = useState<UserData>({
    name: '',
    phone_number: '',
    national_number: '',
    role_id: role,
    password: '',
    password_confirmation: ''
  });

  const handleClose = () => {
    setShowModal(false);
    // Reset form when closing
    setFormData({
      name: '',
      phone_number: '',
      national_number: '',
      role_id: role,
      password: '',
      password_confirmation: ''
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setToast({ type: 'error', message: 'Name is required' });
      return false;
    }
    if (!formData.phone_number.trim()) {
      setToast({ type: 'error', message: 'Phone number is required' });
      return false;
    }
    if (!formData.national_number.trim()) {
      setToast({ type: 'error', message: 'National number is required' });
      return false;
    }
    if (!formData.password) {
      setToast({ type: 'error', message: 'Password is required' });
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      setToast({ type: 'error', message: 'Passwords do not match' });
      return false;
    }
    if (formData.password.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters long' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await addUser(formData);   
      console.log(response);
      
      // Save to localStorage
      localStorage.setItem(`userData_${role}`, JSON.stringify(response.user));
      
      // Update local state
      setUserData(response.user);
      setSuccessUserData(response.user);
      
      // Close modal
      setShowModal(false);
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Reset form
      setFormData({
        name: '',
        phone_number: '',
        national_number: '',
        role_id: role,
        password: '',
        password_confirmation: ''
      });
      
    } catch (error) {
  const err = error as ApiError;
  console.error("Error adding patient:", err);

  let errorMessage = "An unexpected error occurred while adding patient";

  if (err.response?.data?.message) {
    errorMessage = err.response.data.message;
  } else if (err.message) {
    errorMessage = err.message;
  }

  setToast({ type: "error", message: errorMessage });
}finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteUser = () => {
    localStorage.removeItem(`userData_${role}`);
    setUserData(null);
    setToast({ type: 'success', message: 'User deleted successfully' });
  };

  const handleEditUser = () => {
    if (userData) {
      setFormData({
        ...userData,
        password: '',
        password_confirmation: ''
      }); 
      setShowModal(true);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Force page refresh or component re-render
    window.location.reload();
  };

  useEffect(() => {
    const savedUser = localStorage.getItem(`userData_${role}`);
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, [role]);

  return (
    <>
      {!userData || role === "3" ? (
        <button className="cursor-pointer" onClick={() => setShowModal(true)}>
          <div
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${color})`,
            }}
            className={`flex items-center justify-center px-6 gap-2 py-6 rounded-xl`}
          >
            <div>{icon}</div>
            <p className="text-white">{text1}</p>
          </div>
        </button>
      ) : (
        <div className="relative w-full overflow-hidden group rounded-xl"
             style={{ backgroundImage: `linear-gradient(to bottom right, ${color})` }}>
          
          <div className="flex items-center gap-3 p-6">
            <FaUserAlt color="#FFD700" />
            <div>
              <h3 className="text-sm text-white">{userData?.name}</h3>
              <p className="text-sm text-gray-300">{userData?.phone_number}</p>
              {role === "7" ? <p className="text-sm text-gray-300">Admissions official</p> :
                <p className="text-sm text-gray-300">Radiology Official</p>}
            </div>
          </div>

          <div className="absolute flex gap-1 transition-opacity duration-300 opacity-0 top-2 right-2 group-hover:opacity-100">
            <button onClick={handleEditUser} className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
              <Edit size={14} />
            </button>
            <button onClick={handleDeleteUser} className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0000004e] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl overflow-hidden transition-all duration-300 transform scale-100 bg-white shadow-2xl rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg bg-opacity-20">
                  <User className="" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-white hover:bg-opacity-20 group"
                disabled={isLoading}
              >
                <X className="text-white group-hover:text-[var(--main-color)] " size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-8">
              <div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <InputWithLabel
                      label="Full Name*"
                      placeholder="Enter your full name..."
                      type="text"
                      icon={<User size={18} />}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      disabled={isLoading}
                    />

                    <div className="flex flex-col w-full gap-2">
                      <label className="px-2 text-sm font-semibold text-gray-700">Password*</label>
                      <div className="relative">
                        <div className="flex items-center px-4 border-2 border-gray-200 bg-gray-50 rounded-xl focus-within:border-teal-500 focus-within:bg-white">
                          <Lock className="mr-3 text-gray-400" size={18} />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password..."
                            className="w-full py-3 text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            value={formData.password}
                            required
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 ml-2 rounded-lg hover:bg-gray-200"
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col w-full gap-2">
                      <label className="px-2 text-sm font-semibold text-gray-700">Confirm Password*</label>
                      <div className="relative">
                        <div className="flex items-center px-4 border-2 border-gray-200 bg-gray-50 rounded-xl focus-within:border-teal-500 focus-within:bg-white">
                          <Lock className="mr-3 text-gray-400" size={18} />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password..."
                            className="w-full py-3 text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                            onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                            value={formData.password_confirmation}
                            required
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="p-1 ml-2 rounded-lg hover:bg-gray-200"
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <InputWithLabel
                      label="Phone Number*"
                      placeholder="Enter your phone number..."
                      type="tel"
                      icon={<Phone size={18} />}
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      required
                      disabled={isLoading}
                    />

                    <InputWithLabel
                      label="National Number*"
                      placeholder="Enter your national number..."
                      type="text"
                      icon={<Briefcase size={18} />}
                      value={formData.national_number}
                      onChange={(e) => handleInputChange('national_number', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Save User
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        userData={successUserData}
      />
    </>
  );
}

export default ReportCard;