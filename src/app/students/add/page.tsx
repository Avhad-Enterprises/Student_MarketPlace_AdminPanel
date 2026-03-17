"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AddStudentPage } from "@/components/AddStudentPage";
import { useRouter } from "next/navigation";

export default function AddStudentRoute() {
    const router = useRouter();

    const handleNavigate = (page: string) => {
        if (page === 'dashboard') router.push('/dashboard');
        else if (page === 'students') router.push('/students');
        else if (page.startsWith('students-')) {
            const sub = page.replace('students-', '');
            if (sub === 'all') router.push('/students');
            else if (sub === 'profiles') router.push('/students/profiles');
            else if (sub === 'applications') router.push('/students/applications');
            else if (sub === 'status') router.push('/students/status-tracking');
            else router.push(`/students/${sub}`);
        } else {
            router.push(`/${page.replace('-', '/')}`);
        }
    };

    return (
        <AdminLayout activePage="students-add" onNavigate={handleNavigate}>
            <AddStudentPage onNavigate={handleNavigate} />
        </AdminLayout>
    );
}
