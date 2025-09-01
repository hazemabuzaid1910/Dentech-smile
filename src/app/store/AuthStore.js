import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => {
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
                sendOtp: async(phone_number) => {
                    set({ loading: true, error: null });
                    try {
                        const response = await fetch('http://127.0.0.1:8000/api/sendOtp', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ phone_number }),
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Login failed');
                        }
                        const data = await response.json();
                        console.log(data)

                        set({
                            user: { phone_number },
                            loading: false
                        });
                    } catch (error) {
                        set({
                            error: error.message || 'Something went wrong',
                            loading: false,
                        });
                    }
                },
                verifyOtp: async(phone_number, otp) => {
                    set({ loading: true, error: null });
                    try {
                        const response = await fetch('http://127.0.0.1:8000/api/verifyOtp', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ phone_number, otp }),
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Login failed');
                        }
                        const data = await response.json();
                        console.log(data)

                        set({
                            user: { phone_number },
                            loading: false
                        });
                    } catch (error) {
                        set({
                            error: error.message || 'Something went wrong',
                            loading: false,
                        });
                    }
                },
                resetpassowrd: async(phone_number, password, password_confirmation) => {
                    set({ loading: true, error: null });
                    try {
                        const response = await fetch('http://127.0.0.1:8000/api/resetPassword', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ phone_number, password, password_confirmation }),
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
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                role_name: state.role_name,
                user: state.user
            }),
        }
    )
);

export default useAuthStore;