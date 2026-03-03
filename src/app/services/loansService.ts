import { toast } from "sonner";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";

export interface Loan {
    id: number;
    loan_id: string;
    provider_name: string;
    product_name: string;
    amount_range: string;
    countries_supported: number;
    status: 'active' | 'inactive';
    student_visible: boolean;
    interest_type: 'Fixed' | 'Variable';
    collateral_required: boolean;
    approval_rate: string;
    popularity: number;
    created_at?: string;
    updated_at?: string;
}

export interface LoanFilters {
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
        return localStorage.getItem('auth_token');
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

export const getAllLoans = async (filters: LoanFilters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status.toLowerCase());
        if (filters.student_visible !== undefined) queryParams.append('student_visible', filters.student_visible.toString());
        if (filters.sort) queryParams.append('sort', filters.sort);
        if (filters.order) queryParams.append('order', filters.order);

        const response = await fetch(`${API_BASE_URL}/loans?${queryParams.toString()}`, {
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
        console.error("Failed to fetch loans:", error);
        throw error;
    }
};

export const getLoanMetrics = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/loans/metrics`, {
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch loan metrics");

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Failed to fetch loan metrics:", error);
        return null;
    }
};

export const createLoan = async (loanData: Partial<Loan>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/loans`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(loanData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create loan product");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create loan product:", error);
        throw error;
    }
};

export const updateLoan = async (id: number | string, loanData: Partial<Loan>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(loanData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update loan product");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to update loan product:", error);
        throw error;
    }
};

export const deleteLoan = async (id: number | string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to delete loan product");

        return await response.json();
    } catch (error) {
        console.error("Failed to delete loan product:", error);
        throw error;
    }
};

export const exportLoans = async (options: any) => {
    try {
        const queryParams = new URLSearchParams({
            scope: options.scope,
            format: options.format,
            columns: options.selectedColumns.join(','),
        });

        if (options.ids) queryParams.append('ids', options.ids);
        if (options.dateRange?.from) queryParams.append('from', options.dateRange.from);
        if (options.dateRange?.to) queryParams.append('to', options.dateRange.to);

        const response = await fetch(`${API_BASE_URL}/loans/export?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                ...getHeaders(),
                'Accept': options.format === 'json' ? 'application/json' : 'text/csv'
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to export loan data (Status: ${response.status})`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const extension = options.format === 'json' ? 'json' : 'csv';
        a.download = `loans-export-${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error("Failed to export loans:", error);
        throw error;
    }
};
