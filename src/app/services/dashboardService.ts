import axios from 'axios';
import { API_BASE_URL } from "@/config/api";

const API_URL = `${API_BASE_URL}/api/dashboard`;

export interface DashboardStats {
  metrics: {
    students: number;
    applications: number;
    blogs: number;
    payments: number;
    universities: number;
    countries: number;
    users: number;
    activeApplications: number;
  };
  trends: {
    students: string;
    applications: string;
    revenue: string;
    users: string;
  };
  systemAlerts: {
    color: 'blue' | 'yellow' | 'emerald' | 'purple';
    title: string;
    time: string;
    desc: string;
  }[];
}

// Helper to get token
const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return { Authorization: `Bearer ${token}` };
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const response = await axios.get(`${API_URL}/stats`, {
            headers: getAuthHeader()
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};
