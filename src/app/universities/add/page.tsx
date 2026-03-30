"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from "@/components/AdminLayout";
import { UniversityForm } from '@/components/UniversityForm';
import { universityService } from '@/services/universityService';
import { Loader2 } from 'lucide-react';

function AddUniversityContent() {
    const searchParams = useSearchParams();
    const id = searchParams?.get('id');
    const tab = searchParams?.get('tab') || 'basic-info';
    
    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(!!id);

    useEffect(() => {
        if (id) {
            const fetchUniversity = async () => {
                try {
                    const data = await universityService.getById(id);
                    setInitialData(data);
                } catch (error) {
                    console.error("Failed to fetch university:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUniversity();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm font-medium text-gray-500">Loading university data...</p>
            </div>
        );
    }

    return (
        <UniversityForm 
            initialData={initialData} 
            isEdit={!!id} 
            initialTab={tab} 
        />
    );
}

export default function AddUniversityPage() {
    return (
        <AdminLayout activePage="universities-list">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            }>
                <AddUniversityContent />
            </Suspense>
        </AdminLayout>
    );
}
