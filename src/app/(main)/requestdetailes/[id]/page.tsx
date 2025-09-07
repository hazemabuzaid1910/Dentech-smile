"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  User,
  Calendar,
  Ruler,
  Weight,
  
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import useAdminStore from "@/app/store/AdminStore";
import Image from "next/image";
interface Patient {
  name: string;
  phone: string;
  age: number;
  height: number;
  weight: number;
  birthdate: string;
}

interface RadiologyImage {
  url: string;
  type: string;
}
interface stage {
  stage_id: string;
  name: string;
}

interface RequestDetailsResponse {
  request_status: string;
  status: string;
  patient: Patient;
  radiology_images: RadiologyImage[];
}


function RequestDetails() {
const { id } = useParams(); 


  const router = useRouter();
  const { getDetailesReq, detailesReq,getAllStages,AssignPatient } = useAdminStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState<number | "">("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    await getDetailesReq(Number(id));
    const data = await getAllStages();
    
    if (data?.sessions && typeof data.sessions === "object") {
      setStages(Object.values(data.sessions));
    } else {
      setStages([]);
    }

    setLoading(false);
  };
  fetchData();
}, [getAllStages, getDetailesReq, id]);



  const details: RequestDetailsResponse | null = detailesReq;

const handleAssignStage = async () => {
  if (!selectedStage) {
    alert("Please select a stage first!");
    return;
  }

  try {
    setSubmitting(true);

    await AssignPatient(Number(id), selectedStage);

    alert(`Request #${id} assigned to stage ${selectedStage}`);
  } catch (err) {
    console.error(err);
    alert("Error assigning stage. Please try again.");
  } finally {
    setSubmitting(false);
  }
};



  if (loading || !details) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <div className="w-12 h-12 mb-4 border-b-2 border-teal-500 rounded-full animate-spin"></div>
        <p>Loading details...</p>
      </div>
    );
  }

  const { patient, radiology_images } = details;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4 bg-white ">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-teal-600"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-2xl font-bold text-blue-900">
          Request #{id} Details
        </h1>
        <div />
      </div>

      {/* Patient Info */}
      <div className="max-w-5xl px-5 py-8 mx-auto">
        <div className="p-6 mb-8 bg-white shadow-md rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Patient Information
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <User className="text-teal-500" />
              <span className="font-semibold">Name:</span> {patient?.name}
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-teal-500" />
              <span className="font-semibold">Phone:</span> {patient?.phone}
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-teal-500" />
              <span className="font-semibold">Birthdate:</span>{" "}
              {patient?.birthdate}
            </div>
            <div className="flex items-center gap-3">
              <Ruler className="text-teal-500" />
              <span className="font-semibold">Height:</span> {patient?.height} m
            </div>
            <div className="flex items-center gap-3">
              <Weight className="text-teal-500" />
              <span className="font-semibold">Weight:</span> {patient?.weight} kg
            </div>
            <div className="flex items-center gap-3">
              <User className="text-teal-500" />
              <span className="font-semibold">Age:</span> {patient?.age} years
            </div>
          </div>
        </div>

        {/* Radiology Images */}
        <div className="p-6 mb-8 bg-white shadow-md rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Radiology Images
          </h2>
          {radiology_images?.length === 0 ? (
            <p className="text-gray-500">No images available</p>
          ) : (

<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
  {Array.isArray(radiology_images) &&radiology_images?.map((img, idx) => (
    <div
      key={idx}
      className="overflow-hidden transition-all duration-300 bg-gray-100 cursor-pointer rounded-xl hover:shadow-lg"
      onClick={() => setSelectedImage(`http://127.0.0.1:8000/storage/${img.url}`)}
    >
      <Image
        src={`http://127.0.0.1:8000/storage/${img.url}`}
        alt={img.type}
        width={500}
        height={256}
        className="object-cover w-full h-64"
      />
      <div className="p-2 text-sm text-center text-gray-600 bg-white">
        {img.type}
      </div>
    </div>
  ))}
</div>


          )}
        </div>

      
<div className="p-6 bg-white shadow-md rounded-xl">
  <h2 className="mb-4 text-xl font-semibold text-gray-800">
    {details.request_status=== "processed" ? "Request Status" : "Assign to Stage"}
  </h2>

  {details.request_status=== "processed" ? (
    // في حال كان الطلب processed
    <p className="text-gray-600">
      This request has already been <span className="font-semibold text-green-600">processed</span>.
    </p>
  ) : (
    
    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
      <select
        value={selectedStage}
        onChange={(e) => setSelectedStage(Number(e.target.value))}
        className="w-full px-4 py-2 border rounded-lg md:w-1/2 focus:ring-2 focus:ring-teal-500"
      >
        <option value="">-- Select a Stage --</option>
        {Array.isArray(stages) &&
          stages.map((stage: stage) => (
            <option key={stage.stage_id} value={stage.stage_id}>
              {stage.name}
            </option>
          ))}
      </select>
      <button
        onClick={handleAssignStage}
        disabled={submitting}
        className="px-6 py-2 font-medium text-white transition-all duration-300 bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50"
      >
        {submitting ? "Assigning..." : "Assign to Stage"}
      </button>
    </div>
  )}
</div>
{selectedImage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
    <button
      onClick={() => setSelectedImage(null)}
      className="absolute text-3xl font-bold text-white top-4 right-4 hover:text-gray-300"
    >
      ×
    </button>
    <Image
      src={selectedImage}
      alt="Full Screen"
      width={1200}
      height={800}
      className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
    />
  </div>
)}


      </div>
    </div>
  );
}

export default RequestDetails;
