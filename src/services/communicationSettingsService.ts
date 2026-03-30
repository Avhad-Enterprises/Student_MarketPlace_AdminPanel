import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface CommunicationSettings {
    id?: number;
    email_provider: string;
    api_key: string;
    webhook_url: string;
    ip_pool_name: string;
    connection_status: string;
    last_synced: string;
    email_settings: {
        daily_limit: number;
        retry_logic: boolean;
        tracking_enabled: boolean;
    };
    campaign_defaults: {
        default_from_name: string;
        default_from_email: string;
        unsubscribe_link: boolean;
    };
    // Email Configuration
    default_from_name: string;
    default_from_email: string;
    reply_to_email: string;
    email_footer_text: string;
    email_signature: string;
    enable_notifications: boolean;
    enable_auto_status_emails: boolean;
    enable_campaign_tracking: boolean;
    domain_verification_status: string;

    // Campaign Defaults
    default_campaign_owner: string;
    default_lead_source_tag: string;
    default_attribution_model: string;
    campaign_auto_expiry_days: number;
    enable_conversion_tracking: boolean;

    // Sender Identity
    verified_domains: string;
    dkim_status: string;
    spf_status: string;
    sender_name_list: string;
    default_sender_name: string;

    updated_at?: string;
}

export const communicationSettingsService = {
  getSettings: async (): Promise<CommunicationSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/communications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching communication settings:', error);
      throw error;
    }
  },

  updateSettings: async (settings: Partial<CommunicationSettings>): Promise<CommunicationSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/communications`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating communication settings:', error);
      throw error;
    }
  },

  testConnection: async (): Promise<CommunicationSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/communications/test-connection`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error testing communication settings:', error);
      throw error;
    }
  }
};
