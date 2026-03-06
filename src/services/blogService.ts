import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const BLOGS_API_URL = `${API_BASE_URL}/api/blogs`;

export interface Blog {
    id: number;
    blog_id: string;
    title: string;
    author: string;
    category: string;
    content: string;
    tags: string[] | string;
    status: 'draft' | 'published' | 'scheduled' | 'archived';
    visibility: 'public' | 'restricted';
    publish_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface BlogFormData {
    title: string;
    author: string;
    category: string;
    content: string;
    tags: string[];
    status: string;
    visibility: string;
    publish_date?: string | null;
}

const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const blogService = {
    getAllBlogs: async () => {
        const response = await axios.get<Blog[]>(BLOGS_API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getBlogById: async (id: number | string) => {
        const response = await axios.get<Blog>(`${BLOGS_API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    createBlog: async (data: BlogFormData) => {
        const response = await axios.post<Blog>(BLOGS_API_URL, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateBlog: async (id: number, data: Partial<BlogFormData>) => {
        const response = await axios.put<Blog>(`${BLOGS_API_URL}/${id}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteBlog: async (id: number) => {
        const response = await axios.delete(`${BLOGS_API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
