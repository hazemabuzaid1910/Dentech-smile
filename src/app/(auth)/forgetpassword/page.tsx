"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FormEvent } from 'react';

import {  FaArrowLeft, FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { useState,useEffect } from 'react'
import useAuthStore from '../signin/AuthStore'
import { useRouter } from 'next/navigation';
function Sigin() {
  const {signIn,token}=useAuthStore();
const router = useRouter();
  const[openEye,setOpenEye]=useState(false);
    const[confirmPassword,setConfirmPassword]=useState("");
  const[password,setPassword]=useState("");
const handleSubmit=async(e:FormEvent)=>{
 e.preventDefault();
 await (signIn(password));
 
}
    useEffect(() => {
    if (token) {
      
      router.push("/dashboard");
    
    }
  }, [router,token]);
function handletoggle(){
  setOpenEye(!openEye)
}
  return (
    
 <div className="flex items-center justify-center  bg-white w-6xl h-[30rem] rounded-2xl">
        <div className='flex items-center w-full h-full gap-5 px-5 py-5 shadow-2xl rounded-2xl sm:flex-row'>
          <div className='w-full h-full overflow-hidden rounded-xl '>
          <Image src="/login.jpg" alt='' width={600} height={800} className="object-cover h-full "/> 
          </div>
          <div className='w-full p-[5rem] '>
            <form onSubmit={handleSubmit} className='flex flex-col gap-10'>
              <h1 className='text-[50px] text-[var(--main-color)] font-bold'>Reset password</h1>
              <div className='flex flex-col gap-4'>
              <div className='flex items-center w-full px-4 bg-gray-100 rounded-xl'>
              <input 
              type={openEye? "text":"password"} 
              name="" id="" 
              className='w-full px-2 py-3 outline-none' 
              placeholder='Enter Your Password...'
              onChange={(e)=>setPassword(e.target.value)}
              />
                 <div className='cursor-pointer' onClick={handletoggle}>{openEye?<FaRegEye size={20}/>:<FaEyeSlash size={20}/>}</div>  

                </div>
              <div className='flex flex-col w-full gap-2'>
                <div className='flex items-center w-full px-4 bg-gray-100 rounded-xl'>
              <input 
              type={openEye? "text":"password"} 
              name="" id="" 
              className='w-full px-2 py-3 outline-none' 
              placeholder='Enter Your Password...'
              onChange={(e)=>setPassword(e.target.value)}
              />
                 <div className='cursor-pointer' onClick={handletoggle}>{openEye?<FaRegEye size={20}/>:<FaEyeSlash size={20}/>}</div>  

                </div>
               </div>
              <Link href="/signin" className='text-[var(--secondary-color)] flex gap-2 items-center'>
              <FaArrowLeft/>Back</Link>
             </div>
             <div className='flex items-center justify-start'>
              <button className='text-white cursor-pointer bg-[var(--main-color)] py-2 text-[20px] w-fit px-4 rounded-xl '>Sign in</button>
           </div> </form>
          </div>
        </div>
    </div>
  )
}

export default Sigin