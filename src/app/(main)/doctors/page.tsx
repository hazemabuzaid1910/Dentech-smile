"use client";

import { useState } from "react";
import DoctorsTable from "@/components/Doctor";
import { MdAddCircleOutline } from "react-icons/md";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import InputWithLabel from "@/components/InputWithLabel";

export default function DoctorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [openEye, setOpenEye] = useState(false);
  const [password, setPassword] = useState("");

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handletoggle = () => setOpenEye(!openEye);

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-[24px] font-bold">Dental Students</h1>
        <button
          onClick={handleOpen}
          className="py-2 px-4 flex gap-2 text-white bg-[var(--secondary-color)] shadow-xl rounded-xl"
        >
          <MdAddCircleOutline size={22} />
          Add Student
        </button>
      </div>

      <DoctorsTable />

      {showModal && (
        <div className="fixed inset-0 bg-[#0000007f] bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl overflow-hidden w-[900px] shadow-xl">
            <div className="bg-[var(--main-color)] py-2 px-4 flex items-center">
              <h2 className="text-xl font-bold text-white">Add Doctor</h2>
            </div>
            <form className="flex flex-col gap-4 p-10">
              <div className="flex gap-8">
                <div className="flex flex-col gap-5 w-full">
                  <InputWithLabel
                    label="Name*"
                    placeholder="Enter your name..."
                    type="text"
                  />
                  
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm px-2 font-medium text-gray-700">Password*</label>
                    <div className="flex items-center px-4 bg-gray-100 rounded-xl">
                      <input
                        type={openEye ? "text" : "password"}
                        placeholder="Enter your password..."
                        className="w-full py-3 bg-gray-100 outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      <div className="cursor-pointer" onClick={handletoggle}>
                        {openEye ? <FaRegEye size={20} /> : <FaEyeSlash size={20} />}
                      </div>
                    </div>
                  </div>
                     <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm px-2 font-medium text-gray-700">Confirm Password*</label>
                    <div className="flex items-center px-4 bg-gray-100 rounded-xl">
                      <input
                        type={openEye ? "text" : "password"}
                        placeholder="Enter your password..."
                        className="w-full py-3 bg-gray-100 outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="cursor-pointer" onClick={handletoggle}>
                        {openEye ? <FaRegEye size={20} /> : <FaEyeSlash size={20} />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5 w-full">
                  <InputWithLabel
                    label="Phone*"
                    placeholder="Enter your phone number..."
                    type="text"
                  />
                  <InputWithLabel
                    label="Specialty*"
                    placeholder="Enter your specialty..."
                    type="text"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 rounded-xl hover:text-white hover:bg-red-400 transition duration-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--main-color)] text-white rounded-xl cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
