"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { BookingDetail } from '@/components/BookingDetail';
import { useRouter, useParams } from 'next/navigation';

export default function BookingDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    return (
        <AdminLayout activePage="bookings-list">
            <BookingDetail 
              bookingId={id} 
              onBack={() => router.push('/bookings/list')} 
            />
        </AdminLayout>
    );
}
