"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { CountriesOverviewPage } from "@/components/CountriesOverviewPage";

import { useRouter } from 'next/navigation';

export default function CountriesPage() {
    const router = useRouter();

    const handleNavigate = (page: string) => {
        if (page === 'add-country') {
            router.push('/countries/add');
        } else if (page === 'edit-country') {
            // Logic for edit will go here, currently handled via props but navigation helps
        }
    };

    return (
        <AdminLayout activePage="countries-list">
            <CountriesOverviewPage onNavigate={handleNavigate} />
        </AdminLayout>
    );
}
