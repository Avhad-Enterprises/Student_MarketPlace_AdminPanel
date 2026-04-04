'use client';

import React from 'react';
import { ThemesOverview } from '@/app/components/ThemesOverview';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/app/components/AdminLayout';
import { PermissionGuard } from '@/app/components/common/PermissionGuard';

export default function OnlineStoreThemesPage() {
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(`/online-store/${path}`);
    };

    return (
        <AdminLayout activePage="store-themes">
            <PermissionGuard module="online-store" action="view">
                <ThemesOverview onNavigate={handleNavigate} />
            </PermissionGuard>
        </AdminLayout>
    );
}
