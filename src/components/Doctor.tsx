"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import {  FaPlusCircle, FaSearch } from "react-icons/fa";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import Link from "next/link";

const mockDoctors = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Dr. Doctor ${i + 1}`,
  phone: `+963 9${i + 10}00000${i}`,
  image: '/example/hr/5.png',
  specialty: ["Cardiology", "Dermatology", "Neurology"][i % 3],
}));

const DoctorsTable = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDoctors = useMemo(() => {
    return mockDoctors
      .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
      .filter((d) => (filter === "All" ? true : d.specialty === filter));
  }, [search, filter]);

  const pageCount = Math.ceil(filteredDoctors.length / itemsPerPage);
  const doctorsToShow = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



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
          <option value="All">All Specialty</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Neurology">Neurology</option>
       
        </select>
        </div>
      </div>

      <table className="min-w-full rounded ">
        <thead>
          <tr className="text-[var(--secondary-color)] border-b border-gray-200">
               <th className="p-2 "><input type="checkbox" className=""/></th>

   <th className="p-2 ">Account</th>
<th className="p-2 ">Email</th>
<th className="p-2 ">Phone</th>
<th className="p-2 ">Year</th>
<th className="p-2 ">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctorsToShow.map((doc) => (
            <tr key={doc.id} className="text-center text-gray-400 transition duration-300 border-b border-gray-200 cursor-pointer hover:bg-gray-50">
             <td>
              <input type="checkbox" name="" id="" />
             </td>
             <td className="p-2">
    <Link href="/stdaccount" className="flex hover:text-[var(--blue-sky)] group items-center justify-center gap-2">
      <Image
      src="/example/hr/15.png"
      alt={doc.name}
      className="rounded-full"
      width={40}
      height={40}
    />
    <span className=" group-hover:border-b">{doc.name}</span></Link>
  
</td>
              <td className="p-2 ">{doc.specialty}</td>
              <td className="p-2 ">{doc.phone}</td>
              <td className="p-2 ">
                <button className="gap-2 hover:underline">
                  4 
                  
                </button>
              </td>
              <td className="flex items-center justify-center p-2">
              {false&&<div className="flex items-center justify-center gap-4">
                <button className="flex items-center gap-2 p-2 transition duration-300 bg-gray-100 rounded-xl group hover:text-white hover:bg-red-400">
                  <MdDelete size={22}  className="text-red-400 cursor-pointer group-hover:text-white"/>
                  Delete
                </button>
                  
                   <button className="flex items-center gap-2 p-2 transition duration-300 bg-gray-100 rounded-xl group hover:text-white hover:bg-blue-400">
                  <MdModeEdit size={22}  className="text-blue-400 cursor-pointer group-hover:text-white"/>
                  Edite
                </button>
              </div>}
               {true&&<div>
                  <button className="flex items-center gap-2 p-2 transition duration-300 bg-gray-100 rounded-xl group hover:text-white hover:bg-blue-400">
                  <FaPlusCircle size={22}  className="text-blue-400 cursor-pointer group-hover:text-white"/>
                  add request
                </button>
               </div>}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
    </div>
  );
};

export default DoctorsTable;
