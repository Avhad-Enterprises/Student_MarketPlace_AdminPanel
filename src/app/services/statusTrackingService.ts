import axios from 'axios';

const API_URL = 'http://localhost:5000/api/status-tracking';

export interface BackendStatusItem {
    db_id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    risk_level: 'low' | 'medium' | 'high';
    stage: 'profile' | 'application' | 'visa' | 'completed';
    country: string;
    counselor: string;
    sub_status: string | null;
    last_update: string | null;
}

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

export const getAllStatusTracking = async (params: {
    stage?: string;
    risk_level?: string;
    search?: string;
} = {}): Promise<BackendStatusItem[]> => {
    try {
        const response = await axios.get(`${API_URL}/all`, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching status tracking:', error);
        return [];
    }
};

export const getStatusByStudentId = async (studentId: string): Promise<any[]> => {
    try {
        const response = await axios.get(`${API_URL}/student/${studentId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching status by student id:', error);
        return [];
    }
};

export const updateStatus = async (statusData: {
    studentDbId: number;
    stage: string;
    subStatus: string;
    notes: string;
    changedBy: string;
}): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/update`, statusData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
};

export const getStatusMetrics = async (): Promise<{
    applicationCount: number;
    visaCount: number;
    awaitingDecisionCount: number;
    completedCount: number;
    blockedCount: number;
}> => {
    try {
        const response = await axios.get(`${API_URL}/metrics`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching status metrics:', error);
        return {
            applicationCount: 0,
            visaCount: 0,
            awaitingDecisionCount: 0,
            completedCount: 0,
            blockedCount: 0
        };
    }
};
