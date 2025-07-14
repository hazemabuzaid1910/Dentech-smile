"use client"
import React from 'react'
import Image from 'next/image'
import { FaBook, FaEdit } from 'react-icons/fa'
import Table from '../../../components/Table'
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import { useState } from 'react'
import { TbTools } from 'react-icons/tb'
function page() {
      const [isOpen, setIsOpen] = useState(false);
const books = [
  { name: 'Oral and Maxillofacial Pathology', title: 'Neville, Damm, Allen, Chi' },
  { name: 'Contemporary Fixed Prosthodontics', title: 'Rosenstiel, Land, Fujimoto' },
  { name: 'Color Atlas of Dental Medicine: Periodontology', title: 'Hans-Peter Mueller' },
  { name: 'Endodontics: Principles and Practice', title: 'Torabinejad, Walton' },
];

                const articlesData = [
    { id: 1, title: 'How to Learn React', author: 'mohammd faraj', status: 'Published', views: 1234, date: '2024-01-15' },
    { id: 2, title: 'JavaScript Best Practices', author: 'Fateima fawaz', status: 'Draft', views: 856, date: '2024-01-14' },
    { id: 3, title: 'CSS Grid Tutorial', author: 'Hassan osama', status: 'Published', views: 2341, date: '2024-01-13' }
  ];
  return (
    <div className='grid items-start grid-cols-12 p-5'>
    <div className='grid min-h-screen grid-cols-12 col-span-8 gap-5 px-5 '>
           <div className='flex items-center justify-between col-span-12 px-5 '>
                <h1 className='text-[28px]'>Students Profile</h1>
                <div className='flex gap-4'>
                    <button className='cursor-pointer bg-[#f17676] rounded-xl px-4 py-2 text-white'>Delete</button>
                    <button className='cursor-pointer bg-[var(--blue-sky)] rounded-xl px-4 py-2 text-white'>Edit</button>
                </div>
            </div>
        <div className='flex flex-col items-center justify-center col-span-6 gap-6 py-5 bg-white rounded-xl'>
         
         <div className="w-[150px] h-[150px] rounded-full overflow-hidden relative">
          <Image
            src="/example/hr/17.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className='flex flex-col items-center justify-center gap-1'>
            <h1 className='text-[28px] font-[600]'>Doctor 1</h1>
            <span className='text-[var(--blue-sky)] text-[18px]'>+963 99456 4567</span>
            <p className='text-gray-500 text-[18px]'>4th year</p>
            </div>
        </div>
        <div className='col-span-6 col-start-7 gap-6 p-5 bg-white rounded-xl'>
            <div className='flex items-center justify-between'>
                 <h1>General Informations</h1>
       <button className='cursor-pointer'><FaEdit color='var(--blue-sky)'/></button>
            </div>
      
        <table className="w-full mt-10 table-auto ">
  <tbody>
    <tr>
      <th className="px-4 py-4 text-left border-b border-gray-300">Address</th>
      <td className="px-4 py-4 border-b border-gray-300">Damascuse-midan</td>
    </tr>
    <tr>
      <th className="px-4 py-4 text-left border-b border-gray-300">Academic average</th>
      <td className="px-4 py-4 border-b border-gray-300">78%</td>
    </tr>
    <tr>
      <th className="px-4 py-4 text-left border-b border-gray-300">Age</th>
      <td className="px-4 py-4 border-b border-gray-300">25 years old </td>
    </tr>
  </tbody>
</table>

    </div>
  
          <div className="col-span-12">
             <Table
                    data={articlesData.slice(0, 3)}
                    columns={[
                      { key: 'title', header: 'Address' },
                      { key: 'author', header: 'Book' },
                      { 
                        key: 'status', 
                        header: 'State',
                        render: (status) => (
                          <span className={`px-2 py-1 rounded text-xs text-white ${
                            status === 'Published' 
                              ? 'bg-green-500 bg-opacity-20'
                              : 'bg-yellow-500 bg-opacity-20 '
                          }`}>
                            {status === 'Published' ? 'posted' : 'مسودة'}
                          </span>
                        )
                      },
                      { key: 'views', header: 'Views' }
                    ]}
                    onView={(row) => console.log('View:', row)}
                    onEdit={(row) => console.log('Edit:', row)}
                    onDelete={(row) => console.log('Delete:', row)}
                  />
    </div>
    </div>
        <div className='h-full col-span-4 col-start-9 gap-6 p-5 bg-white rounded-xl'>
            <div className='flex items-center justify-between'>
                 <h1>Statistics</h1>
       <button className='cursor-pointer'><FaEdit color='var(--blue-sky)'/></button>
            </div>
      
        <table className="w-full mt-10 table-auto ">
  <tbody>
    <tr>
      <th className="px-4 py-4 text-left border-b border-gray-300">Address</th>
      <td className="px-4 py-4 border-b border-gray-300">Damascuse-midan</td>
    </tr>
    <tr>
      <th className="px-4 py-4 text-left border-b border-gray-300">Academic average</th>
      <td className="px-4 py-4 border-b border-gray-300">78%</td>
    </tr>
    <tr>
      <th className="px-4 py-4 text-left border-b border-gray-300">Age</th>
      <td className="px-4 py-4 border-b border-gray-300">25 years old </td>
    </tr>
      <tr>
      <th className="px-4 py-4 text-left border-b border-gray-300">Age</th>
      <td className="px-4 py-4 border-b border-gray-300">25 years old </td>
    </tr>
  </tbody>
</table>
   <div className='flex flex-col gap-5 py-5'>
    <h1>Equipments</h1>
   <div className="w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className='bg-[var(--hover-color)] flex justify-between rounded-xl px-4 py-4 items-center cursor-pointer transition-colors duration-300'
      >
        <div className='flex items-center gap-2'>
          <FaBook />
          <p>Books</p>
        </div>
        <span>{books.length}</span>
        {isOpen?<IoIosArrowUp />:<IoIosArrowDown />}

      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] mt-3' : 'max-h-0'}`}
      >
        <ul className='p-4 mt-2 space-y-2 bg-white shadow rounded-xl'>
          {books.map((book, index) => (
            <li key={index} className="pb-2 border-b">
              <p className="font-bold">{book.name}</p>
              <p className="text-sm italic text-gray-500">{book.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
       <div className="w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className='bg-[var(--hover-color)] flex justify-between rounded-xl px-4 py-4 items-center cursor-pointer transition-colors duration-300'
      >
        <div className='flex items-center gap-2'>
          <TbTools />

          <p>Tools</p>
        </div>
        <span>{books.length}</span>
        {isOpen?<IoIosArrowUp />:<IoIosArrowDown />}

      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] mt-3' : 'max-h-0'}`}
      >
        <ul className='p-4 mt-2 space-y-2 bg-white shadow rounded-xl'>
          {books.map((book, index) => (
            <li key={index} className="pb-2 border-b">
              <p className="font-bold">{book.name}</p>
              <p className="text-sm italic text-gray-500">{book.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
   </div>
    </div>
    </div>
  )
}

export default page