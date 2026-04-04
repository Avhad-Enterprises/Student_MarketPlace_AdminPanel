"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import LeadStatusOverviewPage from '../../components/LeadStatusOverviewPage';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function LeadStatusPage() {
    return (
        <AdminLayout activePage="bookings-status">
            <PermissionGuard module="bookings" action="view">
                <LeadStatusOverviewPage />
            </PermissionGuard>
        </AdminLayout>
    );
}
