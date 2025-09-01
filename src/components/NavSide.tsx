"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaHome } from 'react-icons/fa';
import { RiLogoutBoxFill } from "react-icons/ri";
import { FaUserDoctor } from 'react-icons/fa6';
import { AiFillSchedule,  } from "react-icons/ai";
import useAuthStore from '../app/store/AuthStore';
import { useRouter } from 'next/navigation';
import { PiUsersFill } from "react-icons/pi";
import { FaCodePullRequest } from "react-icons/fa6";

function NavSide() {
  const router = useRouter();
  const {role_name}=useAuthStore();
  const isRadiology=role_name==="radiologyManager";
    const isAdmin=role_name==="admin";
  const isAdmission=role_name==="AdmissionManager";



  const { logOut } = useAuthStore();
  const handleLogout = async () => {
      await logOut();
       router.replace("/signin");
  };

  return (
    <div className="flex flex-col w-[300px] min-h-screen m-2 px-4 bg-[var(--main-color)] rounded-2xl relative z-50">
      <div className='flex items-center justify-center pt-5 pb-4 border-b border-gray-300'>
        <Image src="/logo.svg" alt="Logo" width={200} height={100} />
      </div>
      <div className='flex items-center text-white'>
        <ul className='flex flex-col w-full gap-5 mt-15'>
          <li>
            <Link href="/" className='text-[20px] flex gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2 w-full px-4'>
              <FaHome size={22} />
              Home
            </Link>
          </li>
          
          {isAdmin&&<li>
            <Link href="/doctors" className='text-[20px] flex gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2 w-full px-4'>
              <FaUserDoctor size={22} />
              Students
            </Link>
          </li>}
          {(isAdmission || isRadiology) && (
  <li>
    <Link
      href="/patient"
      className="text-[20px] flex gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2 w-full px-4"
    >
      <PiUsersFill size={22} />
      Patient
    </Link>
  </li>
)}
          {isAdmission&& <li>
            <Link href="/requests" className='text-[20px] flex gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2 w-full px-4'>
              <FaCodePullRequest size={22} />
              Requests
            </Link>
          </li>}
         { isAdmin&&<li>
            <Link href="/schedule" className='text-[20px] flex mx-1 gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2  px-4'>
           <AiFillSchedule size={22} />

              Practical schedule
            </Link>
          </li>}
          <li>
            <button onClick={handleLogout} className='text-[20px] flex gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2 w-full px-4'>
<RiLogoutBoxFill size={22}/>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavSide;
