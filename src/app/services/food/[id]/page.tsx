"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { FoodProviderDetail } from '@/components/FoodProviderDetail';
import { useRouter, useParams } from 'next/navigation';

export default function FoodDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    return (
        <AdminLayout activePage="services-food">
            <FoodProviderDetail 
              providerId={id} 
              onBack={() => router.push('/services/food')} 
            />
        </AdminLayout>
    );
}
