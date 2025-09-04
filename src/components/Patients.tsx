"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import {  FaPlusCircle, FaSearch } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import Link from "next/link";
import useAdminStore from "@/app/store/AdminStore";
import RequestModal from "./RequestModal";
const PatientTable = () => {
  const {patient,getPatient}=useAdminStore()
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
 useEffect(()=>{
getPatient()
 },[])
const mockDoctors = patient?.patients?.data ?? [];

const filteredDoctors = useMemo(() => {
  return mockDoctors
    .filter((d: { name: string; year: string }) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchesYear = filter === "All" || d.year === filter;
      return matchesSearch && matchesYear;
    });
}, [search, filter, mockDoctors]);

  const pageCount = Math.ceil(filteredDoctors.length / itemsPerPage);
  const doctorsToShow = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


const [showModalRequest, setShowModalRequest] = useState(false);
const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

const handleOpenRequestModal = (id: number) => {
  setSelectedPatientId(id);
  setShowModalRequest(true);
};

const handleCloseRequestModal = () => {
  setShowModalRequest(false);
  setSelectedPatientId(null);
};
  return (
    
    <div className="p-6 bg-white">
      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <div className="flex items-center w-1/2 gap-2 px-4 bg-gray-100 rounded-xl">
          <FaSearch color="var(--light-cyan)"/>
           <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2   outline-none border-[var(--pale-mint)] rounded-xl "
        />
        </div>
       <div className="flex items-center w-1/3 gap-4 px-4 bg-gray-100 rounded-xl">
        <IoFilter size={22} color="var(--light-cyan)"/>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 text-gray-700 outline-none rounded-xl "
        >
          <option value="All">All Year</option>
          <option value="fourth-year">fourth-year</option>
          <option value="fifth-year">fifth-year</option>
       
        </select>
        </div>
      </div>

      <table className="min-w-full rounded ">
        <thead>
          <tr className="text-[var(--secondary-color)] border-b border-gray-200">
               <th className="p-2 "><input type="checkbox" className=""/></th>

<th className="p-2 ">Account</th>
<th className="p-2 ">Phone</th>
<th className="p-2 ">Age</th>
<th className="p-2 ">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctorsToShow.map((doc:{id:number,name:string,phone_number:string,age:string}) => (
            <tr key={doc.id} className="text-center text-gray-400 transition duration-300 border-b border-gray-200 cursor-pointer hover:bg-gray-50">
             <td>
              <input type="checkbox" name="" id="" />
             </td>
             <td className="p-2">
    <Link href="/stdaccount" className="flex hover:text-[var(--blue-sky)] group items-center justify-center gap-2">
    <div>
      <Image
      src="/example/hr/15.png"
      alt={doc.name}
      className="rounded-full "
      width={40}
      height={40}
    /></div>
    <span className="w-1/2 ">{doc.name}</span>
    </Link>
  
</td>
              <td className="p-2 ">{doc.phone_number}</td>
              <td className="p-2 ">
               {doc.age}
              </td>
              <td className="flex items-center justify-center p-2">
            
               <div>
                 <button
  onClick={() => handleOpenRequestModal(doc.id)}
  className="flex items-center gap-2 p-2 transition duration-300 bg-gray-100 cursor-pointer rounded-xl group hover:text-white hover:bg-blue-400"
>
  <FaPlusCircle size={22} className="text-blue-400 group-hover:text-white" />
  add request
</button>
               </div>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-4">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border-b ${
              currentPage === i + 1
                ? "bg-[var(--secondary-color)] text-white"
                : "bg-white text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {showModalRequest && (
  <RequestModal
    patientId={selectedPatientId}
    onClose={handleCloseRequestModal}
  />
)}
    </div>
    
  );
};

export default PatientTable;
