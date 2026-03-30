import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface PolicyGlobalSettings {
    id?: number;
    enable_reacceptance: boolean;
    enable_consent_timestamp: boolean;
    log_retention_months: number;
    legal_contact_email: string;
    created_at?: string;
    updated_at?: string;
}

export interface PolicyPage {
    id: number;
    title: string;
    slug?: string;
    type: string;
    status: string;
    version: string;
    effective_date: string;
    visibility: string;
    content?: string;
    author_name?: string;
    last_updated_at?: string;
}

export const policySettingsService = {
  getGlobalSettings: async (): Promise<PolicyGlobalSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/policies/global`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global policy settings:', error);
      throw error;
    }
  },

  updateGlobalSettings: async (settings: Partial<PolicyGlobalSettings>): Promise<PolicyGlobalSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/policies/global`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating global policy settings:', error);
      throw error;
    }
  },

  getPolicyPages: async (): Promise<PolicyPage[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/policies/pages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching policy pages:', error);
      throw error;
    }
  },

  createPolicyPage: async (page: Partial<PolicyPage>): Promise<PolicyPage> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/policies/pages`, page, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating policy page:', error);
      throw error;
    }
  },

  updatePolicyPage: async (id: number, page: Partial<PolicyPage>): Promise<PolicyPage> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${API_BASE_URL}/api/settings/policies/pages/${id}`, page, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating policy page:', error);
      throw error;
    }
  },

  deletePolicyPage: async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${API_BASE_URL}/api/settings/policies/pages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error deleting policy page:', error);
      throw error;
    }
  }
};
