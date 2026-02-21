import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/universities`;

export interface CreateUniversityDto {
    name: string;
    city: string;
    country: string;
    tuition: string;
    acceptanceRate: string;
    type: string;
    applicationStatus: string;
    status: string;
}

export const universityService = {
    create: async (data: CreateUniversityDto) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    update: async (id: string, data: Partial<CreateUniversityDto>) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.put(`${API_URL}/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    delete: async (id: string) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    bulkUpdateStatus: async (ids: string[], status: 'active' | 'disabled') => {
        const token = localStorage.getItem('auth_token');
        // Simulate bulk update by calling update for each ID
        // In a real scenario, the backend should support a bulk endpoint
        const promises = ids.map(id =>
            axios.put(`${API_URL}/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            })
        );
        await Promise.all(promises);
        return { message: `Updated ${ids.length} universities` };
    },

    getAll: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        countryId?: string;
        type?: string;
        status?: string;
        sort?: string;
        order?: 'asc' | 'desc';
        applicationStatus?: string;
    } = {}) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page: params.page || 1,
                limit: params.limit || 10,
                search: params.search,
                country_id: params.countryId, // Map to backend snake_case
                type: params.type,
                status: params.status,
                sort: params.sort,
                order: params.order,
                application_status: params.applicationStatus // Map to backend snake_case
            }
        });
        return response.data;
    },

    getMetrics: async () => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`${API_URL}/metrics`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    import: async (data: any[]) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post(`${API_URL}/import`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    export: async (format: string = 'xlsx') => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`${API_URL}/export/data`, { // Changed to /export/data based on controller
            params: { format },
            responseType: 'blob', // Important for file download
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
