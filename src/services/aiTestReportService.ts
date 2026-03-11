import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface AITestReport {
    id: number;
    report_id: string;
    type: string;
    severity: 'critical' | 'warning' | 'info';
    student_name: string;
    student_id: string;
    skill: string;
    exam_type: string;
    description: string;
    status: 'open' | 'investigating' | 'resolved';
    assigned_to?: string;
    created_at: string;
    updated_at: string;
}

export const aiTestReportService = {
    getReports: async (): Promise<AITestReport[]> => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${API_BASE_URL}/api/ai-test-reports`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching AI Test Reports:', error);
            throw error;
        }
    },

    updateReportStatus: async (id: number, status: string, assignedTo?: string): Promise<AITestReport> => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(`${API_BASE_URL}/api/ai-test-reports/update-status/${id}`,
                { status, assigned_to: assignedTo },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            return response.data.data;
        } catch (error) {
            console.error('Error updating AI Test Report status:', error);
            throw error;
        }
    }
};
