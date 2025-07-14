"use client";
import StatisticsCard from "../../../components/StatisticsCard";
import Chart from '../../../components/Chart'
import { FaHeartbeat, FaStethoscope, FaUser } from "react-icons/fa";
import {  MdReport  } from "react-icons/md";
import Table from '../../../components/Table'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReportCard from '../../../components/ReportCard';
import useAuthStore from "../../(auth)/signin/AuthStore";
import { FaCirclePlus } from "react-icons/fa6";
export default function Home() {
  const {role_name}=useAuthStore();
  const isAdmin=role_name==="admin";
  const reports = [
  {
    icon: <FaCirclePlus color="#FFD700" size={30} />,
    text1: 'Add a radiology department official',
    text2: '10 minutes ago',
    color: "bg-[#ea6c1e]"
  },
  {
    icon: <FaCirclePlus color="#FFD700" size={30} />,
    text1: 'Add an admissions department official',
    text2: '20 minutes ago',
    color: "bg-[#78aae7]"
  },
  {
    icon: <FaCirclePlus color="#FFD700" size={30} />,
    text1: 'Add practical supervisors',
    text2: '1 hour ago',
    color: "bg-[#d44c4c]"
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
    h1: "64,7k",
    p: "Total Patients",
    icon: <FaUser color="#ffffff" size={25} />,
    color: "bg-[#FF1C93]"
  },
  {
    h1: "12,3k",
    p: "Heart Surgeries",
    icon: <FaHeartbeat color="#ffffff" size={25} />,
    color: "bg-[#0780FA]"
  },
  {
    h1: "8,9k",
    p: "Doctors",
    icon: <FaStethoscope color="#ffffff" size={25} />,
    color: "bg-[#14BEBF]"
  },
];
  return (
    <div className="grid w-full grid-cols-12 gap-5 px-10 py-5 ">
   
      <div className="grid w-full grid-cols-12 col-span-9 gap-4 ">
           <div className="flex justify-between w-full col-span-12 py-5 ">
              <h1 className="text-[28px] font-[600]">{isAdmin? "Radiology":"Admin"}</h1>
              <div className="flex items-center px-5 bg-white rounded-xl">
               <select name="" id=""  className="w-full outline-0">
                <option value="">this week</option>
                <option value="">this month</option>
               </select>
               </div>
      </div>
        {statsData.map((item,index)=>(
          <div           key={index}
  className="col-span-4">
          <StatisticsCard 
          color={item.color}
          icon={item.icon}
          title={item.p}
          value={item.h1}
          />
</div>
))}
 <div className="flex col-span-8 p-5 bg-white rounded-xl">
        <Chart />
      </div>
      <div className="flex flex-col col-span-4 gap-3 p-5 bg-white rounded-xl">
        <h1 className="text-[18px] font-[600]">sections</h1>
           <div className="flex flex-col h-full gap-4">
      {reports.map((report, index) => (
        <ReportCard
          key={index}
          icon={report.icon}
          text1={report.text1}
          text2={report.text2}
          color={report.color}
        />
      ))}
    </div>


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
<div className="flex flex-col col-span-3 gap-5 p-2 my-5 bg-white rounded-xl">
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
