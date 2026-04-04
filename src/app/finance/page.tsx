"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '../components/AdminLayout';
import { FinanceOverviewPage } from '../components/FinanceOverviewPage';
import { PermissionGuard } from '../components/common/PermissionGuard';

export default function FinancePage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="finance">
            <PermissionGuard module="finance" action="view">
                <FinanceOverviewPage onNavigate={(path: string) => router.push(path)} />
            </PermissionGuard>
        </AdminLayout>
    );
}
