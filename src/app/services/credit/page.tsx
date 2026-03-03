"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { BuildCreditOverviewPage } from '../../components/BuildCreditOverviewPage';
import { useRouter } from 'next/navigation';

export default function BuildCreditPage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-credit">
            <BuildCreditOverviewPage onNavigate={(page) => router.push(page)} />
        </AdminLayout>
    );
}
