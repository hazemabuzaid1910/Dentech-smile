import React from 'react'

function ReportCard({icon,text1,color}:{icon:React.ReactNode,color:string,text1:string,text2:string}) {
  return (
    <button className='cursor-pointer'>
        <div className={`flex items-center justify-center px-6 gap-2 py-6  ${color} rounded-xl`}>
                 <div>  {icon} </div>
                 
                  <p className='text-white'>{text1}</p>
                </div>
    </button>
  )
}

export default ReportCard