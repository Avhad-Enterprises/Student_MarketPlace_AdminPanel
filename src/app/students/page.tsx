"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { StudentsOverviewPage } from "@/components/StudentsOverviewPage";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "@/app/components/common/PermissionGuard";

export default function StudentsPage() {
    const router = useRouter();

    const handleNavigate = (page: string) => {
        // Translate the page ID to Next.js route
        if (page === 'dashboard') router.push('/dashboard');
        else if (page === 'add-student') router.push('/students/add');
        else if (page.startsWith('student-detail:')) {
            const id = page.replace('student-detail:', '');
            router.push(`/students/${id}?tab=overview`);
        }
        else if (page.startsWith('students-')) {
            const sub = page.replace('students-', '');
            if (sub === 'all') router.push('/students');
            else if (sub === 'profiles') router.push('/students/profiles');
            else if (sub === 'applications') router.push('/students/applications');
            else if (sub === 'status') router.push('/students/status-tracking');
        }
    };

    return (
        <AdminLayout activePage="students-all">
            <PermissionGuard module="students" action="view">
                <StudentsOverviewPage onNavigate={handleNavigate} />
            </PermissionGuard>
        </AdminLayout>
    );
}
