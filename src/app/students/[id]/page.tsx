"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { StudentDetail } from "@/components/StudentDetail";
import { useParams, useRouter } from "next/navigation";

export default function StudentDetailRoute({ params, searchParams }: { params: { id: string }, searchParams: { tab?: string } }) {
    const router = useRouter();
    const id = params.id;
    const tab = searchParams.tab;

    const handleNavigate = (page: string) => {
        if (page === 'dashboard') router.push('/dashboard');
        else if (page.startsWith('students-')) {
            const sub = page.replace('students-', '');
            if (sub === 'all') router.push('/students');
            else if (sub === 'profiles') router.push('/students/profiles');
            else if (sub === 'applications') router.push('/students/applications');
            else if (sub === 'status') router.push('/students/status-tracking');
        } else {
            router.push(`/${page.replace('-', '/')}`);
        }
    };

    return (
        <AdminLayout activePage="students-all" onNavigate={handleNavigate}>
            <StudentDetail
                studentId={id}
                onBack={() => router.back()}
                initialTab={tab}
            />
        </AdminLayout>
    );
}
