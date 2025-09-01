import { create } from 'zustand'

const useAdminStore = create((set) => {

    set({ loading: true })
    return {
        stages: [],
        supervisors: [],
        patient: [],
        students: [],
        shedule: [],
        statistics: [],
        Rad_statistics: [],
        disease: [],
        addUser: async(formData) => {
            const token = localStorage.getItem('token');

            const response = await fetch('http://127.0.0.1:8000/api/addUser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add user');
            }

            console.log('User added successfully:', data);

            const cardKey = `userData_${formData.role_id}`;
            set({
                [cardKey]: data.user
            });
            localStorage.setItem(cardKey, JSON.stringify(data.user));

            return data;
        },
        delUser: async(id) => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch(`http://127.0.0.1:8000/api/delete-user/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },

            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            return data;
        },
        addShcedule: async(formData) => {
            const token = localStorage.getItem('token');

            if (formData instanceof FormData) {
                const response = await fetch('http://127.0.0.1:8000/api/add-schedule', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',

                    },
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error('Validation errors:', data.errors);
                    throw new Error(data.message || 'Failed to add schedule');
                }

                console.log('User added successfully:', data);
                return data;
            } else {
                const response = await fetch('http://127.0.0.1:8000/api/add-schedule', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error('Validation errors:', data.errors);
                    throw new Error(data.message || 'Failed to add schedule');
                }

                console.log('User added successfully:', data);
                return data;
            }
        },
        getStages: async() => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch('http://127.0.0.1:8000/api/view-stages', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ stages: data });
            return data;
        },
        getSuperVisor: async() => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch('http://127.0.0.1:8000/api/view-all-supervisors', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ supervisors: data });
            return data;
        },
        getPatient: async() => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch('http://127.0.0.1:8000/api/view-all-patients', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ patient: data });
            return data;
        },
        getStudents: async() => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch('http://127.0.0.1:8000/api/view-all-students', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ students: data });
            return data;
        },
        getSchedule: async(year) => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch('http://127.0.0.1:8000/api/view-year-schedules', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },
                body: year,
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ shedule: data });
            return data;
        },
        delSchedule: async(id) => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch(`http://127.0.0.1:8000/api/delete-schedule/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },

            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ shedule: data });
            return data;
        },
        getStatistic: async() => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch('http://127.0.0.1:8000/api/statistics', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ statistics: data });
            return data;
        },
        getRadStatistic: async() => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch('http://127.0.0.1:8000/api/radiology-stats', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ Rad_statistics: data });
            return data;
        },
        getDisease: async() => {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch('http://127.0.0.1:8000/api/all-diseases', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',

                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ disease: data });
            return data;
        },
        addPatient: async(formData) => {
            const token = localStorage.getItem('token');
            console.log(formData)
            console.log(token)
            const response = await fetch('http://127.0.0.1:8000/api/add-patient', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json", // 🔑 مهم


                },
                body: JSON.stringify(formData), // 👈 نحول الكائن لـ JSON
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Validation errors:', data.errors);
                throw new Error(data.message || 'Failed to add schedule');
            }

            console.log('User added successfully:', data);
            set({ patient: data });
            return data;
        },
    }




});
export default useAdminStore