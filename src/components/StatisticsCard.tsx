import React from 'react'

function StatisticsCard({ color, icon, title, value }: {color: string, icon: React.ReactNode, title: string, value: string}) {
  return (
    <div className='bg-white rounded-xl h-fit shadow-md'>
      <div className='flex items-center w-full h-full gap-5 p-5'>
        <div className={`p-4 ${color} rounded-xl`}>
          {icon}
        </div>
        <div className='flex flex-col'>
          <p className='text-gray-400'>{title}</p>
          <h1 className='text-[28px] font-[600]'>{value}</h1>
        </div>
      </div>
    </div>
  )
}

export default StatisticsCard