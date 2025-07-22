"use client"
import React, { JSX, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

// Types
interface SubjectData {
  subject: string;
  supervisor: string;
  location: string;
}

interface ScheduleData {
  [key: string]: SubjectData;
}

interface EditingData {
  subject?: string;
  supervisor?: string;
  location?: string;
}

const PracticalScheduleTable: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<EditingData>({});

  const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const timeSlots: string[] = [
    '8:00 - 9:00',
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 1:00',
    '1:00 - 2:00',
    '2:00 - 3:00',
    '3:00 - 4:00'
  ];

  const subjects: string[] = [
    'Practical Chemistry',
    'Practical Physics',
    'Practical Biology',
    'Computer Science',
    'Applied Mathematics',
    'Civil Engineering',
    'Electrical Engineering',
    'General Medicine'
  ];

  const supervisors: string[] = [
    'Dr. Ahmed Mohamed',
    'Dr. Sarah Ahmed',
    'Dr. Mohamed Ali',
    'Dr. Fatima Hassan',
    'Dr. Abdullah Khalid',
    'Dr. Nour Eldin',
    'Dr. Layla Mostafa',
    'Dr. Youssef Ibrahim'
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

  const subjectColors: { [key: string]: string } = {
    'Practical Chemistry': 'from-orange-500 to-orange-600',
    'Practical Physics': 'from-blue-500 to-blue-600',
    'Practical Biology': 'from-green-500 to-green-600',
    'Computer Science': 'from-purple-500 to-purple-600',
    'Applied Mathematics': 'from-indigo-500 to-indigo-600',
    'Civil Engineering': 'from-yellow-500 to-yellow-600',
    'Electrical Engineering': 'from-pink-500 to-pink-600',
    'General Medicine': 'from-red-500 to-red-600'
  };

  const getSlotKey = (day: string, time: string): string => `${day}-${time}`;

  const addSubject = (day: string, time: string): void => {
    const key = getSlotKey(day, time);
    setIsEditing(key);
    setEditingData({
      subject: '',
      supervisor: '',
      location: ''
    });
  };

  const editSubject = (day: string, time: string): void => {
    const key = getSlotKey(day, time);
    setIsEditing(key);
    setEditingData(scheduleData[key] || {});
  };

  const saveSubject = (day: string, time: string): void => {
    const key = getSlotKey(day, time);
    if (editingData.subject && editingData.supervisor && editingData.location) {
      setScheduleData(prev => ({
        ...prev,
        [key]: {
          subject: editingData.subject!,
          supervisor: editingData.supervisor!,
          location: editingData.location!
        }
      }));
      setIsEditing(null);
      setEditingData({});
    }
  };

  const deleteSubject = (day: string, time: string): void => {
    const key = getSlotKey(day, time);
    setScheduleData(prev => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
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
            value={editingData.subject || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleSelectChange('subject', e.target.value)
            }
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject: string) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          
          <select
            value={editingData.supervisor || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleSelectChange('supervisor', e.target.value)
            }
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select Supervisor</option>
            {supervisors.map((supervisor: string) => (
              <option key={supervisor} value={supervisor}>{supervisor}</option>
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
      const colorClass = subjectColors[hasSubject.subject] || 'from-gray-500 to-gray-600';
      
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
              onClick={() => deleteSubject(day, time)}
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