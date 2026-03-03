import { toast } from "sonner";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";

export interface BuildCredit {
    id: number;
    reference_id: string;
    provider_name: string;
    program_name: string;
    card_type: string;
    countries_supported: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    credit_limit: string;
    monthly_fee: string;
    building_period: string;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}

export interface BuildCreditFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sort?: string;
    order?: string;
    from?: string;
    to?: string;
}

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        console.log("BuildCreditService: Retrieved token from localStorage('auth_token'):", token ? "Found (length: " + token.length + ")" : "MISSING");
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
        console.log("BuildCreditService: Authorization header set.");
    } else {
        console.warn("BuildCreditService: Authorization header NOT set (token missing).");
    }
    return headers;
};

export const buildCreditService = {
    getAll: async (filters: BuildCreditFilters = {}) => {
        try {
            console.log("BuildCreditService: getAll called with filters:", filters);
            const queryParams = new URLSearchParams();
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.limit) queryParams.append('limit', filters.limit.toString());
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status.toLowerCase());
            if (filters.sort) queryParams.append('sort', filters.sort);
            if (filters.order) queryParams.append('order', filters.order);
            if (filters.from) queryParams.append('from', filters.from);
            if (filters.to) queryParams.append('to', filters.to);

            const headers = getHeaders();
            const url = `${API_BASE_URL}/build-credit?${queryParams.toString()}`;
            console.log("BuildCreditService: GET URL:", url);

            const response = await fetch(url, {
                headers: headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Unauthorized: Please login again.");
                }
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to fetch build credit data:", error);
            throw error;
        }
    },

    getById: async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/build-credit/${id}`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error("Failed to fetch program details");
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    create: async (data: Partial<BuildCredit>) => {
        try {
            console.log("BuildCreditService: create called with data:", data);
            const headers = getHeaders();
            const response = await fetch(`${API_BASE_URL}/build-credit`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("BuildCreditService: Create failed with status", response.status, errorData);
                throw new Error(errorData.message || "Failed to create program");
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    update: async (id: number, data: Partial<BuildCredit>) => {
        try {
            const response = await fetch(`${API_BASE_URL}/build-credit/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update program");
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    delete: async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/build-credit/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error("Failed to delete program");
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getMetrics: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/build-credit/metrics`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error("Failed to fetch metrics");
            return await response.json();
        } catch (error) {
            console.error(error);
            return { data: { totalPrograms: 0, averageCreditLimit: '$0', successRate: '0%', activeUsers: '0' } };
        }
    },

    exportData: async (params: any) => {
        try {
            const queryParams = new URLSearchParams(params);
            const response = await fetch(`${API_BASE_URL}/build-credit/export?${queryParams.toString()}`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error("Export failed");
            return await response.blob();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
