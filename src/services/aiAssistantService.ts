import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const aiAssistantService = {
    getSettings: async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${API_BASE_URL}/api/ai-assistant/settings`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching AI Assistant settings:', error);
            throw error;
        }
    },

    updateSettings: async (settings: any) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(`${API_BASE_URL}/api/ai-assistant/settings`, settings, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error updating AI Assistant settings:', error);
            throw error;
        }
    }
};
