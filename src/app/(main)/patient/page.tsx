"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { MdAddCircleOutline } from "react-icons/md";
import { X, User, Phone, Check, Lock, Activity } from "lucide-react";
import InputWithLabel from "@/components/InputWithLabel";
import PatientTable from "@/components/Patients";
import { GiBodyHeight } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import useAdminStore from "@/app/store/AdminStore";
import { MultiValue } from "react-select";
type DiseaseOption = { value: number; label: string };

export default function PatientPage() {
  const [showModalRequest, setShowModalRequest] = useState(false);
  const {getDisease,disease,addPatient}=useAdminStore()


  const [formData, setFormData] = useState<{
  name: string;
  phone: string;
  password: string;
  height: string;
  weight: string;
  birthdate: string;
  diseases: number[]; // بدل string[]
}>({
  name: "",
  phone: "",
  password: "",
  height: "",
  weight: "",
  birthdate: "",
  diseases: [],
});

useEffect(()=>{
  getDisease()
},[])

type Disease = {
  id: number;
  name: string;
};
  const handleClose = () => {
    setShowModalRequest(false);
  };

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

 const payload = {
  name: formData.name,
  phone_number: formData.phone,
  password: formData.password,
  height: formData.height,
  weight: formData.weight,
  birthdate: formatDate(formData.birthdate), 
  disease_id: formData.diseases.map(Number),
};


  console.log("Payload sent:", payload);

  
  if (!payload.name || !payload.phone_number || !payload.password || !payload.birthdate || payload.disease_id.length === 0) {
    alert("Please fill all required fields!");
    return;
  }

  addPatient(payload);
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

            
            <div className="p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                
                <div className="space-y-6">
                  <InputWithLabel
                    label="Full Name*"
                    placeholder="Enter full name..."
                    type="text"
                    icon={<User size={18} />}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
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
                  />
                </div>

                
                <div className="space-y-6">
                  <InputWithLabel
                    label="Phone Number*"
                    placeholder="Enter phone..."
                    type="tel"
                    icon={<Phone size={18} />}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
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
                  />

                  <InputWithLabel
                    label="Birthdate"
                    type="date"
                    icon={<Activity size={18} />}
                    value={formData.birthdate}
                    onChange={(e) =>
                      handleInputChange("birthdate", e.target.value)
                    }
                  />
                </div>
              </div>

             
<div className="mt-6">
  <label className="block mb-2 font-semibold">
    Select Diseases
  </label>
<Select<DiseaseOption, true>
  isMulti
  options={disease?.diseases?.map((d: Disease) => ({
    value: d.id,
    label: d.name,
  })) ?? []}
  className="basic-multi-select"
  classNamePrefix="select"
  value={formData.diseases
    .map((id) => {
      const found = disease?.diseases?.find((d: Disease) => d.id === id);
      return found ? { value: found.id, label: found.name } : null;
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
                  Save Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
