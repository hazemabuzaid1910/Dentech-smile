"use client"
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoNotifications } from 'react-icons/io5'
function NavBar() {
  return (
    <div className='flex items-center  m-2 text-white   bg-[var(--main-color)] py-4 rounded-2xl'>
        <div className='flex items-center justify-center w-full'>
     <div className='flex items-center w-fit rounded-2xl border-1'>
          <FaSearch color='#007981' size={22} className='ml-4'/>
      <input type="text"  className='  w-[20rem]  border-none  px-5 py-1  outline-none'/>
     </div>
    </div>

     <div className='flex justify-end mr-10'>
    <IoNotifications size={26}/>
     </div>
    </div>
  )
}

export default NavBar