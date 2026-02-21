"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { LoanProviderDetail } from '@/components/LoanProviderDetail';

export default function LoanDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <AdminLayout>
            <LoanProviderDetail
                providerId={id}
                onBack={() => router.push('/services/loans')}
            />
        </AdminLayout>
    );
}
