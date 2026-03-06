'use client';

import React from 'react';
import { WebsiteBuilderEditor } from '@/app/components/WebsiteBuilderEditor';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/app/components/AdminLayout';

export default function WebsiteBuilderPage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="store-builder">
            <WebsiteBuilderEditor onBack={() => router.back()} />
        </AdminLayout>
    );
}
