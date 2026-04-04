"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import EnquiriesOverviewPage from '../../components/EnquiriesOverviewPage';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function EnquiriesPage() {
    return (
        <AdminLayout activePage="bookings-enquiries">
            <PermissionGuard module="enquiries" action="view">
                <EnquiriesOverviewPage />
            </PermissionGuard>
        </AdminLayout>
    );
}
