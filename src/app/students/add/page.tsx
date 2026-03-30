"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AddStudentPage } from "@/components/AddStudentPage";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AddStudentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const studentId = searchParams.get('id') || undefined;

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
        <AdminLayout activePage={studentId ? "students-all" : "students-add"} onNavigate={handleNavigate}>
            <AddStudentPage onNavigate={handleNavigate} studentId={studentId} />
        </AdminLayout>
    );
}

export default function AddStudentRoute() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-[#f8f9fb]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <p className="text-lg font-medium text-purple-900">Loading...</p>
                </div>
            </div>
        }>
            <AddStudentContent />
        </Suspense>
    );
}
