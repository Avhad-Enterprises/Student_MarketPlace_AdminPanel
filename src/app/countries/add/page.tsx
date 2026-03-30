"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";
import { CountryForm } from '@/components/CountryForm';
import { getCountryById, CountryFormData } from '@/app/services/countriesService';
import { toast } from 'sonner';

function AddCountryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const countryId = searchParams.get('id');
    const tab = searchParams.get('tab') || 'basic-info';
    
    const [loading, setLoading] = useState(!!countryId);
    const [initialData, setInitialData] = useState<CountryFormData | undefined>(undefined);

    useEffect(() => {
        if (countryId) {
            const fetchCountry = async () => {
                setLoading(true);
                try {
                    const country = await getCountryById(countryId);
                    if (country) {
                        setInitialData({
                            country_name: country.name,
                            country_code: country.code,
                            region: country.region,
                            visa_difficulty: country.visa_difficulty,
                            cost_of_living: country.cost_of_living,
                            status: country.status === 'active' ? 'Active' : 'Inactive',
                            visible: true,
                            service_availability: {
                                visa: country.service_visa ?? false,
                                insurance: country.service_insurance ?? false,
                                housing: country.service_housing ?? false,
                                loans: country.service_loans ?? false,
                                forex: country.service_forex ?? false,
                                courses: country.service_courses ?? false,
                                food: country.service_food ?? false,
                            },
                            // Add other mapping if needed, or assume backend returns compatible structure
                            ...country // Spread original data to cover expanded fields
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch country:', error);
                    toast.error('Failed to load country data');
                } finally {
                    setLoading(false);
                }
            };
            fetchCountry();
        }
    }, [countryId]);

    const handleBack = () => {
        router.push('/countries');
    };

    return (
        <AdminLayout activePage="countries-list" onNavigate={(page) => router.push(`/${page.replace('-', '/')}`)}>
            {loading ? (
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                        <p className="text-lg font-medium text-purple-900">Loading country data...</p>
                    </div>
                </div>
            ) : (
                <CountryForm 
                    isEdit={!!countryId} 
                    countryId={countryId || undefined}
                    initialData={initialData}
                    initialTab={tab}
                    onSuccess={handleBack}
                    onCancel={handleBack}
                />
            )}
        </AdminLayout>
    );
}

export default function AddCountryPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-[#f8f9fb]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <p className="text-lg font-medium text-purple-900">Initializing...</p>
                </div>
            </div>
        }>
            <AddCountryContent />
        </Suspense>
    );
}
