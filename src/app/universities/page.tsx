"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { UniversitiesOverviewPage } from "@/components/UniversitiesOverviewPage";

export default function UniversitiesPage() {
    return (
        <AdminLayout activePage="universities-list">
            <UniversitiesOverviewPage />
        </AdminLayout>
    );
}
