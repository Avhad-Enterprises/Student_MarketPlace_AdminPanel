"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { CourseProviderDetail } from '@/components/CourseProviderDetail';
import { useRouter, useParams } from 'next/navigation';

export default function CourseDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    return (
        <AdminLayout activePage="services-courses">
            <CourseProviderDetail 
              providerId={id} 
              onBack={() => router.push('/services/courses')} 
            />
        </AdminLayout>
    );
}
