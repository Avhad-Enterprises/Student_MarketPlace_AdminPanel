"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AddApplicationPage } from "@/components/AddApplicationPage";
import { useRouter } from "next/navigation";

export default function AddApplicationRoute() {
    const router = useRouter();

    const handleNavigate = (page: string) => {
        if (page === 'dashboard') router.push('/dashboard');
        else if (page.startsWith('students-')) {
            const sub = page.replace('students-', '');
            if (sub === 'all') router.push('/students');
            else if (sub === 'profiles') router.push('/students/profiles');
            else if (sub === 'applications') router.push('/students/applications');
            else if (sub === 'status') router.push('/students/status-tracking');
        }
    };

    return (
        <AdminLayout activePage="students-applications">
            <AddApplicationPage onNavigate={handleNavigate} />
        </AdminLayout>
    );
}
