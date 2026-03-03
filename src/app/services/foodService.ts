import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export interface Food {
    id: string;
    reference_id: string;
    platform: string;
    service_type: string;
    offer_details: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    avg_cost: string;
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

export const getAllFood = async (params: any) => {
    const response = await axiosInstance.get('/api/food', { params });
    return response.data;
};

export const getFoodById = async (id: string) => {
    const response = await axiosInstance.get(`/api/food/${id}`);
    return response.data;
};

export const createFood = async (data: any) => {
    const response = await axiosInstance.post('/api/food', data);
    return response.data;
};

export const updateFood = async (id: string, data: any) => {
    const response = await axiosInstance.put(`/api/food/${id}`, data);
    return response.data;
};

export const deleteFood = async (id: string) => {
    const response = await axiosInstance.delete(`/api/food/${id}`);
    return response.data;
};

export const getFoodMetrics = async () => {
    const response = await axiosInstance.get('/api/food/metrics');
    return response.data;
};
