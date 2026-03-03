import { toast } from "sonner";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";

export interface Visa {
    id: number;
    visa_id: string;
    visa_type: string;
    category: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    processing_difficulty: string;
    work_rights: boolean;
    high_approval: boolean;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}

export interface VisaFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    student_visible?: boolean;
    sort?: string;
    order?: string;
}

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        console.log("Retrieved token:", token ? "exists (length: " + token.length + ")" : "MISSING");
        return token;
    }
    return null;
};

const getHeaders = () => {
    const token = getAuthToken();
    const headers: any = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const getAllVisas = async (filters: VisaFilters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status.toLowerCase());
        if (filters.category && filters.category !== 'All Categories') queryParams.append('category', filters.category);
        if (filters.student_visible !== undefined) queryParams.append('student_visible', filters.student_visible.toString());
        if (filters.sort) queryParams.append('sort', filters.sort);
        if (filters.order) queryParams.append('order', filters.order);

        const response = await fetch(`${API_BASE_URL}/visa?${queryParams.toString()}`, {
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
        console.error("Failed to fetch visas:", error);
        throw error;
    }
};

export const getVisaMetrics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/visa/metrics`, {
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch visa metrics");

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Failed to fetch visa metrics:", error);
        return null;
    }
};

export const createVisa = async (visaData: Partial<Visa>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/visa`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(visaData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || errorData.message || "Failed to create visa";
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create visa:", error);
        throw error;
    }
};

export const updateVisa = async (id: number | string, visaData: Partial<Visa>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/visa/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(visaData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || errorData.message || "Failed to update visa";
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to update visa:", error);
        throw error;
    }
};

export const deleteVisa = async (id: number | string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/visa/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to delete visa");

        return await response.json();
    } catch (error) {
        console.error("Failed to delete visa:", error);
        throw error;
    }
};

export const exportVisas = async (options: any) => {
    try {
        const queryParams = new URLSearchParams({
            scope: options.scope,
            format: options.format,
            detailLevel: options.detailLevel,
            columns: options.selectedColumns.join(','),
        });

        if (options.dateRange?.from) queryParams.append('from', options.dateRange.from);
        if (options.dateRange?.to) queryParams.append('to', options.dateRange.to);

        const response = await fetch(`${API_BASE_URL}/visa/export?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                ...getHeaders(),
                'Accept': options.format === 'json' ? 'application/json' :
                    options.format === 'pdf' ? 'application/pdf' : 'text/csv'
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to export visa data (Status: ${response.status})`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const extension = options.format === 'json' ? 'json' : options.format === 'pdf' ? 'pdf' : 'csv';
        a.download = `visa-export-${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error("Failed to export visa:", error);
        throw error;
    }
};
