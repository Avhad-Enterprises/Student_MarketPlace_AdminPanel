import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai-test-scoring';

const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

export const getScoringSettings = async () => {
    try {
        const response = await axios.get(`${API_URL}/settings`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching scoring settings:', error);
        throw error;
    }
};

export const updateScoringSettings = async (settingsData: any) => {
    try {
        const response = await axios.post(`${API_URL}/settings`, settingsData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error updating scoring settings:', error);
        throw error;
    }
};
