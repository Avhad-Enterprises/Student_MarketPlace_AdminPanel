import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface GeneralSetting {
  id?: number;
  key: string;
  value: string;
  group_name: string;
  updated_at?: string;
}

export const generalSettingsService = {
  getAll: async (): Promise<GeneralSetting[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/general`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching general settings:', error);
      throw error;
    }
  },

  getByKey: async (key: string): Promise<GeneralSetting | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/general/${key}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error);
      throw error;
    }
  },

  upsert: async (key: string, value: string, group_name: string = 'general'): Promise<GeneralSetting> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/general`, { key, value, group_name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error upserting setting:', error);
      throw error;
    }
  },

  bulkUpdate: async (settings: { key: string; value: string; group_name?: string }[]): Promise<GeneralSetting[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/general/bulk`, { settings }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error bulk updating settings:', error);
      throw error;
    }
  }
};
