"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AddBankPage } from "@/components/AddBankPage";
import { useRouter } from "next/navigation";

export default function AddBankRoute() {
    const router = useRouter();

    const handleNavigate = (page: string) => {
        if (page === 'dashboard') router.push('/dashboard');
        else if (page === 'services-banks') router.push('/services/banks');
        else {
            router.push(`/${page.replace('-', '/')}`);
        }
    };

    return (
        <AdminLayout activePage="services-banks" onNavigate={handleNavigate}>
            <AddBankPage onNavigate={handleNavigate} />
        </AdminLayout>
    );
}
