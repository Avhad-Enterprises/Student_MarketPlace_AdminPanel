import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface LocalizationSettings {
    id?: number;
    
    // Language Settings
    default_language: string;
    fallback_language: string;
    enable_multi_language: boolean;
    auto_detect_language: boolean;
    enable_rtl_support: boolean;
    supported_languages: string; // JSON string array
    
    // Timezone & Date Format
    default_timezone: string;
    date_format: string;
    time_format: string;
    first_day_of_week: string;
    auto_timezone_detection: boolean;
    
    // Regional Operations
    primary_region: string;
    region_based_pricing: boolean;
    region_based_content: boolean;
    regional_compliance_mode: boolean;
    operating_regions: string; // JSON string array
    
    // Regional Formatting
    number_format: string;
    phone_number_format: string;
    address_format: string;
    name_format: string;
    decimal_separator: string;
    thousands_separator: string;

    created_at?: string;
    updated_at?: string;
}

export const localizationSettingsService = {
  getSettings: async (): Promise<LocalizationSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/localization`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching localization settings:', error);
      throw error;
    }
  },

  updateSettings: async (settings: Partial<LocalizationSettings>): Promise<LocalizationSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/localization`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating localization settings:', error);
      throw error;
    }
  }
};
