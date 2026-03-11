"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { StudentProfilesOverviewPage } from "@/components/StudentProfilesOverviewPage";
import { useRouter } from "next/navigation";

export default function StudentProfilesPage() {
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
        <AdminLayout activePage="students-profiles">
            <StudentProfilesOverviewPage />
        </AdminLayout>
    );
}
