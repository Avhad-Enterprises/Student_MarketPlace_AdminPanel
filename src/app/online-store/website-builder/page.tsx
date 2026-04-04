'use client';

import React from 'react';
import { WebsiteBuilderEditor } from '@/app/components/WebsiteBuilderEditor';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/app/components/AdminLayout';
import { PermissionGuard } from '@/app/components/common/PermissionGuard';

export default function WebsiteBuilderPage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="store-builder">
            <PermissionGuard module="online-store" action="view">
                <WebsiteBuilderEditor onBack={() => router.back()} />
            </PermissionGuard>
        </AdminLayout>
    );
}
