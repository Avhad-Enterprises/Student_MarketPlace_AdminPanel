"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { InsuranceOverviewPage } from '@/components/InsuranceOverviewPage';
import { useRouter } from 'next/navigation';

export default function InsurancePage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-insurance">
            <InsuranceOverviewPage onNavigate={(page) => router.push(page)} />
        </AdminLayout>
    );
}
