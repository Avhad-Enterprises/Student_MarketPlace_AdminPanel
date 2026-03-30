import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface AdminNotificationSettings {
    id?: number;
    alert_high_risk_student: boolean;
    alert_visa_rejection: boolean;
    alert_payment_failure: boolean;
    alert_expert_over_capacity: boolean;
    alert_recipient_roles: string[];
    enable_student_email_notifications: boolean;
    enable_booking_reminders: boolean;
    enable_deadline_reminders: boolean;
    enable_invoice_reminders: boolean;
    escalate_lead_hours: number;
    escalate_booking_hours: number;
    escalation_role: string;
    escalation_email: string;
    channel_email: boolean;
    channel_sms: boolean;
    channel_in_app: boolean;
    created_at?: string;
    updated_at?: string;
}

export const adminNotificationSettingsService = {
  getSettings: async (): Promise<AdminNotificationSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/admin-notifications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching admin notification settings:', error);
      throw error;
    }
  },

  updateSettings: async (settings: Partial<AdminNotificationSettings>): Promise<AdminNotificationSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/admin-notifications`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating admin notification settings:', error);
      throw error;
    }
  }
};
