"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { InsuranceProviderDetail } from '@/components/InsuranceProviderDetail';

export default function InsuranceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <AdminLayout activePage="services-insurance">
            <InsuranceProviderDetail
                providerId={id}
                onBack={() => router.push('/services/insurance')}
            />
        </AdminLayout>
    );
}
