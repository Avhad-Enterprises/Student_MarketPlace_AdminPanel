import { toast } from "sonner";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://smapi.test-zone.xyz") + "/api";

export interface LibraryItem {
    id: number;
    item_id: string;
    title: string;
    exam: string;
    difficulty?: string;
    topic?: string;
    type?: string;
    transcript?: boolean;
    sections_included?: string[];
    duration?: string;
    status: 'Published' | 'Draft' | 'In Review' | 'Archived';
    usage_30d: number;
    created_at?: string;
    updated_at?: string;
}

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
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

export const getAllLibraryItems = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/library-items`, {
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
        console.error("Failed to fetch library items:", error);
        throw error;
    }
};

export const createLibraryItem = async (itemData: Partial<LibraryItem>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/library-items`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(itemData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || errorData.message || "Failed to create library item";
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create library item:", error);
        throw error;
    }
};

export const updateLibraryItem = async (id: number | string, itemData: Partial<LibraryItem>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/library-items/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(itemData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || errorData.message || "Failed to update library item";
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to update library item:", error);
        throw error;
    }
};

export const deleteLibraryItem = async (id: number | string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/library-items/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to delete library item");

        return await response.json();
    } catch (error) {
        console.error("Failed to delete library item:", error);
        throw error;
    }
};
