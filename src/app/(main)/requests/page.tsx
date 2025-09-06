"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
 
  Clock,
  CheckCircle,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import useAdminStore from "@/app/store/AdminStore";

// Types
interface RequestItem {
  id: number;
  patient_id: number;
  stage_id: number;
  status: "under processing" | "processed" | "completed";
  complete: number;
  created_at: string;
  updated_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ApiResponse {
  current_page: number;
  data: RequestItem[];
  total: number;
  per_page: number;
  last_page: number;
  links: PaginationLink[];
}



function Requests() {
  const [requestsData, setRequestsData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
const router = useRouter();
const {getPatientReq}=useAdminStore()

  const stageNames: Record<number, string> = {
    1: "Initial Examination",
    2: "Diagnosis",
    3: "Treatment",
    4: "Follow-up",
  };

  // Status mapping
  const statusMap: Record<RequestItem["status"], string> = {
    "under processing": "Under Processing",
    processed: "Processed",
    completed: "Completed",
  };

useEffect(() => {
  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getPatientReq();
      setRequestsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  loadRequests();
}, [getPatientReq]); // ← empty deps





  const getStatistics = () => {
    if (!requestsData?.data)
      return { processing: 0, processed: 0, total: 0 };

    const processing = requestsData.data.filter(
      (item) => item.status === "under processing"
    ).length;
    const processed = requestsData.data.filter(
      (item) => item.status === "processed"
    ).length;
    const total = requestsData.data.length;

    return { processing, processed, total };
  };



  const handleRequestClick = (requestId: number) => {
    console.log(`Navigating to request details: ${requestId}`);
      router.push(`/requestdetailes/${requestId}`);

  };

  
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status: RequestItem["status"]): string => {
    const baseClass =
      "px-3 py-1 rounded-full text-xs font-semibold";
    return status === "under processing"
      ? `${baseClass} bg-yellow-100 text-yellow-700`
      : `${baseClass} bg-green-100 text-green-700`;
  };

  const statistics = getStatistics();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="flex items-center justify-between px-8 py-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Patient Requests
          </h1>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="flex items-center gap-4 p-6 transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-center w-16 h-16 text-white bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {statistics.processing}
              </h3>
              <p className="text-sm text-gray-600">Under Processing</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-center w-16 h-16 text-white bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {statistics.processed}
              </h3>
              <p className="text-sm text-gray-600">Processed</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-center w-16 h-16 text-white bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {statistics.total}
              </h3>
              <p className="text-sm text-gray-600">Total Requests</p>
            </div>
          </div>
        </div>

      
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="mb-1 text-xl font-bold text-gray-900">
              Requests List
            </h2>
            <p className="text-sm text-gray-600">
              View all patient requests with their current status
            </p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 mb-4 border-b-2 border-teal-500 rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading requests...</p>
            </div>
          )}

 {!loading && (
  <div className="divide-y divide-gray-100">
    {!requestsData?.data?.length ? (
      <div className="py-16 text-center">
        <div className="mb-4 text-4xl text-gray-400">📋</div>
        <p className="text-gray-500">No requests available</p>
      </div>
    ) : (
      requestsData.data.map((request) => (
        <div
          key={request.id}
          onClick={() => handleRequestClick(request.id)}
          className="grid items-center grid-cols-1 gap-4 px-8 py-6 transition-all duration-300 cursor-pointer hover:bg-gray-50 hover:-translate-x-2 md:grid-cols-4 group"
        >
                    {/* Request ID */}
                    <div className="inline-block px-4 py-2 text-sm font-bold text-center text-white rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 w-fit">
                      #{request.id}
                    </div>

                    {/* Request Info */}
                    <div className="md:col-span-2">
                      <h4 className="mb-1 text-lg font-bold text-gray-900">
                        Patient {request.patient_id} Request
                      </h4>
                      <p className="text-sm text-gray-600">
                        Stage: {stageNames[request.stage_id] || "Not specified"}{" "}
                        • Created: {formatDate(request.created_at)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className={getStatusBadgeClass(request.status)}>
                        {statusMap[request.status] || request.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-teal-500 group-hover:translate-x-1" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {requestsData && !loading && (
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center gap-2">
                {requestsData.links?.map((link, index) => (
                  <button
                    key={index}
              
                    disabled={!link.url}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      link.active
                        ? "bg-teal-500 text-white"
                        : link.url
                        ? "bg-white text-gray-700 border border-gray-300 hover:bg-teal-500 hover:text-white"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Requests;
