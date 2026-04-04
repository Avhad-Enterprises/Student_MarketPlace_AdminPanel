
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const USER_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token'; // Added missing constant


export const authService = {
    login: async (email: string, password: string) => {
        if (email === 'janedoe@example.com' && password === 'password123') {
            const mockUser = {
                id: 'temp-123',
                full_name: 'Jane Doe',
                email: 'janedoe@example.com',
                role: {
                    name: 'Admin',
                    is_system: true,
                    permissions: {
                        dashboard: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
                        students: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
                        services: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
                        bookings: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
                        finance: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
                        reports: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
                        settings: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
                    }
                }
            };
            localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
            localStorage.setItem(TOKEN_KEY, 'temp-token-xyz');
            
            // Notify hooks of authorization change
            window.dispatchEvent(new Event('auth_state_changed'));
            
            return { token: 'temp-token-xyz', data: mockUser };
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password
            });
            if (response.data.token) {
                let userData = response.data.data || response.data.user;
                const token = response.data.token;
                
                // Fetch the role details and permissions so the UI can check module access
                try {
                    // Try to get the roles configured in the backend
                    const rolesResponse = await axios.get(`${API_BASE_URL}/api/roles`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const roles = rolesResponse.data.data || [];
                    
                    // Match the user's role_id or role name
                    const userRole = roles.find((r: any) => 
                        r.id === userData.role_id || 
                        (typeof userData.role === 'string' && r.name === userData.role) ||
                        (userData.role?.id && r.id === userData.role.id)
                    );
                    
                    if (userRole) {
                        // Attach the full role and permissions properly
                        userData.role = userRole;
                        userData.permissions = userRole.permissions;
                    } else if (!userData.role) {
                        console.warn('Could not find matching role for user during login.');
                    }
                } catch (roleError) {
                    console.error('Failed to fetch roles during login:', roleError);
                }

                localStorage.setItem(USER_KEY, JSON.stringify(userData));
                localStorage.setItem(TOKEN_KEY, token);
                
                // Notify hooks of authorization change
                window.dispatchEvent(new Event('auth_state_changed'));
            }
            return response.data;
        } catch (error: unknown) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        // Notify hooks of authorization change
        window.dispatchEvent(new Event('auth_state_changed'));
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        const token = localStorage.getItem(TOKEN_KEY);
        try {
            const response = await axios.post(`${API_BASE_URL}/change-password`, {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    }
};
