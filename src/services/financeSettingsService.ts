import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface FinanceSettings {
    id?: number;
    
    // Currency & Financial Defaults
    primary_currency: string;
    secondary_currency: string;
    exchange_rate_provider: string;
    exchange_rate_frequency: string;
    auto_update_exchange_rates: boolean;
    enable_multi_currency: boolean;
    
    // Payment Methods
    enable_credit_card: boolean;
    enable_debit_card: boolean;
    enable_bank_transfer: boolean;
    enable_paypal: boolean;
    enable_stripe: boolean;
    enable_apple_pay: boolean;
    enable_google_pay: boolean;
    default_payment_gateway: string;
    
    // Invoice & Billing Rules
    invoice_prefix: string;
    invoice_number_format: string;
    starting_invoice_number: number;
    invoice_due_period_days: number;
    late_payment_fee_percent: number;
    enable_auto_invoicing: boolean;
    enable_late_payment_fees: boolean;
    invoice_footer_text: string;
    
    // Refund Rules
    enable_refunds: boolean;
    refund_approval_required: boolean;
    allow_partial_refunds: boolean;
    refund_window_days: number;
    auto_refund_under_amount: number;
    refund_processing_time_days: number;
    
    // Financial Controls
    require_approval_over_amount: number;
    fiscal_year_start_month: string;
    default_tax_rate: number;
    enable_budget_tracking: boolean;
    enable_expense_reporting: boolean;
    enable_tax_calculation: boolean;
    enable_financial_reporting: boolean;

    created_at?: string;
    updated_at?: string;
}

export const financeSettingsService = {
  getSettings: async (): Promise<FinanceSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/api/settings/finance`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching finance settings:', error);
      throw error;
    }
  },

  updateSettings: async (settings: Partial<FinanceSettings>): Promise<FinanceSettings> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/finance`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating finance settings:', error);
      throw error;
    }
  }
};
