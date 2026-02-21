"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AddStudentPage } from "@/components/AddStudentPage";
import { useRouter } from "next/navigation";

export default function AddStudentRoute() {
    const router = useRouter();

    return (
        <AdminLayout activePage="students-add" onNavigate={(page) => router.push(`/${page.replace('-', '/')}`)}>
            <AddStudentPage />
        </AdminLayout>
    );
}
