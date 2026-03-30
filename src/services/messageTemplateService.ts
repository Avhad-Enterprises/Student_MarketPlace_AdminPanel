import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface MessageTemplate {
    id?: number;
    template_id: string;
    name: string;
    type: string;
    linked_event: string;
    status: string;
    content?: string;
    subject?: string;
    created_at?: string;
    updated_at?: string;
}

export const messageTemplateService = {
  getTemplates: async (): Promise<MessageTemplate[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/templates`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  createTemplate: async (template: MessageTemplate): Promise<MessageTemplate> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/templates`, template, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  deleteTemplate: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${API_BASE_URL}/api/settings/templates/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};
