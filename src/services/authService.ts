
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const USER_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token'; // Added missing constant

export const API_URL = 'http://localhost:3000/api';

export const authService = {
    login: async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password
            });
            if (response.data.token) {
                localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
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
    }
};
