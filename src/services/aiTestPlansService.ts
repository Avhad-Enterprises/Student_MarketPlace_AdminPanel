import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface AITestPlansSettings {
    id?: number;
    weak_skill_boost: number;
    ensure_min_skills: boolean;
    prevent_overload: boolean;
    intensity_mode: 'light' | 'normal' | 'intense';
    custom_intensity: any;
    mock_frequency: 'conservative' | 'balanced' | 'aggressive';
    exam_countdown_boost: boolean;
    boost_days_before: number;
    auto_exam_ready: boolean;
    ready_band_threshold: number;
    ready_consistency: number;
    readiness_weights: any;
    enable_streak: boolean;
    min_daily_activity: number;
    grace_days: number;
    streak_milestone: number;
    show_nudges: boolean;
}

export const aiTestPlansService = {
    getSettings: async (): Promise<AITestPlansSettings> => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${API_BASE_URL}/api/ai-test-plans/settings`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching AI Test Plans settings:', error);
            throw error;
        }
    },

    updateSettings: async (settings: AITestPlansSettings): Promise<AITestPlansSettings> => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(`${API_BASE_URL}/api/ai-test-plans/settings`, settings, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error updating AI Test Plans settings:', error);
            throw error;
        }
    }
};
