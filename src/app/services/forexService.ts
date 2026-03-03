import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export interface Forex {
    id: string;
    forex_id: string;
    provider_name: string;
    service_type: string;
    currency_pairs: number;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    avg_fee: string;
    transfer_speed: string;
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

export const getAllForex = async (params: any) => {
    const response = await axiosInstance.get('/api/forex', { params });
    return response.data;
};

export const getForexById = async (id: string) => {
    const response = await axiosInstance.get(`/api/forex/${id}`);
    return response.data;
};

export const createForex = async (data: any) => {
    const response = await axiosInstance.post('/api/forex', data);
    return response.data;
};

export const updateForex = async (id: string, data: any) => {
    const response = await axiosInstance.put(`/api/forex/${id}`, data);
    return response.data;
};

export const deleteForex = async (id: string) => {
    const response = await axiosInstance.delete(`/api/forex/${id}`);
    return response.data;
};

export const getForexMetrics = async () => {
    const response = await axiosInstance.get('/api/forex/metrics');
    return response.data;
};
