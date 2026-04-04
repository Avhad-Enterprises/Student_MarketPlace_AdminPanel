"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { CountriesOverviewPage } from "@/components/CountriesOverviewPage";
import { useRouter } from 'next/navigation';
import { PermissionGuard } from "@/app/components/common/PermissionGuard";

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
            <PermissionGuard module="countries" action="view">
                <CountriesOverviewPage onNavigate={handleNavigate} onEditCountry={handleEditCountry} />
            </PermissionGuard>
        </AdminLayout>
    );
}
