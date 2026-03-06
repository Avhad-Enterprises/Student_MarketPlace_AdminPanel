'use client';

import React from 'react';
import { PagesOverview } from '@/app/components/PagesOverview';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/app/components/AdminLayout';

export default function OnlineStorePagesPage() {
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(`/online-store/${path}`);
    };

    return (
        <AdminLayout activePage="store-pages">
            <PagesOverview onNavigate={handleNavigate} />
        </AdminLayout>
    );
}
