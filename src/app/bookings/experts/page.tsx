"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { ExpertsOverviewPage } from '../../components/ExpertsOverviewPage';

export default function ExpertsPage() {
    return (
        <AdminLayout activePage="bookings-experts">
            <ExpertsOverviewPage />
        </AdminLayout>
    );
}
