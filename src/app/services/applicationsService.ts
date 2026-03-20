import axios from 'axios';

const API_URL = 'https://smapi.test-zone.xyz/api/applications';

export interface Application {
    id: string; // Database ID
    application_id: string; // Display ID e.g. APP-123
    student_db_id: string;
    student_id: string; // Student ID e.g. STU-123
    first_name: string;
    last_name: string;
    university_name: string;
    country: string;
    intake: string;
    status: 'in-progress' | 'submitted' | 'decision-received' | 'pending-docs' | 'closed';
    counselor: string;
    submission_date?: string;
    decision_date?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    // Computed/Joined fields
    studentName?: string;
}

export interface ApplicationMetrics {
    totalApplications: number;
    inProgress: number;
    submitted: number;
    decisions: number;
    pendingDocs: number;
}

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

export const getAllApplications = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    student_id?: string;
    sort?: string;
    order?: 'asc' | 'desc';
} = {}) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader(),
            params
        });
        return response.data; // Returns { data: Application[], pagination: ... }
    } catch (error) {
        console.error('Error fetching applications:', error);
        return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }
};

export const getApplicationMetrics = async () => {
    try {
        const response = await axios.get(`${API_URL}/metrics`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return {
            totalApplications: 0,
            inProgress: 0,
            submitted: 0,
            decisions: 0,
            pendingDocs: 0
        };
    }
};

export const getApplicationById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};


export interface CreateApplicationData {
    studentDbId: string;
    universityName: string;
    country: string;
    intake: string;
    status: string;
    counselor: string;
    notes?: string;
}

export const createApplication = async (data: CreateApplicationData) => {
    const response = await axios.post(API_URL, data, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateApplication = async (id: string, data: Partial<Application>) => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteApplication = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};
