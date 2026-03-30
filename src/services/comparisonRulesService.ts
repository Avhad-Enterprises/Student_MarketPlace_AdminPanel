import { API_BASE_URL } from '../config/api';
import axios from 'axios';

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export interface ComparisonRules {
    id?: number;
    enable_country_scoring: boolean;
    country_scoring_parameters: string[];
    country_weight_distribution: Record<string, number>;
    allow_manual_score_override: boolean;
    enable_university_ranking_engine: boolean;
    university_weight_configuration: Record<string, number>;
    min_eligibility_threshold_required: boolean;
    enable_smart_matching: boolean;
    auto_suggest_top_5_countries: boolean;
    auto_suggest_top_10_universities: boolean;
    exclude_high_risk_options: boolean;
    allow_counselor_override_matching: boolean;
}

export const comparisonRulesService = {
    getRules: async (): Promise<ComparisonRules> => {
        const response = await axios.get(`${API_BASE_URL}/api/settings/comparison-rules`, { headers: getHeaders() });
        return response.data.data;
    },

    updateRules: async (rules: Partial<ComparisonRules>): Promise<ComparisonRules> => {
        const response = await axios.post(`${API_BASE_URL}/api/settings/comparison-rules`, rules, { headers: getHeaders() });
        return response.data.data;
    }
};
