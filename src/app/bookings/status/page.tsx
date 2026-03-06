"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import LeadStatusOverviewPage from '../../components/LeadStatusOverviewPage';

export default function LeadStatusPage() {
    return (
        <AdminLayout activePage="bookings-status">
            <LeadStatusOverviewPage />
        </AdminLayout>
    );
}
