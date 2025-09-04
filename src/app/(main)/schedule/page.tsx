"use client"
import React, { JSX, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import useAdminStore from '@/app/store/AdminStore';
import { useEffect } from 'react';
// Types
interface SubjectData {
  id:number;
  subject: string;
  supervisor: string;
  location: string;
}
const colorPalette = [
  "from-orange-500 to-orange-600",
  "from-blue-500 to-blue-600",
  "from-green-500 to-green-600",
  "from-purple-500 to-purple-600",
  "from-indigo-500 to-indigo-600",
  "from-yellow-500 to-yellow-600",
  "from-pink-500 to-pink-600",
  "from-red-500 to-red-600",
  "from-teal-500 to-teal-600",
  "from-cyan-500 to-cyan-600",
];
interface ScheduleEntry {
  id: number;
  stage_name: string;
  supervisor_name: string;
  location: string;
  start_time: string;
  end_time: string;
}
const yearOptions = [
  { id: "fourth-year", name: "Fourth Year" },
  { id: "fifth-year", name: "Fifth Year" },
];

interface ScheduleResponse {
  status: string;
  year: string;
  schedules: {
    [day: string]: ScheduleEntry[];
  };
}
interface ScheduleData {
  [key: string]: SubjectData;
}

interface EditingData {
  stage_id?: string;
  supervisor_id?: string;
  location?: string;
}

const PracticalScheduleTable: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<EditingData>({});
  const [stageColors, setStageColors] = useState<{ [key: string]: string }>({});
const [selectedYear, setSelectedYear] = useState("fifth-year");

  const { stages, supervisors,addShcedule,getSchedule,delSchedule, getStages, getSuperVisor }=useAdminStore()
  const stageOptions = Array.isArray(stages.stages) ? stages.stages : [];
  const superVisorOptions = Array.isArray(supervisors?.supervisors?.data) ? supervisors.supervisors.data : [];

 

useEffect(() => {
  const fetchSchedule = async () => {
    const formData = new FormData();
    formData.append("year", selectedYear);

    const res: ScheduleResponse = await getSchedule(formData);

    if (res?.schedules) {
      const formattedData: ScheduleData = {};
      const newStageColors: { [key: string]: string } = {};
      let colorIndex = 0;

      Object.entries(res.schedules).forEach(([day, entries]) => {
        (entries as ScheduleEntry[]).forEach((entry) => {
          const timeSlot = `${entry.start_time.slice(0,5)} - ${entry.end_time.slice(0,5)}`;
          const key = `${day}-${timeSlot}`;

          formattedData[key] = {
            id: entry.id,
            subject: entry.stage_name,
            supervisor: entry.supervisor_name,
            location: entry.location
          };

          if (!newStageColors[entry.stage_name]) {
            newStageColors[entry.stage_name] = colorPalette[colorIndex % colorPalette.length];
            colorIndex++;
          }
        });
      });

      setStageColors(newStageColors);
      setScheduleData(formattedData);
    }
  };

  getStages();
  getSuperVisor();
  fetchSchedule();
}, [selectedYear]);


  const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const timeSlots: string[] = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    
  ];

  const subjectOptions: { id: string; name: string }[] = [
    { id: '1', name: 'Practical Chemistry' },
    { id: '2', name: 'Practical Physics' },
    { id: '3', name: 'Practical Biology' },
    { id: '4', name: 'Computer Science' },
    { id: '5', name: 'Applied Mathematics' },
    { id: '6', name: 'Civil Engineering' },
    { id: '7', name: 'Electrical Engineering' },
    { id: '8', name: 'General Medicine' }
  ];


  const locations: string[] = [
    'Chemistry Lab - A101',
    'Physics Lab - B202',
    'Biology Lab - C303',
    'Computer Lab - D404',
    'Lecture Hall - E505',
    'Main Lab - F606',
    'Advanced Lab - G707'
  ];



  const getSlotKey = (day: string, time: string): string => `${day}-${time}`;

  const addSubject = (day: string, time: string): void => {
    const key = getSlotKey(day, time);
    setIsEditing(key);
    setEditingData({
      stage_id: '',
      supervisor_id: '',
      location: ''
    });
  };

  const editSubject = (day: string, time: string): void => {
    const key = getSlotKey(day, time);
    const existingData = scheduleData[key];
    
    if (existingData) {
      const stageId = subjectOptions.find(subj => subj.name === existingData.subject)?.id || '';
      const supervisorId = superVisorOptions.find((sup: { name: string; }) => sup.name === existingData.supervisor)?.id || '';
      
      setIsEditing(key);
      setEditingData({
        stage_id: stageId,
        supervisor_id: supervisorId,
        location: existingData.location
      });
    }
  };

  
 const saveSubject = async (day: string, time: string) => {
  if (editingData.stage_id && editingData.supervisor_id && editingData.location) {
    const subjectName = subjectOptions.find(subj => subj.id === editingData.stage_id)?.name || editingData.stage_id;
    const supervisorName = superVisorOptions.find((s: { id: number; }) => s.id === Number(editingData.supervisor_id))?.name || '';

    setScheduleData(prev => ({
      ...prev,
      [`${day}-${time}`]: {
        id: prev[`${day}-${time}`]?.id,
        subject: subjectName,
        supervisor: supervisorName,
        location: editingData.location!
      }
    }));

    setIsEditing(null);
    setEditingData({});

    // إنشاء FormData جديد لكل حفظ
    const formData = new FormData();
    const [startTime, endTime] = time.split(" - ");
    formData.append("year", selectedYear);
    formData.append("days", day);
    formData.append("stage_id", editingData.stage_id!);
    formData.append("supervisor_id", editingData.supervisor_id!);
    formData.append("location", editingData.location!);
    formData.append("start_time", startTime.trim());
    formData.append("end_time", endTime.trim());

    await addShcedule(formData);

    const refreshFormData = new FormData();
    refreshFormData.append("year", selectedYear);
    const res = await getSchedule(refreshFormData);
    if (res?.schedules) {
      // تحديث scheduleData بنفس الطريقة
      const formattedData: ScheduleData = {};
      const newStageColors: { [key: string]: string } = {};
      let colorIndex = 0;

      Object.entries(res.schedules).forEach(([day, entries]) => {
        (entries as ScheduleEntry[]).forEach((entry) => {
          const key = `${day}-${entry.start_time.slice(0,5)} - ${entry.end_time.slice(0,5)}`;
          formattedData[key] = {
            id: entry.id,
            subject: entry.stage_name,
            supervisor: entry.supervisor_name,
            location: entry.location
          };
          if (!newStageColors[entry.stage_name]) {
            newStageColors[entry.stage_name] = colorPalette[colorIndex % colorPalette.length];
            colorIndex++;
          }
        });
      });

      setStageColors(newStageColors);
      setScheduleData(formattedData);
    }
  }
};


  const deleteSubject = async(day: string, time: string, id:number): Promise<void> => {
    const key = getSlotKey(day, time);
    console.log(id)
        const res =await  delSchedule(id);    

    if (res?.status === "deleted success") { 

    setScheduleData(prev => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  }
  };

  const cancelEdit = (): void => {
    setIsEditing(null);
    setEditingData({});
  };

  const handleSelectChange = (field: keyof EditingData, value: string): void => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  };

  const renderCell = (day: string, time: string): JSX.Element => {
    const key = getSlotKey(day, time);
    const isEditingThis = isEditing === key;
    const hasSubject = scheduleData[key];

    if (isEditingThis) {
      return (
        <div className="p-2 space-y-2">
          <select
            value={editingData.stage_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleSelectChange('stage_id', e.target.value)
            }
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select Subject</option>
            {stageOptions?.map((subject: { id: number; name: string }) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
          
          <select
            value={editingData.supervisor_id || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleSelectChange('supervisor_id', e.target.value)
            }
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select Supervisor</option>
            {superVisorOptions.map((supervisor:{ id: number; name: string }) => (
              <option key={supervisor.id} value={supervisor.id}>{supervisor.name}</option>
            ))}
          </select>
          
          <select
            value={editingData.location || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleSelectChange('location', e.target.value)
            }
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select Location</option>
            {locations.map((location: string) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          
          <div className="flex justify-center gap-2">
            <button
              onClick={() => saveSubject(day, time)}
              className="p-2 text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600"
              type="button"
            >
              <Save size={16} />
            </button>
            <button
              onClick={cancelEdit}
              className="p-2 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      );
    }

    if (hasSubject) {
const colorClass = stageColors[hasSubject.subject] || "from-gray-500 to-gray-600";
      
      return (
        <div className="relative group">
          <div className={`bg-gradient-to-r ${colorClass} text-white p-3 rounded-lg shadow-md`}>
            <div className="mb-1 text-sm font-semibold">{hasSubject.subject}</div>
            <div className="mb-1 text-xs opacity-90">{hasSubject.supervisor}</div>
            <div className="text-xs opacity-80">{hasSubject.location}</div>
          </div>
          
          <div className="absolute flex gap-1 transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100">
            <button
              onClick={() => editSubject(day, time)}
              className="p-1 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
              type="button"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={() => deleteSubject(day, time,hasSubject.id)}
              className="p-1 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
              type="button"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => addSubject(day, time)}
        className="w-full h-full min-h-[60px] border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 flex items-center justify-center group"
        type="button"
      >
        <Plus size={20} className="text-gray-400 group-hover:text-teal-500" />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="mx-auto max-w-7xl">
        <div className="p-8 rounded-2xl">
          <div className="flex mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-teal-600">Practical Subjects Schedule</h1>
          </div>
<div className="mb-6">
  <label className="block mb-2 font-semibold">Select Year:</label>
  <select
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
  >
    {yearOptions.map((year) => (
      <option key={year.id} value={year.id}>{year.name}</option>
    ))}
  </select>
</div>
          <div className="overflow-x-auto">
            <table className="w-full overflow-hidden bg-white border-collapse shadow-lg rounded-xl">
              <thead>
                <tr>
                  <th className="bg-[var(--main-color)] text-white p-4 text-center font-semibold">
                    Time
                  </th>
                  {days.map((day: string) => (
                    <th
                      key={day}
                      className="bg-[var(--main-color)] text-white p-4 text-center font-semibold min-w-[200px]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time: string, timeIndex: number) => (
                  <tr key={time} className={timeIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 text-center font-semibold min-w-[120px]">
                      {time}
                    </td>
                    {days.map((day: string) => (
                      <td
                        key={day}
                        className="p-2 border-r border-gray-200 min-h-[80px] align-top"
                      >
                        {renderCell(day, time)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-8">
            <div className="px-6 py-3 text-white rounded-lg bg-gradient-to-r from-teal-500 to-teal-600">
              <div className="text-sm font-semibold">
                Total Scheduled Subjects: {Object.keys(scheduleData).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticalScheduleTable;