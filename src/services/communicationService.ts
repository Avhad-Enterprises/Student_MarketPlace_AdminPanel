import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const COMMUNICATIONS_API_URL = `${API_BASE_URL}/api/communications`;

export interface Communication {
    id: number;
    student_db_id: number;
    type: 'Email' | 'SMS' | 'WhatsApp' | 'Push';
    status: 'sent' | 'delivered' | 'read' | 'failed';
    content: string;
    sender: string;
    subject?: string;
    created_at: string;
    updated_at: string;
}

export interface CommunicationFormData {
    student_db_id: number;
    type: string;
    status: string;
    content: string;
    sender: string;
    subject?: string;
}

const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const communicationService = {
    getAllCommunications: async () => {
        const response = await axios.get<Communication[]>(COMMUNICATIONS_API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getCommunicationById: async (id: number | string) => {
        const response = await axios.get<Communication>(`${COMMUNICATIONS_API_URL}/detail/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getStudentCommunications: async (studentId: number) => {
        const response = await axios.get<Communication[]>(`${COMMUNICATIONS_API_URL}/${studentId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    createCommunication: async (data: CommunicationFormData) => {
        const response = await axios.post<Communication>(COMMUNICATIONS_API_URL, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateCommunication: async (id: number, data: Partial<CommunicationFormData>) => {
        const response = await axios.put<Communication>(`${COMMUNICATIONS_API_URL}/${id}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteCommunication: async (id: number) => {
        const response = await axios.delete(`${COMMUNICATIONS_API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
