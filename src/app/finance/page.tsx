"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '../components/AdminLayout';
import { FinanceOverviewPage } from '../components/FinanceOverviewPage';

export default function FinancePage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="finance">
            <FinanceOverviewPage onNavigate={(path: string) => router.push(path)} />
        </AdminLayout>
    );
}
