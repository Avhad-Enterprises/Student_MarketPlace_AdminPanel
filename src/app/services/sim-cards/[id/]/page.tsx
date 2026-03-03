"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { SIMCardProviderDetail } from '@/components/SIMCardProviderDetail';

export default function SIMCardDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <AdminLayout activePage="services-sim-cards">
            <SIMCardProviderDetail
                providerId={id}
                onBack={() => router.push('/services/sim-cards')}
            />
        </AdminLayout>
    );
}
