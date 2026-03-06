"use client";

import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { FinanceOverviewPage } from '../components/FinanceOverviewPage';

export default function FinancePage() {
    return (
        <AdminLayout activePage="finance">
            <FinanceOverviewPage />
        </AdminLayout>
    );
}
