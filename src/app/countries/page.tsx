"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { CountriesOverviewPage } from "@/components/CountriesOverviewPage";

import { useRouter } from 'next/navigation';

export default function CountriesPage() {
    const router = useRouter();

    const handleNavigate = (page: string) => {
        if (page === 'add-country') {
            router.push('/countries/add');
        }
    };

    const handleEditCountry = (id: string, tab: string = 'basic-info') => {
        router.push(`/countries/add?id=${id}&tab=${tab}`);
    };

    return (
        <AdminLayout activePage="countries-list" onNavigate={handleNavigate}>
            <CountriesOverviewPage onNavigate={handleNavigate} onEditCountry={handleEditCountry} />
        </AdminLayout>
    );
}
