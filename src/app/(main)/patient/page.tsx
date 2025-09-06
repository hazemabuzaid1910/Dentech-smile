"use client";

import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { MdAddCircleOutline } from "react-icons/md";
import {
  X,
  User,
  Phone,
  Check,
  Lock,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import InputWithLabel from "@/components/InputWithLabel";
import PatientTable from "@/components/Patients";
import { GiBodyHeight, GiWeight } from "react-icons/gi";
import useAdminStore from "@/app/store/AdminStore";

type DiseaseOption = { value: number; label: string };

type Disease = {
  id: number;
  name: string;
};

// ✅ Patient type instead of any
type Patient = {
  name: string;
  phone_number: string;
  password: string;
  height: string;
  weight: string;
  birthdate: string;
};

interface ToastProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon =
    type === "success" ? (
      <CheckCircle size={20} />
    ) : (
      <AlertCircle size={20} />
    );

  return (
    <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-right duration-300">
      <div
        className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md`}
      >
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
  patientData: Patient | null;
}

function SuccessDialog({ isOpen, onClose, patientData }: SuccessDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 z-[55] flex items-center justify-center p-4">
      <div className="w-full max-w-md duration-300 transform bg-white shadow-2xl rounded-2xl animate-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Patient Added Successfully!
          </h3>
          <p className="mb-4 text-gray-600">
            Patient data has been saved successfully
          </p>

          {patientData && (
            <div className="p-4 mb-6 text-left rounded-lg bg-gray-50">
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {patientData.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Phone:</strong> {patientData.phone_number}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Birth Date:</strong> {patientData.birthdate}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Height:</strong> {patientData.height} cm
              </p>
              <p className="text-sm text-gray-700">
                <strong>Weight:</strong> {patientData.weight} kg
              </p>
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

export default function PatientPage() {
  const [showModalRequest, setShowModalRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Toast states
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successPatientData, setSuccessPatientData] = useState<Patient | null>(
    null
  );

  const { getDisease, disease, addPatient } = useAdminStore();

  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    password: string;
    height: string;
    weight: string;
    birthdate: string;
    diseases: number[];
  }>({
    name: "",
    phone: "",
    password: "",
    height: "",
    weight: "",
    birthdate: "",
    diseases: [],
  });

  useEffect(() => {
    getDisease();
  }, [getDisease]);

  const handleClose = () => {
    setShowModalRequest(false);
    // Reset form when closing
    setFormData({
      name: "",
      phone: "",
      password: "",
      height: "",
      weight: "",
      birthdate: "",
      diseases: [],
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setToast({ type: "error", message: "Patient name is required" });
      return false;
    }
    if (!formData.phone.trim()) {
      setToast({ type: "error", message: "Phone number is required" });
      return false;
    }
    if (!formData.password.trim()) {
      setToast({ type: "error", message: "Password is required" });
      return false;
    }
    if (formData.password.length < 6) {
      setToast({
        type: "error",
        message: "Password must be at least 6 characters long",
      });
      return false;
    }
    if (!formData.birthdate) {
      setToast({ type: "error", message: "Birth date is required" });
      return false;
    }
    if (formData.diseases.length === 0) {
      setToast({ type: "error", message: "Please select at least one disease" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: Patient & { disease_id: number[] } = {
      name: formData.name,
      phone_number: formData.phone,
      password: formData.password,
      height: formData.height,
      weight: formData.weight,
      birthdate: formatDate(formData.birthdate),
      disease_id: formData.diseases.map(Number),
    };

    console.log("Payload sent:", payload);

    setIsLoading(true);

    try {
      const response = await addPatient(payload);
      console.log("Patient added successfully:", response);

      // Set success data
      setSuccessPatientData(payload);

      // Close modal
      setShowModalRequest(false);

      // Show success dialog
      setShowSuccessDialog(true);

      // Reset form
      setFormData({
        name: "",
        phone: "",
        password: "",
        height: "",
        weight: "",
        birthdate: "",
        diseases: [],
      });
    }catch (error) {
  const err = error as ApiError;
  console.error("Error adding patient:", err);

  let errorMessage = "An unexpected error occurred while adding patient";

  if (err.response?.data?.message) {
    errorMessage = err.response.data.message;
  } else if (err.message) {
    errorMessage = err.message;
  }

  setToast({ type: "error", message: errorMessage });
}
  };

  const handleInputChange = (
    field: string,
    value: string | number | string[] | number[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Force page refresh or component re-render
    window.location.reload();
  };

  return (
    <div className="relative p-6">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-[24px] font-bold">Patient</h1>
        <button
          onClick={() => setShowModalRequest(true)}
          className="py-2 px-4 flex gap-2 text-white bg-[var(--secondary-color)] shadow-xl rounded-xl"
        >
          <MdAddCircleOutline size={22} />
          Add Patient
        </button>
      </div>

      <PatientTable />

      {showModalRequest && (
        <div className="fixed inset-0 bg-[#0000004e] bg-opacity-60 z-50 flex items-center justify-center p-4 ">
          <div className="w-full max-w-4xl overflow-hidden transition-all duration-300 transform scale-100 bg-white shadow-2xl rounded-2xl">
            {/* Header */}
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
                disabled={isLoading}
              >
                <X
                  className="text-white group-hover:text-[var(--main-color)] "
                  size={20}
                />
              </button>
            </div>

            {/* Body */}
            <div className="p-8">
              <div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <InputWithLabel
                      label="Full Name*"
                      placeholder="Enter full name..."
                      type="text"
                      icon={<User size={18} />}
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      disabled={isLoading}
                    />

                    <InputWithLabel
                      label="Password*"
                      placeholder="Enter password..."
                      type="password"
                      icon={<Lock size={18} />}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      disabled={isLoading}
                    />

                    <InputWithLabel
                      label="Height (cm)"
                      placeholder="Enter height..."
                      type="number"
                      icon={<GiBodyHeight size={18} />}
                      value={formData.height}
                      onChange={(e) =>
                        handleInputChange("height", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <InputWithLabel
                      label="Phone Number*"
                      placeholder="Enter phone..."
                      type="tel"
                      icon={<Phone size={18} />}
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      disabled={isLoading}
                    />

                    <InputWithLabel
                      label="Weight (kg)"
                      placeholder="Enter weight..."
                      type="number"
                      icon={<GiWeight size={18} />}
                      value={formData.weight}
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                      disabled={isLoading}
                    />

                    <InputWithLabel
                      label="Birthdate*"
                      type="date"
                      icon={<Activity size={18} />}
                      value={formData.birthdate}
                      onChange={(e) =>
                        handleInputChange("birthdate", e.target.value)
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Disease Select */}
                <div className="mt-6">
                  <label className="block mb-2 font-semibold">
                    Select Diseases*
                  </label>
                  <Select<DiseaseOption, true>
                    isMulti
                    isDisabled={isLoading}
                    options={
                      disease?.diseases?.map((d: Disease) => ({
                        value: d.id,
                        label: d.name,
                      })) ?? []
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={formData.diseases
                      .map((id) => {
                        const found = disease?.diseases?.find(
                          (d: Disease) => d.id === id
                        );
                        return found
                          ? { value: found.id, label: found.name }
                          : null;
                      })
                      .filter((v): v is DiseaseOption => v !== null)}
                    onChange={(selected: MultiValue<DiseaseOption>) =>
                      handleInputChange(
                        "diseases",
                        selected.map((s) => s.value)
                      )
                    }
                    placeholder="Choose diseases..."
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 font-semibold text-gray-600 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Save Patient
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
        patientData={successPatientData}
      />
    </div>
  );
}
