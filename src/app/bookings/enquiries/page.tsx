"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import EnquiriesOverviewPage from '../../components/EnquiriesOverviewPage';

export default function EnquiriesPage() {
    return (
        <AdminLayout activePage="bookings-enquiries">
            <EnquiriesOverviewPage />
        </AdminLayout>
    );
}
