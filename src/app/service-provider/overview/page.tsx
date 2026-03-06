'use client';

import React from 'react';
import { ServiceProviderOverviewRedesigned } from '@/app/components/ServiceProviderOverviewRedesigned';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/app/components/AdminLayout';

export default function ServiceProviderOverviewPage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-provider-redesigned">
            <ServiceProviderOverviewRedesigned onBack={() => router.push('/services/sim-cards')} />
        </AdminLayout>
    );
}
