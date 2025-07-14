import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => {
            // القيم الأولية من localStorage إذا وجدت
            const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const initialRole = typeof window !== 'undefined' ? localStorage.getItem('role_name') : null;
            const initialNationalNum = typeof window !== 'undefined' ? localStorage.getItem('nationalNumber') : null;

            return {
                user: {
                    role_name: initialRole,
                    national_number: initialNationalNum
                },
                token: initialToken,
                loading: false,
                error: null,
                isAuthenticated: !!initialToken,
                role_name: initialRole,

                // تسجيل الدخول
                signIn: async(national_number, password) => {
                    set({ loading: true, error: null });
                    try {
                        const response = await fetch('http://127.0.0.1:8000/api/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ national_number, password }),
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Login failed');
                        }
                        const data = await response.json();
                        console.log(data)

                        set({
                            user: { national_number, role_name: data.role_name },
                            token: data.token,
                            role_name: data.role_name,
                            isAuthenticated: true,
                            loading: false
                        });

                        // حفظ البيانات في localStorage
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('token', data.token);
                            localStorage.setItem('role_name', data.role_name);
                            localStorage.setItem('nationalNumber', national_number);
                            document.cookie = `token=${data.token}; path=/; max-age=3600; samesite=lax`;
                        }

                    } catch (error) {
                        set({
                            error: error.message || 'Something went wrong',
                            loading: false,
                        });
                    }
                },

                // تسجيل الخروج
                logOut: async() => {
                    set({ loading: true, error: null });
                    const token = useAuthStore.getState().token;

                    try {
                        const response = await fetch('http://127.0.0.1:8000/api/logout', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Logout failed');
                        }

                        // مسح البيانات من الحالة والتخزين
                        set({
                            user: null,
                            token: null,
                            role_name: null,
                            isAuthenticated: false,
                            loading: false
                        });

                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('token');
                            localStorage.removeItem('role_name');
                            localStorage.removeItem('nationalNumber');
                            document.cookie = 'token=; path=/; max-age=0; samesite=lax';
                            window.location.href = "/signin";
                        }

                    } catch (error) {
                        set({
                            error: error.message || 'Something went wrong',
                            loading: false,
                        });
                    }
                },

                // تهيئة الحالة من التخزين
                initializeAuth: () => {
                    if (typeof window === 'undefined') return;

                    const token = localStorage.getItem('token');
                    const role_name = localStorage.getItem('role_name');
                    const nationalNumber = localStorage.getItem('nationalNumber');

                    set({
                        token,
                        role_name,
                        user: { national_number: nationalNumber, role_name },
                        isAuthenticated: !!token,
                        loading: false
                    });
                }
            };
        }, {
            name: 'auth-storage', // اسم المفتاح في localStorage
            partialize: (state) => ({
                token: state.token,
                role_name: state.role_name,
                user: state.user
            }), // تحديد الحقول التي نريد تخزينها
        }
    )
);

export default useAuthStore;