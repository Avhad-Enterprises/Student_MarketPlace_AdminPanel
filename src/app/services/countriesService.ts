import axios from 'axios';

console.log('--- Loading countriesService (Updated) ---');

const API_URL = 'https://smapi.test-zone.xyz/api/countries';

export interface CountryFormData {
    country_name: string;
    country_code: string;
    region: string;
    visa_difficulty: 'Low' | 'Medium' | 'High';
    cost_of_living: 'Low' | 'Medium' | 'High';
    status: 'Active' | 'Inactive';
    visible: boolean;
    service_availability: {
        visa: boolean;
        insurance: boolean;
        housing: boolean;
        loans: boolean;
        forex: boolean;
        courses: boolean;
        food: boolean;
    };
    popularity?: number; // Optional
}

export interface Country {
    id: string;
    name: string;
    code: string;
    region: string;
    visa_difficulty: 'Low' | 'Medium' | 'High';
    cost_of_living: 'Low' | 'Medium' | 'High';
    status: 'active' | 'inactive';
    popularity: number;
    universities_count?: number;
    work_rights?: boolean;
    pr_availability?: boolean;
    service_visa?: boolean;
    service_insurance?: boolean;
    service_housing?: boolean;
    service_loans?: boolean;
    service_forex?: boolean;
    service_courses?: boolean;
    service_food?: boolean;
    created_at?: string;
    updated_at?: string;
}

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

export const getAll = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
} = {}) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader(),
            params
        });
        return response.data; // Returns { data: Country[], pagination: ... }
    } catch (error) {
        console.error('Error fetching countries:', error);
        return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }
};

export const getMetrics = async () => {
    try {
        const response = await axios.get(`${API_URL}/metrics`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return {
            totalCountries: 0,
            activeCountries: 0,
            visaFriendly: 0,
            highDemand: 0,
            withUniversities: 0
        };
    }
};

export const getCountryById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const createCountry = async (data: CountryFormData) => {
    const payload = {
        name: data.country_name,
        code: data.country_code,
        region: data.region,
        visa_difficulty: data.visa_difficulty,
        cost_of_living: data.cost_of_living,
        status: data.status.toLowerCase(),
        popularity: data.popularity || 0,
        service_visa: data.service_availability.visa,
        service_insurance: data.service_availability.insurance,
        service_housing: data.service_availability.housing,
        service_loans: data.service_availability.loans,
        service_forex: data.service_availability.forex,
        service_courses: data.service_availability.courses,
        service_food: data.service_availability.food,
    };

    const response = await axios.post(API_URL, payload, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateCountry = async (id: string, data: CountryFormData) => {
    const payload = {
        name: data.country_name,
        code: data.country_code,
        region: data.region,
        visa_difficulty: data.visa_difficulty,
        cost_of_living: data.cost_of_living,
        status: data.status.toLowerCase(),
        popularity: data.popularity,
        service_visa: data.service_availability.visa,
        service_insurance: data.service_availability.insurance,
        service_housing: data.service_availability.housing,
        service_loans: data.service_availability.loans,
        service_forex: data.service_availability.forex,
        service_courses: data.service_availability.courses,
        service_food: data.service_availability.food,
    };
    const response = await axios.put(`${API_URL}/${id}`, payload, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteCountry = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const importCountries = async (data: any[]) => {
    const response = await axios.post(`${API_URL}/import`, data, {
        headers: getAuthHeader()
    });
    return response.data;
};


export const exportCountries = async (ids?: string[]) => {
    const params = ids && ids.length > 0 ? { ids: ids.join(',') } : {};
    const response = await axios.get(`${API_URL}/export/data`, { // Returns JSON array
        headers: getAuthHeader(),
        params
    });
    return response.data;
};

export const bulkUpdateCountries = async (ids: string[], status: 'active' | 'inactive') => {
    const response = await axios.post(`${API_URL}/bulk-update`, { ids, status }, {
        headers: getAuthHeader()
    });
    return response.data;
};
