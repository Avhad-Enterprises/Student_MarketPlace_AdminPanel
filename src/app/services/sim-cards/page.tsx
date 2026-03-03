"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { SIMCardsOverviewPage } from '../../components/SIMCardsOverviewPage';
import { useRouter } from 'next/navigation';

export default function SIMCardsPage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-sim-cards">
            <SIMCardsOverviewPage onNavigate={(page) => router.push(page)} />
        </AdminLayout>
    );
}
