import axios from 'axios';

const API_URL = 'https://smapi.test-zone.xyz/api/sim-cards';

export interface SimCard {
    id: string;
    sim_id: string;
    provider_name: string;
    service_name: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    network_type: string;
    data_allowance: string;
    validity: string;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}

const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return { Authorization: `Bearer ${token}` };
};

export const getAllSimCards = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    network_type?: string;
    student_visible?: boolean;
    sort?: string;
    order?: 'asc' | 'desc';
} = {}) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching SIM cards:', error);
        return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }
};

export const getSimMetrics = async () => {
    try {
        const response = await axios.get(`${API_URL}/metrics`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching SIM metrics:', error);
        return {
            totalProviders: 0,
            activePlans: 0,
            countriesCovered: 0,
            mostPopular: 'N/A'
        };
    }
};

export const getSimCardById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const createSimCard = async (data: any) => {
    const response = await axios.post(API_URL, data, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateSimCard = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteSimCard = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};
