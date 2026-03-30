import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface ComplianceSettings {
    id?: number;
    
    // Data Protection Rules
    gdpr_mode: boolean;
    ccpa_mode: boolean;
    right_to_be_forgotten: boolean;
    data_portability: boolean;
    data_retention_period: number;
    anonymize_deleted: boolean;
    
    // Consent & Privacy
    require_explicit_consent: boolean;
    cookie_consent: boolean;
    marketing_opt_in: boolean;
    age_verification_required: boolean;
    privacy_policy_url: string;
    minimum_age: number;
    
    // Document Compliance
    document_encryption: boolean;
    document_watermarking: boolean;
    version_control: boolean;
    compliance_tagging: boolean;
    document_retention_years: number;
    automatic_expiry: boolean;
    
    // Audit & Activity Logs
    enable_audit_logging: boolean;
    log_data_access: boolean;
    log_data_modifications: boolean;
    log_user_authentication: boolean;
    audit_log_retention_days: number;
    real_time_alerts: boolean;
    
    // Regulatory Modes
    primary_framework: string;
    data_residency: string;
    soc2_compliance: boolean;
    iso27001_compliance: boolean;
    hipaa_compliance: boolean;

    created_at?: string;
    updated_at?: string;
}

export const complianceSettingsService = {
  getSettings: async (): Promise<ComplianceSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/compliance`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching compliance settings:', error);
      throw error;
    }
  },

  updateSettings: async (settings: Partial<ComplianceSettings>): Promise<ComplianceSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/compliance`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating compliance settings:', error);
      throw error;
    }
  }
};
