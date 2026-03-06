import { API_BASE_URL } from '../config/api';
import axios from 'axios';

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export interface SystemSettings {
    platform_name: string;
    support_email: string;
    primary_currency: string;
}

export interface NotificationSetting {
    key: string;
    title: string;
    description: string;
    enabled: boolean;
    type: string;
}

export const systemSettingsService = {
    getSystemSettings: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/settings/system`, { headers: getHeaders() });
        return response.data;
    },

    updateSystemSettings: async (settings: Partial<SystemSettings>) => {
        const response = await axios.post(`${API_BASE_URL}/api/settings/system`, settings, { headers: getHeaders() });
        return response.data;
    },

    getNotificationSettings: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/settings/notifications`, { headers: getHeaders() });
        return response.data;
    },

    updateNotificationSetting: async (key: string, enabled: boolean) => {
        const response = await axios.put(`${API_BASE_URL}/api/settings/notifications/${key}`, { enabled }, { headers: getHeaders() });
        return response.data;
    }
};
