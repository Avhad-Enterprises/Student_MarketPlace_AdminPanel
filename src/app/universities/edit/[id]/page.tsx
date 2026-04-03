"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UniversityForm } from '@/app/components/UniversityForm';
import { universityService } from '@/services/universityService';
import { toast } from 'sonner';

export default function EditUniversityPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = params.id as string;
    const tab = searchParams.get('tab') || 'basic-info';

    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUniversity = async () => {
            try {
                setLoading(true);
                const data = await universityService.getById(id);
                setInitialData(data);
            } catch (error) {
                console.error('Failed to fetch university:', error);
                toast.error('Failed to load university details');
                router.push('/universities');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUniversity();
        }
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading University Profile...</p>
                </div>
            </div>
        );
    }

    if (!initialData) return null;

    return (
        <div className="min-h-screen bg-[#fafbfc] py-8 px-4 md:px-0">
            <UniversityForm 
                isEdit={true} 
                initialData={initialData} 
                initialTab={tab}
                onSuccess={() => router.push('/universities')}
                onCancel={() => router.push('/universities')}
            />
        </div>
    );
}
