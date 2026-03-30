import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface IntegrationSettings {
    id?: number;
    
    // API Access & Keys
    enable_public_api: boolean;
    api_key: string;
    api_key_rotation: string;
    api_key_expiry_days: number;
    api_rate_limit: number;
    allowed_ip_whitelist: string;
    
    // Webhook Configuration
    enable_webhooks: boolean;
    webhook_endpoint_url: string;
    webhook_secret_key: string;
    webhook_retry_policy: string;
    webhook_events: string; // JSON string array
    
    // Third-Party & Service Providers
    integration_provider: string;
    integration_credentials: string;
    ai_service_provider: string;
    file_storage_provider: string;
    search_engine_provider: string;
    notification_service_provider: string;
    
    // Data Import / Export
    allow_csv_import: boolean;
    allow_bulk_data_export: boolean;
    enable_scheduled_data_sync: boolean;
    export_format: string;

    created_at?: string;
    updated_at?: string;
}

export const integrationSettingsService = {
  getSettings: async (): Promise<IntegrationSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/integrations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching integration settings:', error);
      throw error;
    }
  },

  updateSettings: async (settings: Partial<IntegrationSettings>): Promise<IntegrationSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/integrations`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating integration settings:', error);
      throw error;
    }
  }
};
