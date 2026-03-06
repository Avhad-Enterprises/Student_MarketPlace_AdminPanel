"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import BookingsOverviewPage from '../../components/BookingsOverviewPage';

import { AdminLayout } from '../../components/AdminLayout';

export default function BookingsListPage() {
    const router = useRouter();

    const handleNavigate = (page: string, bookingId?: string) => {
        if (page === 'booking-detail' && bookingId) {
            router.push(`/bookings/detail/${bookingId}`);
        }
    };

    return (
        <AdminLayout activePage="bookings-list">
            <BookingsOverviewPage onNavigate={handleNavigate} />
        </AdminLayout>
    );
}
