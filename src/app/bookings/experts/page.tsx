"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { ExpertsOverviewPage } from '../../components/ExpertsOverviewPage';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function ExpertsPage() {
    return (
        <AdminLayout activePage="bookings-experts">
            <PermissionGuard module="bookings" action="view">
                <ExpertsOverviewPage />
            </PermissionGuard>
        </AdminLayout>
    );
}
