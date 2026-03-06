import { API_BASE_URL } from '../config/api';

export interface Booking {
    id?: number;
    booking_id: string;
    date_time: string;
    student_name: string;
    service: string;
    expert: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'no-show';
    mode: string;
    source: string;
    created_at?: string;
    updated_at?: string;
}

const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const bookingService = {
    async getAllBookings(): Promise<Booking[]> {
        const response = await fetch(`${API_BASE_URL}/api/bookings`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const json = await response.json();
        return json.data;
    },

    async getBookingById(id: string): Promise<Booking> {
        const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to fetch booking details');
        const json = await response.json();
        return json.data;
    },

    async updateBooking(id: string, bookingData: Partial<Booking>): Promise<Booking> {
        const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(bookingData),
        });
        if (!response.ok) throw new Error('Failed to update booking');
        const json = await response.json();
        return json.data;
    },

    async createBooking(bookingData: Booking): Promise<Booking> {
        const response = await fetch(`${API_BASE_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(bookingData),
        });
        if (!response.ok) throw new Error('Failed to create booking');
        const json = await response.json();
        return json.data;
    },

    async deleteBooking(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error('Failed to delete booking');
    }
};
