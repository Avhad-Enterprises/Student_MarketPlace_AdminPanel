import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface AiAssistantSettings {
    assistant_name: string;
    tagline: string;
    default_language: string;
    model_provider: string;
    model_version: string;
    temperature: number;
    response_length: string;
    memory_window: string;
    streaming: boolean;
    timeout: number;
    retry_attempts: number;
    tone: string;
    answer_style: string;
    communication_style: string;
    confidence_threshold: number;
    confidence_visibility: string;
    escalation_action: string;
    welcome_message: string;
    guardrails: any;
    escalation_triggers: any;
    formatting_rules: any;
    status: string;
    strict_mode: boolean;
    profile_icon?: string;
    escalation_message: string;
    escalation_button_text: string;
    enable_ai_visa_assistant: boolean;
    ai_mode: string;
    risk_sensitivity_level: string;
    escalation_trigger_threshold: number;
    default_prompt_template: string;
    allow_dynamic_country_prompt_injection: boolean;
    allow_document_context_injection: boolean;
    allow_financial_data_injection: boolean;
    enable_response_explanation_mode: boolean;
    block_unverified_student_data: boolean;
    require_manual_review_for_high_risk_cases: boolean;
    log_all_ai_decisions: boolean;
    enable_ai_audit_trail: boolean;
    enable_human_approval_required: boolean;
}

export interface AiAssistantSettingsVersion {
    id: number;
    settings_data: any;
    version_label: string;
    created_at: string;
    created_by: string;
}

export const aiAssistantService = {
    getSettings: async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${API_BASE_URL}/api/ai-assistant/settings`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching AI Assistant settings:', error);
            throw error;
        }
    },

    updateSettings: async (settings: any) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(`${API_BASE_URL}/api/ai-assistant/settings`, settings, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error updating AI Assistant settings:', error);
            throw error;
        }
    },

    getVersions: async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${API_BASE_URL}/api/ai-assistant/versions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching AI Assistant versions:', error);
            throw error;
        }
    },

    rollbackVersion: async (versionId: number) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(`${API_BASE_URL}/api/ai-assistant/rollback/${versionId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error rolling back AI Assistant version:', error);
            throw error;
        }
    }
};
