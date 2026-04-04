'use client';

import React from 'react';
import { PagesOverview } from '@/app/components/PagesOverview';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/app/components/AdminLayout';
import { PermissionGuard } from '@/app/components/common/PermissionGuard';

export default function OnlineStorePagesPage() {
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(`/online-store/${path}`);
    };

    return (
        <AdminLayout activePage="store-pages">
            <PermissionGuard module="online-store" action="view">
                <PagesOverview onNavigate={handleNavigate} />
            </PermissionGuard>
        </AdminLayout>
    );
}
