import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export interface Employment {
    id: string;
    reference_id: string;
    platform: string;
    service_type: string;
    job_types: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    avg_salary: string;
    verified: boolean;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}

const getAuthToken = () => localStorage.getItem('auth_token');

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getAllEmployment = async (params: any) => {
    const response = await axiosInstance.get('/api/employment', { params });
    return response.data;
};

export const getEmploymentById = async (id: string) => {
    const response = await axiosInstance.get(`/api/employment/${id}`);
    return response.data;
};

export const createEmployment = async (data: any) => {
    const response = await axiosInstance.post('/api/employment', data);
    return response.data;
};

export const updateEmployment = async (id: string, data: any) => {
    const response = await axiosInstance.put(`/api/employment/${id}`, data);
    return response.data;
};

export const deleteEmployment = async (id: string) => {
    const response = await axiosInstance.delete(`/api/employment/${id}`);
    return response.data;
};

export const getEmploymentMetrics = async () => {
    const response = await axiosInstance.get('/api/employment/metrics');
    return response.data;
};
