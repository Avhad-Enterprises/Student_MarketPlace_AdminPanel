import { API_BASE_URL } from '../config/api';

export interface AiFeature {
    id?: number;
    feature_id: string;
    order: number;
    name: string;
    status: 'active' | 'disabled';
    show_in_dashboard: boolean;
    linked_flow: string;
    description: string;
    starter_prompt: string;
    usage_30d: number;
    requires_ielts: boolean;
    requires_country: boolean;
    requires_profile: boolean;
    category: string;
    created_at?: string;
    updated_at?: string;
}

const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const aiFeatureService = {
    async getAllFeatures(): Promise<AiFeature[]> {
        const response = await fetch(`${API_BASE_URL}/api/ai-features`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to fetch features');
        const json = await response.json();
        return json.data;
    },

    async getFeatureById(featureId: string): Promise<AiFeature> {
        const response = await fetch(`${API_BASE_URL}/api/ai-features/${featureId}`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to fetch feature details');
        const json = await response.json();
        return json.data;
    },

    async updateFeature(featureId: string, featureData: Partial<AiFeature>): Promise<AiFeature> {
        const response = await fetch(`${API_BASE_URL}/api/ai-features/${featureId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(featureData),
        });
        if (!response.ok) throw new Error('Failed to update feature');
        const json = await response.json();
        return json.data;
    },

    async createFeature(featureData: AiFeature): Promise<AiFeature> {
        const response = await fetch(`${API_BASE_URL}/api/ai-features`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(featureData),
        });
        if (!response.ok) throw new Error('Failed to create feature');
        const json = await response.json();
        return json.data;
    }
};
