import { API_BASE_URL } from '../config/api';

export interface Enquiry {
    id?: number;
    enquiry_id: string;
    date_submitted: string;
    student_name: string;
    email: string;
    subject: string;
    message?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'new' | 'in-progress' | 'responded' | 'closed';
    created_at?: string;
    updated_at?: string;
}

const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const enquiryService = {
    async getAllEnquiries(): Promise<Enquiry[]> {
        const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to fetch enquiries');
        const json = await response.json();
        return json.data;
    },

    async getEnquiryById(id: string): Promise<Enquiry> {
        const response = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to fetch enquiry details');
        const json = await response.json();
        return json.data;
    },

    async updateEnquiry(id: string, enquiryData: Partial<Enquiry>): Promise<Enquiry> {
        const response = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(enquiryData),
        });
        if (!response.ok) throw new Error('Failed to update enquiry');
        const json = await response.json();
        return json.data;
    },

    async createEnquiry(enquiryData: Enquiry): Promise<Enquiry> {
        const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(enquiryData),
        });
        if (!response.ok) throw new Error('Failed to create enquiry');
        const json = await response.json();
        return json.data;
    },

    async deleteEnquiry(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to delete enquiry');
    }
};
