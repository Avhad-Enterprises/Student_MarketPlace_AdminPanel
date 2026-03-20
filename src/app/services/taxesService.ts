import { toast } from "sonner";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://smapi.test-zone.xyz") + "/api";

export interface Tax {
    id: number;
    tax_id: string;
    service_name: string;
    provider: string;
    filing_type: string;
    countries_covered: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    residency_type: string;
    complexity: string;
    usage_rate: string;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}

export interface TaxFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    student_visible?: boolean;
    sort?: string;
    order?: string;
}

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        console.log("Retrieved token (taxes):", token ? "exists (length: " + token.length + ")" : "MISSING");
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

export const getAllTaxes = async (filters: TaxFilters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status.toLowerCase());
        if (filters.student_visible !== undefined) queryParams.append('student_visible', filters.student_visible.toString());
        if (filters.sort) queryParams.append('sort', filters.sort);
        if (filters.order) queryParams.append('order', filters.order);

        const response = await fetch(`${API_BASE_URL}/taxes?${queryParams.toString()}`, {
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
        console.error("Failed to fetch taxes:", error);
        throw error;
    }
};

export const getTaxMetrics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/taxes/metrics`, {
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch tax metrics");

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Failed to fetch tax metrics:", error);
        return null;
    }
};

export const createTax = async (taxData: Partial<Tax>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/taxes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(taxData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create tax service");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create tax service:", error);
        throw error;
    }
};

export const updateTax = async (id: number | string, taxData: Partial<Tax>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/taxes/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(taxData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update tax service");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to update tax service:", error);
        throw error;
    }
};

export const deleteTax = async (id: number | string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/taxes/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to delete tax service");

        return await response.json();
    } catch (error) {
        console.error("Failed to delete tax service:", error);
        throw error;
    }
};

export const exportTaxes = async (options: any) => {
    try {
        // For CSV/JSON we use the backend
        const queryParams = new URLSearchParams({
            scope: options.scope,
            format: options.format,
            columns: options.selectedColumns.join(','),
        });

        if (options.ids) queryParams.append('ids', options.ids);
        if (options.dateRange?.from) queryParams.append('from', options.dateRange.from);
        if (options.dateRange?.to) queryParams.append('to', options.dateRange.to);

        const response = await fetch(`${API_BASE_URL}/taxes/export?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                ...getHeaders(),
                'Accept': options.format === 'json' ? 'application/json' : 'text/csv'
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to export tax data (Status: ${response.status})`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const extension = options.format === 'json' ? 'json' : 'csv';
        a.download = `taxes-export-${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error("Failed to export taxes:", error);
        throw error;
    }
};
