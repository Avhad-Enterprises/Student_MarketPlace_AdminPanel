"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CountryForm } from '@/app/components/CountryForm';
import { getCountryById, CountryFormData } from '@/services/countriesService';
import { toast } from 'sonner';

export default function EditCountryPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = params.id as string;
    const tab = searchParams.get('tab') || 'basic-info';

    const [initialData, setInitialData] = useState<CountryFormData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                setLoading(true);
                const data = await getCountryById(id);
                // Ensure data matches CountryFormData structure
                setInitialData(data);
            } catch (error) {
                console.error('Failed to fetch country:', error);
                toast.error('Failed to load country details');
                router.push('/countries');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCountry();
        }
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading Country Profile...</p>
                </div>
            </div>
        );
    }

    if (!initialData) return null;

    return (
        <div className="min-h-screen bg-[#fafbfc] py-8">
            <CountryForm 
                isEdit={true} 
                countryId={id} 
                initialData={initialData} 
                initialTab={tab}
                onSuccess={() => router.push('/countries')}
                onCancel={() => router.push('/countries')}
            />
        </div>
    );
}
