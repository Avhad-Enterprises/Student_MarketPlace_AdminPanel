import { toast } from "sonner";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";

export interface Bank {
    id: number;
    bank_id: string;
    bank_name: string;
    account_type: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    min_balance: string;
    digital_onboarding: boolean;
    student_friendly: boolean;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}

export interface BankFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    account_type?: string;
    student_visible?: boolean;
    sort?: string;
    order?: string;
}

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

const getHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const getAllBanks = async (filters: BankFilters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status.toLowerCase());
        if (filters.account_type && filters.account_type !== 'All Types') queryParams.append('account_type', filters.account_type);
        if (filters.student_visible !== undefined) queryParams.append('student_visible', filters.student_visible.toString());
        if (filters.sort) queryParams.append('sort', filters.sort);
        if (filters.order) queryParams.append('order', filters.order);

        const response = await fetch(`${API_BASE_URL}/banks?${queryParams.toString()}`, {
            headers: getHeaders(),
        });

        if (!response.ok) {
            if (response.status === 401) {
                toast.error("Unauthorized: Please login again.");
            }
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch banks:", error);
        throw error;
    }
};

export const getBankMetrics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/banks/metrics`, {
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch bank metrics");

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Failed to fetch bank metrics:", error);
        return null;
    }
};

export const createBank = async (bankData: Partial<Bank>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/banks`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(bankData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create bank");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create bank:", error);
        throw error;
    }
};

export const updateBank = async (id: number | string, bankData: Partial<Bank>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/banks/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(bankData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update bank");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to update bank:", error);
        throw error;
    }
};

export const deleteBank = async (id: number | string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/banks/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to delete bank");

        return await response.json();
    } catch (error) {
        console.error("Failed to delete bank:", error);
        throw error;
    }
};
