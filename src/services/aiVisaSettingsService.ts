import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface AiVisaSettings {
  id?: number;
  enable_ai_assistant: boolean;
  ai_mode: string;
  risk_sensitivity: string;
  confidence_threshold: number;
  escalation_threshold: number;
  prompt_template: string;
  allow_country_injection: boolean;
  allow_document_injection: boolean;
  allow_financial_injection: boolean;
  enable_response_explanations: boolean;
  block_unverified_data: boolean;
  require_manual_review: boolean;
  log_decisions: boolean;
  enable_audit_trail: boolean;
  require_human_approval: boolean;
  updated_at?: string;
}

export const aiVisaSettingsService = {
  getSettings: async (): Promise<AiVisaSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/ai-visa`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching AI Visa settings:', error);
      throw error;
    }
  },

  updateSettings: async (settings: Partial<AiVisaSettings>): Promise<AiVisaSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/ai-visa`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating AI Visa settings:', error);
      throw error;
    }
  }
};
