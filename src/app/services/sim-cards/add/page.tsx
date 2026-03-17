"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AddSIMCardPage } from "@/components/AddSIMCardPage";
import { useRouter } from "next/navigation";

export default function AddSIMCardRoute() {
    const router = useRouter();

    const handleNavigate = (page: string) => {
        if (page === 'dashboard') router.push('/dashboard');
        else if (page === 'services-sim-cards') router.push('/services/sim-cards');
        else {
            router.push(`/${page.replace('-', '/')}`);
        }
    };

    return (
        <AdminLayout activePage="services-sim-cards" onNavigate={handleNavigate}>
            <AddSIMCardPage onNavigate={handleNavigate} />
        </AdminLayout>
    );
}
