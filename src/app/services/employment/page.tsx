"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { EmploymentOverviewPage } from '@/components/EmploymentOverviewPage';
import { useRouter } from 'next/navigation';

export default function EmploymentPage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-employment">
            <EmploymentOverviewPage onNavigate={(page) => router.push(page)} />
        </AdminLayout>
    );
}
