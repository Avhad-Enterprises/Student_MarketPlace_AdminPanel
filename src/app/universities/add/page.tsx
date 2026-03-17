"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { UniversityForm } from '@/components/UniversityForm';

export default function AddUniversityPage() {
    return (
        <AdminLayout activePage="universities-list">
            <UniversityForm />
        </AdminLayout>
    );
}
