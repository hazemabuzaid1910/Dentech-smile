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
import Image from "next/image";
import { BarChart3, CheckCircle, Clock } from "lucide-react";

export default function Home() {
  const {role_name}=useAuthStore();
  const {getStatistic,statistics,getRadStatistic,Rad_statistics,getRecentImage,admissionstat,getstaticAdmission,recent_image}=useAdminStore()
  
  const isRadiology=role_name==="radiologyManager";
  const isAdmin=role_name==="admin";
  const isAdmission=role_name==="AdmissionManager"
  useEffect(()=>{
    if(isAdmission){
getstaticAdmission()
    }
      if(isRadiology){
    getRecentImage()
    }
    if(role_name==="admin"){
      getStatistic()
    }
    if(role_name==="radiologyManager"){
      getRadStatistic()
    }
  },[getRadStatistic, getRecentImage, getStatistic, getstaticAdmission, isAdmission, isRadiology, role_name])

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
    const staticData = [
    {
      h1: admissionstat?.data?.[0].request_count ?? "0", 
      p: "Total Request",
      icon: <CheckCircle color="#ffffff" size={25} />,
      color: "bg-[#FF1C93]"
    },
    {
      h1: admissionstat?.data?.[0].assign_request_count ?? "0",
      p: "Assigned request",
      icon: <BarChart3 color="#ffffff" size={25} />,
      color: "bg-[#0780FA]"
    },
    {
      h1: admissionstat?.data?.[0].unassign_request_count ?? "0",
      p: "Unassign request",
      icon: <Clock color="#ffffff" size={25} />,
      color: "bg-[#14BEBF]"
    },
  ];

  const fallbackData = [
    { id: 1, type: 'Dentistry', students: 120, graduated: 30, created_at: '2024-01-10' },
    { id: 2, type: 'Medicine', students: 200, graduated: 50, created_at: '2024-01-11' },
    { id: 3, type: 'Pharmacy', students: 150, graduated: 40, created_at: '2024-01-12' },
    { id: 4, type: 'Nursing', students: 180, graduated: 60, created_at: '2024-01-13' },
  ];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tableData: any[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tableColumns: any[] = [];

if (isRadiology) {
  tableData = recent_image?.images_this_week ?? [];
  tableColumns = [
    { key: 'id', header: 'ID' },
    { key: 'type', header: 'Type' },
    {
      key: 'image_url',
      header: 'Image',
      render: (url: string) => (
        <Image
          src={`http://127.0.0.1:8000/storage/${url}`}
          alt="radiology"
          className="object-cover w-20 h-20 rounded-md"
        />
      ),
    },
    { key: 'created_at', header: 'Created At' },
  ];
} else if (isAdmission) {
  tableData = admissionstat?.data ?? [];
  tableColumns = [
    { key: 'stage_id', header: 'Stage ID' },
    { key: 'stage_name', header: 'Stage Name' },
    { key: 'session_count', header: 'Session Count' },
    { key: 'average_score', header: 'Average Score' },
  ];
} else if (isAdmin) {
  tableData = fallbackData;
  tableColumns = [
    { key: 'id', header: 'ID' },
    { key: 'type', header: 'Type' },
    { key: 'students', header: 'Students' },
    { key: 'graduated', header: 'Graduated' },
    { key: 'created_at', header: 'Created At' },
  ];
}


  return (
    <div className="grid w-full grid-cols-12 gap-5 px-10 py-5 ">
      <div className="grid w-full grid-cols-12 col-span-9 gap-4 ">
        <div className="flex justify-between w-full col-span-12 ">
          <h1 className="text-[28px] font-[600]">
            {isAdmin? "Admin":(isRadiology?"Radiology":"Admission Office")}
          </h1>
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
          : (isAdmin)?statsData.map((item, index) => (
              <div key={index} className="col-span-4">
                <StatisticsCard 
                  color={item.color}
                  icon={item.icon}
                  title={item.p}
                  value={item.h1}
                />
              </div>
            )): staticData.map((item, index) => (
              <div key={index} className="col-span-4">
                <StatisticsCard 
                  color={item.color}
                  icon={item.icon}
                  title={item.p}
                  value={item.h1}
                />
              </div>))
        }

        <div className={`flex w-full ${isAdmin?"col-span-8":"col-span-12"} p-5 bg-white rounded-xl`}>
          <div className="h-[20rem] w-full">
            <Chart />
          </div>
        </div>

        { isAdmin &&  
          <div className="flex flex-col col-span-4 gap-3 p-5 bg-white rounded-xl">
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
          </div>
        }
        

        <div className="col-span-12">
          <div className="bg-white rounded-xl p-4 h-[300px] overflow-y-auto">
      <Table
  data={tableData}
  columns={tableColumns}
  onView={(row) => console.log('View:', row)}
  onEdit={(row) => console.log('Edit:', row)}
  onDelete={(row) => console.log('Delete:', row)}
/>

          </div>
        </div>
      </div>

      <div className="flex flex-col col-span-3 gap-5 p-2 bg-white rounded-xl">
        <h1 className="mb-4 text-xl font-semibold">Calendar</h1>
        <Calendar formatShortWeekday={formatWeekday} locale="en-US" />
        <div>
          <h1>Reports</h1>
        </div>
        <div className="flex p-2 gap-2 bg-[#35B6E6] rounded-xl">
          <div>
            <MdReport color="#BFCE8A" size={30}/>
          </div>
          <div className="flex flex-col gap-5 text-white">
            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
            <span>10 minutes ago</span>
          </div>
        </div>
             <div className="flex gap-2 p-2 text-gray-700 border-2 rounded-xl">
          <div>
            <MdReport color="#BFCE8A" size={30}/>
          </div>
          <div className="flex flex-col gap-5 text-gray-700">
            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
            <span>10 minutes ago</span>
          </div>
        </div>
             <div className="flex gap-2 p-2 text-gray-700 border-2 rounded-xl">
          <div>
            <MdReport color="#BFCE8A" size={30}/>
          </div>
          <div className="flex flex-col gap-5 text-gray-700">
            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
            <span>10 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
