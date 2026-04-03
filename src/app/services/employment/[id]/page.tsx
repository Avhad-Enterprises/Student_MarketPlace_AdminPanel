"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { EmploymentProviderDetail } from '@/components/EmploymentProviderDetail';
import { useRouter, useParams } from 'next/navigation';

export default function EmploymentDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    return (
        <AdminLayout activePage="services-employment">
            <EmploymentProviderDetail 
              providerId={id} 
              onBack={() => router.push('/services/employment')} 
            />
        </AdminLayout>
    );
}
