import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export interface Housing {
    id: string;
    reference_id: string;
    provider_name: string;
    housing_type: string;
    location: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    avg_rent: string;
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

export const getAllHousing = async (params: any) => {
    const response = await axiosInstance.get('/api/housing', { params });
    return response.data;
};

export const getHousingById = async (id: string) => {
    const response = await axiosInstance.get(`/api/housing/${id}`);
    return response.data;
};

export const createHousing = async (data: any) => {
    const response = await axiosInstance.post('/api/housing', data);
    return response.data;
};

export const updateHousing = async (id: string, data: any) => {
    const response = await axiosInstance.put(`/api/housing/${id}`, data);
    return response.data;
};

export const deleteHousing = async (id: string) => {
    const response = await axiosInstance.delete(`/api/housing/${id}`);
    return response.data;
};

export const getHousingMetrics = async () => {
    const response = await axiosInstance.get('/api/housing/metrics');
    return response.data;
};
