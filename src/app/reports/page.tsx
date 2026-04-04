"use client";

import React from 'react';
import { AdminLayout } from '@/app/components/AdminLayout';
import { FinanceOverviewPage } from '@/app/components/FinanceOverviewPage';
import { PermissionGuard } from '@/app/components/common/PermissionGuard';

export default function ReportsPage() {
    return (
        <AdminLayout activePage="report-analytics">
            <PermissionGuard module="reports" action="view">
                <FinanceOverviewPage />
            </PermissionGuard>
        </AdminLayout>
    );
}
