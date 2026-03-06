import { API_BASE_URL } from '../config/api';
import axios from "axios";

export interface Payment {
    id: number;
    student_db_id: number;
    payment_id: string;
    invoice_number: string;
    description: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'overdue' | 'refunded';
    payment_method: string;
    due_date: string;
    paid_date: string | null;
    created_by: string;
    notes: string;
    created_at: string;
    updated_at: string;
    first_name?: string;
    last_name?: string;
}

export interface PaymentFormData {
    student_db_id: number;
    payment_id: string;
    invoice_number: string;
    description: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    due_date: string;
    paid_date?: string | null;
    notes?: string;
}

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const financeService = {
    getAllPayments: async (): Promise<Payment[]> => {
        const response = await axios.get(`${API_BASE_URL}/api/payments`, { headers: getHeaders() });
        return response.data;
    },

    getPaymentById: async (id: number): Promise<Payment> => {
        const response = await axios.get(`${API_BASE_URL}/api/payments/${id}`, { headers: getHeaders() });
        return response.data;
    },

    createPayment: async (data: PaymentFormData): Promise<Payment> => {
        const response = await axios.post(`${API_BASE_URL}/api/payments`, data, { headers: getHeaders() });
        return response.data;
    },

    updatePayment: async (id: number, data: Partial<PaymentFormData>): Promise<Payment> => {
        const response = await axios.put(`${API_BASE_URL}/api/payments/${id}`, data, { headers: getHeaders() });
        return response.data;
    },

    deletePayment: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/api/payments/${id}`, { headers: getHeaders() });
    }
};
