import { API_BASE_URL } from '../config/api';

export interface LeadStatus {
    db_id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    risk_level: 'low' | 'medium' | 'high';
    stage: string;
    country: string;
    counselor: string;
    sub_status: string | null;
    last_update: string | null;
}

export interface LeadFormData {
    firstName: string;
    lastName: string;
    email: string;
    countryCode?: string;
    phoneNumber?: string;
    nationality?: string;
    currentCountry?: string;
    primaryDestination?: string;
    intendedIntake?: string;
    currentStage?: string;
    riskLevel?: 'low' | 'medium' | 'high';
    leadSource?: string;
    assignedCounselor?: string;
    notes?: string;
}

export interface LeadMetrics {
    applicationCount: number;
    visaCount: number;
    awaitingDecisionCount: number;
    completedCount: number;
    blockedCount: number;
}

const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const leadStatusService = {
    async getAllLeads(filters: { stage?: string; risk_level?: string; search?: string } = {}): Promise<LeadStatus[]> {
        const queryParams = new URLSearchParams();
        if (filters.stage) queryParams.append('stage', filters.stage);
        if (filters.risk_level) queryParams.append('risk_level', filters.risk_level);
        if (filters.search) queryParams.append('search', filters.search);

        const response = await fetch(`${API_BASE_URL}/api/status-tracking/all?${queryParams.toString()}`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to fetch leads');
        const data = await response.json();
        return data;
    },

    async getMetrics(): Promise<LeadMetrics> {
        const response = await fetch(`${API_BASE_URL}/api/status-tracking/metrics`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to fetch lead metrics');
        const data = await response.json();
        return data;
    },

    async updateStatus(updateData: {
        studentDbId: number;
        stage: string;
        subStatus: string;
        notes: string;
        changedBy: string;
    }): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/status-tracking/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(updateData),
        });
        if (!response.ok) throw new Error('Failed to update status');
        const data = await response.json();
        return data;
    },

    async getStatusHistory(studentId: string): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/api/status-tracking/student/${studentId}`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to fetch status history');
        const data = await response.json();
        return data;
    },

    async createLead(leadData: LeadFormData): Promise<{ id: number; student_id: string; message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(leadData),
        });
        if (!response.ok) throw new Error('Failed to create lead');
        return await response.json();
    },

    async updateLead(id: string | number, leadData: Partial<LeadFormData>): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(leadData),
        });
        if (!response.ok) throw new Error('Failed to update lead');
        return await response.json();
    },

    async deleteLead(id: string | number): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to delete lead');
        return await response.json();
    }
};
