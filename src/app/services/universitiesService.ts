import axios from 'axios';

import { API_BASE_URL } from "@/config/api";

const API_URL = `${API_BASE_URL}/api/universities`;

export interface University {
    id: string;
    univ_id: string;
    name: string;
    city: string;
    country_name: string;
    type: string;
    status: string;
}

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

export const getAllUniversities = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    country_id?: string;
} = {}) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader(),
            params
        });
        return response.data; // { data: University[], pagination: ... }
    } catch (error) {
        console.error('Error fetching universities:', error);
        return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }
};
