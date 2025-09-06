"use client";
import StatisticsCard from "../../../components/StatisticsCard";
import Chart from '../../../components/Chart'
import {FaStethoscope, FaUser } from "react-icons/fa";
import {  MdReport  } from "react-icons/md";
import Table from '../../../components/Table'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReportCard from '../../../components/ReportCard';
import useAuthStore from "../../store/AuthStore";
import { FaCirclePlus } from "react-icons/fa6";
import useAdminStore from "@/app/store/AdminStore";
import { useEffect } from "react";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaImage } from "react-icons/fa";

export default function Home() {
  const {role_name}=useAuthStore();
     const {getStatistic,statistics,getRadStatistic,Rad_statistics}=useAdminStore()
  const isRadiology=role_name==="radiologyManager";
    const isAdmin=role_name==="admin";
  useEffect(()=>{
    if(role_name==="admin"){
getStatistic()
    }
       if(role_name==="radiologyManager"){
getRadStatistic()
    }
    
    
  },[])
  const radStatsData = [
  {
    h1: Rad_statistics?.total_patients ?? "0", 
    p: "Total Patients",
    icon: <FaUser color="#ffffff" size={25} />,
    color: "bg-[#FF1C93]"
  },
  {
    h1: Rad_statistics?.images_this_week ?? "0",
    p: "Images This Week",
    icon: <FaImage color="#ffffff" size={25} />,
    color: "bg-[#0780FA]"
  },
  {
    h1: Rad_statistics?.pending_requests ?? "0",
    p: "Pending Requests",
    icon: <MdOutlinePendingActions color="#ffffff" size={25} />,
    color: "bg-[#14BEBF]"
  },
];

  const reports = [
  {
    icon: <FaCirclePlus color="#FFD700" size={30} />,
    text1: 'Add a radiology department official',
    text2: '10 minutes ago',
    color: "#ea6c1e",
    role:"6"
  },
  {
    icon: <FaCirclePlus color="#FFD700" size={30} />,
    text1: 'Add an admissions department official',
    text2: '20 minutes ago',
    color: "#78aae7",
    role:"7"
  },
  {
    icon: <FaCirclePlus color="#FFD700" size={30} />,
    text1: 'Add practical supervisors',
    text2: '1 hour ago',
    color: "#d44c4c",
    role:"3"
  },
];

 const formatWeekday = (locale: string | undefined, date: Date) => {
    return date.toLocaleDateString(locale ?? 'en-US', { weekday: 'short' }).charAt(0);
  };
            const articlesData = [
    { id: 1, title: 'How to Learn React', author: 'أحمد محمد', status: 'Published', views: 1234, date: '2024-01-15' },
    { id: 2, title: 'JavaScript Best Practices', author: 'فاطمة علي', status: 'Draft', views: 856, date: '2024-01-14' },
    { id: 3, title: 'CSS Grid Tutorial', author: 'محمد حسن', status: 'Published', views: 2341, date: '2024-01-13' }
  ];
  const statsData = [
  {
    h1: statistics?.patients ?? "0", 
    p: "Total Patients",
    icon: <FaUser color="#ffffff" size={25} />,
    color: "bg-[#FF1C93]"
  },
  {
    h1: statistics?.supervisors ?? "0",
    p: "Supervisors",
    icon: <MdOutlineSupervisorAccount color="#ffffff" size={25} />,
    color: "bg-[#0780FA]"
  },
  {
    h1: statistics?.students ?? "0",
    p: "Doctors",
    icon: <FaStethoscope color="#ffffff" size={25} />,
    color: "bg-[#14BEBF]"
  },
];

  return (
    <div className="grid w-full grid-cols-12 gap-5 px-10 py-5 ">
   
      <div className="grid w-full grid-cols-12 col-span-9 gap-4 ">
           <div className="flex justify-between w-full col-span-12 ">
              <h1 className="text-[28px] font-[600]">{isAdmin? "Admin":(isRadiology?"Radiology":"Admission Office")}</h1>
              <div className="flex items-center px-5 bg-white rounded-xl">
               <select name="" id=""  className="w-full outline-0">
                <option value="">this week</option>
                <option value="">this month</option>
               </select>
               </div>
      </div>
       {isRadiology
  ? radStatsData.map((item, index) => (
      <div key={index} className="col-span-4">
        <StatisticsCard 
          color={item.color}
          icon={item.icon}
          title={item.p}
          value={item.h1}
        />
      </div>
    ))
  : statsData.map((item, index) => (
      <div key={index} className="col-span-4">
        <StatisticsCard 
          color={item.color}
          icon={item.icon}
          title={item.p}
          value={item.h1}
        />
      </div>
    ))
}

 <div className={`flex w-full ${isAdmin?"col-span-8":"col-span-12"} p-5 bg-white rounded-xl`}>
        <Chart />
      </div>
   { isAdmin&&  <div className="flex flex-col col-span-4 gap-3 p-5 bg-white rounded-xl">
        <h1 className="text-[18px] font-[600]">sections</h1>
           <div className="flex flex-col h-full gap-4">
      {reports.map((report, index) => (
        <ReportCard
          key={index}
          icon={report.icon}
          role={report.role}
          text1={report.text1}
          title={report.text1}
          color={report.color}
        />
      ))}
    </div>
      </div>}
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
<div className="flex flex-col col-span-3 gap-5 p-2 bg-white rounded-xl">
  <h1 className="mb-4 text-xl font-semibold">Calendar</h1>
  <Calendar formatShortWeekday={formatWeekday} 
 locale="en-US"
className="" />
<div>
  <h1>Reports</h1>
</div>

 <div className="flex p-2 gap-2 bg-[#35B6E6] rounded-xl">
         <div>
         <MdReport color="#BFCE8A" size={30}/>
         </div>
         <div className="flex flex-col gap-5 text-white">
          <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facere.
          </h3>
          <span>10 minutes ago</span>
         </div>
        </div> <div className="flex p-2 gap-2 bg-[#35B6E6] rounded-xl">
         <div>
         <MdReport color="#BFCE8A" size={30}/>
         </div>
         <div className="flex flex-col gap-5 text-white">
          <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facere.
          </h3>
          <span>10 minutes ago</span>
         </div>
        </div> <div className="flex p-2 gap-2 bg-[#35B6E6] rounded-xl">
         <div>
         <MdReport color="#BFCE8A" size={30}/>
         </div>
         <div className="flex flex-col gap-5 text-white">
          <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facere.
          </h3>
          <span>10 minutes ago</span>
         </div>
 </div> 
     

</div>

    </div>

  );
}
