"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { FinanceOverviewPage } from '@/components/FinanceOverviewPage';

export default function ReportsPage() {
    return (
        <AdminLayout activePage="report-analytics">
            <FinanceOverviewPage />
        </AdminLayout>
    );
}
