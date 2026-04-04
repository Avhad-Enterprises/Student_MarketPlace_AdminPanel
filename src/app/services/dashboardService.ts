import axios from 'axios';
import { API_BASE_URL } from "@/config/api";

const API_URL = `${API_BASE_URL}/api/dashboard`;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MetricData {
  total: number;
  change: number;   // e.g. 12.5 means +12.5%, -3.2 means -3.2%
  trend: number[];  // 7 daily data points for the sparkline
}

export interface DashboardSummary {
  students:     MetricData;
  applications: MetricData;
  blogs:        MetricData;
  payments:     MetricData;
  users:        MetricData;
}

export interface DashboardAlert {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'critical';
  color: 'blue' | 'yellow' | 'emerald' | 'purple' | 'red';
  timestamp: string;
}

export interface DashboardInsight {
  id: string;
  title: string;
  description: string;
  icon: string;
  timestamp: string;
  value: number | null;
}

export interface DashboardAdminUsers {
  total: number;
  thisWeek: number;
  growth: number;  // percentage
  recentUsers: {
    id: string;
    name: string;
    email: string;
    initials: string;
    status: string;
    joinedAt: string;
  }[];
}

// Legacy full-stats type kept for /stats endpoint
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

// ─── Auth Helper ─────────────────────────────────────────────────────────────

const getAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return { Authorization: `Bearer ${token}` };
};

// ─── API Functions ───────────────────────────────────────────────────────────

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await axios.get(`${API_URL}/summary`, { headers: getAuthHeader() });
  return response.data.data;
};

export const getDashboardAlerts = async (): Promise<DashboardAlert[]> => {
  const response = await axios.get(`${API_URL}/alerts`, { headers: getAuthHeader() });
  return response.data.data;
};

export const getDashboardInsights = async (): Promise<DashboardInsight[]> => {
  const response = await axios.get(`${API_URL}/insights`, { headers: getAuthHeader() });
  return response.data.data;
};

export const getDashboardAdminUsers = async (): Promise<DashboardAdminUsers> => {
  const response = await axios.get(`${API_URL}/admin-users`, { headers: getAuthHeader() });
  return response.data.data;
};

// Legacy — kept for backwards compat
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get(`${API_URL}/stats`, { headers: getAuthHeader() });
  return response.data.data;
};
