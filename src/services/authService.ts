
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const USER_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token'; // Added missing constant

export const API_URL = 'https://smapi.test-zone.xyz:3000/api';

export const authService = {
    login: async (email: string, password: string) => {
        if (email === 'janedoe@example.com' && password === 'password123') {
            const mockUser = { id: 'temp-123', full_name: 'Jane Doe', email: 'janedoe@example.com' };
            localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
            localStorage.setItem(TOKEN_KEY, 'temp-token-xyz');
            return { token: 'temp-token-xyz', data: mockUser };
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password
            });
            if (response.data.token) {
                localStorage.setItem(USER_KEY, JSON.stringify(response.data.data || response.data.user));
                localStorage.setItem(TOKEN_KEY, response.data.token);
            }
            return response.data;
        } catch (error: unknown) { // Added type annotation
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
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
