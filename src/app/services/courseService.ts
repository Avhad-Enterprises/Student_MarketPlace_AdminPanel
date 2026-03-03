import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export interface Course {
    id: string;
    reference_id: string;
    course_name: string;
    provider: string;
    category: string;
    duration: string;
    avg_cost: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    popularity: number;
    learners_count?: number;
    rating?: number;
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

export const getAllCourses = async (params: any) => {
    const response = await axiosInstance.get('/api/courses', { params });
    return response.data;
};

export const getCourseById = async (id: string) => {
    const response = await axiosInstance.get(`/api/courses/${id}`);
    return response.data;
};

export const createCourse = async (data: any) => {
    const response = await axiosInstance.post('/api/courses', data);
    return response.data;
};

export const updateCourse = async (id: string, data: any) => {
    const response = await axiosInstance.put(`/api/courses/${id}`, data);
    return response.data;
};

export const deleteCourse = async (id: string) => {
    const response = await axiosInstance.delete(`/api/courses/${id}`);
    return response.data;
};

export const getCourseMetrics = async () => {
    const response = await axiosInstance.get('/api/courses/metrics');
    return response.data;
};
