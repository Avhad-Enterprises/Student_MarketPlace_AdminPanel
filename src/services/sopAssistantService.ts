import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface SOP {
    id: string;
    studentName: string;
    country: string;
    university: string;
    reviewStatus: string;
    aiConfidenceScore: string;
    status: 'active' | 'inactive';
    lastUpdated: string;
}

export interface SOPStats {
    totalSOPs: number;
    draftsCreated: number;
    reviewedSOPs: number;
    avgConfidence: string;
}

export interface SOPAssistantSettings {
    id?: number;
    model_provider: string;
    model_version: string;
    system_prompt: string;
    confidence_threshold: number;
    auto_approval: boolean;
    max_tokens: number;
    temperature: number;
}

export interface SOPFilters {
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    country?: string;
    reviewStatus?: string;
}

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const sopAssistantService = {
    getSOPs: async (filters: SOPFilters = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/sop-assistant/sops`, {
                ...getAuthHeaders(),
                params: filters
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching SOPs:', error);
            throw error;
        }
    },

    getStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/sop-assistant/stats`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching SOP stats:', error);
            throw error;
        }
    },

    updateStatus: async (id: string, status: string) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/api/sop-assistant/sops/${id}/status`, { status }, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error updating SOP status:', error);
            throw error;
        }
    },

    createSOP: async (data: Partial<SOP>) => {
        try {
            // Map camelCase to snake_case for backend
            const backendData = {
                student_name: data.studentName,
                country: data.country,
                university: data.university,
                review_status: data.reviewStatus,
                ai_confidence_score: data.aiConfidenceScore,
                status: data.status
            };
            const response = await axios.post(`${API_BASE_URL}/api/sop-assistant/sops`, backendData, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error creating SOP:', error);
            throw error;
        }
    },

    updateSOP: async (id: string, data: Partial<SOP>) => {
        try {
            // Map camelCase to snake_case for backend
            const backendData: any = {};
            if (data.studentName) backendData.student_name = data.studentName;
            if (data.country) backendData.country = data.country;
            if (data.university) backendData.university = data.university;
            if (data.reviewStatus) backendData.review_status = data.reviewStatus;
            if (data.aiConfidenceScore) backendData.ai_confidence_score = data.aiConfidenceScore;
            if (data.status) backendData.status = data.status;

            const response = await axios.put(`${API_BASE_URL}/api/sop-assistant/sops/${id}`, backendData, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error updating SOP:', error);
            throw error;
        }
    },

    importSOPs: async (data: any[]) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/sop-assistant/sops/import`, data, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error importing SOPs:', error);
            throw error;
        }
    },

    getSettings: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/sop-assistant/settings`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching SOP settings:', error);
            throw error;
        }
    },

    updateSettings: async (data: Partial<SOPAssistantSettings>) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/sop-assistant/settings`, data, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error updating SOP settings:', error);
            throw error;
        }
    }
};
