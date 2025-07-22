"use client";

import { useState } from "react";
import DoctorsTable from "@/components/Doctor";
import { MdAddCircleOutline } from "react-icons/md";
import {
  X,
  Eye,
  EyeOff,
  User,
  Phone,
  Briefcase,
  Lock,
  Check,
} from "lucide-react";
import InputWithLabel from "@/components/InputWithLabel";
import { IoCloudUploadOutline } from "react-icons/io5";
import ImageUploadInput from "@/components/ImageUploadInput";


export default function PatientPage() {
  const [showModal, setShowModal] = useState(false);
  const [showModalRequest, setShowModalRequest] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialty: "",
  });

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="relative p-6">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-[24px] font-bold">Patient</h1>
        <button
          onClick={() => setShowModal(true)}
          className="py-2 px-4 flex gap-2 text-white bg-[var(--secondary-color)] shadow-xl rounded-xl"
        >
          <MdAddCircleOutline size={22} />
          Add Patient
        </button>
      </div>

      <DoctorsTable />

      {showModal && (
        <div className="fixed inset-0 bg-[#0000004e] bg-opacity-60 z-50 flex items-center justify-center p-4 ">
          <div className="w-full max-w-4xl overflow-hidden transition-all duration-300 transform scale-100 bg-white shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg bg-opacity-20">
                  <User className="" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Add Patient</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-white hover:bg-opacity-20 group"
              >
                <X
                  className="text-white group-hover:text-[var(--main-color)] "
                  size={20}
                />
              </button>
            </div>

            {/* Form */}
            <div className="p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  <InputWithLabel
                    label="Full Name*"
                    placeholder="Enter your full name..."
                    type="text"
                    icon={<User size={18} />}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />

                  <div className="flex flex-col w-full gap-2">
                    <label className="px-2 text-sm font-semibold text-gray-700">
                      Password*
                    </label>
                    <div className="relative">
                      <div className="flex items-center px-4 transition-all duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus-within:border-teal-500 focus-within:bg-white">
                        <Lock className="mr-3 text-gray-400" size={18} />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password..."
                          className="w-full py-3 text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 ml-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
                        >
                          {showPassword ? (
                            <EyeOff size={18} className="text-gray-400" />
                          ) : (
                            <Eye size={18} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-2">
                    <label className="px-2 text-sm font-semibold text-gray-700">
                      Confirm Password*
                    </label>
                    <div className="relative">
                      <div className="flex items-center px-4 transition-all duration-200 border-2 border-gray-200 bg-gray-50 rounded-xl focus-within:border-teal-500 focus-within:bg-white">
                        <Lock className="mr-3 text-gray-400" size={18} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password..."
                          className="w-full py-3 text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          value={confirmPassword}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="p-1 ml-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} className="text-gray-400" />
                          ) : (
                            <Eye size={18} className="text-gray-400" />
                          )}
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
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />

                  <InputWithLabel
                    label="Specialty*"
                    placeholder="Enter your specialty..."
                    type="text"
                    icon={<Briefcase size={18} />}
                    value={formData.specialty}
                    onChange={(e) =>
                      handleInputChange("specialty", e.target.value)
                    }
                    required
                  />

                  {/* Additional Info Box */}
                  <div className="p-4 border border-teal-200 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl">
                    <h3 className="mb-2 text-sm font-semibold text-teal-700">
                      Password Requirements:
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-teal-500" />
                        At least 8 characters long
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-teal-500" />
                        Include uppercase and lowercase letters
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-teal-500" />
                        Include at least one number
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 font-semibold text-gray-600 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl hover:from-teal-600 hover:to-teal-700"
                >
                  <Check size={18} />
                  Save User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModalRequest && (
        <div className="fixed inset-0 bg-[#0000004e] bg-opacity-60 z-50 flex items-center justify-center p-4 ">
          <div className="w-full max-w-4xl overflow-hidden transition-all duration-300 transform scale-100 bg-white shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg bg-opacity-20">
                  <User className="" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Add Patient Request
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-white hover:bg-opacity-20 group"
              >
                <X
                  className="text-white group-hover:text-[var(--main-color)] "
                  size={20}
                />
              </button>
            </div>

            {/* Form */}
            <div className="p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  <InputWithLabel
                    label="Full Name*"
                    placeholder="Enter your full name..."
                    type="text"
                    icon={<User size={18} />}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
<ImageUploadInput
  label="Profile Picture"
  placeholder="Upload your profile picture"
  icon={<IoCloudUploadOutline size={40} />}
  onChange={(e) => handleInputChange("image", e.target.files?.[0])}
  inputClassName=""
  containerClassName="w-full max-w-md"
/>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <InputWithLabel
                    label="Phone Number*"
                    placeholder="Enter your phone number..."
                    type="tel"
                    icon={<Phone size={18} />}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
<ImageUploadInput
  label="Profile Picture"
  placeholder="Upload your profile picture"
  icon={<IoCloudUploadOutline size={40} />}
  onChange={(e) => handleInputChange("image", e.target.files?.[0])}
  inputClassName=""
  containerClassName="w-full max-w-md"
/>
                  <InputWithLabel
                    label="Specialty*"
                    placeholder="Enter your specialty..."
                    type="text"
                    icon={<Briefcase size={18} />}
                    value={formData.specialty}
                    onChange={(e) =>
                      handleInputChange("specialty", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 font-semibold text-gray-600 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl hover:from-teal-600 hover:to-teal-700"
                >
                  <Check size={18} />
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
