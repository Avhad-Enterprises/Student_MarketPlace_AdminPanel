import { toast } from "sonner";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://smapi.test-zone.xyz") + "/api";

export interface Insurance {
    id: number;
    insurance_id: string;
    provider_name: string;
    policy_name: string;
    coverage_type: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    duration: string;
    visa_compliant: boolean;
    mandatory: boolean;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}

export interface InsuranceFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    coverage_type?: string;
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

export const getAllInsurance = async (filters: InsuranceFilters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status.toLowerCase());
        if (filters.coverage_type && filters.coverage_type !== 'All Types') queryParams.append('coverage_type', filters.coverage_type);
        if (filters.student_visible !== undefined) queryParams.append('student_visible', filters.student_visible.toString());
        if (filters.sort) queryParams.append('sort', filters.sort);
        if (filters.order) queryParams.append('order', filters.order);

        const response = await fetch(`${API_BASE_URL}/insurance?${queryParams.toString()}`, {
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
        console.error("Failed to fetch insurance:", error);
        throw error;
    }
};

export const getInsuranceMetrics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/insurance/metrics`, {
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch insurance metrics");

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Failed to fetch insurance metrics:", error);
        return null;
    }
};

export const createInsurance = async (insuranceData: Partial<Insurance>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/insurance`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(insuranceData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create insurance");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create insurance:", error);
        throw error;
    }
};

export const updateInsurance = async (id: number | string, insuranceData: Partial<Insurance>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/insurance/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(insuranceData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update insurance");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to update insurance:", error);
        throw error;
    }
};

export const deleteInsurance = async (id: number | string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/insurance/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to delete insurance");

        return await response.json();
    } catch (error) {
        console.error("Failed to delete insurance:", error);
        throw error;
    }
};
