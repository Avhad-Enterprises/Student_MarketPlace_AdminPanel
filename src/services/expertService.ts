import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const EXPERTS_API_URL = `${API_BASE_URL}/api/experts`;

export interface Expert {
    id: number;
    expert_id: string;
    full_name: string;
    email: string;
    phone?: string;
    specialization?: string;
    experience_years?: number;
    rating?: number;
    status: string;
    avatar_url?: string;
    bio?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ExpertFormData {
    full_name: string;
    email: string;
    phone?: string;
    specialization?: string;
    experience_years?: number;
    rating?: number;
    status: string;
    avatar_url?: string;
    bio?: string;
}

export const expertService = {
    getAllExperts: async (page = 1, limit = 10, search = '') => {
        try {
            const response = await axios.get(`${EXPERTS_API_URL}`, {
                params: { page, limit, search }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching experts:', error);
            throw error;
        }
    },

    getExpertById: async (id: string | number) => {
        try {
            const response = await axios.get(`${EXPERTS_API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching expert by ID:', error);
            throw error;
        }
    },

    createExpert: async (expertData: ExpertFormData) => {
        try {
            const response = await axios.post(`${EXPERTS_API_URL}`, expertData);
            return response.data;
        } catch (error) {
            console.error('Error creating expert:', error);
            throw error;
        }
    },

    updateExpert: async (id: string | number, expertData: Partial<ExpertFormData>) => {
        try {
            const response = await axios.put(`${EXPERTS_API_URL}/${id}`, expertData);
            return response.data;
        } catch (error) {
            console.error('Error updating expert:', error);
            throw error;
        }
    },

    deleteExpert: async (id: string | number) => {
        try {
            const response = await axios.delete(`${EXPERTS_API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting expert:', error);
            throw error;
        }
    }
};
