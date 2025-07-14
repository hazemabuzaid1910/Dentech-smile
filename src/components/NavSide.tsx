"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaHome } from 'react-icons/fa';
import { TbLogout2 } from "react-icons/tb";
import { FaUserDoctor } from 'react-icons/fa6';
import { AiOutlineSchedule } from "react-icons/ai";
import useAuthStore from '../app/(auth)/signin/AuthStore';
import { useRouter } from 'next/navigation';
function NavSide() {
  const router = useRouter();

  const { logOut } = useAuthStore();
  const handleLogout = async () => {
      await logOut();
       router.replace("/signin");
  };

  return (
    <div className="flex flex-col w-[300px] m-2 px-4 bg-[var(--main-color)] rounded-2xl relative z-50">
      <div className='flex items-center justify-center pt-5 pb-4 border-b border-gray-300'>
        <Image src="/logo.svg" alt="Logo" width={300} height={100} />
      </div>
      <div className='flex items-center text-white'>
        <ul className='flex flex-col w-full gap-5 mt-15'>
          <li>
            <Link href="/" className='text-[20px] flex gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2 w-full px-4'>
              <FaHome size={22} />
              Home
            </Link>
          </li>
          
          <li>
            <Link href="/doctors" className='text-[20px] flex gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2 w-full px-4'>
              <FaUserDoctor size={22} />
              Students
            </Link>
          </li>
          <li>
            <Link href="/patients" className='text-[20px] flex mx-1 gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2  px-4'>
            <AiOutlineSchedule size={22} />
              Practical schedule
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className='text-[20px] flex gap-5 items-center hover:bg-[var(--hover-color)] rounded-2xl py-2 w-full px-4'>
              <TbLogout2 size={22} />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavSide;
